import { mountLabs } from '../../components/lab-kit.js';
import { ppf } from './labs-econ.js';
export const mount = (root) => mountLabs(root, 'T08', [ppf], [{ en: 'Production possibilities', hi: 'उत्पादन संभावनाएँ' }]);
