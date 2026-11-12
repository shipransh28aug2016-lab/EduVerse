# GitHub repository research

Date: 2026-11-11.

**How this was done, and its limits.** Licence, star count, archive status and last-push date below were read from the GitHub search API on this date. The three.js size (691 KB raw, 168 KB gzip for `three.module.min.js` r170) was measured here. All other technical judgements (dependencies, bundle size, accessibility, mobile behaviour) come from general knowledge of these projects; the repositories were not cloned, built or benchmarked in this work, and sizes marked "approx." are not measured. Where the GitHub API reports `NOASSERTION` as the licence, no licence could be determined automatically and **no code was reused**.

## Decision summary

| Repository | Licence (API) | Last push | Decision | What we do with it |
|---|---|---|---|---|
| mrdoob/three.js | MIT | 2026-11-10 | **Adopt** | Already used; vendored r170, loaded lazily by the 3D tab only |
| pmndrs/react-three-fiber | MIT | 2026-10-21 | **Reject** | Requires React; project is a no-bundler static ES-module app |
| pmndrs/drei | MIT | 2026-10-21 | **Reject** | React-only helpers |
| pmndrs/drei-vanilla | MIT | 2026-02-20 | **Reference only** | Ideas for camera controls and HTML labels; our own scene already covers both |
| vasturiano/globe.gl | MIT | 2026-08-22 | **Reference only** | Globe idea; default textures come from remote URLs, extra dependencies |
| CesiumGS/cesium | Apache-2.0 | 2026-11-11 | **Reject** | Far too heavy; terrain/imagery from online services |
| immersive-web/webxr | NOASSERTION | 2026-11-09 | **Reference only** | The API specification; we call the standard `navigator.xr` detection |
| immersive-web/webxr-samples | MIT | 2026-10-26 | **Reference only** | Session lifecycle patterns; no code copied |
| pmndrs/xr | NOASSERTION | 2026-10-15 | **Reject** | React; licence undetermined |
| aframevr/aframe | MIT | 2026-07-13 | **Reject** | A second rendering engine; duplicates three.js |
| d3/d3 | ISC | 2026-11-03 | **Adapt** (technique) | Scales and equirectangular projection re-implemented in a few lines; vendor a single d3 module only if a lab needs one |
| ManimCommunity/manim | MIT | 2026-11-09 | **Reference only** | Python video renderer; pedagogical pattern of stepwise transformation |
| 3b1b/manim | MIT | 2026-09-09 | **Reference only** | Same |
| recharts/recharts | MIT | 2026-11-10 | **Reject** | React-only; we have an SVG `Chart` class |
| R74nCom/sandboxels | NOASSERTION | 2026-06-03 | **Reference only** | Cellular-automaton sandbox concept; licence undetermined so no code reuse |

Net effect on dependencies: **no new runtime dependency was added**. three.js r170 was already the 3D engine and is now pinned and vendored with its licence file.

## Evaluation against the ten questions

