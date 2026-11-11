# Implementation audit
**Starting point:** the EduVerse repository held only a README. The build is greenfield. Patterns were reused from the author's related repos (geovisulab: bilingual dictionary and Earth-interior idea; cbse-economics-simulator: i18n engine and curriculum test approach; Virtualsciencelab).

## Reference images → mechanisms
| Reference | Mechanism built |
|---|---|
| Plate-boundary 3D cutaway | `plate-3d.js` (extruded sections, arrows, labels) fed by the same `profile()` as the 2D SVG |
| Election map game | `politics/models.js` electoral-systems comparison on one fictional vote set |
| Interactive supply/demand graph | `economics/models.js` + `engines/chart.js`, draggable-price market with ghost curves |
| Harappan street | planned (T04.L4 city planner, labelled reconstruction); not built |

## Architecture
Pure, unit-tested models; thin UI modules; shared `predict()` / `mcq()` (answers computed from the model); one i18n layer with three modes where switching re-labels without resetting state; lazy `import()` per theme; hash routing with relative URLs.

## Verification
41 unit tests (models, curriculum-to-PDF trace, UI string completeness in both languages) and 45 browser checks (all 16 routes, language switch preserving state, reset, keyboard tabs, 3D render and orbit, `?nowebgl`, low graphics, mobile 375 px no overflow, reload persistence, no console errors).

## Known gaps and risks
- 12 of 16 themes are placeholders; the Part 1 and Part 2 coverage in the audit shows exactly which syllabus bullets are unmapped to a built lab.
- Hindi is draft everywhere; Hindi plate names exist only for the 8 major plates.
- 3D label overlap is possible at some camera angles (mantle label vs sinking-plate label).
- Boundary-type overlay on the world plate map is not built (no suitable dataset bundled).
- Headless Chrome used software WebGL; real-device GPU behaviour is untested.
- Indo-Australian plate grouping needs teacher review.
- Source oddities D1 to D10 are recorded in `docs/CURRICULUM_COVERAGE_AUDIT.md`.
