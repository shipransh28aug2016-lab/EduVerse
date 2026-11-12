// Supply-demand, PPF, scarcity & opportunity-cost, economic systems, and household safety-net models (T08 & T09).
export * from '../../modules/economics/models.js';

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