| Repository | 1 Educational experience | 2 Fits architecture (static ES modules, no bundler) | 3 Browser / 4 mobile | 5 Accessibility | 6 Dependencies and size | 8 Maintained | 9 Smaller reuse possible | 10 Likely comprehension gain |
|---|---|---|---|---|---|---|---|---|
| three.js | 3-D plate sections, cutaways, camera views | Yes (ES module) | WebGL; lazy, render-on-demand, low-graphics and no-WebGL fallbacks in place | Canvas is opaque to assistive tech, so every 3D view has an SVG twin and text readout | 168 KB gzip, none else | Yes | Already loaded only when the 3D tab opens | Moderate for spatial topics (plate sections) |
| R3F, drei, pmndrs/xr | Same as three.js | **No** (React) | Adds React runtime (approx. 40 KB gzip+) | — | React + reconciler | Yes | No | None beyond three.js |
| drei-vanilla | Orbit/label helpers | Partly | — | — | Depends on three | Slower | **Yes, as ideas** | Marginal |
| globe.gl | Rotating globe with points/arcs | Needs bundling or CDN | Textures fetched remotely | Canvas only | three-globe, d3 modules (approx. 150–250 KB gzip) | Yes | A projected SVG map covers T02/T13 needs | Low over an SVG map for plates and routes |
| CesiumJS | True-scale terrain | No (large worker/asset tree) | Heavy for low-end Android | Poor | Many MB; online tiles | Yes | No | Not worth the bandwidth |
| WebXR spec and samples | Immersive viewing | Standard API, optional | Needs a device; low Android coverage in classrooms | Needs non-VR alternative | None (browser API) | Yes | **Yes: detection only** | Unproven; must never be required |
| A-Frame | VR scenes by HTML | Separate scene graph | Heavy | Limited | Own three fork | Moderate | No | None beyond three.js |
| d3 | Scales, projections, force layout | Yes (ESM, modular) | SVG, light | SVG can carry roles/labels | Per-module, small | Yes | **Yes** | Indirect |
| manim (both) | Animated explainers | Offline Python tool | Output is video | Needs captions | Python, LaTeX, ffmpeg | Yes | No | Possible for offline videos, not for interactivity |
| recharts | Charts | No (React) | — | — | React | Yes | No | None beyond our `Chart` |
| sandboxels | Particle sandbox | Own app | Heavy loops | Limited | Not a library; licence unknown | Slower | Concept only | Not curriculum-aligned |

Question 7 (licence) is in the summary table. MIT, ISC and Apache-2.0 allow reuse with attribution; the three.js licence file is shipped at `vendor/three/LICENSE`. Nothing from the NOASSERTION repositories was copied.

## Per-repository notes

### three.js — Adopt
- Pinned: r170, `vendor/three/three.module.min.js`, imported dynamically in `src/engines/three-scene.js` only when a 3D tab opens. Measured: the T02 page costs 100 KB gzip without 3D and 267 KB gzip once the 3D tab is opened.
- Themes: T02 boundary explorer (existing). Candidates: T10.L1 ocean-floor relief, T04.L4 Harappan city, T12.L2 fort cutaway (all unbuilt).
- Upgrade rule: change the version only together with a re-run of `tests/lab-smoke.cjs` and a check of `three-scene.js` disposal code.

### react-three-fiber, drei, pmndrs/xr — Reject
Adopting them would mean adding React and a bundler, which the brief forbids ("do not replace the existing framework unnecessarily").

### drei-vanilla — Reference only
Useful ideas: damped orbit controls, billboarded HTML labels. The existing `plate-3d.js` already projects labels onto the canvas; nothing needed.

### globe.gl — Reference only
A globe would help T02 (plate motion on a sphere) and T13 (routes), but both are served by the equirectangular SVG map (`data/geo/*.json`, 43 KB) that already works offline. If a globe is added later it should be a ~100-line orthographic view on the existing three.js scene using the same GeoJSON, not a new dependency.

### CesiumJS — Reject
Real terrain is attractive for T02 landforms, but the data comes from online services and the library is far outside a low-bandwidth budget.

### WebXR (spec, samples) — Reference only; detection implemented
`src/engines/xr.js` reports `{vr, ar}` support using `navigator.xr.isSessionSupported`, never throws, and returns unsupported when the API is absent. Tested with mocks (`tests/labs.test.mjs`). **No immersive session is started anywhere**: that cannot be verified without a headset, so shipping it would be untested code. When a lab offers "Enter VR", it must be gated on this function and the non-VR view must remain complete.

### A-Frame — Reject
It bundles its own copy of three.js and a separate entity system; adding it next to our scene would duplicate the rendering engine.

### d3 — Adapt (technique only)
Used as a reference for equirectangular projection (`tradeRoutes.project`) and linear/log scales (`timeline.js`), both a few lines. If a lab later needs orthographic projection, force layout or Voronoi, vendor only `d3-geo` / `d3-force` (ISC), pinned.

