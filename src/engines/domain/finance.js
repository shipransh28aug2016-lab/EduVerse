// Personal finance engine: budgeting, simple/compound interest, inflation. Rates are ILLUSTRATIVE; no real product rates are encoded.
export const budgetSplit = ({ income, needs, wants }) => {
  const savings = income - needs - wants;
  return { savings, needsPct: (needs / income) * 100, wantsPct: (wants / income) * 100, savingsPct: (savings / income) * 100, deficit: savings < 0 };
};
export const RULE_50_30_20 = { needs: 50, wants: 30, savings: 20 };        // a common rule of thumb, not a law
export const simpleInterest = (P, ratePct, years) => P * (ratePct / 100) * years;
export const simpleAmount = (P, ratePct, years) => P + simpleInterest(P, ratePct, years);
export const compoundAmount = (P, ratePct, years, perYear = 1) => P * (1 + ratePct / 100 / perYear) ** (perYear * years);
export function interestSeries(P, ratePct, years) {
  return Array.from({ length: years + 1 }, (_, y) => ({ year: y, simple: simpleAmount(P, ratePct, y), compound: compoundAmount(P, ratePct, y) }));
}
/** Years for money to double (rule of 72 approximation vs exact). */
export const doublingYears = (ratePct) => ({ rule72: 72 / ratePct, exact: Math.log(2) / Math.log(1 + ratePct / 100) });
/** What ₹amount will buy after `years` of inflation, in today's rupees. */
export const realValue = (amount, inflationPct, years) => amount / (1 + inflationPct / 100) ** years;
export const realRate = (nominalPct, inflationPct) => ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
export const priceAfter = (price, inflationPct, years) => price * (1 + inflationPct / 100) ** years;
