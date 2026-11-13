// T08 — Building Blocks in Economics: L1 Scarcity, L2 PPF, L3 What/How/For Whom, L4 Economic systems, L5 Safety net.
import { mountLabs } from '../../components/lab-kit.js';
import { ppf, scarcityGame, econFlow, econSystems, safetyNet } from './t08-specs.js';

export const mount = (root) => mountLabs(
  root,
  'T08',
  [scarcityGame, ppf, econFlow, econSystems, safetyNet],
  [
    { en: 'Scarcity & choice (L1)', hi: 'दुर्लभता व चयन (L1)' },
    { en: 'Production frontier (L2)', hi: 'उत्पादन संभावना (L2)' },
    { en: 'What / How / For whom (L3)', hi: 'क्या / कैसे / किसके लिए (L3)' },
    { en: 'Economic systems (L4)', hi: 'आर्थिक प्रणालियाँ (L4)' },
    { en: 'Safety net (L5)', hi: 'सामाजिक सुरक्षा-जाल (L5)' },
  ],
);
