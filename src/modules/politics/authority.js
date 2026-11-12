// T14 — Authority: L1 Kautilya & Shukraniti, L2 Concept map, L3 Timeline, L4 Authority types, L5 Citizen workflow.
import { mountLabs } from '../../components/lab-kit.js';
import { kautilyaExplorer, authorityMap, authorityTimeline, authorityTypes, citizenScenario } from './labs-authority.js';

export const mount = (root) => mountLabs(
  root,
  'T14',
  [kautilyaExplorer, authorityMap, authorityTimeline, authorityTypes, citizenScenario],
  [
    { en: 'Kautilya & Shukraniti (L1)', hi: 'कौटिल्य व शुक्रनीति (L1)' },
    { en: 'Authority concept map (L2)', hi: 'प्राधिकार अवधारणा (L2)' },
    { en: 'Constitutional arc (L3)', hi: 'संवैधानिक विकास (L3)' },
    { en: 'Authority styles (L4)', hi: 'प्राधिकार प्रकार (L4)' },
    { en: 'Citizen grievance (L5)', hi: 'नागरिक शिकायत प्रक्रिया (L5)' },
  ],
);
