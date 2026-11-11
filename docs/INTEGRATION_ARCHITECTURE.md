# Integration architecture

## 1. Principles

1. **No framework change.** Static ES modules, hash routing, no bundler, no backend. URLs (`#/theme/T09`), stored state keys and existing modules are unchanged.
2. **Engines are pure.** A domain engine takes numbers and returns numbers or plain objects. No DOM, no `window`, no randomness, no I/O. That is what makes every engine unit-testable in Node and reusable by any UI (2-D lab, 3-D view, teacher view, future worksheet generator).
3. **One rendering engine.** three.js (vendored r170) for 3-D; plain SVG for everything else. No second engine.
4. **Heavy things load on demand.** Each theme loads through `registry.js` with `import()`; three.js loads only when a 3D tab opens.
5. **The core works without capabilities.** No WebGL → SVG twin. No WebXR → nothing changes. No network after first load → every lab still works; the only fetches are static JSON files (`curriculum.json`, `glossary.json`, geodata) and the trade map treats its land outlines as optional.
6. **Honest provenance.** Every lab declares one of `documented | schematic | fictional | reconstruction` and shows it in a coloured callout.

## 2. Layers

```
              ┌──────────────────────────── src/main.js: router · curriculum · status · language bar
              │
 theme page ──┤  src/modules/registry.js  (lazy import per theme)
              │      ├─ legacy modules: tectonics · early-humans · elections · price-puzzle  (unchanged)
              │      ├─ composite wrappers: geography/earth.js · politics/elections-plus.js
              │      └─ lab modules: atmosphere · oceans · life · trade · democracy · foundations · startups · finance
              │
 lab runner ──┤  src/components/lab-kit.js   createLab(spec) · mountLabs(root, theme, specs, tabs)
              │      uses widgets.js (slider/chips/toggle/tabs/predict/mcq), core/i18n.js, core/store.js
              │
 views ───────┤  src/engines/chart.js (SVG) · inline SVG · three-scene.js + webgl.js (lazy 3-D)
              │
 engines ─────┘  src/engines/domain/*.js  pure models (12)         src/engines/xr.js  capability probe
```

Dependency direction is strictly downward. The files in `src/engines/domain/` import nothing from `components`, `core` or any DOM API; the only upward references are three re-exports of the existing pure models (`election.js` → `politics/models.js`, `market.js` → `economics/models.js`, `tectonics.js` → `geography/models.js`).

## 3. Domain engines (the brief's twelve)

| # | Brief | File | Exposes | Used by |
|---|---|---|---|---|
| 1 | Terrain and landform | `terrain.js` | `gradate`, `run`, `initialProfile`; mass-conserving erosion/deposition profile | T02.L4 |
| 2 | Earth structure, tectonics | `tectonics.js` (re-export of `geography/models.js`) | `tectonicState`, `convergenceKm`, `layerAtDepth` | T02.L2–L3 |
| 3 | Atmosphere and climate | `atmosphere.js` | ISA temperature/pressure, `massBelow`, `localWind` | T03.L1, L4 |
| 4 | Ocean systems | `ocean.js` | `tidalRange`, `tideSeries`, `tsunamiSpeed`, `warning` | T10.L2, L4 |
| 5 | Ecosystems, food webs | `ecosystem.js` | `harvestRun`, `maxSustainableYield`, `webRun` (RK4) | T11.L3 |
| 6 | Historical timeline | `timeline.js` | linear/log placement, BCE/CE conversion | (T04 uses `history/models.js`) |
| 7 | Historical maps, trade routes | `tradeRoutes.js` | cities, routes with date spans, haversine, `activeRoutes`, `project` | T13.L1 |
| 8 | Democracy, institutions | `institutions.js` | actors/relations, `confidenceVote`, `lawPassage` | T06.L3 |
| 9 | Election, voting | `election.js` (+ `politics/models.js`) | FPTP, runoff, proportional, `minimalWinningCoalitions` | T07.L2, L4 |
| 10 | Supply-demand, equilibrium | `market.js` (+ `economics/models.js`) | equilibrium, ceilings, externality, PPF | T08.L2, T09 |
| 11 | Entrepreneurship, startups | `startup.js` | `unitEconomics`, `series`, `runwayMonths` | T15.L2, L5 |
| 12 | Personal finance | `finance.js` | budget split, simple/compound, doubling, inflation | T16.L1–L3 |

`src/engines/domain/index.js` re-exports all twelve as namespaces. Each engine has tests in `tests/engines.test.mjs`.

**Engine contract.** Pure functions; inputs validated by clamping rather than throwing (a slider can reach any value); outputs contain everything the view needs, so a view never recomputes physics; unit-bearing names (`...Km`, `...Pct`, `...HPa`); any teaching simplification is named in a comment at the top of the file.

## 4. The lab kit

A lab is data. `createLab(spec, themeId)` builds the page; the spec supplies only domain content.

