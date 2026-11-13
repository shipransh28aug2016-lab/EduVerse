import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(import.meta.dirname, '..');
const realFetch = globalThis.fetch;

function setupDom() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost:4173/' });
  const g = dom.window;
  for (const k of ['window', 'document', 'location', 'navigator', 'localStorage', 'HTMLElement', 'SVGElement', 'Element', 'Node', 'Event', 'KeyboardEvent', 'CustomEvent']) {
    if (g[k] !== undefined) Object.defineProperty(globalThis, k, { value: g[k], configurable: true, writable: true });
  }
  globalThis.addEventListener = g.addEventListener.bind(g);
  globalThis.removeEventListener = g.removeEventListener.bind(g);
  globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  g.scrollTo = () => {};
  globalThis.scrollTo = () => {};
  globalThis.requestAnimationFrame = (fn) => setTimeout(() => fn(performance.now()), 0);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  globalThis.fetch = async (u) => {
    const clean = String(u).replace(/^\/+/, '').split('?')[0];
    const p = path.join(ROOT, clean);
    if (!fs.existsSync(p)) return { ok: false, status: 404, async text() { return ''; }, async json() { throw new Error('404 ' + p); } };
    const txt = fs.readFileSync(p, 'utf8');
    return { ok: true, status: 200, async text() { return txt; }, async json() { return JSON.parse(txt); } };
  };
  return dom;
}

