// Class X: data integrity for all 22 chapters and a DOM mount of every chapter page in each language mode.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(import.meta.dirname, '..');
const dom = new JSDOM('<!doctype html><html><body><main id="main"></main></body></html>', { url: 'http://localhost:4173/' });
for (const k of ['window', 'document', 'location', 'navigator', 'localStorage', 'HTMLElement', 'SVGElement', 'Element', 'Node', 'Event']) Object.defineProperty(globalThis, k, { value: dom.window[k], configurable: true, writable: true });
globalThis.matchMedia = () => ({ matches: false });
globalThis.ResizeObserver = class { observe() {} disconnect() {} };

const { CHAPTERS, UNITS } = await import('../src/x/data/index.js');
const india = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/geo/india.simplified.json'), 'utf8')).features.map((f) => f.properties.name));
const world = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/geo/countries-110m.json'), 'utf8')).objects.countries.geometries.map((g) => g.properties.name));
const bil = (o, where) => { assert.ok(o && typeof o.en === 'string' && o.en.trim(), `${where}: missing English`); assert.ok(typeof o.hi === 'string' && /[ऀ-ॿ]/.test(o.hi), `${where}: missing Hindi`); };

test('22 chapters across four textbooks with unique ids', () => {
  assert.equal(CHAPTERS.length, 22);
  assert.equal(new Set(CHAPTERS.map((c) => c.id)).size, 22);
  assert.deepEqual(UNITS.map((u) => CHAPTERS.filter((c) => c.unit === u.id).length), [5, 7, 5, 5]);
});

test('every chapter is bilingual and has 3D scenes, 2D explorers, ideas and a valid quiz', () => {
  for (const c of CHAPTERS) {
    bil(c, c.id); bil(c.hook, `${c.id} hook`); bil(c.note, `${c.id} note`);
    assert.ok(c.scenes.length >= 1 && c.explore.length >= 1, `${c.id}: needs 3D and 2D`);
    assert.equal(c.ideas.length, 4); c.ideas.forEach((i) => { bil(i, `${c.id} idea`); bil(i.d, `${c.id} idea text`); });
    assert.equal(c.quiz.length, 4);
    // options may be bare numerals or acronyms, so they only need to be non-empty
    for (const q of c.quiz) { bil(q.q, `${c.id} question`); bil(q.why, `${c.id} explanation`); assert.equal(q.o.length, 4); q.o.forEach((o) => assert.ok(o.en.trim() && o.hi.trim(), `${c.id} option`)); assert.ok(q.a >= 0 && q.a < 4); }
    for (const e of c.explore) bil(e.t, `${c.id} explorer title`);
  }
});

test('3D scene specs reference real map features and sane coordinates', () => {
  for (const c of CHAPTERS) for (const s of c.scenes) {
    bil(s.t, `${c.id} scene title`);
    assert.ok(['globe', 'india', 'towers', 'diorama'].includes(s.kind), `${c.id}: unknown kind ${s.kind}`);
    if (s.kind === 'towers') for (const se of s.series) { bil(se, `${c.id} series`); assert.equal(se.values.length, s.cats.length); se.values.forEach((v) => assert.ok(Number.isFinite(v) && v >= 0)); }
    for (const L of s.layers || []) {
      bil(L, `${c.id} layer`);
      const seen = new Set();
      for (const g of L.groups || []) for (const st of g.states) { assert.ok(india.has(st), `${c.id}: unknown state ${st}`); assert.ok(!seen.has(st), `${c.id} ${L.en}: ${st} is in two groups`); seen.add(st); }
      for (const k of Object.keys(L.highlight || {})) assert.ok(world.has(k), `${c.id}: unknown country ${k}`);
      for (const p of L.points || []) { bil(p, `${c.id} point`); assert.ok(Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180); if (s.kind === 'india') assert.ok(p.lat > 5 && p.lat < 38 && p.lon > 66 && p.lon < 98, `${c.id}: ${p.en} is off the India map`); }
    }
  }
});

test('every chapter page mounts, relabels in en / hi / both, and the quiz scores', async () => {
  const store = await import('../src/core/store.js');
  const { mountChapter, chapterGrid, quizScore } = await import('../src/x/page.js');
  const main = document.getElementById('main');
  assert.equal(chapterGrid().reduce((a, sec) => a + sec.querySelectorAll('.xcard').length, 0), 22);
  for (const c of CHAPTERS) {
    main.replaceChildren();
    const inst = mountChapter(main, c.id);
    assert.equal(inst.debug().stage.live, false, 'no WebGL in jsdom: text alternative expected');
    assert.ok(main.querySelector('.stage-fallback li'), `${c.id}: 3D text alternative missing`);
    for (const b of main.querySelectorAll('.x2d button, .schip')) b.click();
    for (const r of main.querySelectorAll('.x2d input[type=range]')) { assert.ok(main.querySelector(`label[for="${r.id}"]`), `${c.id}: slider needs a label`); r.value = r.max; r.dispatchEvent(new dom.window.Event('input', { bubbles: true })); }
    for (const lang of ['en', 'hi', 'both']) {
      store.set({ lang }); inst.relabel();
      assert.equal(/\b(NaN|undefined|Infinity)\b|⟦/.test(main.innerHTML), false, `${c.id} (${lang}) renders a broken value`);
      for (const svg of main.querySelectorAll('svg[role=img]')) assert.ok(svg.getAttribute('aria-label')?.trim(), `${c.id}: chart needs a label`);
    }
    main.querySelectorAll('.xq').forEach((f, i) => f.querySelectorAll('.xq-opt')[c.quiz[i].a].click());
    assert.deepEqual(quizScore(c), { done: true, n: 4, of: 4 });
    inst.destroy();
  }
});
