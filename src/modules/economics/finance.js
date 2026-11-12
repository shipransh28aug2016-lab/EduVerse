// T16 — Smart Ways to Manage Your Finances: L1 Budget, L2 Inflation, L3 Interest, L4 Risk & insurance, L5 Income tax concept.
import { mountLabs } from '../../components/lab-kit.js';
import { budget, inflation, interest } from './labs-econ.js';
import { riskReturn, taxFlow } from './labs-econ-extra.js';

export const mount = (root) => mountLabs(
  root,
  'T16',
  [budget, inflation, interest, riskReturn, taxFlow],
  [
    { en: 'Monthly budget (L1)', hi: 'मासिक बजट (L1)' },
    { en: 'Inflation (L2)', hi: 'मुद्रास्फीति (L2)' },
    { en: 'Simple vs compound interest (L3)', hi: 'साधारण बनाम चक्रवृद्धि ब्याज (L3)' },
    { en: 'Risk & insurance (L4)', hi: 'जोखिम व बीमा (L4)' },
    { en: 'Income tax concept (L5)', hi: 'आयकर अवधारणा (L5)' },
  ],
);
