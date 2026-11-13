// T02 composite: plate map, 3D/2D boundary explorer, Earth interior (L1-L3), plus gradation (L4), 3D landform gallery (L5), and hazard lab (L6).
import { h } from '../../core/dom.js';
import { bi } from '../../components/widgets.js';
import { createLab, createThreeLab } from '../../components/lab-kit.js';
import { createLandform3d } from './landforms-3d.js';
import * as i18n from '../../core/i18n.js';
import * as tectonics from './tectonics.js';
import { gradation, landformGallery, hazardLab } from './labs-earth.js';
import { tabs } from '../../components/widgets.js';

export function mount(root, ctx) {
  const top = h('div'), more = h('div');
  const base = tectonics.mount(top, ctx);
  const lab4 = createLab(gradation, 'T02');
  const lab5 = createThreeLab(landformGallery, 'T02', createLandform3d);
  const lab6 = createLab(hazardLab, 'T02');

  i18n.register({
    'T02.more.L4': { en: 'Gradation sandbox (L4)', hi: 'समतलीकरण प्रयोग (L4)' },
    'T02.more.L5': { en: '3D Landform gallery (L5)', hi: '3D स्थलाकृति दीर्घा (L5)' },
    'T02.more.L6': { en: 'Slope & GLOF hazard (L6)', hi: 'ढलान व GLOF जोखिम (L6)' },
  });

  const tb = tabs({
    active: 'L4',
    onChange: (id) => { if (id === 'L5') lab5.enable(); else lab5.disable(); },
    tabs: [
      { id: 'L4', key: 'T02.more.L4', el: lab4.el },
      { id: 'L5', key: 'T02.more.L5', el: lab5.el },
      { id: 'L6', key: 'T02.more.L6', el: lab6.el },
    ],
  });

  more.append(
    h('h2', { class: 'module-sep' }, bi({ en: 'Surface processes, landforms & mountain hazards (T02.L4–L6)', hi: 'धरातलीय प्रक्रियाएँ, स्थलाकृतियाँ व पर्वतीय आपदाएँ (T02.L4–L6)' }, { tag: 'span' })),
    tb.root,
  );
  root.append(top, more);
  i18n.apply(root);

  return {
    relabel() { base.relabel?.(); lab4.relabel(); lab5.relabel(); lab6.relabel(); i18n.apply(root); },
    destroy() { base.destroy?.(); lab5.destroy(); },
    debug: () => ({ ...base.debug?.(), gradation: lab4.debug(), landforms: lab5.debug(), hazard: lab6.debug() }),
  };
}