### manim (Community and 3b1b) — Reference only
The teaching pattern worth keeping is "build up an explanation in steps with the changing quantity highlighted". The labs do this interactively (predict → change a control → live readout). Manim could produce offline explainer videos for low-connectivity classrooms; that is a content project, not an integration.

### recharts — Reject
React-only. The existing `Chart` class draws labelled SVG axes with units and is reused by every graph lab.

### sandboxels — Reference only
It suggests "falling-sand" materials sandboxes. Our topics need explained, quantitative models (conservation, equilibrium), so the terrain engine uses a conserved-mass profile model instead. The licence could not be determined; no code or assets were used.

## What was built instead of importing libraries

| Need | Implementation | Size |
|---|---|---|
| Declarative interactive lab with the full pedagogy | `src/components/lab-kit.js` | 9 KB raw |
| 12 domain engines | `src/engines/domain/*.js` | 24 KB raw total |
| Map/route drawing | inline SVG + existing simplified land data | 0 new bytes of data |
| XR capability gate | `src/engines/xr.js` | < 1 KB |

## Licence and attribution obligations

- three.js: MIT; copyright notice shipped in `vendor/three/LICENSE`.
- Natural Earth coastlines (public domain) and PB2002 plate outlines (Bird 2003, ODC-By) were already credited in `README.md` and `data/geo/SOURCES.md`.
- Atmosphere values follow the published US Standard Atmosphere 1976; tidal and tsunami formulas are standard physics.

## Update 2026-11-12: libraries installed for the premium 2D/3D layer and Class X

Installed from npm and vendored by `npm run vendor` (`tools/build-vendor.mjs`, esbuild). Nothing loads from a CDN; the app still runs offline. Sizes are the built files measured in this repository (raw, minified).

| Repository | Licence | What is used | Vendored as | Size |
|---|---|---|---|---|
| mrdoob/three.js (`three@0.170.0` addons) | MIT | `OrbitControls`, `EffectComposer` + `UnrealBloomPass` + `OutputPass`, `RoomEnvironment` (PBR reflections), `CSS2DRenderer` (HTML labels), `RoundedBoxGeometry` | `vendor/three/three-fx.esm.js` (core stays external) | 43 KB |
| d3/d3-hierarchy | ISC | tidy tree layouts for classification explorers | `vendor/d3/d3-plus.esm.js` | 38 KB (whole bundle) |
| d3/d3-sankey | BSD-3-Clause | production-chain flow diagram | same bundle | |
| d3/d3-interpolate, d3/d3-ease | ISC, BSD-3-Clause | bundled for transitions | same bundle | |
| lucide-icons/lucide | ISC | 38 extra icons | `vendor/lucide/lucide-x.esm.js` | 9 KB |
| rsms/inter (`@fontsource-variable/inter`) | SIL OFL 1.1 | UI text | `assets/fonts/inter.woff2` | 48 KB |
| undercasetype/Fraunces (`@fontsource-variable/fraunces`) | SIL OFL 1.1 | display headings | `assets/fonts/fraunces.woff2` | 67 KB |
| notofonts/devanagari (`@fontsource-variable/noto-sans-devanagari`) | SIL OFL 1.1 | Hindi text | `assets/fonts/noto-devanagari.woff2` | 121 KB |

Earlier decisions that still stand: React-based libraries (react-three-fiber, drei, recharts) and second engines (A-Frame, CesiumJS) remain rejected because the app is a static ES-module site. `globe.gl` was not adopted: the globe is built here on three.js with d3-geo painting Natural Earth outlines onto a canvas texture, so no remote textures are fetched.

This reverses one earlier line in this document ("no new runtime dependency was added"): the bloom, environment and label addons and the two d3 modules are new runtime code, loaded lazily only when a 3D stage or a Class X page opens.
