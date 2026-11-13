# AGENTS.md — EduVerse Engineering & Agent Guide

EduVerse is a zero-build static ES-module web application (`CBSE Class IX Social Science` interactive bilingual visualiser, `en` / `hi` / `both`) serving 16 curriculum themes (`T01`–`T16`), 78 learning objects, and 79 interactive simulations with 3D WebGL/Cardboard/WebXR dioramas and progressive 2D SVG fallbacks.

## 1. Architecture & Layer Boundaries

Enforced automatically by `node tools/verify-architecture.mjs` (`tests/architecture.test.mjs`):

```
index.html (modulepreload hints)
  └─▶ src/main.js (hash router, topbar/HUD, Hero 3D globe; <80 KB raw static boot closure)
        ├─▶ src/core/{dom,store,i18n,media,sound}.js         [NO imports from components/ or modules/]
        ├─▶ src/i18n/core.js                                [101 shell keys]
        ├─▶ src/engines/icons.js                            [Lucide icon facade; keeps D3 off Home boot]
        ├─▶ src/components/diorama/hero-globe.js + toolkit.js
        └─▶ Lazy routes:
              ├─▶ #/theme/T01..T16 ─▶ src/modules/registry.js (`MODULES[T##]`, `loadTeacherMeta`)
              │     ├─▶ src/components/{lab-kit,three-lab,nep-bridge}.js
              │     ├─▶ src/components/diorama/{loader,part1,part2}.js (dynamic import on 3D tab)
              │     ├─▶ src/i18n/modules/{t02,t04,t07,t09}.js (registered on demand)
              │     └─▶ src/modules/<disc>/tXX-specs.js (one theme's specs per chunk; zero cross-theme imports)
              └─▶ #/bridge, #/portfolio ─▶ src/modules/class-x-bridge.js + src/i18n/modules/bridge.js
```

### Non-Negotiable Guardrails
1. **Zero Circular Imports**: No static ES import cycles anywhere in `src/`. (`lab-kit.js` owns `createLab` + `createThreeLab`; `three-lab.js` never imports `lab-kit.js`.)
2. **Pure Domain Engines (`src/engines/domain/*.js`)**: All 14 domain math modules + `index.js` must remain 100% deterministic, DOM-free, and side-effect free. Never reference `document`, `window`, `localStorage`, `fetch`, `core/`, `components/`, `i18n/`, or `modules/`. Keep `src/modules/*/models.js` as downward re-exports only.
3. **Core Layer Purity (`src/core/*.js`)**: Never import from `src/components/` or `src/modules/`.
4. **Lean Home Boot Closure**: `src/main.js` must NOT statically import `i18n/ui.js`, `components/diorama-3d.js`, `diorama/{part1,part2}.js`, `data/nep-cbq.js`, `modules/class-x-bridge.js`, `modules/teacher-meta.js`, `engines/viz.js`, `vendor/d3/d3-viz.esm.js`, or `vendor/three/three.module.min.js`.
5. **Per-Theme Lazy Isolation**: Each `MODULES[T##]` entry must load only its own `tXX-specs.js` / bespoke files and never pull multi-theme `labs-*.js` barrels or another theme's specs.

## 2. Pedagogical & Bilingual Contracts

- Every user-facing string in UI dictionaries and lab specs must have `{ en, hi }` with non-empty Devanagari (`[\u0900-\u097f]`) Hindi text (marked `draft-needs-teacher-review` unless signed off by a subject teacher).
- Every `lab-kit` spec defines `id`, `lo`, `title`, `objective`, `controls`, `view()`, `tryThis`, `predict`, `exit`, and `provenance` (`fictional` | `schematic` | `documented` | `reconstruction`).
- Never emit `NaN`, `undefined`, or `Infinity` across min/mid/max extremes of any control.
- Every `v.plate` figure references a valid file in `assets/images/plates/` with bilingual caption and `spots` coordinates.
- Every interactive WebGL diorama (`T01`–`T16`) must tolerate missing WebGL (`?nowebgl=1` or `lowGraphics`) with zero unhandled errors and fall back cleanly to 2D SVG/plate stages.

## 3. Verification Commands

```bash
npm run catalog   # Regenerate docs/CURRICULUM_COVERAGE.json & docs/SIMULATION_CATALOG.json
npm run sw        # Regenerate sw.js PRECACHE manifest & version hash
npm run verify    # Architecture guardrails (tools/verify-architecture.mjs) + 33 Node/JSDOM tests
npm test          # 33 unit, spec, architecture, DOM/module, glossary & HTTP tests
npm run serve     # Launch local static server at http://0.0.0.0:4173
```

Always run `npm run catalog && npm run sw && npm run verify` before committing changes. Keep `sw.js`, `docs/CURRICULUM_COVERAGE.json`, and `docs/SIMULATION_CATALOG.json` synchronized with `src/`.

## 4. Sprout Specialist Subagent Tree

Native subagent specifications aligned with Sprout's Quartermaster Planner Mode reside in `.sprout/agents/` (`root`, `project-explorer`, `architect`, `tech-lead`, `engineer`, `spec-reviewer`, `quality-reviewer`, `verifier`). See `docs/SPROUT_PLANNER_BLUEPRINT.md` for the complete capability map and task pipeline.
