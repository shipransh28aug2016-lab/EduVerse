// Structural, bilingual and numeric-safety checks for every lab spec across all 16 themes (no browser needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as t01 from '../src/modules/integrated/t01.js';
import * as earth from '../src/modules/geography/labs-earth.js';
import * as geoExtra from '../src/modules/geography/labs-geo-extra.js';
import * as awl from '../src/modules/geography/labs-air-water-life.js';
import * as histEarly from '../src/modules/history/labs-history-early.js';
import * as histLater from '../src/modules/history/labs-history-later.js';
import * as trade from '../src/modules/history/labs-trade.js';
import * as pol from '../src/modules/politics/labs-politics.js';
import * as auth from '../src/modules/politics/labs-authority.js';
import * as econ from '../src/modules/economics/labs-econ.js';
import * as econExtra from '../src/modules/economics/labs-econ-extra.js';
import { xrSupport } from '../src/engines/xr.js';

const SPECS = [
  t01, earth, geoExtra, awl, histEarly, histLater, trade, pol, auth, econ, econExtra,
].flatMap((m) => Object.values(m).filter((v) => v && typeof v === 'object' && v.id && v.view && v.controls));

const DEV = /[ऀ-ॿ]/, BAD = /NaN|undefined|Infinity|\[object/;
const isBi = (o) => o && typeof o === 'object' && typeof o.en === 'string' && 'hi' in o;
function* biStrings(v, path = '') {
  if (isBi(v)) { yield [path, v]; }
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (typeof x === 'object') yield* biStrings(x, `${path}.${k}`);
}
const DEFAULT_LOS = SPECS.map((s) => s.id);

test('spec ids are unique and each has the required pedagogy parts', () => {
  assert.ok(SPECS.length >= 66, `expected >=66 specs, got ${SPECS.length}`);
  assert.equal(new Set(DEFAULT_LOS).size, SPECS.length);
  for (const s of SPECS) {
    assert.ok(isBi(s.objective), `${s.id} objective`);
    assert.ok(s.note?.kind, `${s.id} provenance note`);
    assert.ok(s.controls.length >= 1, `${s.id} controls`);
    assert.ok(s.discover?.length >= 1, `${s.id} guided discovery`);
    assert.ok(s.predictions?.length >= 1, `${s.id} prediction`);
    assert.ok(s.exit?.length >= 1, `${s.id} assessment`);
    assert.ok(isBi(s.reflect), `${s.id} reflection`);
    assert.doesNotThrow(() => JSON.stringify(s.init()), `${s.id} state is JSON`);
    assert.ok(['fictional', 'schematic', 'documented', 'reconstruction'].includes(s.note.kind));
  }
});

test('every English string has a non-empty Devanagari Hindi counterpart', () => {
  for (const s of SPECS) for (const [path, o] of biStrings(s)) {
    if (!/[A-Za-z]{3}/.test(o.en)) continue;
    assert.ok(typeof o.hi === 'string' && DEV.test(o.hi), `${s.id}${path}: missing Hindi for "${o.en.slice(0, 50)}"`);
  }
});

test('control values: init inside range; every control extreme renders without NaN/undefined/Infinity', () => {
  for (const s of SPECS) {
    const init = s.init();
    for (const c of s.controls) {
      if (c.type === 'slider') assert.ok(init[c.id] >= c.min && init[c.id] <= c.max, `${s.id}.${c.id} init out of range`);
      if (c.type === 'chips') assert.ok(c.options.some((o) => o.id === init[c.id]), `${s.id}.${c.id} init not an option`);
    }
    const check = (S, what) => {
      const v = s.view(S);
      assert.ok(v.svg.includes('<svg'), `${s.id} ${what} svg`);
      assert.ok(!BAD.test(v.svg), `${s.id} ${what}: bad number in svg`);
      assert.ok(v.lines.length >= 1);
      for (const l of v.lines) {
        assert.ok(l.en && l.hi && DEV.test(l.hi), `${s.id} ${what}: line lacks Hindi`);
        assert.ok(!BAD.test(l.en + l.hi), `${s.id} ${what}: bad number in "${l.en.slice(0, 60)}"`);
      }
    };
    check(init, 'default');
    for (const c of s.controls) {
      const vals = c.type === 'slider' ? [c.min, (c.min + c.max) / 2, c.max] : c.type === 'chips' ? c.options.map((o) => o.id) : [true, false];
      for (const x of vals) check({ ...init, [c.id]: x }, `${c.id}=${x}`);
    }
  }
});

test('predictions: run() returns a listed option; explanation is bilingual; state stays valid', () => {
  for (const s of SPECS) for (const p of s.predictions) {
    const S = s.init();
    const out = p.run(S);
    assert.ok(p.options.some((o) => o.id === out), `${s.id}.${p.id}: run() returned "${out}" which is not an option`);
    const e = p.explain(S);
    assert.ok(e.en && DEV.test(e.hi) && !BAD.test(e.en + e.hi), `${s.id}.${p.id} explanation`);
    assert.ok(s.view(S).lines.length >= 1);
    for (const o of p.options) assert.ok(o.en && o.hi && (!/[A-Za-z]{3}/.test(o.en) || DEV.test(o.hi)), `${s.id}.${p.id} option ${o.id}`);
  }
});

test('exit tickets: exactly one correct option, wrong options explain themselves', () => {
  for (const s of SPECS) for (const q of s.exit) {
    assert.equal(q.options.filter((o) => o.id === q.correct).length, 1, `${s.id}.${q.id} correct option`);
    assert.ok(q.options.length >= 2 && isBi(q.explain) && isBi(q.hint));
    for (const o of q.options) if (o.id !== q.correct) assert.ok(isBi(o.why) || isBi(q.explain), `${s.id}.${q.id} feedback for ${o.id}`);
  }
});

test('scientific spot checks surfaced in the labs', () => {
  const S = awl.tsunami.init(); assert.match(awl.tsunami.view(S).lines[0].en, /713/);
  assert.match(awl.cutaway.view({ alt: 11 }).lines[0].en, /-56|−56/);
  assert.match(econ.interest.view({ principal: 10000, rate: 8, years: 30 }).lines[0].en, /1,00,626|1,00,627/);
});

test('xr detection never throws and defaults to unsupported', async () => {
  assert.deepEqual(await xrSupport({}), { vr: false, ar: false, secure: true });
  assert.deepEqual(await xrSupport({ xr: { isSessionSupported: async (m) => m === 'immersive-vr' } }), { vr: true, ar: false, secure: true });
  assert.deepEqual(await xrSupport({ xr: { isSessionSupported: async () => { throw new Error('denied'); } } }), { vr: false, ar: false, secure: true });
});
