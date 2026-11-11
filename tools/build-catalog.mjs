// Generates docs/CURRICULUM_COVERAGE.json and docs/SIMULATION_CATALOG.json from the curriculum, QA list and lab specs.
// usage: node tools/build-catalog.mjs   (idempotent; run after changing labs or learning-object status)
import fs from 'node:fs';
import * as earth from '../src/modules/geography/labs-earth.js';
import * as awl from '../src/modules/geography/labs-air-water-life.js';
import * as trade from '../src/modules/history/labs-trade.js';
import * as pol from '../src/modules/politics/labs-politics.js';
import * as econ from '../src/modules/economics/labs-econ.js';
const cur = JSON.parse(fs.readFileSync('src/curriculum/curriculum.json', 'utf8')), qa = new Set(JSON.parse(fs.readFileSync('data/coverage/qa-passed.json', 'utf8')).passed);
const specs = [earth.gradation, awl.cutaway, awl.breeze, awl.tides, awl.tsunami, awl.harvest, awl.foodweb, trade.trade, pol.institutions, pol.coalition, econ.ppf, econ.unit, econ.pnl, econ.budget, econ.interest, econ.inflation];
const FILE = { 'T02.L4': 'src/modules/geography/labs-earth.js', 'T03': 'src/modules/geography/labs-air-water-life.js', 'T10': 'src/modules/geography/labs-air-water-life.js', 'T11': 'src/modules/geography/labs-air-water-life.js', 'T13': 'src/modules/history/labs-trade.js', 'T06': 'src/modules/politics/labs-politics.js', 'T07.L4': 'src/modules/politics/labs-politics.js', 'T08': 'src/modules/economics/labs-econ.js', 'T15': 'src/modules/economics/labs-econ.js', 'T16': 'src/modules/economics/labs-econ.js' };
const ENGINE = { T02: 'terrain', T03: 'atmosphere', T10: 'ocean', T11: 'ecosystem', T13: 'tradeRoutes', T06: 'institutions', T07: 'election', T08: 'market', T15: 'startup', T16: 'finance' };
const LEGACY = { 'T02.L1': 'src/modules/geography/tectonics.js', 'T02.L2': 'src/modules/geography/tectonics.js', 'T02.L3': 'src/modules/geography/tectonics.js', 'T04.L1': 'src/modules/history/early-humans.js', 'T04.L2': 'src/modules/history/early-humans.js', 'T07.L2': 'src/modules/politics/elections.js' };
const bySpec = new Map(); for (const s of specs) { const lo = s.id.split('.').slice(0, 2).join('.').replace(/[a-z]$/, ''); (bySpec.get(lo) ?? bySpec.set(lo, []).get(lo)).push(s); }
const catalog = [], themes = [];
for (const t of cur.themes) {
  const los = t.learningObjects.map((l) => {
    const ss = bySpec.get(l.id) ?? [], file = ss.length ? (FILE[l.id] ?? FILE[t.id]) : LEGACY[l.id] ?? (t.id === 'T09' ? 'src/modules/economics/price-puzzle.js' : null);
    for (const s of ss) catalog.push({ id: s.id, learningObject: l.id, theme: t.id, title: { en: l.en, hi: l.hi }, modality: l.modality, engine: ENGINE[t.id] ? `src/engines/domain/${{ T02: 'terrain', T03: 'atmosphere', T10: 'ocean', T11: 'ecosystem', T13: 'tradeRoutes', T06: 'institutions', T07: 'election', T08: 'market', T15: 'startup', T16: 'finance' }[t.id]}.js` : null,
      implementation: file, kit: 'src/components/lab-kit.js', objective: s.objective, provenance: s.note.kind, controls: s.controls.map((c) => ({ id: c.id, type: c.type, label: c.label })), guidedDiscoveryPrompts: s.discover.length, predictions: s.predictions.length, exitQuestions: s.exit.length, hasReflection: !!s.reflect, hasReset: true, bilingual: true, hindiReview: 'draft: subject-teacher review pending', status: l.status, qaPassed: qa.has(l.id), verification: ['tests/engines.test.mjs', 'tests/labs.test.mjs', 'tests/lab-smoke.cjs'] });
    if (!ss.length && file) catalog.push({ id: l.id, learningObject: l.id, theme: t.id, title: { en: l.en, hi: l.hi }, modality: l.modality, implementation: file, kit: null, status: l.status, qaPassed: qa.has(l.id), bilingual: true, hindiReview: 'draft: subject-teacher review pending', note: 'hand-built module that predates lab-kit' });
    return { id: l.id, modality: l.modality, engine: l.engine, status: l.status, qaPassed: qa.has(l.id), implementation: file };
  });
  const n = los.length, k = los.filter((l) => l.status === 'implemented').length;
  themes.push({ id: t.id, part: t.partNo ?? t.part, discipline: t.discipline, hours: t.hours, title: t.title, concepts: t.concepts.length, outcomes: t.outcomes.length, learningObjects: { total: n, implemented: k, planned: n - k, qaPassed: los.filter((l) => l.qaPassed).length }, items: los });
}
const tot = themes.reduce((a, t) => ({ total: a.total + t.learningObjects.total, implemented: a.implemented + t.learningObjects.implemented, qaPassed: a.qaPassed + t.learningObjects.qaPassed }), { total: 0, implemented: 0, qaPassed: 0 });
fs.writeFileSync('docs/CURRICULUM_COVERAGE.json', JSON.stringify({ generatedBy: 'tools/build-catalog.mjs', source: cur.meta.doc, summary: { ...tot, planned: tot.total - tot.implemented, themesWithAnyLab: themes.filter((t) => t.learningObjects.implemented).length, themes: themes.length }, themes }, null, 1));
fs.writeFileSync('docs/SIMULATION_CATALOG.json', JSON.stringify({ generatedBy: 'tools/build-catalog.mjs', count: catalog.length, simulations: catalog }, null, 1));
console.log(JSON.stringify({ ...tot, planned: tot.total - tot.implemented, simulations: catalog.length }));