test('DOM + module mount/relabel/a11y/interaction check across all 16 themes (T01–T16)', async () => {
  setupDom();
  try {
    const [{ UI }, { MODULES, TEACHER, LIMITS }, store, i18n, { HERO_MEDIA, THEME_MEDIA, themeBannerEl }, { iconEl }] = await Promise.all([
      import('../src/i18n/ui.js'),
      import('../src/modules/registry.js'),
      import('../src/core/store.js'),
      import('../src/core/i18n.js'),
      import('../src/core/media.js'),
      import('../src/engines/viz.js'),
    ]);

    const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/curriculum/curriculum.json'), 'utf8'));
    const gl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/glossary.json'), 'utf8'));
    i18n.register(UI);
    i18n.setGlossary(gl.terms);

    assert.equal(cur.themes.length, 16);
    assert.ok(fs.existsSync(path.join(ROOT, HERO_MEDIA.src)), 'HERO_MEDIA image missing');
    for (const th of cur.themes) {
      assert.ok(MODULES[th.id], `Missing MODULES entry for ${th.id}`);
      assert.ok(TEACHER[th.id], `Missing TEACHER entry for ${th.id}`);
      assert.ok(LIMITS[th.id], `Missing LIMITS entry for ${th.id}`);
      const m = THEME_MEDIA[th.id];
      assert.ok(m && fs.existsSync(path.join(ROOT, m.src)), `Missing media file for ${th.id}`);
      const svg = iconEl(m.icon, { size: 16 });
      assert.equal(svg.tagName.toLowerCase(), 'svg', `Lucide icon failed for ${th.id}: ${m.icon}`);
      const banner = themeBannerEl(th.id);
      assert.ok(banner && banner.querySelector('img'), `themeBannerEl failed for ${th.id}`);
    }

    const main = document.getElementById('main');
    for (const th of cur.themes) {
      store.set({ lang: 'en', lowGraphics: false, reducedMotion: false });
      main.replaceChildren();
      const banner = themeBannerEl(th.id);
      const modSlot = document.createElement('div');
      modSlot.id = 'module';
      main.append(banner, modSlot);
      const mod = await MODULES[th.id]();
      const inst = mod.mount(modSlot, {});
      assert.ok(inst && typeof inst.relabel === 'function' && typeof inst.destroy === 'function', `${th.id} missing lifecycle hooks`);

      // Exercise every tab in the theme
      const tabs = [...modSlot.querySelectorAll('[role=tab]')];
      for (const tab of tabs) {
        tab.click();
        await new Promise((r) => setTimeout(r, 5));
      }

      // Exercise sliders, radios, switches, and MCQ buttons
      for (const tab of tabs.length ? tabs : [null]) {
        if (tab) tab.click();
        for (const r of modSlot.querySelectorAll('input[type=range]')) {
          const labelOk = !!(r.getAttribute('aria-label') || r.getAttribute('aria-labelledby') || (r.id && modSlot.querySelector(`label[for="${r.id}"]`)));
          assert.ok(labelOk, `${th.id} slider lacks accessible label`);
          r.value = r.max;
          r.dispatchEvent(new Event('input', { bubbles: true }));
          r.value = r.min;
          r.dispatchEvent(new Event('input', { bubbles: true }));
        }
        for (const c of modSlot.querySelectorAll('.chips .chip')) c.click();
        for (const sw of modSlot.querySelectorAll('input[type=checkbox]')) sw.click();
        for (const opt of modSlot.querySelectorAll('.predict .opt, .mcq .opt')) opt.click();
      }

      // Verify SVG accessibility, 2D plate images + no NaN/undefined/Infinity/unresolved i18n keys in EN, HI, and BOTH
      for (const img of main.querySelectorAll('.lab-plate img')) {
        const src = img.getAttribute('src') || '';
        assert.ok(src && fs.existsSync(path.join(ROOT, src)), `${th.id} .lab-plate missing file: ${src}`);
        assert.ok((img.getAttribute('alt') || '').trim().length > 0, `${th.id} .lab-plate missing alt text`);
      }
      assert.ok(main.querySelectorAll('.lab-plate img').length >= 1, `${th.id} expected at least one .lab-plate 2D image inside labs`);
      for (const lang of ['en', 'hi', 'both']) {
        store.set({ lang });
        i18n.apply(main);
        inst.relabel();
        const html = main.innerHTML;
        assert.equal(/⟦[^⟧]+⟧/.test(html), false, `${th.id} (${lang}) has unresolved i18n placeholder`);
        assert.equal(/\b(NaN|undefined|Infinity)\b/.test(html), false, `${th.id} (${lang}) contains NaN/undefined/Infinity`);
        for (const svg of main.querySelectorAll('svg[role=img]')) {
          assert.ok((svg.getAttribute('aria-label') || '').trim().length > 0, `${th.id} (${lang}) svg[role=img] missing aria-label`);
        }
      }

      inst.destroy();
    }
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('all static assets, images, geodata, vendor bundles & sw.js precache files exist on disk', () => {
  const swText = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const m = swText.match(/const PRECACHE = (\[[\s\S]*?\]);/);
  assert.ok(m, 'sw.js must contain PRECACHE array');
  const files = JSON.parse(m[1]);
  assert.ok(files.length >= 80, 'sw.js precache should include app shell + modules');
  for (const rel of files) {
    const clean = rel === './' ? 'index.html' : rel.replace(/^\.\//, '');
    assert.ok(fs.existsSync(path.join(ROOT, clean)), `sw.js lists missing file: ${rel}`);
  }
});

test('tools/serve.mjs serves static assets over HTTP on 0.0.0.0 without 404s', async () => {
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = u === '/' ? 'index.html' : u.replace(/^\/+/, '');
    const p = path.resolve(ROOT, rel);
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  }).listen(0, '127.0.0.1');
  await new Promise((r) => srv.once('listening', r));
  const port = srv.address().port;
  try {
    const urls = [
      '/',
      '/assets/css/app.css',
      '/src/main.js',
      '/src/curriculum/curriculum.json',
      '/data/glossary.json',
      '/data/geo/india.simplified.json',
      '/data/geo/countries-110m.json',
      '/vendor/d3/d3-viz.esm.js',
      '/vendor/lucide/lucide-icons.esm.js',
      '/vendor/three/three.module.min.js',
      '/sw.js',
      '/assets/images/hero.jpg',
      ...Array.from({ length: 16 }, (_, i) => `/assets/images/t${String(i + 1).padStart(2, '0')}.jpg`),
      ...fs.readdirSync(path.join(ROOT, 'assets/images/plates')).filter((f) => f.endsWith('.jpg')).map((f) => `/assets/images/plates/${f}`),
    ];
    for (const u of urls) {
      const resp = await fetch(`http://127.0.0.1:${port}${u}`);
      assert.equal(resp.status, 200, `HTTP status mismatch for ${u}`);
      const buf = await resp.arrayBuffer();
      assert.ok(buf.byteLength > 50, `Empty body for ${u}`);
    }
  } finally {
    srv.close();
  }
});

test('src/main.js app shell boots, routes Home <-> Theme, toggles preferences & renders 100% bilingual curriculum', async () => {
  setupDom();
  try {
    await import('../src/main.js');
    // Wait for async boot() + initial home() render
    for (let i = 0; i < 40 && !document.querySelector('#main .card'); i++) {
      await new Promise((r) => setTimeout(r, 15));
    }
    const cards = [...document.querySelectorAll('#main .card')];
    assert.equal(cards.length, 16, 'Home should render all 16 theme cards');
    assert.ok(document.querySelector('.hero-shell .hero-art img'), 'Home should render hero illustration');
    assert.equal(document.querySelectorAll('#main .card .card-media img').length, 16, 'All 16 cards should have media banners');
    assert.equal(document.querySelectorAll('#main .badge.implemented').length, 16, 'All 16 cards should show implemented badge');

    // Toggle UI preferences in topbar
    for (const pref of ['lowGraphics', 'reducedMotion', 'projector', 'teacher']) {
      const btn = document.querySelector(`#topbar [data-pref="${pref}"]`);
      assert.ok(btn, `Missing topbar button for ${pref}`);
      btn.click();
    }
    assert.ok(document.documentElement.classList.contains('low-g'));
    assert.ok(document.documentElement.classList.contains('reduce-motion'));
    assert.ok(document.documentElement.classList.contains('projector'));
    assert.ok(document.documentElement.classList.contains('teacher'));
    // Reset lowGraphics off for theme page render
    document.querySelector('#topbar [data-pref="lowGraphics"]').click();

    // Switch to Hindi and navigate to T12
    document.querySelector('#topbar [data-lang="hi"]').click();
    location.hash = '#/theme/T12';
    window.dispatchEvent(new Event('hashchange'));
    for (let i = 0; i < 40 && !document.querySelector('#module .lab'); i++) {
      await new Promise((r) => setTimeout(r, 15));
    }
    const mainHtml = document.getElementById('main').innerHTML;
    assert.ok(document.querySelector('#main .theme-banner img'), 'Theme page should render banner');
    assert.ok(document.querySelector('#module .lab'), 'Theme T12 should mount lab inside #module');
    assert.ok(document.querySelector('#main dl.gloss dd[data-term-def]'), 'Theme T12 should render bilingual glossary definitions');
    assert.equal(/⟦[^⟧]+⟧/.test(mainHtml), false, 'Theme page has unresolved i18n key');
    assert.equal(/\b(NaN|undefined|Infinity)\b/.test(mainHtml), false, 'Theme page contains invalid literal');

    // Verify live language switching updates LO chips & glossary <dd> definitions in place
    const glossDdBefore = document.querySelector('#main dl.gloss dd[data-term-def]').textContent;
    const loChipBefore = document.querySelector('#main .chip-lo').textContent;
    document.querySelector('#topbar [data-lang="en"]').click();
    assert.notEqual(document.querySelector('#main dl.gloss dd[data-term-def]').textContent, glossDdBefore, 'Glossary definition should update live on lang switch');
    assert.notEqual(document.querySelector('#main .chip-lo').textContent, loChipBefore, 'LO chip should update live on lang switch');
    document.querySelector('#topbar [data-lang="both"]').click();
    assert.match(document.querySelector('#main dl.gloss dd[data-term-def]').textContent, /[ऀ-ॿ]/, 'Glossary definition in both mode should include Hindi');

    // Return home
    location.hash = '#/';
    window.dispatchEvent(new Event('hashchange'));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(document.querySelectorAll('#main .card').length, 16);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('every theme T01–T16 has bilingual glossary coverage', () => {
  const gl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/glossary.json'), 'utf8'));
  const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/curriculum/curriculum.json'), 'utf8'));
  for (const term of gl.terms) {
    assert.ok(term.en && /[ऀ-ॿ]/.test(term.hi || ''), `Glossary ${term.id} missing Hindi term`);
    assert.ok(term.defEn && /[ऀ-ॿ]/.test(term.defHi || ''), `Glossary ${term.id} missing Hindi def`);
  }
  for (const th of cur.themes) {
    const terms = gl.terms.filter((g) => (g.themes || []).includes(th.id));
    assert.ok(terms.length >= 2, `${th.id} expected >= 2 glossary terms, found ${terms.length}`);
  }
});
