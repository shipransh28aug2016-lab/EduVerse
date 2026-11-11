// Entrepreneurship and startup engine: unit economics, break-even and a simple profit-and-loss statement. All inputs are fictional/teaching numbers.
export function unitEconomics({ price, varCost, fixed, units }) {
  const contribution = price - varCost, revenue = price * units, totalCost = fixed + varCost * units, profit = revenue - totalCost;
  const breakEven = contribution > 0 ? Math.ceil(fixed / contribution - 1e-9) : Infinity;
  return { contribution, revenue, totalCost, profit, breakEven, marginPct: revenue > 0 ? (profit / revenue) * 100 : 0, status: profit > 0 ? 'profit' : profit < 0 ? 'loss' : 'break-even' };
}
export function series({ price, varCost, fixed, maxUnits, steps = 24 }) {
  const out = []; for (let i = 0; i <= steps; i++) { const u = (maxUnits * i) / steps; out.push({ units: u, revenue: price * u, cost: fixed + varCost * u }); } return out;
}
/** Months of runway: how long the cash lasts if the business loses `monthlyLoss` each month. */
export const runwayMonths = (cash, monthlyLoss) => (monthlyLoss <= 0 ? Infinity : cash / monthlyLoss);
