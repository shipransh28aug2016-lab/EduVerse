# Test report

Run: 2026-11-12, branch `arena/f1b4ae79-eduverse`. Environment: Node `v22.22.3`, `jsdom` DOM harness (Chromium/Playwright binaries not available in the sandbox environment).

## Summary

| Suite | Command | Result |
|---|---|---|
| Engine unit tests (`tests/engines.test.mjs`) | `npm test` | 18 / 18 pass (terrain, atmosphere, ocean, ecosystem, timeline, tradeRoutes, institutions, election, market, startup, finance, tectonics, history, society) |
| Lab-spec validation (`tests/labs.test.mjs`) | `npm test` | 7 / 7 pass across all 67 `lab-kit` specs (uniqueness, pedagogy structure, Devanagari Hindi parity, extreme control sweeps, prediction live runs, single-answer exit tickets, scientific spot checks, XR guard, `v.plate` asset & caption checks) |
| Runtime DOM, glossary & HTTP verify (`tests/modules-dom.test.mjs`) | `npm test` | 5 / 5 pass (boots `src/main.js`, live-relabels LO chips, concepts/outcomes & `dd[data-term-def]` glossary definitions across `en`/`hi`/`both`, checks Home + all 16 modules `T01`–`T16` mounting/tabs/controls/relabel/SVG `aria-label`s, `.lab-plate` 2D lab figures across all 16 themes `T01`–`T16`, verifies >=2 bilingual glossary entries per theme across 88 terms in `data/glossary.json`, verifies all 87 `sw.js` files exist, verifies HTTP 200 static serving across all `t01..16.jpg` & 26 `assets/images/plates/*.jpg`) |
| Catalogue generator | `npm run catalog` | 78 learning objects, 78 implemented, 0 planned, 79 simulations (27 prior Chromium QA-verified in `data/coverage/qa-passed.json`) |
| Service worker precache | `npm run sw` | 87 files precached |
| Chromium smoke (`tests/lab-smoke.cjs`) | `npm run smoke` | Not executed here (no Chromium/Playwright binary in sandbox) |
| Chromium a11y (`tests/a11y-smoke.cjs`) | `npm run a11y` | Not executed here (no Chromium/Playwright binary in sandbox) |
| Payload & throttled perf (`perf-size.cjs`, `perf-throttle.cjs`) | — | Not executed here (requires Playwright + Chromium) |

## What is verified vs pending Chromium QA

- **Verified programmatically (Node + `jsdom`):**
  - Every engine invariant (mass conservation, ISA 1976 atmosphere, tidal ranges, tsunami speeds, logistic yield & Lotka-Volterra food web, catchment water budget, slope hazard FoS, minimal winning coalitions, Harappan/fort models, unit economics, compound interest & inflation, insurance pools, progressive tax).
  - Every one of the 67 `lab-kit` specs renders cleanly at min/mid/max control values, every prediction runs on the live model, every exit ticket has 1 valid answer and bilingual feedback, and all English strings have Devanagari Hindi counterparts.
  - All 16 lazy theme modules (`T01`–`T16`) mount cleanly into DOM, switch tabs, respond to sliders/chips/checkboxes/options, toggle WebGL 2D fallback gracefully, expose `aria-label` on `svg[role=img]` and range inputs, switch across `en`/`hi`/`both`, and pass HTTP 200 static asset verification.
- **Not verified in a live browser engine here:**
  - Real Chromium pixel rendering, WebGL GPU shader rendering, computed CSS 44 px touch-target bounding boxes, zero horizontal scroll overflow at 360 px / 1100 px, CDP network-throttled timing, and live Service Worker offline interception (`npm run smoke`, `npm run a11y`, `perf-size.cjs`, `perf-throttle.cjs`).
  - Subject-teacher review of Hindi translations (`draft-needs-teacher-review`) and domain expert sign-off on illustrative datasets.

## Reproducing

```bash
npm test
npm run catalog && npm run sw
# On a machine with Playwright + Chromium installed:
npm install --no-save playwright && npx playwright install chromium
npm run smoke
W=360 MOBILE=1 npm run smoke
npm run a11y
```
