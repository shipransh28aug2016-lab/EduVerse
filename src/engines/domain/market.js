// Supply-demand, PPF, scarcity & opportunity-cost, public goods, asymmetry & household safety-net models (T08 & T09).
// Every number is fictional and chosen for teaching; nothing here is real market data.
export const P0 = 50, Q0 = 60;          // baseline equilibrium of every scenario
export const PMAX = 100, QMAX = 120;    // chart ranges
// b = how much demand falls per ₹1 rise; d = how much supply rises per ₹1 rise
const SCENARIOS = {
  base: { b: 1, d: 1, lim: 40 },
  necessity: { b: 0.3, d: 1, lim: 25 },
  luxury: { b: 2, d: 1, lim: 40 },
  perishable: { b: 1, d: 0.2, lim: 25 },
};
export const SCENARIO_IDS = Object.keys(SCENARIOS);
const sc = (m) => SCENARIOS[m.scenario] ?? SCENARIOS.base;
const EPS = 0.5;

export const initialMarket = () => ({ scenario: 'base', price: 50, sD: 0, sS: 0, ceilingOn: false, ceiling: 35 });
export const shiftLimit = (scenario) => (SCENARIOS[scenario] ?? SCENARIOS.base).lim;
export const qd = (m, p) => Math.max(0, Q0 - sc(m).b * (p - P0) + (m.sD || 0));
export const qs = (m, p) => Math.max(0, Q0 + sc(m).d * (p - P0) + (m.sS || 0));
export function equilibrium(m) {
  const { b, d } = sc(m);
  const P = Math.max(0, P0 + ((m.sD || 0) - (m.sS || 0)) / (b + d));
  return { P, Q: Math.min(qd(m, P), qs(m, P)) };
}
export function statusAt(m, P) {
  const Qd = qd(m, P), Qs = qs(m, P);
  const status = Qs - Qd > EPS ? 'surplus' : Qd - Qs > EPS ? 'shortage' : 'balanced';
  return { P, Qd, Qs, status, surplus: Math.max(0, Qs - Qd), shortage: Math.max(0, Qd - Qs), traded: Math.min(Qd, Qs) };
}
export function compute(m) {
  const eq = equilibrium(m);
  const capped = !!m.ceilingOn && m.price > m.ceiling;          // the chosen price is not allowed: the cap applies
  const binding = !!m.ceilingOn && m.ceiling < eq.P - 1e-9;       // a cap only matters when it is below equilibrium
  const at = statusAt(m, capped ? m.ceiling : m.price);
  // what buyers would pay for the few units on sale: the demand curve read at the traded quantity
  const blackMarketPrice = capped && binding && at.status === 'shortage' ? P0 + (Q0 + (m.sD || 0) - at.traded) / sc(m).b : null;
  const rows = []; for (let P = 10; P <= 90; P += 10) { const r = statusAt(m, P); rows.push({ P, Qd: r.Qd, Qs: r.Qs, status: r.status }); }
  return { eq, at, capped, binding, blackMarketPrice, rows };
}

// ---- externality: benefit to buyers and private cost to makers, plus a side effect x per unit on outsiders
export const mb = (q) => 110 - q;
export const mpc = (q) => 10 + q;
export function externality({ kind, x }) {
  const Qm = 50, Pm = mb(Qm), neg = kind === 'negative';
  const Qopt = neg ? Qm - x / 2 : Qm + x / 2;
  const Popt = neg ? mb(Qopt) : mpc(Qopt);
  const gap = Qopt - Qm;                                          // negative: the market makes too much
  return { Qm, Pm, Qopt, Popt, gap, dwl: 0.5 * x * Math.abs(gap) };
}

