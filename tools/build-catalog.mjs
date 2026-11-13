// Generates docs/CURRICULUM_COVERAGE.json and docs/SIMULATION_CATALOG.json from the curriculum, QA list and lab specs.
// usage: node tools/build-catalog.mjs   (idempotent; run after changing labs or learning-object status)
import fs from 'node:fs';
import * as t01 from '../src/modules/integrated/t01.js';
import * as earth from '../src/modules/geography/labs-earth.js';
import * as t03 from '../src/modules/geography/t03-specs.js';
import * as t10 from '../src/modules/geography/t10-specs.js';
import * as t11 from '../src/modules/geography/t11-specs.js';
import * as t04 from '../src/modules/history/t04-specs.js';
import * as t05 from '../src/modules/history/t05-specs.js';
import * as t12 from '../src/modules/history/t12-specs.js';
import * as t13 from '../src/modules/history/t13-specs.js';
import * as trade from '../src/modules/history/labs-trade.js';
import * as t06 from '../src/modules/politics/t06-specs.js';
import * as t07 from '../src/modules/politics/t07-specs.js';
import * as auth from '../src/modules/politics/labs-authority.js';
import * as t08 from '../src/modules/economics/t08-specs.js';
import * as t15 from '../src/modules/economics/t15-specs.js';
import * as t16 from '../src/modules/economics/t16-specs.js';

const cur = JSON.parse(fs.readFileSync('src/curriculum/curriculum.json', 'utf8'));
const qa = new Set(JSON.parse(fs.readFileSync('data/coverage/qa-passed.json', 'utf8')).passed);

const MODS = [
  ['src/modules/integrated/t01.js', t01],
  ['src/modules/geography/labs-earth.js', earth],
  ['src/modules/geography/t03-specs.js', t03],
  ['src/modules/geography/t10-specs.js', t10],
  ['src/modules/geography/t11-specs.js', t11],
  ['src/modules/history/t04-specs.js', t04],
  ['src/modules/history/t05-specs.js', t05],
  ['src/modules/history/t12-specs.js', t12],
  ['src/modules/history/t13-specs.js', t13],
  ['src/modules/history/labs-trade.js', trade],
  ['src/modules/politics/t06-specs.js', t06],
  ['src/modules/politics/t07-specs.js', t07],
  ['src/modules/politics/labs-authority.js', auth],
  ['src/modules/economics/t08-specs.js', t08],
  ['src/modules/economics/t15-specs.js', t15],
  ['src/modules/economics/t16-specs.js', t16],
];

const specs = [];
const FILE_MAP = {};
for (const [file, mod] of MODS) {
  for (const v of Object.values(mod)) {
    if (v && typeof v === 'object' && v.id && v.view && v.controls) {
      specs.push(v);
      FILE_MAP[v.id] = file;
    }
  }
}

const ENGINE_FILE = {
  T01: 'society',
  T02: 'terrain',
  T03: 'atmosphere',
  T04: 'history',
  T05: 'history',
  T06: 'institutions',
  T07: 'election',
  T08: 'market',
  T09: 'market',
  T10: 'ocean',
  T11: 'ecosystem',
  T12: 'history',
  T13: 'tradeRoutes',
  T14: 'society',
  T15: 'startup',
  T16: 'finance',
};

const LEGACY = {
  'T02.L1': 'src/modules/geography/tectonics.js',
  'T02.L2': 'src/modules/geography/tectonics.js',
  'T02.L3': 'src/modules/geography/tectonics.js',
  'T04.L1': 'src/modules/history/early-humans.js',
  'T04.L2': 'src/modules/history/early-humans.js',
  'T07.L2': 'src/modules/politics/elections.js',
};

const bySpec = new Map();
for (const s of specs) {
  const lo = s.id.split('.').slice(0, 2).join('.').replace(/[a-z]$/, '');
  (bySpec.get(lo) ?? bySpec.set(lo, []).get(lo)).push(s);
}

const catalog = [], themes = [];
for (const t of cur.themes) {
  const los = t.learningObjects.map((l) => {
    const ss = bySpec.get(l.id) ?? [];
    const file = ss.length ? FILE_MAP[ss[0].id] : (LEGACY[l.id] ?? (t.id === 'T09' ? 'src/modules/economics/price-puzzle.js' : null));
    for (const s of ss) {
      catalog.push({
        id: s.id,
        learningObject: l.id,
        theme: t.id,
        title: { en: l.en, hi: l.hi },
        modality: l.modality,
        engine: ENGINE_FILE[t.id] ? `src/engines/domain/${ENGINE_FILE[t.id]}.js` : null,
        implementation: FILE_MAP[s.id],
        kit: 'src/components/lab-kit.js',
        objective: s.objective,
        provenance: s.note.kind,
        controls: s.controls.map((c) => ({ id: c.id, type: c.type, label: c.label })),
        guidedDiscoveryPrompts: s.discover.length,
        predictions: s.predictions.length,
        exitQuestions: s.exit.length,
        hasReflection: !!s.reflect,
        hasReset: true,
        bilingual: true,
        hindiReview: 'draft: subject-teacher review pending',
        status: l.status,
        qaPassed: qa.has(l.id),
        verification: ['tests/engines.test.mjs', 'tests/labs.test.mjs', 'tests/lab-smoke.cjs'],
      });
    }
    if (!ss.length && file) {
      catalog.push({
        id: l.id,
        learningObject: l.id,
        theme: t.id,
        title: { en: l.en, hi: l.hi },
        modality: l.modality,
        implementation: file,
        kit: null,
        status: l.status,
        qaPassed: qa.has(l.id),
        bilingual: true,
        hindiReview: 'draft: subject-teacher review pending',
        note: 'hand-built module that predates lab-kit',
      });
    }
    return { id: l.id, modality: l.modality, engine: l.engine, status: l.status, qaPassed: qa.has(l.id), implementation: file };
  });
  const n = los.length, k = los.filter((l) => l.status === 'implemented').length;
  themes.push({
    id: t.id,
    part: t.partNo ?? t.part,
    discipline: t.discipline,
    hours: t.hours,
    title: t.title,
    concepts: t.concepts.length,
    outcomes: t.outcomes.length,
    learningObjects: { total: n, implemented: k, planned: n - k, qaPassed: los.filter((l) => l.qaPassed).length },
    items: los,
  });
}

const tot = themes.reduce((a, t) => ({
  total: a.total + t.learningObjects.total,
  implemented: a.implemented + t.learningObjects.implemented,
  qaPassed: a.qaPassed + t.learningObjects.qaPassed,
}), { total: 0, implemented: 0, qaPassed: 0 });

fs.writeFileSync('docs/CURRICULUM_COVERAGE.json', JSON.stringify({
  generatedBy: 'tools/build-catalog.mjs',
  source: cur.meta.doc,
  summary: { ...tot, planned: tot.total - tot.implemented, themesWithAnyLab: themes.filter((t) => t.learningObjects.implemented).length, themes: themes.length },
  themes,
}, null, 1));
fs.writeFileSync('docs/SIMULATION_CATALOG.json', JSON.stringify({
  generatedBy: 'tools/build-catalog.mjs',
  count: catalog.length,
  simulations: catalog,
}, null, 1));
console.log(JSON.stringify({ ...tot, planned: tot.total - tot.implemented, simulations: catalog.length }));
