// Personal finance engine: budgeting, interest, inflation, risk-return & insurance pooling (T16.L4), and tax concept flow (T16.L5).
export const budgetSplit = ({ income, needs, wants }) => {
  const savings = income - needs - wants;
  return { savings, needsPct: (needs / income) * 100, wantsPct: (wants / income) * 100, savingsPct: (savings / income) * 100, deficit: savings < 0 };
};
export const RULE_50_30_20 = { needs: 50, wants: 30, savings: 20 };
export const simpleInterest = (P, ratePct, years) => P * (ratePct / 100) * years;
export const simpleAmount = (P, ratePct, years) => P + simpleInterest(P, ratePct, years);
export const compoundAmount = (P, ratePct, years, perYear = 1) => P * (1 + ratePct / 100 / perYear) ** (perYear * years);
export function interestSeries(P, ratePct, years) {
  return Array.from({ length: years + 1 }, (_, y) => ({ year: y, simple: simpleAmount(P, ratePct, y), compound: compoundAmount(P, ratePct, y) }));
}
export const doublingYears = (ratePct) => ({ rule72: 72 / ratePct, exact: Math.log(2) / Math.log(1 + ratePct / 100) });
export const realValue = (amount, inflationPct, years) => amount / (1 + inflationPct / 100) ** years;
export const realRate = (nominalPct, inflationPct) => ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
export const priceAfter = (price, inflationPct, years) => price * (1 + inflationPct / 100) ** years;

/** T16.L4 Hypothetical financial instruments & insurance risk-pooling calculator. */
export const INSTRUMENTS = [
  { id: 'savings', en: 'Savings A/c', hi: 'बचत खाता', returnPct: 3.5, risk: 5, liquidity: 98 },
  { id: 'fd', en: 'Fixed Deposit', hi: 'सावधि जमा (FD)', returnPct: 6.5, risk: 12, liquidity: 65 },
  { id: 'bond', en: 'Govt Bond', hi: 'सरकारी बॉन्ड', returnPct: 7.0, risk: 18, liquidity: 55 },
  { id: 'index', en: 'Equity Index Fund', hi: 'इक्विटी इंडेक्स फंड', returnPct: 11.0, risk: 65, liquidity: 85 },
];

export function insurancePool({ poolSize = 200, claimProbPct = 3, claimAmount = 40000 }) {
  const expectedClaims = poolSize * (claimProbPct / 100);
  const totalPoolNeeded = expectedClaims * claimAmount;
  const fairPremium = totalPoolNeeded / Math.max(1, poolSize);
  return { expectedClaims: +expectedClaims.toFixed(1), totalPoolNeeded: Math.round(totalPoolNeeded), fairPremium: Math.round(fairPremium) };
}

/** T16.L5 Strictly conceptual progressive tax-bracket & public-service allocation model (hypothetical illustrative slabs). */
export function taxConceptAlloc({ incomeUnits = 12, progressivity = 1 }) {
  // Purely illustrative conceptual slab tiers (unitless income index 0..24) — NO real statutory tax rates.
  const exempt = Math.min(incomeUnits, 4);
  const mid = Math.max(0, Math.min(incomeUnits - 4, 6));
  const top = Math.max(0, incomeUnits - 10);
  const effectiveTax = mid * (0.05 * progressivity) + top * (0.14 * progressivity);
  const effectivePct = incomeUnits > 0 ? (effectiveTax / incomeUnits) * 100 : 0;
  return {
    exempt, mid, top,
    effectiveTax: +effectiveTax.toFixed(2),
    effectivePct: +effectivePct.toFixed(1),
    takeHome: +(incomeUnits - effectiveTax).toFixed(2),
  };
}
