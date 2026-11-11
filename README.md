# EduVerse: Class IX Social Science visualiser (CBSE 087, 2026-27)

Interactive, bilingual (English / हिन्दी / English + हिन्दी) learning labs bound to the CBSE Class IX Social Science syllabus. Static ES modules, no bundler, no backend, no login, no ads, no tracking. Works on GitHub Pages or any static host.

## Run
```
npm run serve        # http://127.0.0.1:8080/
npm test             # 41 unit tests: models, curriculum drift, UI strings
npm run e2e          # Playwright + Chrome checks; writes data/coverage/qa-passed.json
npm run verify       # curriculum build, tests, e2e, curriculum build again
```
Needs Node 20+, Python 3 with `playwright` and `Pillow` for the e2e run. Add `--shots` to `tests/e2e.py` for screenshots.

## What is built (honest status)
| Theme | Built | Planned |
|---|---|---|
| T02 Shaping of the Earth's Surface | L1 plate map, L2 boundary explorer (3D + SVG), L3 Earth interior | L4 to L6 |
| T04 Early Humans | L1 deep-time clock, L2 evidence vs inference | L3 to L5 |
| T07 Elections | L2 electoral-systems sandbox | L1, L3, L4 |
| T09 The Price Puzzle | L1 to L6 (market, ceiling, scenarios, externality, public goods, information) | none |
| All other themes | syllabus wording, opening question, placeholder | all |

Exact counts: `docs/CURRICULUM_COVERAGE_AUDIT.md`. A learning object counts as QA-passed only when `tests/e2e.py` verified it.

## Layout
`index.html`, `assets/css/app.css`, `src/core` (store, i18n, dom), `src/components/widgets.js`, `src/engines` (chart, three-scene, webgl), `src/modules/<discipline>/` (pure `models.js` + UI), `src/i18n/ui.js`, `data/` (glossary, geodata, coverage, source PDF), `tools/` (curriculum build, geodata build, server), `tests/`, `docs/`, `vendor/three`.

## Accessibility and performance
Keyboard operable, 44 px touch targets, projector mode, reduced motion, low-graphics mode, no-WebGL fallback (`?nowebgl=1`), render-on-demand 3D, lazy module loading, three.js geometry disposal.

## Attributions
three.js (MIT, vendored r170); plate outlines from PB2002 (Bird 2003, ODC-By) via the fraxen/tectonicplates repository; coastlines from Natural Earth (public domain). See `data/geo/SOURCES.md`.

## Policies
`docs/ACCURACY_AND_SOURCE_POLICY.md`. Hindi text is draft until reviewed by a subject teacher.
