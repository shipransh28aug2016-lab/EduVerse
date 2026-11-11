// Democracy and institutional-relationships engine. Textbook models: parliamentary (e.g. India's Union government) and presidential (e.g. USA).
export const SYSTEMS = ['parliamentary', 'presidential'];
export const ACTORS = {
  parliamentary: ['voters', 'legislature', 'executive', 'headOfState', 'judiciary'],
  presidential: ['voters', 'legislature', 'executive', 'judiciary'],
};
// edges: from → to, kind
export const RELATIONS = {
  parliamentary: [
    ['voters', 'legislature', 'elect'], ['legislature', 'executive', 'forms'], ['executive', 'legislature', 'answerable'],
    ['headOfState', 'executive', 'appoints'], ['judiciary', 'executive', 'checks'], ['judiciary', 'legislature', 'checks'],
  ],
  presidential: [
    ['voters', 'legislature', 'elect'], ['voters', 'executive', 'elect'], ['executive', 'legislature', 'veto'],
    ['legislature', 'executive', 'impeach'], ['judiciary', 'executive', 'checks'], ['judiciary', 'legislature', 'checks'],
  ],
};
/** Can the legislature end the executive's term by an ordinary majority vote of no confidence? */
export const removableByConfidenceVote = (system) => system === 'parliamentary';
/** A no-confidence motion: `total` legislators, `supportExec` still support the executive. */
export function confidenceVote(system, { total, supportExec }) {
  const majority = Math.floor(total / 2) + 1, lost = supportExec < majority;
  if (system === 'parliamentary') return { majority, lost, outcome: lost ? 'executive-falls' : 'executive-continues', next: lost ? 'alternative-or-election' : 'none' };
  return { majority, lost, outcome: 'executive-continues', next: 'fixed-term', note: 'no-confidence-not-available' };
}
/** Law passage when the executive's party lacks a legislative majority ("divided government"). */
export function lawPassage(system, { total, supportExec }) {
  const majority = Math.floor(total / 2) + 1, execHasMajority = supportExec >= majority;
  if (system === 'parliamentary') return { passes: execHasMajority, stable: execHasMajority, note: execHasMajority ? 'executive-leads' : 'executive-would-fall' };
  return { passes: execHasMajority, stable: true, note: execHasMajority ? 'aligned' : 'gridlock-possible' };
}
