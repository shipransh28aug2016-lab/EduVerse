// Compatibility re-export of pure T07 electoral models from src/engines/domain/election.js.
export {
  PARTIES, SEATS, BASE, TRANSFER,
  initialElection, applySwing, totals, voteShare, fptp, runoff, proportional, run,
} from '../../engines/domain/election.js';
