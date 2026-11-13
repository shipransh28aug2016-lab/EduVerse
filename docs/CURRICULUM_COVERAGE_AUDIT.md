# CURRICULUM_COVERAGE_AUDIT

_Synchronized from `src/curriculum/curriculum.json`, `docs/CURRICULUM_COVERAGE.json`, and `data/coverage/coverage.json` (`npm run catalog`)._

Source: CBSE Class IX Social Science (Subject Code 087) 2026-27 (14 pp.). Note-Course Structure will be provided shortly (p.14). No marks distribution or exam blueprint is encoded in this project.

## Result

| Check | Result |
|---|---|
| Themes | 16 (Part 1: 9, Part 2: 7) |
| Hours | Part 1 = 70, Part 2 = 55, total = 125 (matches PDF sequence) |
| Learning objects (`curriculum.json`) | **78 / 78 implemented** (`0` planned) across **16 / 16** themes (**79** simulations) |
| Prescribed bullets (`coverage.json`) | 174 (77 concepts, 97 outcomes) |
| Unmapped bullets | **0** |
| Wording trace-check vs PDF | passed (in-order word match per page) |
| Marks distribution / blueprint | **not encoded** (PDF p.14: "Course Structure will be provided shortly") |
| Implemented learning objects mapped | **174/174** bullets implemented, 0 partial, 0 planned |
| Hindi | **174/174** draft rows (subject-teacher review pending), 0 pending |
| Prior Chromium QA passed | **27/78** LOs (49/174 bullets in `data/coverage/qa-passed.json`); all 78 LOs / 79 simulations verified via Node + JSDOM |

"Mapped" means a learning object is *designated* for the bullet. Prior Chromium QA records live Playwright pass status in `data/coverage/qa-passed.json`; Node + JSDOM runtime and static architecture guardrails cover all 16 themes.

## Per theme

| ID | Theme | h | LOs (Impl) | Chromium QA LOs | Bullets | Impl Bullets | Partial | Planned |
|---|---|---|---|---|---|---|---|---|
| T01 | Understanding Social Science | 4 | 3/3 | 0/3 | 5 | 5 | 0 | 0 |
| T02 | Shaping of the Earth's Surface | 8 | 6/6 | 4/6 | 10 | 10 | 0 | 0 |
| T03 | Atmosphere and Climate | 7 | 6/6 | 2/6 | 11 | 11 | 0 | 0 |
| T04 | Early Humans and Beginning of Civilisation | 9 | 5/5 | 2/5 | 15 | 15 | 0 | 0 |
| T05 | State and Society (upto 1000 CE) | 9 | 5/5 | 0/5 | 8 | 8 | 0 | 0 |
| T06 | Democracy | 9 | 4/4 | 1/4 | 8 | 8 | 0 | 0 |
| T07 | Elections | 9 | 4/4 | 2/4 | 19 | 19 | 0 | 0 |
| T08 | Building Blocks in Economics | 7 | 5/5 | 1/5 | 10 | 10 | 0 | 0 |
| T09 | The Price Puzzle: What Drives the Market | 8 | 6/6 | 6/6 | 10 | 10 | 0 | 0 |
| T10 | Oceans and Life | 7 | 5/5 | 2/5 | 11 | 11 | 0 | 0 |
| T11 | Life on Earth | 7 | 5/5 | 1/5 | 10 | 10 | 0 | 0 |
| T12 | Resistance and Resilience (1000 CE – 1700 CE) | 9 | 5/5 | 0/5 | 9 | 9 | 0 | 0 |
| T13 | India and the World-I (1900 BCE-1200 CE) | 8 | 4/4 | 1/4 | 7 | 7 | 0 | 0 |
| T14 | Authority | 10 | 5/5 | 0/5 | 11 | 11 | 0 | 0 |
| T15 | From Ideas to Startups | 8 | 5/5 | 2/5 | 16 | 16 | 0 | 0 |
| T16 | Smart Ways to Manage Your Finances | 6 | 5/5 | 3/5 | 14 | 14 | 0 | 0 |

## Source discrepancies (PDF wording preserved)

- **D1** (p.14): Internal-assessment table is headed "CLASS IX (2025-26)" inside the 2026-27 document. Treated as a labelling slip; the table is reproduced as teacher tools only.
- **D2** (p.8): Part 2 themes restart numbering at 1-7 in the PDF. Project uses a stable global serial 1-16 plus the PDF-local number (partNo).
- **D3** (p.10): Theme "Elections": PDF concept bullets do not list Representation of the People Acts, coalition government or Anti-Defection Law, but outcome bullets do. These three are kept as outcomes; spec-only concept rows are flagged source:"spec".
- **D4** (p.4): Competency C2.2 is cited by the "Early Humans" theme (p.9) but is not defined in the competency list on pp.4-6. Code kept; definition marked missing.
- **D5** (p.13): Theme "India and the World-I": "Medicine" appears twice in "Medicine, Mathematics and Astronomy, Medicine, Religion". Preserved verbatim pending teacher review.
- **D6** (p.8): Source typo "duststroms" (dust storms). Source wording kept in `text`; display text corrected in `display`.
- **D7** (p.9): Theme "Atmosphere and Climate": "Carbon footprint" has no bullet marker in the PDF (runs on after "Floods"). Treated as its own concept.
- **D8** (p.14): Theme "Smart Ways to Manage Your Finances" cites "CG8" (a curricular goal) where other themes cite competency codes (Cx.y).
- **D10** (p.4): Competencies C1.1-C1.4 are labelled "CG-1.1"-"CG-1.4" in the PDF (curricular-goal prefix used for competencies). Project normalises to C1.1-C1.4 and keeps CG-1..CG-9 for the goals on p.3.
- **D9** (p.13): Theme "From Ideas to Startups": outcome "Identify the key components of a balance." is incomplete in the source (balance sheet presumably). Source wording preserved; teacher to confirm.

Competency codes cited but not defined in PDF pp.4-6: C2.2.

## Row-level detail

See `data/coverage/coverage.json`, `docs/CURRICULUM_COVERAGE.json`, and `docs/SIMULATION_CATALOG.json`.
