// T07 — Elections: L1 Election timeline & ECI, L2 Electoral systems sandbox (legacy), L3 Delimitation & voter roll, L4 Coalition & Anti-Defection.
import { h } from '../../core/dom.js';
import * as i18n from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { tabs as mkTabs } from '../../components/widgets.js';
import { createLab } from '../../components/lab-kit.js';
import * as elections from './elections.js';
import { electionTimeline, delimitationLab, coalition } from './t07-specs.js';

export function mount(root, ctx) {
  const lab1 = createLab(electionTimeline, 'T07');
  const el2 = h('div');
  const base = elections.mount(el2, ctx);
  const lab3 = createLab(delimitationLab, 'T07');
  const lab4 = createLab(coalition, 'T07');

  i18n.register({
    'T07.tab.L1': { en: 'ECI workflow (L1)', hi: 'निर्वाचन प्रक्रिया (L1)' },
    'T07.tab.L2': { en: 'Vote-to-seat lab (L2)', hi: 'मत-से-सीट प्रयोग (L2)' },
    'T07.tab.L3': { en: 'Delimitation & roll (L3)', hi: 'परिसीमन व सूची (L3)' },
    'T07.tab.L4': { en: 'Coalitions (L4)', hi: 'गठबंधन व दलबदल कानून (L4)' },
  });

  const ui = store.simState('T07.ui', { tab: 'L1' });
  const tb = mkTabs({
    active: ui.tab,
    onChange: (id) => { ui.tab = id; store.saveSim(); },
    tabs: [
      { id: 'L1', key: 'T07.tab.L1', el: lab1.el },
      { id: 'L2', key: 'T07.tab.L2', el: el2 },
      { id: 'L3', key: 'T07.tab.L3', el: lab3.el },
      { id: 'L4', key: 'T07.tab.L4', el: lab4.el },
    ],
  });
  root.append(tb.root);
  i18n.apply(root);

  return {
    relabel() { lab1.relabel(); base.relabel?.(); lab3.relabel(); lab4.relabel(); i18n.apply(root); },
    destroy() { base.destroy?.(); },
    debug: () => ({ L1: lab1.debug(), L2: base.debug?.(), L3: lab3.debug(), L4: lab4.debug() }),
  };
}
