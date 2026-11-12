// T10 — Oceans and Life: L1 3D Ocean-Floor Cutaway, L2 Tides, L3 Marine Fisheries, L4 Tsunami, L5 Maritime Cooperation.
import * as i18n from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { createLab } from '../../components/lab-kit.js';
import { createThreeLab } from '../../components/three-lab.js';
import { createOcean3d } from './ocean-3d.js';
import { tabs as mkTabs } from '../../components/widgets.js';
import { tides, tsunami } from './labs-air-water-life.js';
import { oceanRelief, fisheries, maritimeCoop } from './labs-geo-extra.js';

export function mount(root) {
  const lab1 = createThreeLab(oceanRelief, 'T10', createOcean3d);
  const lab2 = createLab(tides, 'T10');
  const lab3 = createLab(fisheries, 'T10');
  const lab4 = createLab(tsunami, 'T10');
  const lab5 = createLab(maritimeCoop, 'T10');
  const labs = [lab1, lab2, lab3, lab4, lab5];

  i18n.register({
    'T10.tab.L1': { en: '3D Ocean floor (L1)', hi: '3D समुद्र-तल (L1)' },
    'T10.tab.L2': { en: 'Tides (L2)', hi: 'ज्वार-भाटा (L2)' },
    'T10.tab.L3': { en: 'Fisheries (L3)', hi: 'मत्स्य आजीविका (L3)' },
    'T10.tab.L4': { en: 'Tsunami timing (L4)', hi: 'सुनामी समय (L4)' },
    'T10.tab.L5': { en: 'Maritime law (L5)', hi: 'समुद्री सहयोग (L5)' },
  });

  const ui = store.simState('T10.ui', { tab: 'L1' });
  const tb = mkTabs({
    active: ui.tab,
    onChange: (id) => {
      ui.tab = id; store.saveSim();
      if (id === 'L1') lab1.enable(); else lab1.disable();
    },
    tabs: [
      { id: 'L1', key: 'T10.tab.L1', el: lab1.el },
      { id: 'L2', key: 'T10.tab.L2', el: lab2.el },
      { id: 'L3', key: 'T10.tab.L3', el: lab3.el },
      { id: 'L4', key: 'T10.tab.L4', el: lab4.el },
      { id: 'L5', key: 'T10.tab.L5', el: lab5.el },
    ],
  });
  root.append(tb.root);
  i18n.apply(root);
  if ((ui.tab || 'L1') === 'L1') lab1.enable();

  return {
    relabel() { labs.forEach((l) => l.relabel()); i18n.apply(root); },
    destroy() { lab1.destroy(); },
    debug: () => ({ L1: lab1.debug(), L2: lab2.debug(), L3: lab3.debug(), L4: lab4.debug(), L5: lab5.debug() }),
  };
}
