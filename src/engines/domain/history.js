// Pure history domain engine for T04.L3-L5 (settlement, Harappan city, river civilisations),
// T05 (Vedic to 1000 CE state & society), T12 (1000-1700 CE resistance, forts, Bhakti), and T13.L2-L4.

/** T04.L3 Hunter-gatherer vs early farming settlement simulation over 15 years. */
export function settlementSim({ mode = 'forager', rainfallVar = 0.3, storage = 0.5 }) {
  const years = 16;
  const series = [];
  let pop = mode === 'forager' ? 28 : 65;
  let foodStore = mode === 'forager' ? 10 : 45 * storage;
  for (let y = 0; y < years; y++) {
    // Deterministic pseudo-climate cycle
    const shock = Math.sin(y * 1.45) * rainfallVar;
    const yieldPerPerson = mode === 'forager' ? 1.05 + shock * 0.25 : (1.28 + shock * 0.65);
    const need = pop * 1.0;
    const harvest = pop * yieldPerPerson;
    foodStore = Math.max(0, Math.min(180 * storage + 20, foodStore + harvest - need));
    const surplus = harvest - need;
    const diseasePenalty = mode === 'farmer' ? 0.015 : 0.002;
    const growth = surplus >= 0 ? 0.035 - diseasePenalty : -0.04;
    pop = Math.max(12, Math.round(pop * (1 + growth)));
    series.push({ y, pop, foodStore: Math.round(foodStore), surplus: Math.round(surplus) });
  }
  return { series, finalPop: series[series.length - 1].pop, finalStore: series[series.length - 1].foodStore };
}

/** T04.L4 Harappan city planner grid & sanitation metrics. */
export function harappanPlan({ gridStreets = true, coveredDrains = true, granary = true, greatBath = true, wellsPerBlock = 2 }) {
  const sanitation = (coveredDrains ? 45 : 10) + Math.min(40, wellsPerBlock * 12) + (greatBath ? 15 : 0);
  const floodSafety = (gridStreets ? 30 : 12) + (coveredDrains ? 40 : 10) + (granary ? 30 : 5);
  const overall = Math.min(100, Math.round((sanitation + floodSafety) / 2));
  return { sanitation: Math.min(100, sanitation), floodSafety: Math.min(100, floodSafety), overall };
}

/** T04.L5 Comparative Bronze Age river civilisations (approximate dates). */
export const RIVER_CIVS = [
  { id: 'harappan', lon: 68.1, lat: 27.3, river: { en: 'Indus & Ghaggar-Hakra', hi: 'सिंधु व घग्गर-हकरा' }, span: 'c. 2600–1900 BCE', en: 'Harappan (Mohenjo-daro, Harappa, Dholavira)', hi: 'हड़प्पा सभ्यता', writing: { en: 'Indus script (undeciphered)', hi: 'सिंधु लिपि (अपाठित)' }, trait: { en: 'Standardised baked bricks, covered street drains, grid planning', hi: 'मानक पक्की ईंटें, ढकी नालियाँ, ग्रिड नगर-योजना' } },
  { id: 'mesopotamia', lon: 44.4, lat: 32.5, river: { en: 'Tigris & Euphrates', hi: 'दजला व फ़रात' }, span: 'c. 3200–1900 BCE', en: 'Mesopotamia (Sumer, Ur, Babylon)', hi: 'मेसोपोटामिया', writing: { en: 'Cuneiform on clay tablets', hi: 'मिट्टी की पट्टियों पर कीलाक्षर' }, trait: { en: 'Ziggurats, city-states, earliest deciphered trade receipts', hi: 'ज़िग्गुरात, नगर-राज्य, प्राचीनतम पठित व्यापार-लेखे' } },
  { id: 'egypt', lon: 31.2, lat: 29.8, river: { en: 'Nile', hi: 'नील नदी' }, span: 'c. 3100–1100 BCE', en: 'Ancient Egypt (Memphis, Thebes)', hi: 'प्राचीन मिस्र', writing: { en: 'Hieroglyphs & papyrus', hi: 'चित्रलिपि व पपायरस' }, trait: { en: 'Predictable Nile flood silt, monumental stone pyramids', hi: 'नियमित नील बाढ़ गाद, विशाल पाषाण पिरामिड' } },
  { id: 'china', lon: 114.3, lat: 36.1, river: { en: 'Huang He (Yellow River)', hi: 'ह्वांग हो (पीली नदी)' }, span: 'c. 1600–1046 BCE', en: 'Shang China (Anyang)', hi: 'शांग चीन', writing: { en: 'Oracle bone script', hi: 'अस्थि-अभिलेख लिपि' }, trait: { en: 'Ritual bronze casting, millet agriculture, walled towns', hi: 'कांस्य ढलाई, बाजरा खेती, प्राचीर-युक्त नगर' } },
];

/** T12.L2 Indian hill fort defence & water resilience model. */
export function fortDesign({ bastions = 4, bentGate = true, cisterns = 3, granaryMonths = 8, doubleWall = true }) {
  const defence = Math.min(100, bastions * 8 + (bentGate ? 25 : 5) + (doubleWall ? 28 : 8));
  const siegeEndurance = Math.min(100, cisterns * 14 + granaryMonths * 4.5);
  const overall = Math.round(defence * 0.52 + siegeEndurance * 0.48);
  return { defence, siegeEndurance: Math.round(siegeEndurance), overall };
}

