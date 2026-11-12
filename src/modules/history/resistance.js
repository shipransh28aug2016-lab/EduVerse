// T12 — Resistance and Resilience (1000–1700 CE): L1 Polities map, L2 3D Fort Cutaway, L3 Art & Lit gallery, L4 Bhakti map, L5 Continuity timeline.
import * as i18n from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { createLab } from '../../components/lab-kit.js';
import { createThreeLab } from '../../components/three-lab.js';
import { createFort3d } from './fort-3d.js';
import { tabs as mkTabs } from '../../components/widgets.js';
import { loadGeoAll } from '../../engines/viz.js';
import { regionalPolitiesMap, fortBuilder, heritageGallery, bhaktiNetwork, continuityTimeline } from './labs-history-later.js';

export function mount(root) {
  const lab1 = createLab(regionalPolitiesMap, 'T12');
  const lab2 = createThreeLab(fortBuilder, 'T12', createFort3d);
  const lab3 = createLab(heritageGallery, 'T12');
  const lab4 = createLab(bhaktiNetwork, 'T12');
  const lab5 = createLab(continuityTimeline, 'T12');
  const labs = [lab1, lab2, lab3, lab4, lab5];

  i18n.register({
    'T12.tab.L1': { en: 'Regional polities (L1)', hi: 'क्षेत्रीय राज्य (L1)' },
    'T12.tab.L2': { en: '3D Hill fort (L2)', hi: '3D पहाड़ी दुर्ग (L2)' },
    'T12.tab.L3': { en: 'Art & literature (L3)', hi: 'कला व साहित्य (L3)' },
    'T12.tab.L4': { en: 'Bhakti network (L4)', hi: 'भक्ति परंपरा मानचित्र (L4)' },
    'T12.tab.L5': { en: 'Continuity timeline (L5)', hi: 'निरंतरता समय-रेखा (L5)' },
  });

  const ui = store.simState('T12.ui', { tab: 'L1' });
  const tb = mkTabs({
    active: ui.tab,
    onChange: (id) => {
      ui.tab = id; store.saveSim();
      if (id === 'L2') lab2.enable(); else lab2.disable();
    },
    tabs: [
      { id: 'L1', key: 'T12.tab.L1', el: lab1.el },
      { id: 'L2', key: 'T12.tab.L2', el: lab2.el },
      { id: 'L3', key: 'T12.tab.L3', el: lab3.el },
      { id: 'L4', key: 'T12.tab.L4', el: lab4.el },
      { id: 'L5', key: 'T12.tab.L5', el: lab5.el },
    ],
  });
  root.append(tb.root);
  i18n.apply(root);
  if (ui.tab === 'L2') lab2.enable();

  let alive = true;
  loadGeoAll().then(() => { if (alive) { lab1.draw(); lab4.draw(); } });

  return {
    relabel() { labs.forEach((l) => l.relabel()); i18n.apply(root); },
    destroy() { alive = false; lab2.destroy(); },
    debug: () => ({ L1: lab1.debug(), L2: lab2.debug(), L3: lab3.debug(), L4: lab4.debug(), L5: lab5.debug() }),
  };
}
