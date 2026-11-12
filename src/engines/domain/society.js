// Pure social science, democracy, election delimitation, and authority domain engine (T01, T06, T07, T14).

/** T06.L1 Fictional-case democracy evaluator across 4 democratic criteria. */
export function assessDemocracyCase({ freeVote = true, multipleParties = true, freeMedia = true, equalLaw = true }) {
  const checks = [freeVote, multipleParties, freeMedia, equalLaw];
  const score = checks.filter(Boolean).length;
  const verdict = score === 4 ? 'democratic' : score >= 2 ? 'flawed' : 'non-democratic';
  return { score, max: 4, verdict };
}

/** T07.L3 9-block toy city for delimitation & gerrymandering vs population parity.
 * Each block has 100 voters: Party A vs Party B. Mode splits 9 blocks into 3 constituencies of 3 blocks each. */
export const TOY_BLOCKS = [
  // Row 0..2, mostly A in center/west, B clustered on east/north
  { id: 0, a: 70, b: 30 }, { id: 1, a: 65, b: 35 }, { id: 2, a: 25, b: 75 },
  { id: 3, a: 60, b: 40 }, { id: 4, a: 55, b: 45 }, { id: 5, a: 30, b: 70 },
  { id: 6, a: 75, b: 25 }, { id: 7, a: 45, b: 55 }, { id: 8, a: 35, b: 65 },
];
// Total votes: A = 460 (51.1%), B = 440 (48.9%) across 900 voters!
export function delimitationOutcome(scheme = 'rows') {
  const maps = {
    rows: [[0, 1, 2], [3, 4, 5], [6, 7, 8]],       // A wins 2-1
    cols: [[0, 3, 6], [1, 4, 7], [2, 5, 8]],       // A wins [0,3,6], [1,4,7] 2-1
    packedA: [[0, 1, 6], [2, 3, 4], [5, 7, 8]],    // Packing A into dist 0 lets B win 2-1 despite fewer votes!
    unequal: [[0, 1, 3, 4, 6], [2, 5], [7, 8]],    // Malapportionment: unequal populations (500 vs 200 vs 200) -> B wins 2-1!
  };
  const groups = maps[scheme] || maps.rows;
  const districts = groups.map((g, idx) => {
    const votesA = g.reduce((s, id) => s + TOY_BLOCKS[id].a, 0);
    const votesB = g.reduce((s, id) => s + TOY_BLOCKS[id].b, 0);
    const pop = votesA + votesB;
    return { idx, blocks: g, pop, votesA, votesB, winner: votesA >= votesB ? 'A' : 'B' };
  });
  const seatsA = districts.filter((d) => d.winner === 'A').length;
  const seatsB = districts.length - seatsA;
  const totalA = TOY_BLOCKS.reduce((s, x) => s + x.a, 0);
  const totalB = TOY_BLOCKS.reduce((s, x) => s + x.b, 0);
  const popSpread = Math.max(...districts.map((d) => d.pop)) - Math.min(...districts.map((d) => d.pop));
  return { districts, seatsA, seatsB, totalA, totalB, popSpread, mismatch: seatsB > seatsA && totalA > totalB };
}

/** T07.L3 Fictional electoral roll enumerator eligibility check. */
export function checkVoterRoll({ age = 18, resident = true, citizen = true }) {
  const eligible = age >= 18 && resident && citizen;
  const reason = !citizen ? 'not-citizen' : age < 18 ? 'under-age' : !resident ? 'not-ordinarily-resident' : 'eligible';
  return { eligible, reason };
}

/** T14.L5 Citizen-to-institution grievance & public-service escalation timeline. */
export function citizenWorkflow({ issue = 'water', daysWaited = 15, escalated = false }) {
  const stages = [
    { id: 'ward', en: '1. Local Office / Ward Desk', hi: '1. स्थानीय कार्यालय / वार्ड पटल' },
    { id: 'nodal', en: '2. Block / Municipal Grievance Officer', hi: '2. प्रखंड / नगर शिकायत अधिकारी' },
    { id: 'ombuds', en: '3. Independent Appellate / Ombudsperson', hi: '3. स्वतंत्र अपीलीय / लोकपाल' },
    { id: 'court', en: '4. Judiciary (Judicial Review)', hi: '4. न्यायपालिका (न्यायिक समीक्षा)' },
  ];
  const activeStage = daysWaited <= 7 ? 0 : daysWaited <= 21 ? 1 : escalated ? 3 : 2;
  const resolutionChance = Math.min(95, 35 + activeStage * 18 + (escalated ? 15 : 0));
  return { stages, activeStage, resolutionChance, issue };
}
