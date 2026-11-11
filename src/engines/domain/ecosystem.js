// Ecosystem engine: logistic regrowth with harvest (sustainable yield) and a predator–prey food web (Lotka–Volterra, RK4).
export const forest = { K: 1000, r: 0.4 };                                  // carrying capacity (units of stock), regrowth rate per year
export const maxSustainableYield = (K = forest.K, r = forest.r) => (r * K) / 4;   // at stock = K/2
/** Yearly stock with constant harvest per year; collapses to 0 when harvest > regrowth can replace. */
export function harvestRun({ K = forest.K, r = forest.r, stock0 = 800, harvest = 80, years = 50 } = {}) {
  const s = [stock0]; let x = stock0, total = 0, collapsedAt = null;
  for (let y = 1; y <= years; y++) {
    const grow = r * x * (1 - x / K), take = Math.min(x + grow, harvest);
    x = Math.max(0, x + grow - take); total += take; s.push(x);
    if (x <= 1e-6 && collapsedAt == null) collapsedAt = y;
  }
  return { stock: s, total, collapsedAt, final: x, sustainable: collapsedAt == null && s[s.length - 1] >= 0.2 * K };
}
/** Predator–prey: dx/dt = a x - b x y ; dy/dt = d b x y - m y. Returns trajectory; `removePredators` thins y at a given year. */
export function webRun({ x0 = 40, y0 = 9, a = 0.6, b = 0.025, e = 0.5, m = 0.5, years = 40, dt = 0.05, cullYear = null, cullFrac = 0 } = {}) {
  const f = (x, y) => [a * x - b * x * y, e * b * x * y - m * y];
  const out = [{ t: 0, prey: x0, pred: y0 }]; let x = x0, y = y0, t = 0, nextCull = cullYear;
  const n = Math.round(years / dt);
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y), k2 = f(x + (dt / 2) * k1[0], y + (dt / 2) * k1[1]), k3 = f(x + (dt / 2) * k2[0], y + (dt / 2) * k2[1]), k4 = f(x + dt * k3[0], y + dt * k3[1]);
    x += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); t += dt;
    if (nextCull != null && t >= nextCull) { y *= 1 - cullFrac; nextCull = null; }
    if (i % Math.round(0.25 / dt) === 0) out.push({ t, prey: x, pred: y });
  }
  return out;
}
