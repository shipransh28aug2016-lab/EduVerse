import { mountLabs } from '../../components/lab-kit.js';
import { budget, inflation, interest } from './labs-econ.js';
export const mount = (root) => mountLabs(root, 'T16', [budget, inflation, interest], [{ en: 'Monthly budget', hi: 'मासिक बजट' }, { en: 'Inflation', hi: 'मुद्रास्फीति' }, { en: 'Simple vs compound interest', hi: 'साधारण बनाम चक्रवृद्धि ब्याज' }]);
