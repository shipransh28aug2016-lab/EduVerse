import { mountLabs } from '../../components/lab-kit.js';
import { cutaway, breeze } from './labs-air-water-life.js';
export const mount = (root) => mountLabs(root, 'T03', [cutaway, breeze], [{ en: 'Atmosphere layers', hi: 'वायुमंडल की परतें' }, { en: 'Land and sea breeze', hi: 'स्थल और समुद्री समीर' }]);
