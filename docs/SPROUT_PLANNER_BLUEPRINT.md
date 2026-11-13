# Sprout Quartermaster Planner Blueprint — EduVerse Systemic Refactoring

This blueprint applies **Sprout Quartermaster Planner Mode** (`qm-indexer` → `qm-planner` → `architect` → `tech-lead` → `engineer` → `spec-reviewer` → `quality-reviewer` → `verifier`) to modularize, accelerate, and safeguard `/home/user/EduVerse` while preserving 100% of its zero-build static ES-module simplicity, bilingual pedagogy (`en`/`hi`/`both`), and 78-LO curriculum coverage.

---

## 1. Capability Map (`qm-indexer`)

| Layer / Domain | Files | Baseline State (Before) | Bottleneck / Coupling Identified |
|---|---|---|---|
| **App Shell & Routing** | `index.html`, `src/main.js` | `17.1 KB` shell, 0 `<link rel="modulepreload">`; eager static imports of `ui.js`, `teacher-meta.js` (+ `economics/content.js`, `geography/content.js`), `viz.js` (+ `101.3 KB` D3 bundle), `nep-bridge.js`, `class-x-bridge.js`, `diorama-3d.js` | Home (`#/`) statically pulled **21 modules** including D3 (`101.3 KB`), full 334-key UI dictionary (`43 KB`), NEP/CBQ & Class X bridge, `teacher-meta.js` (`43.4 KB`), and all 12 3D builders (`~36 KB`) |
| **i18n System** | `src/core/i18n.js`, `src/i18n/ui.js` | Monolithic `334`-key `src/i18n/ui.js` (`43.3 KB`) loaded upfront on `#/` | Home only renders `101` shell keys; `233` keys belong to lazy `T02`, `T04`, `T07`, `T09`, and `#/bridge`/`#/portfolio` routes |
| **Per-Theme Lab Specs** | `src/modules/{geography,history,politics,economics}/labs-*.js` | 7 multi-theme barrels aggregating `56` specs across `12` themes (`T03..T08`, `T10..T13`, `T15..T16`) | Opening one theme (`T03`) parsed specs for unrelated themes (`T10`, `T11`) and bloated theme chunk sizes (`t05` `85 KB` lumped with `t04` & `t12`) |
| **3D Diorama Engine** | `src/components/diorama-3d.js`, `three-lab.js`, `lab-kit.js` | Single `601`-line `diorama-3d.js` containing Hero Globe + all 12 theme builders + shared helpers; circular static import `lab-kit.js <-> three-lab.js` | Opening Home parsed all 12 theme 3D scene builders; circular `lab-kit <-> three-lab` coupling hindered strict DAG verification |
| **Pure Domain Engines** | `src/engines/domain/*.js` (14 files + `index.js`) | Mostly pure math, except `tectonics.js`, `election.js`, `market.js` imported upward from `src/modules/*/models.js` | Upward `engines/domain -> modules` arrows violated clean layer direction |
| **Verification & Docs** | `tools/verify-architecture.mjs` (absent), `tests/*.test.mjs`, `docs/*.md` | `32` Node/JSDOM tests passed (`npm test`); `IMPLEMENTATION_AUDIT.md`, `CURRICULUM_COVERAGE_AUDIT.md`, `SIMULATION_CATALOG.md`, `TEST_REPORT.md` stale (claimed `20`–`27` LOs vs actual `78/78` LOs / `79` sims) | Zero automated enforcement of cycle freedom, layer purity, lazy isolation, or `sw.js`/catalog freshness |

---

## 2. Specialist Agent Tree (`.sprout/agents/`)

```
root (.sprout/agents/root.md)
 ├── project-explorer   — read-only mapper of curriculum, import graph, and baselines
 ├── architect          — defines layer DAG, split boundaries, static boot budget (<110 KB)
 ├── tech-lead          — decomposes into sequential tasks + enforces review gates
 │    ├── engineer          — implements focused ESM module splits, async loaders, tooling
 │    ├── spec-reviewer     — verifies 78/78 LOs, Devanagari Hindi parity, NaN/Infinity freedom
 │    └── quality-reviewer  — audits cycle freedom, layer purity, stale-route guards, cleanup
 └── verifier           — executes catalog, sw, verify-architecture, 33 tests, HTTP checks
```

---

## 3. Modular Execution Plan (`qm-planner`) & Outcomes

