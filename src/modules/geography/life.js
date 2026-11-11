import { mountLabs } from '../../components/lab-kit.js';
import { harvest, foodweb } from './labs-air-water-life.js';
export const mount = (root) => mountLabs(root, 'T11', [harvest, foodweb], [{ en: 'Forest harvest', hi: 'वन की कटाई' }, { en: 'Food web', hi: 'खाद्य-जाल' }]);
