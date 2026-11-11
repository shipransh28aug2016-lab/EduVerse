// Supply-demand and market-equilibrium engine: re-exports the existing model and adds the production possibility frontier.
export * from '../../modules/economics/models.js';
/** PPF as a quarter-ellipse (increasing opportunity cost): A²/aMax² + B²/bMax² = 1. */
export const ppfB = (A, aMax, bMax) => (A >= aMax ? 0 : bMax * Math.sqrt(1 - (A / aMax) ** 2));
export function ppfPoint(A, B, aMax, bMax) {
  const frontier = ppfB(A, aMax, bMax), inside = (A / aMax) ** 2 + (B / bMax) ** 2;
  return { frontier, status: A > aMax || B > bMax || inside > 1 + 1e-9 ? 'unattainable' : inside < 1 - 1e-9 ? 'inefficient' : 'efficient' };
}
/** Units of B given up per extra unit of A when moving from A to A+dA along the frontier. */
export const opportunityCost = (A, dA, aMax, bMax) => (ppfB(A, aMax, bMax) - ppfB(A + dA, aMax, bMax)) / dA;
