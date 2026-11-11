import { createLab } from '../../components/lab-kit.js';
import * as i18n from '../../core/i18n.js';
import { trade, LAND } from './labs-trade.js';
export function mount(root) {
  const lab = createLab(trade, 'T13'); root.append(lab.el); i18n.apply(root);
  let alive = true;   // land outlines are optional: the lab works (grid + routes) without them, also offline
  fetch(new URL('../../../data/geo/land.simplified.json', import.meta.url)).then((r) => r.json()).then((j) => { LAND.polys = j.land; if (alive) lab.draw(); }).catch(() => {});
  return { relabel: () => lab.relabel(), destroy() { alive = false; }, debug: () => lab.debug() };
}
