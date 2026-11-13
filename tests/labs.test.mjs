// Structural, bilingual and numeric-safety checks for every lab spec across all 16 themes (no browser needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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
import { xrSupport } from '../src/engines/xr.js';

const SPECS = [
  t01, earth, t03, t10, t11, t04, t05, t12, t13, trade, t06, t07, auth, t08, t15, t16,
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
      if (v.plate) {
        assert.ok(v.plate.src && fs.existsSync(path.resolve(import.meta.dirname, '..', v.plate.src)), `${s.id} ${what}: missing plate ${v.plate.src}`);
        assert.ok(v.plate.en && v.plate.hi && DEV.test(v.plate.hi), `${s.id} ${what}: plate lacks bilingual caption`);
        assert.ok(Array.isArray(v.plate.spots) && v.plate.spots.length >= 2, `${s.id} ${what}: expected >=2 interactive hotspots on 2D plate`);
        for (const sp of v.plate.spots) {
          assert.ok(sp.x >= 0 && sp.x <= 100 && sp.y >= 0 && sp.y <= 100, `${s.id} ${what}: spot coords out of 0..100`);
          assert.ok(sp.en && sp.hi && DEV.test(sp.hi), `${s.id} ${what}: spot lacks bilingual title`);
          assert.ok(sp.detail?.en && sp.detail?.hi && DEV.test(sp.detail.hi), `${s.id} ${what}: spot lacks bilingual detail`);
          if (sp.set) {
            for (const [k, val] of Object.entries(sp.set)) {
              const ctl = s.controls.find((c) => c.id === k);
              assert.ok(ctl, `${s.id} ${what}: spot.set key "${k}" is not a valid control`);
              if (ctl.type === 'chips') assert.ok(ctl.options.some((o) => o.id === val), `${s.id} ${what}: spot.set.${k}=${val} not a chip option`);
              if (ctl.type === 'slider') assert.ok(val >= ctl.min && val <= ctl.max, `${s.id} ${what}: spot.set.${k}=${val} outside slider [${ctl.min}..${ctl.max}]`);
            }
            const nextV = s.view({ ...S, ...sp.set });
            assert.ok(nextV.svg.includes('<svg') && !BAD.test(nextV.svg), `${s.id} ${what}: spot.set produced bad svg`);
          }
        }
      }
      assert.ok(v.plate, `${s.id} ${what}: every LO lab must render an interactive 2D plate`);
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
  const S = t10.tsunami.init(); assert.match(t10.tsunami.view(S).lines[0].en, /713/);
  assert.match(t03.cutaway.view({ alt: 11 }).lines[0].en, /-56|−56/);
  assert.match(t16.interest.view({ principal: 10000, rate: 8, years: 30 }).lines[0].en, /1,00,626|1,00,627/);
});

test('xr detection never throws and defaults to unsupported', async () => {
  assert.deepEqual(await xrSupport({}), { vr: false, ar: false, secure: true });
  assert.deepEqual(await xrSupport({ xr: { isSessionSupported: async (m) => m === 'immersive-vr' } }), { vr: true, ar: false, secure: true });
  assert.deepEqual(await xrSupport({ xr: { isSessionSupported: async () => { throw new Error('denied'); } } }), { vr: false, ar: false, secure: true });
});
