import { mountLabs } from '../../components/lab-kit.js';
import { unit, pnl } from './labs-econ.js';
export const mount = (root) => mountLabs(root, 'T15', [unit, pnl], [{ en: 'Unit economics', hi: 'इकाई अर्थशास्त्र' }, { en: 'Profit and loss', hi: 'लाभ और हानि' }]);
