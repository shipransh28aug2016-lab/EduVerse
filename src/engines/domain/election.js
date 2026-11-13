// Election and voting engine (T07): pure fictional electoral-system models + coalition arithmetic.
export const PARTIES = ['R', 'B', 'G', 'Y']; // neutral colour names; deliberately not real parties
export const SEATS = 10;
// votes in thousands, 10 constituencies of 100 each
export const BASE = [
  ...Array.from({ length: 7 }, () => ({ R: 40, B: 35, G: 15, Y: 10 })),
  ...Array.from({ length: 3 }, () => ({ R: 15, B: 70, G: 10, Y: 5 })),
];
// Runoff assumption (stated to students): where the voters of an eliminated party go. Fictional.
export const TRANSFER = { G: { B: 0.7, R: 0.3 }, Y: { B: 0.5, R: 0.5 }, R: { B: 0.5, R: 0.5 }, B: { B: 0.5, R: 0.5 } };

const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
export const initialElection = () => ({ system: 'fptp', swing: 0 });

// shift `pts` votes (per 100) from B to R in every constituency, never below zero
export function applySwing(consts, pts) {
  const from = pts >= 0 ? 'B' : 'R', to = pts >= 0 ? 'R' : 'B', n = Math.abs(pts);
  return consts.map((c) => { const mv = Math.min(n, c[from]); return { ...c, [from]: c[from] - mv, [to]: c[to] + mv }; });
}
export const totals = (consts) => Object.fromEntries(PARTIES.map((p) => [p, consts.reduce((a, c) => a + c[p], 0)]));
export const voteShare = (consts) => { const t = totals(consts), s = Object.values(t).reduce((a, b) => a + b, 0); return Object.fromEntries(PARTIES.map((p) => [p, t[p] / s])); };

export function fptp(consts) {
  const seats = Object.fromEntries(PARTIES.map((p) => [p, 0])), winners = [];
  consts.forEach((c) => { const w = top(c)[0][0]; seats[w]++; winners.push(w); });
  return { seats, winners };
}
// two-round system: if nobody has >50%, the top two go to a second round and eliminated parties' voters transfer by TRANSFER
export function runoff(consts) {
  const seats = Object.fromEntries(PARTIES.map((p) => [p, 0])), winners = [], rounds = [];
  consts.forEach((c) => {
    const tot = Object.values(c).reduce((a, b) => a + b, 0), r = top(c);
    if (r[0][1] > tot / 2) { seats[r[0][0]]++; winners.push(r[0][0]); rounds.push(1); return; }
    const [a, b] = [r[0][0], r[1][0]], v = { [a]: c[a], [b]: c[b] };
    PARTIES.filter((p) => p !== a && p !== b).forEach((p) => { [a, b].forEach((q) => { v[q] += c[p] * (TRANSFER[p]?.[q] ?? 0.5); }); });
    const w = v[a] >= v[b] ? a : b; seats[w]++; winners.push(w); rounds.push(2);
  });
  return { seats, winners, rounds };
}
// proportional representation, largest-remainder (Hare) method, one national list
export function proportional(consts, n = SEATS) {
  const sh = voteShare(consts), q = Object.fromEntries(PARTIES.map((p) => [p, sh[p] * n]));
  const seats = Object.fromEntries(PARTIES.map((p) => [p, Math.floor(q[p] + 1e-9)]));
  let left = n - Object.values(seats).reduce((a, b) => a + b, 0);
  PARTIES.map((p) => [p, q[p] - seats[p]]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).forEach(([p]) => { if (left > 0) { seats[p]++; left--; } });
  return { seats };
}
export function run(system, swing) {
  const consts = applySwing(BASE, swing);
  const res = system === 'fptp' ? fptp(consts) : system === 'runoff' ? runoff(consts) : proportional(consts);
  const sh = voteShare(consts), seats = res.seats;
  const most = (o) => top(o)[0][0], topVotes = most(sh), maxSeats = Math.max(...Object.values(seats));
  const topSeats = seats[topVotes] === maxSeats ? topVotes : most(seats); // a tie for most seats is not a mismatch
  return { consts, system, swing, seats, voteShare: sh, rounds: res.rounds, topVotes, topSeats, mismatch: seats[topVotes] < maxSeats };
}

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