// ---- public goods
export const PUBLIC_GOOD_ITEMS = [
  { id: 'streetlight', excludable: false, rival: false, why: 'The light falls on everyone on the road; one more walker does not use it up, and non-payers cannot be kept out.' },
  { id: 'lighthouse', excludable: false, rival: false, why: 'Every ship can use the warning light; ships that do not pay cannot be stopped, and one ship’s use does not reduce another’s.' },
  { id: 'park', excludable: false, rival: false, why: 'An open public park: anyone can enter and (unless it is crowded) one visitor does not reduce another’s enjoyment. Heavy crowding makes it partly rival.' },
  { id: 'mango', excludable: true, rival: true, why: 'The vendor can refuse anyone who does not pay, and the mango you eat is not available to anyone else: a private good.' },
  { id: 'cinema', excludable: true, rival: true, why: 'Only ticket holders get in, and a seat taken by one person cannot be used by another.' },
  { id: 'tuition', excludable: true, rival: true, why: 'The teacher can refuse a student who does not pay, and seats in a small class are limited.' },
];
export const isPublicGood = (it) => !it.excludable && !it.rival;
export const FR = { households: 10, cost: 60, pay: 10, value: 15 };
export function freeRider(k, tax = false) {
  const needed = Math.ceil(FR.cost / FR.pay);
  if (tax) { const share = FR.cost / FR.households; return { collected: FR.cost, lit: true, needed, share, payerNet: FR.value - share, nonPayerNet: null }; }
  const collected = k * FR.pay, lit = collected >= FR.cost;
  return { collected, lit, needed, share: null, payerNet: (lit ? FR.value : 0) - FR.pay, nonPayerNet: k < FR.households ? (lit ? FR.value : 0) : null };
}

// ---- information asymmetry: used bikes (₹ thousand). seller = least the owner accepts, buyer = most a buyer pays
export const BIKE = { good: { seller: 60, buyer: 70 }, bad: { seller: 20, buyer: 30 } };
export const goodShareNeeded = () => (BIKE.good.seller - BIKE.bad.buyer) / (BIKE.good.buyer - BIKE.bad.buyer);
export function usedBikes(g, inspect) {
  const offer = g * BIKE.good.buyer + (1 - g) * BIKE.bad.buyer;
  const goodPrice = (BIKE.good.seller + BIKE.good.buyer) / 2, badPrice = (BIKE.bad.seller + BIKE.bad.buyer) / 2;
  return { offer, goodTrades: inspect || offer >= BIKE.good.seller, goodPrice, badPrice };
}

// ---- PPF, scarcity & household safety-net models
export const ppfB = (A, aMax, bMax) => (A >= aMax ? 0 : bMax * Math.sqrt(1 - (A / aMax) ** 2));
export function ppfPoint(A, B, aMax, bMax) {
  const frontier = ppfB(A, aMax, bMax), inside = (A / aMax) ** 2 + (B / bMax) ** 2;
  return { frontier, status: A > aMax || B > bMax || inside > 1 + 1e-9 ? 'unattainable' : inside < 1 - 1e-9 ? 'inefficient' : 'efficient' };
}
export const opportunityCost = (A, dA, aMax, bMax) => (ppfB(A, aMax, bMax) - ppfB(A + dA, aMax, bMax)) / dA;

/** T08.L1 Scarcity & opportunity-cost allocation of a fixed ₹100 or study-hour budget. */
export function scarcityAllocate({ budget = 100, books = 40, snack = 30, data = 20 }) {
  const spent = books + snack + data;
  const remaining = budget - spent;
  const over = remaining < 0;
  const wellBeing = Math.round(books * 1.45 + snack * 0.9 + data * 1.15 - (over ? Math.abs(remaining) * 3 : 0));
  return { spent, remaining, over, wellBeing, opportunityHint: books < 50 ? 'more-study' : 'balanced' };
}

/** T08.L5 Household shock & social safety-net buffer (crop failure / medical bill). */
export function householdShock({ monthlyIncome = 12000, savings = 6000, shockCost = 10000, safetyNetCoverPct = 60 }) {
  const netShock = shockCost * (1 - safetyNetCoverPct / 100);
  const gap = Math.max(0, netShock - savings);
  const savingsLeft = Math.max(0, savings - netShock);
  const debtRisk = gap > 0;
  const monthsToRecover = monthlyIncome > 0 ? +(gap / (monthlyIncome * 0.25)).toFixed(1) : 0;
  return { netShock, gap, savingsLeft, debtRisk, monthsToRecover };
}
