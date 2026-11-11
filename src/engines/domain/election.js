// Election and voting engine: re-exports the existing electoral-systems model and adds coalition arithmetic.
export * from '../../modules/politics/models.js';
/** Smallest-by-membership sets of parties whose seats exceed half the house and in which no member is surplus (minimal winning coalitions). */
export function minimalWinningCoalitions(seats) {
  const parties = Object.keys(seats).filter((p) => seats[p] > 0), total = Object.values(seats).reduce((a, b) => a + b, 0), need = Math.floor(total / 2) + 1, out = [];
  for (let mask = 1; mask < 1 << parties.length; mask++) {
    const set = parties.filter((_, i) => mask & (1 << i)), sum = set.reduce((s, p) => s + seats[p], 0);
    if (sum >= need && set.every((p) => sum - seats[p] < need)) out.push({ parties: set, seats: sum });
  }
  return { need, total, coalitions: out.sort((a, b) => a.parties.length - b.parties.length || a.seats - b.seats) };
}
export const hasMajority = (seats, party) => seats[party] > Object.values(seats).reduce((a, b) => a + b, 0) / 2;
