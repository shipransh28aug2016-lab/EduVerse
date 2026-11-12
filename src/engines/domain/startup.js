// Entrepreneurship, business-plan scoring, startup hubs, and creative-destruction engine (T15).
export function unitEconomics({ price, varCost, fixed, units }) {
  const contribution = price - varCost, revenue = price * units, totalCost = fixed + varCost * units, profit = revenue - totalCost;
  const breakEven = contribution > 0 ? Math.ceil(fixed / contribution - 1e-9) : Infinity;
  return { contribution, revenue, totalCost, profit, breakEven, marginPct: revenue > 0 ? (profit / revenue) * 100 : 0, status: profit > 0 ? 'profit' : profit < 0 ? 'loss' : 'break-even' };
}
export function series({ price, varCost, fixed, maxUnits, steps = 24 }) {
  const out = []; for (let i = 0; i <= steps; i++) { const u = (maxUnits * i) / steps; out.push({ units: u, revenue: price * u, cost: fixed + varCost * u }); } return out;
}
export const runwayMonths = (cash, monthlyLoss) => (monthlyLoss <= 0 ? Infinity : cash / monthlyLoss);

/** T15.L1 Idea-to-enterprise business plan readiness score (0..100). */
export function planReadiness({ problemClarity = 4, customerProof = 3, unitMarginOk = true, capitalBufferMonths = 4 }) {
  const score = Math.min(100, Math.round(problemClarity * 7 + customerProof * 7 + (unitMarginOk ? 25 : 5) + Math.min(6, capitalBufferMonths) * 3.5));
  const stage = score >= 75 ? 'launch-ready' : score >= 50 ? 'pilot-needed' : 'early-idea';
  return { score, stage };
}

/** T15.L3 Representative Indian startup hubs & MSME cluster hubs (schematic coordinates). */
export const STARTUP_HUBS = [
  { id: 'bengaluru', lon: 77.6, lat: 13.0, state: 'Karnataka', en: 'Bengaluru (Tech & DeepTech)', hi: 'बेंगलुरु (तकनीक)' },
  { id: 'ncr', lon: 77.2, lat: 28.6, state: 'Delhi', en: 'Delhi-NCR (Commerce & Logistics)', hi: 'दिल्ली-एनसीआर (वाणिज्य)' },
  { id: 'mumbai', lon: 72.9, lat: 19.1, state: 'Maharashtra', en: 'Mumbai-Pune (FinTech & SaaS)', hi: 'मुंबई-पुणे (फ़िनटेक)' },
  { id: 'hyderabad', lon: 78.5, lat: 17.4, state: 'Telangana', en: 'Hyderabad (BioTech & T-Hub)', hi: 'हैदराबाद (बायोटेक)' },
  { id: 'surat', lon: 72.8, lat: 21.2, state: 'Gujarat', en: 'Surat / Morbi (MSME Textiles & Ceramics)', hi: 'सूरत (एमएसएमई वस्त्र)' },
  { id: 'patna', lon: 85.1, lat: 25.6, state: 'Bihar', en: 'Patna / Jaipur (Agri & Craft Startups)', hi: 'पटना / जयपुर (कृषि-शिल्प)' },
];

/** T15.L4 Creative destruction trade-off: old vs new technology over 10 years. */
export function creativeDestruction({ techSpeed = 60, retrainSupport = 50 }) {
  const oldJobs = [], newJobs = [], output = [];
  for (let y = 0; y <= 10; y++) {
    const shift = 1 / (1 + Math.exp(-(y - 4.5) * (0.4 + techSpeed / 100)));
    const o = Math.round(100 * (1 - shift * 0.85));
    const n = Math.round(120 * shift * (0.65 + 0.35 * (retrainSupport / 100)));
    oldJobs.push([y, o]);
    newJobs.push([y, n]);
    output.push([y, Math.round(100 + 130 * shift)]);
  }
  const displacedPeak = Math.max(...oldJobs.map((p, i) => Math.max(0, 100 - p[1] - newJobs[i][1] * 0.6)));
  return { oldJobs, newJobs, output, finalNetJobs: oldJobs[10][1] + newJobs[10][1], displacedPeak: Math.round(displacedPeak) };
}
