// T02 composite: the existing plate/boundary/interior module plus the new gradation sandbox (L4). Existing behaviour is untouched.
import { h } from '../../core/dom.js';
import { bi } from '../../components/widgets.js';
import { createLab } from '../../components/lab-kit.js';
import * as i18n from '../../core/i18n.js';
import * as tectonics from './tectonics.js';
import { gradation } from './labs-earth.js';
export function mount(root, ctx) {
  const top = h('div'), more = h('div');
  const base = tectonics.mount(top, ctx);
  const lab = createLab(gradation, 'T02');
  more.append(h('h2', { class: 'module-sep' }, bi({ en: 'More labs: weathering, erosion and deposition (T02.L4)', hi: 'और प्रयोगशालाएँ: अपक्षय, अपरदन और निक्षेपण (T02.L4)' }, { tag: 'span' })), lab.el);
  root.append(top, more); i18n.apply(root);
  return { relabel() { base.relabel?.(); lab.relabel(); i18n.apply(root); }, destroy() { base.destroy?.(); }, debug: () => ({ ...base.debug?.(), gradation: lab.debug() }) };
}
