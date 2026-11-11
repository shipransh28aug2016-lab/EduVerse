# Accuracy and source policy
1. **The CBSE syllabus PDF is binding.** `tools/curriculum-source.mjs` carries the wording; `tools/build-curriculum.mjs` word-matches every bullet to the PDF text and the hours sequence, and fails the build on drift. Ten source oddities are logged as D1–D10 in the generated audit.
2. **No invented marks distribution.** PDF p.14 says the course structure is "to be provided shortly"; nothing about marks or blueprints is encoded.
3. **Models are labelled.** Every lab shows its limits. T02: distances are exact arithmetic (1 cm/yr = 10 km per million years); heights, onset times and earthquake cycles are schematic and not forecasts. T09: all prices, quantities and costs are fictional.
4. **Answers are computed, never hard-coded.** `predict()` runs the experiment on the live model and grades against its result; feedback text pulls numbers from the model.
5. **Real data only from cited sources** (`data/geo/SOURCES.md`). Elections and finance use fictional data.
6. **Hindi is draft** until a subject teacher signs off (`hiStatus: draft-needs-teacher-review`).
7. **Status honesty.** A learning object is `implemented` only if built; it is counted as QA-passed only when `tests/e2e.py` lists it in `data/coverage/qa-passed.json`.
8. **No login, ads, tracking or gamification.** Student text stays in `localStorage`.