/** T05.L3 Kautilya Saptanga & State-vs-Society governance simulation (up to 1000 CE). */
export function saptangaEmpireSim({ taxRate = 17, roadsInvest = 50, irrigationInvest = 50, governanceMode = 'maurya' } = {}) {
  const modeBonus = {
    gana: { leg: 14, treas: -8, breakaway: 10, village: 16 },
    maurya: { leg: 4, treas: 12, breakaway: 18, village: 4 },
    samanta: { leg: -4, treas: -4, breakaway: 52, village: 0 },
    chola: { leg: 12, treas: 4, breakaway: 24, village: 28 },
  }[governanceMode] || { leg: 0, treas: 0, breakaway: 20, village: 0 };

  const overTaxPenalty = Math.max(0, taxRate - 17) * 2.55;
  const underTaxBonus = taxRate <= 17 ? (17 - taxRate) * 0.8 : 0;
  const infraSupport = roadsInvest * 0.22 + irrigationInvest * 0.28;

  const legitimacy = Math.max(5, Math.min(100, Math.round(62 + modeBonus.leg + underTaxBonus - overTaxPenalty + infraSupport * 0.55)));
  const villageResilience = Math.max(8, Math.min(100, Math.round(35 + modeBonus.village + irrigationInvest * 0.48 - Math.max(0, taxRate - 20) * 1.4)));
  const treasury = Math.max(5, Math.min(100, Math.round(28 + modeBonus.treas + taxRate * 2.1 * (legitimacy / 100) - (roadsInvest + irrigationInvest) * 0.14)));
  const breakawayRisk = Math.max(4, Math.min(98, Math.round(modeBonus.breakaway + Math.max(0, taxRate - 22) * 1.3 - roadsInvest * 0.22 - (governanceMode === 'chola' ? 8 : 0))));

  const limbs = [
    { id: 'svamin', en: 'Svamin (Rule/Assembly)', hi: 'स्वामी (शासन)', val: legitimacy },
    { id: 'janapada', en: 'Janapada (People/Land)', hi: 'जनपद (प्रजा व कृषि)', val: villageResilience },
    { id: 'kosha', en: 'Kosha (Treasury)', hi: 'कोश (राजकोष)', val: treasury },
    { id: 'durga', en: 'Durga & Roads', hi: 'दुर्ग व मार्ग', val: Math.round((roadsInvest + irrigationInvest) / 2) },
    { id: 'mitra', en: 'Stability (Low Revolt)', hi: 'स्थिरता (कम विद्रोह)', val: 100 - breakawayRisk },
  ];
  return { legitimacy, villageResilience, treasury, breakawayRisk, limbs };
}

/** T05.L5 Ancient Indian caravan & maritime guild (shreni / Ayyavole / Manigramam) model. */
export function guildRiskSim({ route = 'uttarapatha', shreniJoin = true, cargoValue = 120, monsoonInsurance = false } = {}) {
  const base = {
    uttarapatha: { distMult: 1.15, baseRisk: 34, taxDrag: 10 },
    dakshinapatha: { distMult: 1.25, baseRisk: 38, taxDrag: 12 },
    maritime: { distMult: 1.55, baseRisk: 52, taxDrag: 14 },
  }[route] || { distMult: 1.15, baseRisk: 34, taxDrag: 10 };

  const riskReduction = (shreniJoin ? 22 : 0) + (monsoonInsurance ? 16 : 0);
  const riskPct = Math.max(6, Math.min(85, base.baseRisk - riskReduction));
  const fee = (shreniJoin ? Math.round(cargoValue * 0.08) : 0) + (monsoonInsurance ? Math.round(cargoValue * 0.07) : 0);
  const grossProfit = Math.round(cargoValue * base.distMult);
  const expectedLoss = Math.round(grossProfit * (riskPct / 100) * 0.55);
  const netReturn = Math.max(10, grossProfit - expectedLoss - fee - base.taxDrag);
  return { grossProfit, riskPct, fee, expectedLoss, netReturn };
}

/** T05.L6 AI-Era Historical Claim Audit & Source-Corroboration simulation. */
export function sourceAuditSim({ claimId = 'ashoka', checkEpigraphy = false, checkChronology = false, checkMaterial = false } = {}) {
  const checksDone = [checkEpigraphy, checkChronology, checkMaterial].filter(Boolean).length;
  const profiles = {
    ashoka: {
      epigraphyBreaks: true,
      chronologyBreaks: true,
      materialBreaks: false,
      flaws: 2,
    },
    samanta: {
      epigraphyBreaks: true,
      chronologyBreaks: false,
      materialBreaks: true,
      flaws: 2,
    },
    science: {
      epigraphyBreaks: true,
      chronologyBreaks: true,
      materialBreaks: true,
      flaws: 3,
    },
  };
  const p = profiles[claimId] || profiles.ashoka;
  let caught = 0;
  if (checkEpigraphy && p.epigraphyBreaks) caught++;
  if (checkChronology && p.chronologyBreaks) caught++;
  if (checkMaterial && p.materialBreaks) caught++;
  const verifiedPct = Math.min(100, Math.round((caught / p.flaws) * 80 + checksDone * 7));
  const status = caught >= p.flaws ? 'debunked' : caught >= 1 ? 'partial' : 'unverified';
  return { checksDone, caught, totalFlaws: p.flaws, verifiedPct, status };
}
