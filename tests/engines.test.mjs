import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engines/domain/index.js';
const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('terrain: mass is conserved (eroded = deposited + carried to sea)', () => {
  for (const agent of E.terrain.AGENTS) for (const rock of Object.keys(E.terrain.ROCK_HARDNESS)) {
    const r = E.terrain.run({ rain: 0.7, rock, agent }, 60);
    near(r.eroded, r.deposited + r.sea, 1e-6);
    const before = E.terrain.initialProfile().reduce((a, b) => a + b, 0), after = r.profile.reduce((a, b) => a + b, 0);
    near(before - after, r.sea, 1e-6);
  }
});
test('terrain: more rain and softer rock erode faster; vegetation slows erosion', () => {
  const e = (o) => E.terrain.run(o, 30).eroded;
  assert.ok(e({ rain: 0.9 }) > e({ rain: 0.1 }));
  assert.ok(e({ rock: 'soft' }) > e({ rock: 'hard' }));
  assert.ok(e({ vegetation: 1 }) < e({ vegetation: 0 }));
  assert.ok(E.terrain.run({}, 60).relief < E.terrain.run({}, 0).relief);
});
test('atmosphere: ISA reference values', () => {
  near(E.atmosphere.temperatureC(0), 15); near(E.atmosphere.temperatureC(11), -56.5, 0.01); near(E.atmosphere.temperatureC(32), -44.5, 0.01);
  near(E.atmosphere.pressureHPa(0), 1013.25, 0.01); near(E.atmosphere.pressureHPa(11), 226.32, 0.2);
  assert.ok(E.atmosphere.massBelow(12) > 0.75 && E.atmosphere.massBelow(12) < 0.85);
  assert.equal(E.atmosphere.layerAt(5).id, 'troposphere'); assert.equal(E.atmosphere.layerAt(30).id, 'stratosphere');
  near(E.atmosphere.COMPOSITION.reduce((s, c) => s + c.pct, 0), 100, 0.05);
});
test('atmosphere: sea breeze by day, land breeze at night; cloud reduces the contrast', () => {
  assert.equal(E.atmosphere.localWind({ hour: 15 }).kind, 'sea-breeze');
  assert.equal(E.atmosphere.localWind({ hour: 3 }).kind, 'land-breeze');
  assert.ok(E.atmosphere.localWind({ hour: 15, cloud: 1 }).speed < E.atmosphere.localWind({ hour: 15 }).speed);
});
test('ocean: spring range > neap range; series matches the analytic range', () => {
  assert.ok(E.ocean.tidalRange(0) > E.ocean.tidalRange(90)); near(E.ocean.tidalRange(0), E.ocean.tidalRange(180)); near(E.ocean.tidalRange(90), E.ocean.tidalRange(270));
  const range = (p) => { const s = E.ocean.tideSeries(p, 26, 0.05).map((x) => x.h); return Math.max(...s) - Math.min(...s); };
  near(range(0), E.ocean.tidalRange(0), 0.05);
  near(E.ocean.tidalRange(0), 2 * (1 + 0.46)); near(E.ocean.tidalRange(90), 2 * (1 - 0.46));
});
test('ocean: tsunami speed in deep water is ~713 km/h and slows in shallows', () => {
  near(E.ocean.tsunamiKmh(4000), 713.1, 0.5); assert.ok(E.ocean.tsunamiKmh(10) < 40);
  near(E.ocean.arrivalHours(713.1, 4000), 1, 0.01);
  assert.equal(E.ocean.warning({ distKm: 100, depthM: 4000, sirenMinutes: 100 }).timeToEvacuate, 0);
});
test('ecosystem: sustainable yield is r*K/4; harvest above it collapses', () => {
  near(E.ecosystem.maxSustainableYield(), 100);
  assert.ok(E.ecosystem.harvestRun({ harvest: 90 }).sustainable);
  assert.notEqual(E.ecosystem.harvestRun({ harvest: 130 }).collapsedAt, null);
  assert.equal(E.ecosystem.harvestRun({ harvest: 0, stock0: 100, years: 80 }).final > 900, true);
});
test('ecosystem: predator–prey stays positive and oscillates; culling predators lets prey rise', () => {
  const w = E.ecosystem.webRun(); assert.ok(w.every((p) => p.prey > 0 && p.pred > 0));
  const peaks = w.filter((p, i) => i && i < w.length - 1 && p.prey > w[i - 1].prey && p.prey >= w[i + 1].prey).length; assert.ok(peaks >= 2);
  const max = (a) => Math.max(...a.map((p) => p.prey));
  assert.ok(max(E.ecosystem.webRun({ cullYear: 5, cullFrac: 0.9 })) > max(w));
});
test('timeline: placement and BCE/CE labels', () => {
  near(E.timeline.linear(0, 100), 1); near(E.timeline.linear(100, 100), 0); assert.ok(E.timeline.log(10, 1e6) > E.timeline.log(1000, 1e6));
  assert.equal(E.timeline.yaToLabel(E.timeline.yearToYa(-2600)), '2600 BCE'); assert.equal(E.timeline.yaToLabel(E.timeline.yearToYa(1000)), '1000 CE');
  assert.equal(E.timeline.activeAt([{ start: -10, end: 10 }, { start: 20, end: 30 }], 5).length, 1);
});
test('tradeRoutes: haversine, active routes by year, all stops are known', () => {
  near(E.tradeRoutes.haversineKm({ lat: 0, lon: 0 }, { lat: 0, lon: 90 }), 10007.5, 1);
  for (const r of E.tradeRoutes.ROUTES) for (const s of r.stops) assert.ok(E.tradeRoutes.CITIES[s], s);
  assert.deepEqual(E.tradeRoutes.activeRoutes(-2000).map((r) => r.id), ['indus-mesopotamia']);
  assert.equal(E.tradeRoutes.activeRoutes(-5000).length, 0);
  assert.ok(E.tradeRoutes.travelDays(E.tradeRoutes.ROUTES[1]) > 100);
  const [x, y] = E.tradeRoutes.project({ lat: 48, lon: 20 }); near(x, 0); near(y, 0);
});
test('institutions: only a parliamentary executive falls on a lost confidence vote', () => {
  assert.equal(E.institutions.confidenceVote('parliamentary', { total: 100, supportExec: 50 }).outcome, 'executive-falls');
  assert.equal(E.institutions.confidenceVote('parliamentary', { total: 100, supportExec: 51 }).outcome, 'executive-continues');
  assert.equal(E.institutions.confidenceVote('presidential', { total: 100, supportExec: 10 }).outcome, 'executive-continues');
  assert.equal(E.institutions.lawPassage('presidential', { total: 100, supportExec: 40 }).note, 'gridlock-possible');
  for (const s of E.institutions.SYSTEMS) for (const [a, b] of E.institutions.RELATIONS[s]) assert.ok(E.institutions.ACTORS[s].includes(a) && E.institutions.ACTORS[s].includes(b));
});
test('election: existing systems still work; coalitions are minimal and winning', () => {
  const f = E.election.run('fptp', 0); assert.equal(Object.values(f.seats).reduce((a, b) => a + b, 0), E.election.SEATS);
  const c = E.election.minimalWinningCoalitions({ R: 4, B: 3, G: 2, Y: 1 }); assert.equal(c.need, 6);
  for (const k of c.coalitions) { assert.ok(k.seats >= 6); for (const p of k.parties) assert.ok(k.seats - { R: 4, B: 3, G: 2, Y: 1 }[p] < 6); }
  assert.equal(E.election.minimalWinningCoalitions({ R: 7, B: 3 }).coalitions[0].parties.join(), 'R');
});
test('market: existing equilibrium preserved; PPF shows increasing opportunity cost', () => {
  near(E.market.equilibrium(E.market.initialMarket()).P, 50);
  assert.equal(E.market.ppfPoint(0, 0, 10, 10).status, 'inefficient'); assert.equal(E.market.ppfPoint(10, 10, 10, 10).status, 'unattainable');
  assert.ok(E.market.opportunityCost(8, 1, 10, 10) > E.market.opportunityCost(1, 1, 10, 10));
});
test('startup: break-even and profit', () => {
  const u = E.startup.unitEconomics({ price: 50, varCost: 30, fixed: 2000, units: 100 });
  assert.equal(u.breakEven, 100); assert.equal(u.status, 'break-even'); assert.equal(E.startup.unitEconomics({ price: 50, varCost: 30, fixed: 2000, units: 99 }).status, 'loss');
  assert.equal(E.startup.unitEconomics({ price: 20, varCost: 30, fixed: 10, units: 5 }).breakEven, Infinity);
  assert.equal(E.startup.runwayMonths(1000, 250), 4);
});
test('finance: interest, doubling, inflation', () => {
  near(E.finance.simpleAmount(1000, 10, 10), 2000); near(E.finance.compoundAmount(1000, 10, 10), 2593.74, 0.01);
  assert.ok(E.finance.compoundAmount(1000, 10, 1) === E.finance.simpleAmount(1000, 10, 1) || Math.abs(E.finance.compoundAmount(1000, 10, 1) - 1100) < 1e-9);
  near(E.finance.doublingYears(8).rule72, 9); near(E.finance.doublingYears(8).exact, 9.006, 0.01);
  near(E.finance.realValue(1000, 6, 10), 558.39, 0.01); near(E.finance.realRate(8, 6), 1.887, 0.01);
  const b = E.finance.budgetSplit({ income: 10000, needs: 5000, wants: 3000 }); near(b.savingsPct, 20); assert.equal(E.finance.budgetSplit({ income: 100, needs: 80, wants: 40 }).deficit, true);
});
test('tectonics wrapper exposes the existing model', () => {
  near(E.tectonics.convergenceKm(5, 40), 2000); assert.equal(E.tectonics.layerAtDepth(3000).state, 'liquid');
});
