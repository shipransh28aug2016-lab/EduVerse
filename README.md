# EduVerse: Social Science for Classes IX and X in 2D and 3D (CBSE 087)

Interactive, bilingual (English / हिन्दी / English + हिन्दी) learning labs for the CBSE Class IX Social Science syllabus (2026-27, 16 themes) and the four NCERT Class X textbooks (22 chapters). Static ES modules, no bundler, no backend, no login, no ads, no tracking. Works on GitHub Pages or any static host, and offline after the first visit.

## Run
```
npm run serve        # http://0.0.0.0:4173/   (tools/serve.mjs; any static server works)
npm test             # engine, 67 lab-spec, DOM/module & HTTP server tests (Node 20+)
npm run smoke        # Chromium checks of all 16 themes (needs Playwright + Chromium)
npm run a11y         # Chromium accessibility checks T01–T16 (needs Playwright + Chromium)
npm run catalog      # regenerate docs/CURRICULUM_COVERAGE.json and docs/SIMULATION_CATALOG.json
npm run sw           # regenerate sw.js (offline precache list) after adding files
npm run vendor       # rebuild vendor bundles and fonts from node_modules (after npm ci)
```

## What is built (honest status)
All **78 of 78 learning objects** across all **16 themes (`T01`–`T16`)** are implemented across **79 interactive simulations** (`67` declarative `lab-kit` / `three-lab` simulations + `12` custom interactive modules). Exact status per object: `docs/CURRICULUM_COVERAGE.json`; per simulation: `docs/SIMULATION_CATALOG.json`. Note: only the 27 LOs listed in `data/coverage/qa-passed.json` carry prior Chromium QA verification; the remaining 51 LOs are verified by unit + `jsdom` DOM/interaction suites pending headless Chromium verification.

| Theme | Built Labs |
|---|---|
| T01 Exploring Social Science | L1 Society-Environment-Economy-Governance system map, L2 Indian regional lenses (India map), L3 4-discipline enquiry sorter |
| T02 Shaping of the Earth's Surface | L1 plate map, L2 boundary explorer (3D + SVG), L3 Earth interior, L4 gradation sandbox, L5 3D landform gallery, L6 slope & GLOF hazard lab |
| T03 Atmosphere and Climate | L1 atmosphere layers (ISA 1976), L2 climate grapher (5 Indian stations), L3 Indian monsoon map, L4 coastal breeze, L5 catchment flood balance, L6 carbon footprint |
| T04 Early Humans | L1 deep-time clock, L2 evidence vs inference, L3 forager-to-farmer sim, L4 3D Harappan city planner, L5 river-valley civilisations world map |
| T05 Early Civilisations & Empires | L1 historical geography of India map, L2 Vedic sources room, L3 Sabha/Mahajanapada/Mauryan admin flow, L4 knowledge traditions gallery, L5 trade & guild routes |
| T06 Democracy | L1 democracy audit matrix, L2 Indian democratic roots gallery, L3 parliamentary vs presidential, L4 world constitutional systems map |
| T07 Elections | L1 ECI election process flow, L2 electoral systems, L3 delimitation & voter roll lab, L4 coalition & anti-defection lab |
| T08 Building Blocks in Economics | L1 scarcity budget game, L2 production possibility frontier, L3 circular flow, L4 economic systems matrix, L5 welfare safety net |
| T09 The Price Puzzle | L1 market supply/demand, L2 price ceiling, L3 real-world deviations, L4 externalities, L5 public goods, L6 information asymmetry |
| T10 Oceans and Life | L1 3D ocean-floor relief cutaway, L2 tides (spring/neap), L3 sustainable fisheries, L4 tsunami timing, L5 UNCLOS maritime cooperation |
| T11 Life on Earth | L1 world biomes map, L2 India biosphere reserves map, L3 forest harvest & food web, L4 forest fire mitigation planner, L5 sacred groves & FRA policy |
| T12 Resisting & Adapting (1000–1700 CE) | L1 regional kingdoms India map, L2 3D Indian hill fort defence lab, L3 architecture/literature/crafts gallery, L4 Bhakti force-network, L5 state & economy timeline |
| T13 India and the World-I | L1 time-filtered trade routes map, L2 cultural & scholarly exchange map, L3 Indian Knowledge Systems gallery, L4 maritime/archaeological artefact viewer |
| T14 Roots of Authority | L1 Kautilya & Shukraniti source room, L2 Danda–Nyaya–Bala concept network, L3 evolution of authority timeline, L4 types of authority audit, L5 citizen & RTI civic workflow |
| T15 From Ideas to Startups | L1 business plan & stages builder, L2 unit economics, L3 India startup/MSME ecosystem map, L4 creative destruction, L5 profit, loss & balance sheet |
| T16 Smart Ways to Manage Your Finances | L1 budget, L2 inflation, L3 simple vs compound interest, L4 investment risk-return & insurance pool, L5 income tax concept flow |

