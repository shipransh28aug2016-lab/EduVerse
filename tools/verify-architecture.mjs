// Architectural boundary, cycle, lazy-isolation, preload & manifest verification gate for EduVerse.
// Usage: node tools/verify-architecture.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walkJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJs(p));
    else if (/\.(js|mjs)$/.test(e.name)) out.push(p);
  }
  return out.sort();
}

const rel = (p) => path.relative(ROOT, p).replaceAll('\\', '/');

function parseImports(absFile) {
  const txt = fs.readFileSync(absFile, 'utf8');
  const staticDeps = [];
  const dynamicDeps = [];
  const staticRe = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g;
  const dynRe = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = staticRe.exec(txt))) {
    const spec = m[1] || m[2];
    if (spec?.startsWith('.')) staticDeps.push(path.resolve(path.dirname(absFile), spec));
  }
  while ((m = dynRe.exec(txt))) {
    if (m[1]?.startsWith('.')) dynamicDeps.push(path.resolve(path.dirname(absFile), m[1]));
  }
  return { txt, staticDeps, dynamicDeps };
}

export function runArchitectureChecks() {
  const errors = [];
  const srcFiles = walkJs(path.join(ROOT, 'src'));
  const graph = new Map();

  for (const f of srcFiles) {
    const parsed = parseImports(f);
    for (const dep of [...parsed.staticDeps, ...parsed.dynamicDeps]) {
      if (!fs.existsSync(dep)) errors.push(`Unresolved import in ${rel(f)}: ${rel(dep)}`);
    }
    graph.set(f, parsed);
  }

  // 1. Cycle detection over static ES imports
  const state = new Map(); // 0/undefined=unvisited, 1=visiting, 2=done
  const stack = [];
  function dfs(u) {
    state.set(u, 1);
    stack.push(u);
    for (const v of graph.get(u)?.staticDeps || []) {
      if (!graph.has(v)) continue;
      if (state.get(v) === 1) {
        const cyc = [...stack.slice(stack.indexOf(v)), v].map(rel).join(' -> ');
        errors.push(`Circular static import: ${cyc}`);
      } else if (!state.get(v)) {
        dfs(v);
      }
    }
    stack.pop();
    state.set(u, 2);
  }
  for (const f of srcFiles) if (!state.get(f)) dfs(f);

  // 2. Domain engine purity guardrails (src/engines/domain/*)
  for (const f of walkJs(path.join(ROOT, 'src/engines/domain'))) {
    const { txt, staticDeps, dynamicDeps } = graph.get(f);
    for (const dep of [...staticDeps, ...dynamicDeps]) {
      const r = rel(dep);
      if (/^src\/(core|components|i18n|modules)\//.test(r) || /three-scene|webgl|chart|viz\.js/.test(r)) {
        errors.push(`Domain purity violation: ${rel(f)} imports ${r}`);
      }
    }
    if (/\b(document\.|window\.|localStorage\b|fetch\s*\()/.test(txt)) {
      errors.push(`Domain purity violation: ${rel(f)} references browser/DOM API`);
    }
  }

  // 3. Core layer boundary (src/core/* must not import components/ or modules/)
  for (const f of walkJs(path.join(ROOT, 'src/core'))) {
    const { staticDeps, dynamicDeps } = graph.get(f);
    for (const dep of [...staticDeps, ...dynamicDeps]) {
      const r = rel(dep);
      if (/^src\/(components|modules)\//.test(r)) {
        errors.push(`Core boundary violation: ${rel(f)} imports ${r}`);
      }
    }
  }

  // 4. Home boot static closure guard (src/main.js must stay lean)
  const mainAbs = path.join(ROOT, 'src/main.js');
  const bootSeen = new Set();
  const walkStatic = (u) => {
    if (bootSeen.has(u) || !graph.has(u)) return;
    bootSeen.add(u);
    for (const v of graph.get(u).staticDeps) walkStatic(v);
  };
  walkStatic(mainAbs);
  const bootRel = [...bootSeen].map(rel);
  const forbiddenOnBoot = [
    'src/i18n/ui.js',
    'src/components/diorama-3d.js',
    'src/components/diorama/part1.js',
    'src/components/diorama/part2.js',
    'src/data/nep-cbq.js',
    'src/modules/class-x-bridge.js',
    'src/modules/teacher-meta.js',
    'src/engines/viz.js',
    'vendor/d3/d3-viz.esm.js',
    'vendor/three/three.module.min.js',
  ];
  for (const bad of forbiddenOnBoot) {
    if (bootRel.includes(bad)) errors.push(`Eager boot bloat: src/main.js statically imports ${bad}`);
  }

  // 5. Per-theme lazy module isolation (MODULES[T##] must not import other themes' specs or legacy barrels)
  const regText = fs.readFileSync(path.join(ROOT, 'src/modules/registry.js'), 'utf8');
  const modEntries = [...regText.matchAll(/(T\d\d)\s*:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/g)];
  if (modEntries.length !== 16) errors.push(`Expected 16 MODULES entries in registry.js, found ${modEntries.length}`);
  for (const [, themeId, relImp] of modEntries) {
    const entryAbs = path.resolve(ROOT, 'src/modules', relImp);
    const seen = new Set();
    const walkMod = (u) => {
      if (seen.has(u) || !graph.has(u)) return;
      seen.add(u);
      for (const v of graph.get(u).staticDeps) walkMod(v);
    };
    walkMod(entryAbs);
    for (const depAbs of seen) {
      const r = rel(depAbs);
      if (/^src\/modules\/[^/]+\/labs-(air-water-life|geo-extra|history-early|history-later|politics|econ|econ-extra)\.js$/.test(r)) {
        errors.push(`Theme ${themeId} imports multi-theme barrel ${r} instead of per-theme specs`);
      }
      const mSpec = r.match(/\/(t\d\d)-specs\.js$/);
      if (mSpec && mSpec[1].toUpperCase() !== themeId) {
        errors.push(`Theme ${themeId} cross-imports foreign spec file ${r}`);
      }
    }
  }

  // 6. index.html modulepreload & SW precache / catalog sync checks
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const preloads = [...html.matchAll(/<link\s+rel="modulepreload"\s+href="([^"]+)">/g)].map((m) => m[1]);
  if (preloads.length < 5) errors.push('index.html missing critical-path modulepreload hints');
  for (const href of preloads) {
    if (!fs.existsSync(path.join(ROOT, href))) errors.push(`index.html modulepreload missing file: ${href}`);
  }

  const swText = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const swMatch = swText.match(/const PRECACHE = (\[[\s\S]*?\]);/);
  if (!swMatch) errors.push('sw.js missing PRECACHE array');
  else {
    const precacheSet = new Set(JSON.parse(swMatch[1]));
    for (const f of srcFiles) {
      const r = rel(f);
      if (!precacheSet.has(r)) errors.push(`sw.js PRECACHE is stale; missing ${r} (run npm run sw)`);
    }
  }

  const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/curriculum/curriculum.json'), 'utf8'));
  const cov = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/CURRICULUM_COVERAGE.json'), 'utf8'));
  const curLOs = cur.themes.reduce((a, t) => a + t.learningObjects.length, 0);
  if (cov.summary?.total !== curLOs || cov.summary?.implemented !== cur.themes.reduce((a, t) => a + t.learningObjects.filter((l) => l.status === 'implemented').length, 0)) {
    errors.push('docs/CURRICULUM_COVERAGE.json is out of sync with curriculum.json (run npm run catalog)');
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      srcFiles: srcFiles.length,
      bootStaticModules: bootRel.length,
      bootStaticKB: +(bootRel.reduce((a, r) => a + fs.statSync(path.join(ROOT, r)).size, 0) / 1024).toFixed(1),
      themesVerified: modEntries.length,
      preloads: preloads.length,
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const res = runArchitectureChecks();
  console.log(JSON.stringify(res, null, 2));
  if (!res.ok) process.exit(1);
}
