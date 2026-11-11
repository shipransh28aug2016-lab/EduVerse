// T07 composite: the existing electoral-systems sandbox (L2) plus the new coalition lab (L4).
import { h } from '../../core/dom.js';
import { bi } from '../../components/widgets.js';
import { createLab } from '../../components/lab-kit.js';
import * as i18n from '../../core/i18n.js';
import * as elections from './elections.js';
import { coalition } from './labs-politics.js';
export function mount(root, ctx) {
  const top = h('div'), more = h('div'), base = elections.mount(top, ctx), lab = createLab(coalition, 'T07');
  more.append(h('h2', { class: 'module-sep' }, bi({ en: 'More labs: forming a government (T07.L4)', hi: 'और प्रयोगशालाएँ: सरकार बनाना (T07.L4)' }, { tag: 'span' })), lab.el);
  root.append(top, more); i18n.apply(root);
  return { relabel() { base.relabel?.(); lab.relabel(); i18n.apply(root); }, destroy() { base.destroy?.(); }, debug: () => ({ ...base.debug?.(), coalition: lab.debug() }) };
}
