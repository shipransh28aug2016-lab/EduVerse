import { mountLabs } from '../../components/lab-kit.js';
import { tides, tsunami } from './labs-air-water-life.js';
export const mount = (root) => mountLabs(root, 'T10', [tides, tsunami], [{ en: 'Tides', hi: 'ज्वार-भाटा' }, { en: 'Tsunami timing', hi: 'सुनामी का समय' }]);