Every lab states its learning objective and whether its data is documented, schematic, fictional or a reconstruction; explains changes live in English and Hindi; asks the student to predict before testing; ends with an exit ticket and a reflection; and includes a reset.

## Class X (22 chapters)
Routes: `#/x` (chapter grid) and `#/x/<id>`. Every chapter page has a cinematic 3D stage, four key ideas, one or two 2D explorers and a four-question quiz, all bilingual. Chapters are plain data in `src/x/data/*.js`; the engines read declarative specs.

| Textbook | Chapters | 3D scenes | 2D explorers |
|---|---|---|---|
| History: India and the Contemporary World II | H1–H5 | globe with layers (Europe; routes of the global world), extruded India map (national movement, Dandi route), cotton-mill diorama, hand-press diorama | timelines, share chart |
| Geography: Contemporary India II | G1–G7 | extruded India map with layers (soils, tiger reserves, dams, crops, minerals and energy, industries, Golden Quadrilateral, ports, air links), multipurpose-dam diorama | classification trees, step flows, crop calendar |
| Political Science: Democratic Politics II | P1–P5 | globe (Belgium / Sri Lanka; party systems), tier models (forms of power-sharing, three tiers of government, party structure), data towers | bars, trees, step flows, democracy scorecard |
| Economics: Understanding Economic Development | E1–E5 | data towers (India and neighbours; three states; sectors), bank credit-loop diorama, globe of a production chain, consumer-commission tiers | cost-of-credit calculator, Sankey chain, trees, step flows |

Class IX additionally gains a "3D atlas" on T01, T04, T10, T11 and T13, and its five existing 3D labs get image-based lighting.

3D engine: `src/engines/stage.js` (three.js r170 with orbit controls, bloom, room-environment PBR lighting, soft shadows, CSS2D labels, hover picking; renders only while on screen). Scene builders: `src/x/scenes/{globe,india,towers,diorama}.js`. Viewer and fallback: `src/x/stage-view.js`. With Low graphics on, or without WebGL, each stage is replaced by a text list of the same information.

Limits to know about: maps use present-day borders; whole states are highlighted for regions that are really parts of states; pins are approximate; dioramas are schematics. Class X figures are those printed in the NCERT chapters and editions differ. Which chapters and map items are assessed changes with each CBSE circular and is not encoded here. Hindi is draft.

## Layout
`src/x/` (Class X data, page, 2D explorers, 3D scene builders, Class IX atlas), `src/engines/stage.js`, `assets/fonts/`, `tools/build-vendor.mjs`, plus:
`index.html`, `sw.js` (generated), `assets/css/app.css`, `assets/images/`, `src/core` (`dom`, `i18n`, `store`, `media`), `src/components` (`widgets`, `lab-kit`, `three-lab`), `src/engines` (`chart`, `viz`, `three-scene`, `webgl`, `xr`, and `domain/`), `src/modules/` (16 themes + `teacher-meta.js` + `openings.js` + `registry.js`), `src/i18n/ui.js`, `src/curriculum/curriculum.json`, `data/` (`glossary.json`, `geo/`, `coverage/`), `vendor/` (`three`, `d3`, `lucide`), `tests/`, `tools/`, `docs/`.

## Accessibility and performance
Keyboard operable, ≥44 px touch targets, projector mode, reduced motion, low-graphics mode (disables WebGL & hides raster banners), no-WebGL fallback (`?nowebgl=1`), single-tab render-on-demand 3D, lazy module loading, offline service worker.

## Attributions
- **Three.js** (MIT, vendored r170 core plus addons in `vendor/three/three-fx.esm.js`, licence in `vendor/three/LICENSE`)
- **d3-hierarchy, d3-sankey, d3-interpolate, d3-ease** (ISC / BSD-3-Clause, `vendor/d3/d3-plus.esm.js`)
- **Fonts**: Inter, Fraunces, Noto Sans Devanagari (SIL OFL 1.1, `assets/fonts/`, licence files beside them)
- **D3 & TopoJSON** (`d3-array`, `d3-force`, `d3-geo`, `d3-path`, `d3-scale`, `d3-shape`, `topojson-client`, bundled in `vendor/d3/d3-viz.esm.js`)
- **Lucide Icons** (ISC, bundled in `vendor/lucide/lucide-icons.esm.js`)
- **Geodata**: Natural Earth / `world-atlas` (`data/geo/countries-110m.json`, `WORLD_ATLAS_LICENSE`), `datta07/INDIAN-SHAPEFILES` simplified (`data/geo/india.simplified.json`, `INDIA_SHAPEFILES_LICENSE`), PB2002 tectonic plates (Bird 2003, ODC-By). See `data/geo/SOURCES.md`.
- Atmosphere values follow the US Standard Atmosphere 1976.

## Policies
`docs/ACCURACY_AND_SOURCE_POLICY.md`. Hindi text is draft until reviewed by a subject teacher.
