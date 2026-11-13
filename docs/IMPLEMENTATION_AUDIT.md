# Implementation audit

Audit date: 2026-11-12 (updated from 2026-11-11 baseline). Scope: `/home/user/EduVerse` on branch `arena/7ded2df7-eduverse`.

## 1. Current Coverage & Capabilities

All **78 / 78 learning objects** across all **16 / 16 curriculum themes** (`T01`–`T16`) are implemented (`79` interactive simulations, `56` plate illustrations, `17` banner/hero visuals, `91` bilingual glossary terms, `32` competency-based assertion-reason questions, and Class X Board Bridge + Portfolio views).

Authoritative machine-generated manifests:
- `docs/CURRICULUM_COVERAGE.json` (`npm run catalog`): 16 themes, 78 implemented LOs, 0 planned, 27 prior Chromium QA-passed (`data/coverage/qa-passed.json`).
- `docs/SIMULATION_CATALOG.json` (`npm run catalog`): 79 simulation definitions linked to domain engines, lab implementations, and controls.
- `sw.js` (`npm run sw`): precaches all runtime static HTML, CSS, JS modules, geodata, vendored libraries, and images.

## 2. Modular Architecture (Post-Sprout Quartermaster Refactoring)

```
index.html (<link rel="modulepreload"> critical path)
  └── src/main.js (hash router, topbar/HUD, flip-card glossary, Hero 3D globe)
        ├── src/core/{dom,store,i18n,media,sound}.js         (pure UI runtime utilities; zero components/modules imports)
        ├── src/i18n/core.js (101 shell keys)               + lazy src/i18n/modules/{t02,t04,t07,t09,bridge}.js (233 keys; ui.js barrel retained)
        ├── src/engines/domain/*.js (14 pure models)        + index.js (zero DOM/window/upward imports; modules/*/models.js are barrels)
        ├── src/engines/{icons,viz,three-scene,webgl,xr}.js (D3 separated from lightweight Lucide icons facade)
        ├── src/components/
        │     ├── widgets.js, lab-kit.js, three-lab.js      (cycle-free: createThreeLab moved into lab-kit.js; async 3D builders)
        │     ├── nep-bridge.js (lazy on theme routes)
        │     └── diorama/{toolkit,hero-globe,part1,part2,loader}.js (+ sync facade diorama-3d.js)
        └── src/modules/
              ├── registry.js (`MODULES[T01..T16]` + lazy `loadTeacherMeta()`)
              ├── class-x-bridge.js (lazy on #/bridge & #/portfolio)
              └── <discipline>/tXX-specs.js (12 isolated per-theme spec modules + 7 legacy labs-*.js barrels)
```

### Key Structural Improvements Verified
- **Home Static Boot Budget**: Cut initial `#/` closure from `21` modules (`~245 KB` raw incl. D3 & `teacher-meta`) down to **`16` modules (`79.0 KB` raw)** by extracting `src/engines/icons.js`, splitting `src/i18n/core.js`, isolating `HeroGlobe3d` from `part1`/`part2` 3D builders, and deferring `nep-bridge.js`, `class-x-bridge.js`, and `teacher-meta.js`.
- **Zero Static Circular Imports**: Eliminated the `lab-kit.js <-> three-lab.js` import cycle by unifying `createThreeLab` inside `src/components/lab-kit.js`.
- **Strict Pure Domain Layer**: Moved pure mathematical implementations out of `src/modules/{geography,politics,economics}/models.js` into `src/engines/domain/{tectonics,election,market}.js`, preserving downward re-export barrels in `models.js`.
- **Automated Enforcement**: Added `tools/verify-architecture.mjs` (`npm run verify` + `tests/architecture.test.mjs`) and `.sprout/agents/` + `AGENTS.md` + `docs/SPROUT_PLANNER_BLUEPRINT.md`.

## 3. Verification Performed

- `npm run verify`: passes `tools/verify-architecture.mjs` (`0` errors across all 102 `src/` files) and all **33 / 33** Node + JSDOM tests (`architecture`, `engines`, `labs`, `modules-dom`).
- `npm run catalog && npm run sw`: cleanly regenerates `CURRICULUM_COVERAGE.json`, `SIMULATION_CATALOG.json`, and `sw.js`.
- `tools/serve.mjs`: HTTP `200 OK` static serving verified for `/`, ESM chunks, geojson, and images.

## 4. Open Risks & Pending Human/Browser Sign-Offs

- **Chromium / Playwright (`npm run smoke`, `npm run a11y`, `perf-size.cjs`, `perf-throttle.cjs`)**: Chromium binaries are absent in this container sandbox; 51 of 78 LOs have automated Node/JSDOM verification (`33/33` tests pass) and await live Chromium visual/touch-target QA in CI or desktop Playwright (`data/coverage/qa-passed.json` records `27` prior Chromium QA passes).
- **Hindi Review**: All 174 curriculum rows and module dictionaries remain `draft-needs-teacher-review` awaiting Hindi subject-teacher validation.
- **Physical Hardware Checks**: No physical Android GPU frame-rate telemetry or WebXR headset testing has been run in-sandbox.
- **Source Oddities**: Historical PDF wording discrepancies `D1`–`D10` are preserved faithfully per `docs/CURRICULUM_COVERAGE_AUDIT.md`.
