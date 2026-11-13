# Test report

Run: 2026-11-12, branch `arena/7ded2df7-eduverse`. Environment: Node `v22.22.3`, `jsdom` DOM harness (Chromium/Playwright binaries not available in the sandbox environment).

## Summary

| Suite | Command | Result |
|---|---|---|
| Architecture & guardrail suite (`tests/architecture.test.mjs` + `tools/verify-architecture.mjs`) | `npm run verify` | **Pass** (`0` cycles, pure `engines/domain/`, lean `79.0 KB` static Home boot across `16` modules, `16/16` isolated themes, `13` preloads, `sw.js` & catalog synced) |
| Engine unit tests (`tests/engines.test.mjs`) | `npm test` | **18 / 18 pass** (terrain, atmosphere, ocean, ecosystem, timeline, tradeRoutes, institutions, election, market, startup, finance, tectonics, history, society) |
| Lab-spec validation (`tests/labs.test.mjs`) | `npm test` | **7 / 7 pass** across all declarative `lab-kit` specs (uniqueness, pedagogy structure, Devanagari Hindi parity, extreme control sweeps, prediction live runs, single-answer exit tickets, scientific spot checks, XR guard, `v.plate` asset & caption checks) |
| Runtime DOM, lazy routing, glossary & HTTP verify (`tests/modules-dom.test.mjs`) | `npm test` | **7 / 7 pass** (boots `src/main.js`, navigates Home <-> `T01`/`T02`/`T04`/`T05`/`T07`/`T09`/`T12` <-> `#/bridge` <-> `#/portfolio`, verifies lazy i18n registration without unresolved `⟦key⟧`, live-relabels `en`/`hi`/`both`, verifies all `T01`–`T16` module mounts/tabs/controls/3D diorama build/fallback, glossary coverage across 91 terms, `sw.js` file existence, and HTTP `200` static serving) |
| Catalogue generator | `npm run catalog` | **78 / 78** learning objects implemented (`0` planned), **79** simulations, **27** prior Chromium QA-verified (`data/coverage/qa-passed.json`) |
| Service worker precache | `npm run sw` | **116** runtime files precached (`sw.js`) |
| Chromium smoke (`tests/lab-smoke.cjs`) | `npm run smoke` | Not executed here (no Chromium/Playwright binary in sandbox) |
| Chromium a11y (`tests/a11y-smoke.cjs`) | `npm run a11y` | Not executed here (no Chromium/Playwright binary in sandbox) |
| Payload & throttled perf (`perf-size.cjs`, `perf-throttle.cjs`) | — | Not executed here (requires Playwright + Chromium) |

_Total automated Node/JSDOM subtests passing: **33 / 33** (`1` architecture + `18` engine + `7` lab + `7` DOM/runtime/HTTP)._

## What is verified vs pending Chromium QA

- **Verified programmatically (Node + `jsdom` + static ESM graph analysis):**
  - Zero static circular imports across all `102` source files under `src/`, pure DOM-free domain engines (`src/engines/domain/`), lean `src/main.js` static boot (`79.0 KB` raw), and strict per-theme spec isolation across `T01`–`T16`.
  - Every engine invariant (mass conservation, ISA 1976 atmosphere, tidal ranges, tsunami speeds, logistic yield & Lotka-Volterra food web, catchment water budget, slope hazard FoS, minimal winning coalitions, Harappan/fort models, unit economics, compound interest & inflation, insurance pools, progressive tax).
  - Every `lab-kit` spec renders cleanly at min/mid/max control values without `NaN`/`undefined`/`Infinity`, every prediction runs on the live model, every exit ticket has 1 valid answer and bilingual feedback, and every English string has Devanagari Hindi parity.
  - All 16 lazy theme modules (`T01`–`T16`) and lazy `#/bridge` & `#/portfolio` routes mount cleanly into DOM, register lazy i18n slices (`T02`, `T04`, `T07`, `T09`, `bridge`), toggle WebGL 2D fallback gracefully, expose `aria-label` on `svg[role=img]` and range inputs, and serve assets over HTTP `200 OK`.
- **Not verified in a live browser engine here:**
  - Real Chromium pixel rendering, WebGL GPU shader rendering, computed CSS 44 px touch-target bounding boxes, zero horizontal scroll overflow at 360 px / 1100 px, CDP network-throttled timing, and live Service Worker offline interception (`npm run smoke`, `npm run a11y`, `perf-size.cjs`, `perf-throttle.cjs`).
  - Subject-teacher review of Hindi translations (`draft-needs-teacher-review`) and domain expert sign-off on illustrative datasets.

## Reproducing

```bash
npm run catalog && npm run sw && npm run verify
# On a machine with Playwright + Chromium installed:
npm install --no-save playwright && npx playwright install chromium
npm run smoke
W=360 MOBILE=1 npm run smoke
npm run a11y
```