| Task | Scope & Target Artifacts | Architectural Outcome | Verification Signal |
|---|---|---|---|
| **Task 1: Modular i18n Dictionaries** | Split `src/i18n/ui.js` (`334` keys) into `src/i18n/core.js` (`101` shell keys) + `src/i18n/modules/{t02,t04,t07,t09,bridge}.js` (`233` lazy keys); retain `ui.js` compatibility barrel | Home loads `14 KB` `core.js` (`101` keys) instead of `43.3 KB` `ui.js` (`334` keys); lazy modules self-register keys on import | `334/334` key parity verified; `npm test` `32/32` pass |
| **Task 2: Per-Theme Lab Spec Isolation** | Split 7 `labs-*.js` barrels into 12 theme-scoped `t{03,04,05,06,07,08,10,11,12,13,15,16}-specs.js` modules; update 12 theme entrypoints, `tools/build-catalog.mjs`, `tests/labs.test.mjs`; keep 7 `labs-*.js` re-export barrels | Every `MODULES[T##]` dynamic import loads strictly its own theme's lab specs with zero cross-theme static coupling | `56/56` spec behavior verified; `npm run catalog` (`78/78` LOs, `79` sims); `npm test` `32/32` pass |
| **Task 3: Lazy 3D Diorama Split, Cycle Elimination & Layer Inversion** | Split `diorama-3d.js` into `diorama/{toolkit,hero-globe,part1,part2,loader}.js` (+ sync facade `diorama-3d.js`); async builders in `three-lab.js`; lazy `loadTheme3d` in `lab-kit.js` & `price-puzzle.js`; lazy `nep-bridge.js`, `class-x-bridge.js`, `teacher-meta.js`; split `engines/icons.js` from `viz.js` (D3); move `createThreeLab` into `lab-kit.js` to break `lab-kit <-> three-lab` cycle; move pure math into `engines/domain/{tectonics,election,market}.js` (`modules/*/models.js` become downward barrels) | **Zero static circular imports**; **zero upward domain imports**; Home static closure shrunk from **21 modules (~245 KB raw)** to **16 modules (`79.0 KB` raw)** — removing `d3-viz` (`101.3 KB`), `teacher-meta` (`43.4 KB`), `ui.js`, `nep-cbq.js`, `class-x-bridge.js`, and 12 theme 3D builders from `#/` initial boot | `node --check` clean; lazy routes `T02`, `T04`, `T07`, `T09`, `#/bridge`, `#/portfolio` verified in `modules-dom.test.mjs` |
| **Task 4: Module Preloads & Automated Guardrails** | Add 13 `<link rel="modulepreload">` tags to `index.html`; create `tools/verify-architecture.mjs` + `tests/architecture.test.mjs` + `npm run verify` script | Automated CI gate checks 102 `src/` files for cycles, domain/core purity, Home static boot budget (`< 110 KB`), 16-theme isolation, `index.html` preloads, `sw.js` `PRECACHE` freshness, and `CURRICULUM_COVERAGE.json` parity | `node tools/verify-architecture.mjs` passes with `errors: []`, `bootStaticKB: 79`, `themesVerified: 16` |
| **Task 5: Developer Docs & Audit Sync** | Author `AGENTS.md`, `.sprout/agents/*.md`, `docs/SPROUT_PLANNER_BLUEPRINT.md`; synchronize `IMPLEMENTATION_AUDIT.md`, `CURRICULUM_COVERAGE_AUDIT.md`, `SIMULATION_CATALOG.md`, `TEST_REPORT.md` | Documentation accurately reflects `78/78` implemented LOs, `79` simulations, modular boundaries, and Sprout agent workflow | All counts reconciled against `curriculum.json` and generated JSON catalogs |
| **Task 6: Full Manifest Regeneration & Live HTTP Gate** | Execute `npm run catalog && npm run sw && npm run verify`, plus live HTTP serving verification via `tools/serve.mjs` | `sw.js` precaches all `116` runtime files; zero 404s across ESM modules, lazy chunks, and image/geodata assets | `npm run verify` exits `0` (`33/33` tests pass); live HTTP routes return `200 OK` |

---

## 4. Known Environment Boundaries

- **Chromium / Playwright (`npm run smoke`, `npm run a11y`, `perf-size.cjs`, `perf-throttle.cjs`)**: Browser binaries are absent in this container sandbox; headless JSDOM (`tests/modules-dom.test.mjs`), live HTTP serving (`tools/serve.mjs`), and real Vendored Three.js scene-graph construction cover DOM, routing, WebGL fallback, i18n, and HTTP verification locally, while live Chromium pixel/layout runs are documented for CI/desktop environments.
- **Sprout CLI Runtime**: `.sprout/agents/*.md` uses Sprout's native YAML frontmatter + markdown agent specification so any future Bun + LLM API environment can execute the agent tree directly alongside `AGENTS.md`.
