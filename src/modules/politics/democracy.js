import { mountLabs } from '../../components/lab-kit.js';
import { institutions } from './labs-politics.js';
export const mount = (root) => mountLabs(root, 'T06', [institutions], [{ en: 'Parliamentary vs presidential', hi: 'संसदीय बनाम अध्यक्षीय' }]);