```js
{ id: 'T10.L4',
  objective: {en, hi},                       // learning objective
  note: {kind: 'documented'|'schematic'|'fictional'|'reconstruction', en?, hi?},
  init: () => state,                          // JSON state, persisted in the store, restored on reload
  controls: [{id, type: 'slider'|'chips'|'toggle', label: {en,hi}, min, max, step, fmt?, hint?, options?}],
  view: (state) => ({ svg, aria, lines: [{en, hi, cls?}] }),   // pure; calls an engine
  discover: [{en, hi}],                       // guided-discovery prompts
  predictions: [{id, stem, options, run(state) → optionId, explain(state) → {en, hi}}],
  exit: [mcq], reflect: {en, hi} }
```

What the kit guarantees for every lab, which is the "visual and pedagogical standard" of the brief:

| Requirement | How it is met |
|---|---|
| Learning objective | Rendered first from `objective` |
| Bilingual | Every string is `{en, hi}`; three language modes re-render without resetting state; `tests/labs.test.mjs` fails if any English string lacks Devanagari Hindi |
| Accurate visual | `view()` derives the SVG from the engine only |
| Interactive controls | sliders (native `range`, keyboard operable), chips (radio group), toggles |
| Cause and effect, real-time explanation | `view().lines` re-rendered on every input, in an `aria-live="polite"` region |
| Experimentation, guided discovery | `discover` list |
| Prediction → test | `predictions`: student commits first; `run()` applies the experiment to the live model and grades against the engine, not a hard-coded answer |
| Assessment / application | exit tickets (hint, retry, explained feedback) + a reflection box saved locally |
| Reset | one control restoring `init()` |
| Provenance | coloured callout per `note.kind` |

**Adding a lab** (typical effort: one spec file, no UI code): write or reuse an engine function; write the spec; add it to a module with `mountLabs`; register the theme in `registry.js`; set the learning object's status in `curriculum.json`; run `node --test tests/*.test.mjs`, `node tests/lab-smoke.cjs T##`, `node tools/build-catalog.mjs`.

## 5. Capability detection and fallbacks

| Capability | Check | Behaviour when absent |
|---|---|---|
| WebGL | `engines/webgl.js` (also `?nowebgl=1`) | 3-D tab shows the 2-D section; every 3-D view already has an SVG twin |
| Low graphics | user switch in the bar, stored | 3-D uses simpler rendering |
| Reduced motion | `prefers-reduced-motion` + user switch | animations replaced by jumps |
| WebXR | `engines/xr.js` `xrSupport()` | returns `{vr:false, ar:false}`; no UI shown; nothing depends on it |
| Storage | `store.js` try/catch | memory-only state |
| Network | no runtime API calls; optional land outlines in T13 | map without coastlines |
| Touch | 44 px targets (existing CSS), pointer events | — |

## 6. Performance budget (enforced by measurement, see `PERFORMANCE_AUDIT.md`)

Home ≤ 60 KB gzip, any theme without 3D ≤ 100 KB gzip, 3D tab adds one cached 168 KB gzip module, input-to-redraw ≤ 16 ms, no horizontal overflow at 360 px.

## 7. Internationalisation and content rules

- Interface strings live in `src/i18n/ui.js`; lab content lives in the spec next to the model so that content authors change one file.
- Glossary terms come from `data/glossary.json`.
- Hindi is draft until a subject teacher signs it off (the per-simulation field `hindiReview` in `SIMULATION_CATALOG.json` records this).
- Fictional data is labelled fictional; reconstructions are labelled reconstructions; documented values name their basis. No real product rates, party names or market prices are encoded.

## 8. Testing strategy

| Layer | Test | Command |
|---|---|---|
| Engines | physics/economics identities, conservation, boundary cases | `node --test tests/engines.test.mjs` |
| Lab specs | structure, Hindi presence, numeric safety at all control extremes, prediction and exit-ticket integrity | `node --test tests/labs.test.mjs` |
| Browser | every control on every tab, 3 languages, errors, overflow, latency, heap | `node tests/lab-smoke.cjs T02 T03 …` (`W=360 MOBILE=1` for phone) |
| Payload | requests and gzip bytes per page | `node tests/perf-size.cjs` |
| Catalogue | coverage and simulation catalogue regenerate from source | `node tools/build-catalog.mjs` |

## 9. Measuring comprehension (not yet done)

The brief's success criterion is improved understanding, which code cannot prove. Proposed pilot, using what is already built: (1) a 6-question pre-test per theme drawn from the exit tickets; (2) students use the lab with prediction-before-test; (3) the same questions as a post-test a week later; (4) compare gain with a class taught the same topic without the lab; (5) read per-prediction correctness from the stored `done` map (data stays in the browser; export is a manual step). The app deliberately has no telemetry, so any collection needs a teacher-run export or a separately consented tool.

## 10. Roadmap

1. Teacher review of Hindi and of `tradeRoutes.js` dates.
2. Remaining learning objects, in order of reuse of existing engines: T08.L1/L3, T16.L4, T15.L1, T07.L1/L3, T06.L1, T03.L5/L6, T10.L3.
3. 3-D landform gallery and ocean relief on the existing three.js scene (needs compressed meshes and level-of-detail).
4. Optional VR view gated on `xrSupport()`, tested on a real headset.
5. Reconstructed environments (Harappan street, fort) with a clear *reconstruction* label and sourced evidence panel.
