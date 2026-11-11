# Test report

Run: 2026-11-11, branch `claude/intelligent-curie-pg8zrc`. Environment: Node 22, Chromium via Playwright (software WebGL), local static server.

## Summary

| Suite | Command | Result |
|---|---|---|
| Engine unit tests | `node --test tests/engines.test.mjs` | 16 / 16 pass |
| Lab-spec tests | `node --test tests/labs.test.mjs` | 7 / 7 pass |
| Browser smoke, desktop 1100 px | `node tests/lab-smoke.cjs T01 … T16` | 16 themes pass, 0 console errors, 0 failed requests |
| Browser smoke, phone 360 px touch | `W=360 MOBILE=1 node tests/lab-smoke.cjs T01 … T16` | 16 themes pass, 0 horizontal overflow |
| Accessibility smoke | `node tests/a11y-smoke.cjs T02 … T16` | 11 lab themes pass |
| Payload | `node tests/perf-size.cjs` | see `PERFORMANCE_AUDIT.md` |
| Throttled and offline | `node tests/perf-throttle.cjs` | offline home and lab load and respond |
| Catalogue | `node tools/build-catalog.mjs` | 78 learning objects, 27 implemented, 28 simulations |

## What the tests check

**Engines (16).** Mass conservation of the terrain model for every agent and rock type; more rain/softer rock/less vegetation erode faster; ISA reference temperature and pressure (15 °C, 1013.25 hPa at 0 km; −56.5 °C, 226.3 hPa at 11 km); sea breeze by day and land breeze at night; tidal range from the analytic formula equals the range of the simulated series; spring (2.92 m) larger than neap (1.08 m); tsunami speed at 4,000 m ≈ 713 km/h; sustainable yield = rK/4 and collapse above it; predator–prey oscillation; haversine against a known distance and route activity by year; only a parliamentary executive falls on a lost confidence vote; coalitions are minimal and winning; opportunity cost rises along the PPF; break-even arithmetic; simple/compound interest, rule of 72, inflation; existing tectonic and election models still correct.

**Lab specs (7).** Every lab has an objective, a provenance note, controls, guided discovery, a prediction, an exit ticket and a reflection; every English string anywhere in a spec has a Hindi counterpart in Devanagari; every control at minimum, middle and maximum (and every chip option and toggle state) renders without `NaN`, `undefined` or `Infinity` in either the graphic or the explanation, and every explanation line has Hindi; every prediction's `run()` returns one of its listed options; every exit ticket has exactly one correct option and explained wrong options; XR detection never throws.

**Browser smoke.** For each of the 16 theme routes: opens it cold, clicks every tab, moves every slider to minimum, maximum and middle, clicks every chip, toggle, prediction and exit option, cycles English / Hindi / English+Hindi, then fails on any console error, HTTP error, unresolved `⟦key⟧`, `NaN`, `undefined`, `Infinity` or horizontal overflow. Totals per viewport: 214 control changes and 183 option clicks.

**Accessibility smoke (390 px, touch).** The first slider changes with the arrow keys; tabs move with the arrow keys; every graphic `svg[role=img]` has a non-empty `aria-label`; every slider is labelled; each lab has an `aria-live` readout; all chips, options and buttons are at least 44 px tall.

## Defects found and fixed during this work

1. `main.js` rendered the text `null` under every theme page lacking teacher notes or limits (found by looking at screenshots).
2. T10 tides: the moon-phase chip group had a numeric initial value but string option ids, so nothing was selected on load (found by the lab-spec test).
3. Four source files had never been uploaded; seven imports failed (see `IMPLEMENTATION_AUDIT.md`).
4. Initial parenthesis error in the institutions lab, an overflowing diagram in "English + हिन्दी" mode and an overlapping label, found by the syntax check and by viewing the rendered diagram; fixed.

## Not tested

- **Hindi correctness.** Tests prove Hindi is present and renders, not that it is accurate or idiomatic. A subject teacher has not reviewed any of it.
- **Scientific and historical content review.** Numbers are checked against the formulas in the code (and ISA, tidal, tsunami values against known references), not against an independent expert read-through. Trade-route dates and places in `tradeRoutes.js` need checking against the prescribed textbook.
- **Real devices.** No physical Android phone; no GPU frame-rate; no screen-reader session (NVDA, TalkBack); no colour-contrast audit tool run; no WebXR headset.
- **Pre-existing modules.** T02 L1–L3, T04, T07 L2, T09 were exercised by the smoke tests (no errors, all controls driven) but their own correctness tests (described in the earlier README as 41 unit tests and 45 browser checks) are not in the repository.
- **Learning outcomes.** Nothing here shows that students learn more. See the pilot protocol in `INTEGRATION_ARCHITECTURE.md` §9.

## Reproducing

```bash
npm install --no-save playwright   # only for the browser suites
node --test tests/*.test.mjs
node tests/lab-smoke.cjs T01 T02 T03 T04 T05 T06 T07 T08 T09 T10 T11 T12 T13 T14 T15 T16
W=360 MOBILE=1 node tests/lab-smoke.cjs T01 T02 T03 T04 T05 T06 T07 T08 T09 T10 T11 T12 T13 T14 T15 T16
node tests/a11y-smoke.cjs T02 T03 T06 T07 T08 T09 T10 T11 T13 T15 T16
node tools/build-catalog.mjs && node tools/build-sw.mjs
```
