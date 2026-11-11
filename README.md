# EduVerse: Class IX Social Science visualiser (CBSE 087, 2026-27)

Interactive, bilingual (English / हिन्दी / English + हिन्दी) learning labs bound to the CBSE Class IX Social Science syllabus. Static ES modules, no bundler, no backend, no login, no ads, no tracking. Works on GitHub Pages or any static host, and offline after the first visit.

## Run
```
npm run serve        # http://127.0.0.1:8080/   (needs tools/serve.mjs; any static server works, e.g. python3 -m http.server)
npm test             # engine and lab-spec unit tests (Node 20+, no dependencies)
npm run smoke        # browser checks of every theme (needs: npm i --no-save playwright)
npm run catalog      # regenerate docs/CURRICULUM_COVERAGE.json and docs/SIMULATION_CATALOG.json
npm run sw           # regenerate sw.js (offline precache list) after adding files
```
`tools/build-curriculum.mjs`, `tools/serve.mjs`, `tests/e2e.py` and the geodata build are referred to by older scripts but are not in this repository.

## What is built (honest status)
27 of 78 learning objects are implemented, in 12 of 16 themes; 51 are placeholders. Exact status per object: `docs/CURRICULUM_COVERAGE.json`; per simulation: `docs/SIMULATION_CATALOG.json`.

| Theme | Built |
|---|---|
| T02 Shaping of the Earth's Surface | L1 plate map, L2 boundary explorer (3D + SVG), L3 Earth interior, L4 weathering/erosion/deposition |
| T03 Atmosphere and Climate | L1 atmosphere layers (standard atmosphere), L4 land and sea breeze |
| T04 Early Humans | L1 deep-time clock, L2 evidence vs inference |
| T06 Democracy | L3 parliamentary vs presidential |
| T07 Elections | L2 electoral systems, L4 coalition formation |
| T08 Building Blocks in Economics | L2 production possibility frontier |
| T09 The Price Puzzle | L1 to L6 |
| T10 Oceans and Life | L2 tides (spring/neap), L4 tsunami timing |
| T11 Life on Earth | L3 forest harvest and food web |
| T13 India and the World-I | L1 time-filtered trade routes |
| T15 From Ideas to Startups | L2 unit economics, L5 profit and loss |
| T16 Smart Ways to Manage Your Finances | L1 budget, L2 inflation, L3 simple vs compound interest |
| T01, T05, T12, T14 | syllabus wording, opening question, placeholder |

Every lab states its learning objective and whether its data is documented, schematic, fictional or a reconstruction; explains changes live in both languages; asks the student to predict before testing; ends with an exit ticket and a reflection; and has a reset.

## Layout
`index.html`, `sw.js` (generated), `assets/css/app.css`, `src/core` (store, i18n, dom), `src/components` (`widgets.js`, `lab-kit.js`), `src/engines` (chart, three-scene, webgl, xr), `src/engines/domain` (12 pure engines), `src/modules/<discipline>/` (pure models + UI + lab specs), `src/i18n/ui.js`, `src/curriculum/curriculum.json`, `data/` (glossary, geodata, coverage), `vendor/three`, `tests/`, `tools/`, `docs/`.

Architecture, how to add a lab, and the capability fallbacks: `docs/INTEGRATION_ARCHITECTURE.md`.

## Accessibility and performance
Keyboard operable, 44 px touch targets, projector mode, reduced motion, low-graphics mode, no-WebGL fallback (`?nowebgl=1`), render-on-demand 3D, lazy module loading, offline service worker. Home page is 59 KB gzip; lab pages 65 to 100 KB; the 3D module (168 KB gzip) loads only when a 3D tab opens. Measurements and limits: `docs/PERFORMANCE_AUDIT.md`. Tests and what they do not cover: `docs/TEST_REPORT.md`.

## Research and licences
Which open-source projects were evaluated and why none was added as a dependency: `docs/GITHUB_REPOSITORY_RESEARCH.md`.

## Attributions
three.js (MIT, vendored r170, licence in `vendor/three/LICENSE`); plate outlines from PB2002 (Bird 2003, ODC-By) via the fraxen/tectonicplates repository; coastlines from Natural Earth (public domain). See `data/geo/SOURCES.md`. Atmosphere values follow the US Standard Atmosphere 1976.

## Policies
`docs/ACCURACY_AND_SOURCE_POLICY.md`. Hindi text is draft until reviewed by a subject teacher.
