// NEP 2020 Competency Matrix, Class IX -> Class X (2026-27) Synergy Strip & CBSE 50% CBQ Trainer (Assertion-Reason + Case-Based).
import { h } from '../core/dom.js';
import * as i18n from '../core/i18n.js';
import { t } from '../core/i18n.js';
import * as store from '../core/store.js';
import { playTap } from '../core/sound.js';
import { bi, relabelBi, mcq, tabs } from './widgets.js';
import { CG_META, THEME_NEP } from '../data/nep-cbq.js';

const AR_OPTS = [
  { id: 'A', en: '(A) Both Assertion (A) and Reason (R) are true, and R is the correct explanation of A.', hi: '(A) कथन (A) और कारण (R) दोनों सत्य हैं, तथा R, A की सही व्याख्या करता है।' },
  { id: 'B', en: '(B) Both A and R are true, but R is NOT the correct explanation of A.', hi: '(B) A और R दोनों सत्य हैं, पर R, A की सही व्याख्या नहीं करता।' },
  { id: 'C', en: '(C) Assertion (A) is true, but Reason (R) is false.', hi: '(C) कथन (A) सत्य है, पर कारण (R) असत्य है।' },
  { id: 'D', en: '(D) Assertion (A) is false, but Reason (R) is true.', hi: '(D) कथन (A) असत्य है, पर कारण (R) सत्य है।' },
];

export function createNepBridge(themeId, curriculum) {
  const meta = THEME_NEP[themeId];
  if (!meta) return null;
  const prog = store.progress(themeId);
  prog.cbq ??= {};

  // ---- NEP 2020 Competency Pills (clickable to inspect exact CBSE/NCF-SE description) ----
  const compInfo = h('div', { class: 'nep-comp-detail note', hidden: true });
  let activeCode = null;
  const compDict = new Map((curriculum?.competencies || []).map((c) => [c.code, c.text]));

  const pills = [
    ...meta.cgs.map((code) => ({ code, desc: CG_META[code] || { en: code, hi: code }, isCg: true })),
    ...meta.codes.map((code) => ({ code, desc: { en: compDict.get(code) || `NCERT Competency ${code}`, hi: `एनसीईआरटी दक्षता मानक ${code}` }, isCg: false })),
  ];

  const pillBar = h('div', { class: 'nep-pills' },
    ...pills.map((p) => h('button', {
      type: 'button',
      class: `nep-chip ${p.isCg ? 'cg' : 'comp'}`,
      'aria-pressed': 'false',
      onclick: () => {
        playTap();
        const same = activeCode === p.code;
        activeCode = same ? null : p.code;
        pillBar.querySelectorAll('.nep-chip').forEach((b) => b.setAttribute('aria-pressed', !same && b.dataset.code === p.code ? 'true' : 'false'));
        if (same) { compInfo.hidden = true; return; }
        compInfo.hidden = false;
        compInfo.replaceChildren(h('strong', {}, `${p.code}: `), bi(p.desc, { tag: 'span' }));
      },
      'data-code': p.code,
    }, p.code)));

  // ---- Synergy Banner (Class IX -> Class X 2026-27 + 21st Century Skill + Bridge Links) ----
  const synergyCard = h('section', { class: 'nep-card', 'aria-labelledby': 'nep-h' },
    h('div', { class: 'nep-top' },
      h('div', {},
        h('span', { class: 'nep-kicker', 'data-k': 'nep.kicker' }, t('nep.kicker')),
        h('h2', { id: 'nep-h', 'data-k': 'nep.title' }, t('nep.title'))),
      h('span', { class: 'nep-skill-pill' }, '⚡ ', bi(meta.skill, { tag: 'span' }))),
    pillBar,
    compInfo,
    h('div', { class: 'nep-x-box' },
      h('div', { class: 'nep-x-head' }, '🔗 ', bi(meta.classX.chapters, { tag: 'strong' })),
      bi(meta.classX.summary, { tag: 'p', cls: 'note' }),
      h('div', { class: 'row' },
        h('a', { class: 'btn ghost', href: '#/bridge', 'data-k': 'nep.goBridge' }, t('nep.goBridge')),
        h('a', { class: 'btn ghost', href: '#/portfolio', 'data-k': 'nep.goPort' }, t('nep.goPort')))));

  // ---- CBSE 50% Competency-Based Question (CBQ) Practice: Assertion-Reason + Case-Based ----
  const arDef = {
    id: meta.ar.id,
    stem: {
      en: `Assertion–Reason (${themeId}): Choose the correct relationship between (A) and (R):`,
      hi: `कथन–कारण (${themeId}): कथन (A) और कारण (R) के बीच सही संबंध चुनें:`,
    },
    correct: meta.ar.correct,
    options: AR_OPTS.map((o) => ({
      ...o,
      ...(o.id !== meta.ar.correct ? { why: meta.ar.explain } : {}),
    })),
    explain: meta.ar.explain,
    hint: { en: 'Check first if (A) is true, then if (R) is true, and finally whether "because R" explains A.', hi: 'पहले जाँचें क्या (A) सत्य है, फिर (R) सत्य है, और अंत में क्या “क्योंकि R” कथन (A) को समझाता है।' },
  };

  const arBox = h('div', { class: 'cbq-panel' },
    h('div', { class: 'cbq-ar-pair' },
      h('div', { class: 'cbq-stmt' }, h('strong', {}, 'A · '), bi(meta.ar.assertion, { tag: 'span' })),
      h('div', { class: 'cbq-stmt' }, h('strong', {}, 'R · '), bi(meta.ar.reason, { tag: 'span' }))),
    mcq(arDef, {
      done: prog.cbq,
      onDone: (id, v) => { prog.cbq[id] = v; store.saveProgress(); },
    }));

  const caseDef = {
    id: meta.caseQ.id,
    stem: meta.caseQ.stem,
    correct: meta.caseQ.correct,
    options: meta.caseQ.options,
    explain: meta.caseQ.explain,
    hint: { en: 'Read the source extract carefully for cause, evidence, or mathematical relationship.', hi: 'कारण, प्रमाण या गणितीय संबंध के लिए स्रोत प्रसंग को ध्यान से पढ़ें।' },
  };

  const caseBox = h('div', { class: 'cbq-panel' },
    h('blockquote', { class: 'cbq-case-box' }, bi(meta.caseQ.passage, { tag: 'div' })),
    mcq(caseDef, {
      done: prog.cbq,
      onDone: (id, v) => { prog.cbq[id] = v; store.saveProgress(); },
    }));

  const cbqTabs = tabs({
    active: 'ar',
    tabs: [
      { id: 'ar', key: 'cbq.tab.ar', el: arBox },
      { id: 'case', key: 'cbq.tab.case', el: caseBox },
    ],
  });

  const cbqCard = h('section', { class: 'cbq-card', 'aria-labelledby': 'cbq-h' },
    h('div', { class: 'cbq-head' },
      h('h2', { id: 'cbq-h', 'data-k': 'cbq.title' }, t('cbq.title')),
      h('p', { class: 'note', 'data-k': 'cbq.lead' }, t('cbq.lead'))),
    cbqTabs.root);

  const root = h('div', { class: 'nep-wrap' }, synergyCard, cbqCard);
  i18n.apply(root);

  return {
    el: root,
    relabel() {
      relabelBi(root);
      i18n.apply(root);
    },
  };
}
