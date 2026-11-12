// Class X: chapter page (cinematic 3D stage, key ideas, 2D explorers, quiz) and the chapter grid for the home page.
import { h } from '../core/dom.js';
import { pair } from '../core/i18n.js';
import * as store from '../core/store.js';
import { bi } from '../components/widgets.js';
import { CHAPTERS, UNITS, chapter } from './data/index.js';
import { stageView } from './stage-view.js';
import { create2d } from './viz2d.js';
import { icon } from './icons.js';

export { CHAPTERS, UNITS };
const S = {
  back: { en: 'All Class X chapters', hi: 'कक्षा X के सभी अध्याय' }, ideas: { en: 'Key ideas', hi: 'मुख्य विचार' }, explore: { en: 'Explore in 2D', hi: '2D में खोजें' },
  quiz: { en: 'Check yourself', hi: 'स्वयं को जाँचें' }, score: { en: 'Score', hi: 'अंक' }, retry: { en: 'Try again', hi: 'फिर प्रयास करें' },
  right: { en: 'Correct.', hi: 'सही।' }, wrong: { en: 'Not quite.', hi: 'ठीक नहीं।' }, note: { en: 'About this model', hi: 'इस मॉडल के बारे में' },
  chapter: { en: 'Chapter', hi: 'अध्याय' }, cls: { en: 'Class X', hi: 'कक्षा X' }, scenes3d: { en: '3D', hi: '3D' }, views2d: { en: '2D', hi: '2D' },
  src: { en: 'Content follows the NCERT Class X textbooks. Draft Hindi awaits subject-teacher review; check which chapters and map items your school’s current CBSE syllabus assesses.', hi: 'सामग्री NCERT कक्षा X की पाठ्यपुस्तकों के अनुसार है। हिन्दी पाठ विषय-शिक्षक की समीक्षा की प्रतीक्षा में है; वर्तमान CBSE पाठ्यक्रम में कौन-से अध्याय और मानचित्र-बिंदु मूल्यांकन में हैं, यह अपने विद्यालय से जाँचें।' },
};
/** Short bilingual label that main.js re-labels on language change (shared data-title contract). */
export const tx = (tag, cls, o, ...kids) => h(tag, { class: cls, 'data-title': JSON.stringify({ en: o.en, hi: o.hi }) }, pair(o.en, o.hi), ...kids);
const unitOf = (c) => UNITS.find((u) => u.id === c.unit);
const prog = (id) => { const p = store.progress(`X.${id}`); p.quiz ??= []; return p; };
export const quizScore = (c) => { const a = prog(c.id).quiz; return { done: c.quiz.every((_, i) => a[i] != null), n: c.quiz.filter((qq, i) => a[i] === qq.a).length, of: c.quiz.length }; };

function quiz(c) {
  const el = h('div', { class: 'xquiz' }), P = prog(c.id);
  function draw() {
    const sc = quizScore(c);
    el.replaceChildren(
      ...c.quiz.map((qq, i) => {
        const picked = P.quiz[i];
        return h('fieldset', { class: 'xq' }, h('legend', {}, h('span', { class: 'xq-n' }, String(i + 1)), pair(qq.q.en, qq.q.hi)),
          h('div', { class: 'xq-opts' }, ...qq.o.map((o, k) => h('button', { type: 'button', class: `xq-opt${picked != null && k === qq.a ? ' ok' : ''}${picked === k && k !== qq.a ? ' bad' : ''}`, 'aria-pressed': picked === k ? 'true' : 'false', disabled: picked != null || null, onclick: () => { P.quiz[i] = k; store.saveProgress(); draw(); } },
            picked != null && k === qq.a ? icon('CircleCheck', { size: 17 }) : picked === k ? icon('CircleX', { size: 17 }) : h('span', { class: 'xq-k' }, 'ABCD'[k]), h('span', {}, pair(o.en, o.hi))))),
          picked != null ? h('p', { class: `xq-why ${picked === qq.a ? 'ok' : 'bad'}`, role: 'status' }, h('b', {}, pair(...(picked === qq.a ? [S.right.en, S.right.hi] : [S.wrong.en, S.wrong.hi]))), ' ', pair(qq.why.en, qq.why.hi)) : null);
      }),
      h('div', { class: 'xq-foot' }, h('span', { class: 'xq-score' }, icon('Trophy', { size: 18 }), ` ${pair(S.score.en, S.score.hi)}: ${sc.n} / ${sc.of}`),
        P.quiz.some((x) => x != null) ? h('button', { type: 'button', class: 'btn ghost', onclick: () => { P.quiz = []; store.saveProgress(); draw(); } }, pair(S.retry.en, S.retry.hi)) : null));
  }
  draw(); return { el, relabel: draw };
}

export function mountChapter(root, id) {
  const c = chapter(id), u = unitOf(c), idx = CHAPTERS.indexOf(c), prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
  prog(id).visited = true; store.saveProgress();
  const stage = stageView(c.scenes), widgets = c.explore.map((e) => ({ e, w: create2d(e) })), qz = quiz(c);
  const sec = (ico, title, ...kids) => h('section', { class: 'xsec' }, h('h2', { class: 'xsec-h' }, icon(ico, { size: 20 }), tx('span', '', title)), ...kids);
  root.append(
    h('a', { class: 'back', href: '#/x' }, '← ', tx('span', '', S.back)),
    h('header', { class: 'xhero', style: `--u:${u.color}` },
      h('div', { class: 'xhero-copy' },
        h('p', { class: 'eyebrow' }, icon(u.icon, { size: 15 }), tx('span', '', S.cls), ' · ', tx('span', '', u), ' · ', tx('span', '', S.chapter), ` ${c.no}`),
        tx('h1', 'display', c),
        bi(c.hook, { tag: 'p', cls: 'xhook' })),
      stage.el),
    sec('Sparkles', S.ideas, h('div', { class: 'ideas' }, ...c.ideas.map((it, i) => h('article', { class: 'idea' }, h('span', { class: 'idea-n' }, String(i + 1).padStart(2, '0')), tx('h3', '', it), bi(it.d, { tag: 'p' }))))),
    sec('Map', S.explore, ...widgets.map(({ e, w }) => h('div', { class: 'xpanel' }, tx('h3', 'xpanel-h', e.t), w.el))),
    sec('Target', S.quiz, qz.el),
    h('aside', { class: 'limits' }, tx('strong', '', S.note), ' ', bi(c.note, { tag: 'span' }), bi(S.src, { tag: 'p', cls: 'note' })),
    h('nav', { class: 'pager', 'aria-label': 'Chapter navigation' },
      prev ? h('a', { href: `#/x/${prev.id}`, rel: 'prev' }, '← ', tx('span', '', prev)) : h('span'),
      h('a', { href: '#/x' }, tx('span', '', S.back)),
      next ? h('a', { href: `#/x/${next.id}`, rel: 'next' }, tx('span', '', next), ' →') : h('span')));
  return {
    relabel() { stage.relabel(); widgets.forEach(({ w }) => w.relabel()); qz.relabel(); },
    destroy() { stage.destroy(); },
    debug: () => ({ stage: stage.debug(), quiz: quizScore(c) }),
  };
}

/** Chapter cards for the home page, grouped by textbook. */
export function chapterGrid() {
  return UNITS.map((u) => h('section', { class: 'part xunit', style: `--u:${u.color}` },
    h('h2', { class: 'unit-h' }, h('span', { class: 'unit-ico' }, icon(u.icon, { size: 20 })), tx('span', '', u), tx('small', '', u.book)),
    h('div', { class: 'grid' }, ...CHAPTERS.filter((c) => c.unit === u.id).map((c) => {
      const sc = quizScore(c), visited = !!prog(c.id).visited;
      return h('a', { class: `xcard${visited ? ' seen' : ''}`, href: `#/x/${c.id}`, 'data-chapter': c.id },
        h('span', { class: 'xcard-top' }, h('span', { class: 'xcard-ico' }, icon(c.icon, { size: 22 })), h('span', { class: 'xcard-no' }, String(c.no).padStart(2, '0'))),
        tx('span', 'card-title', c),
        h('span', { class: 'xcard-tags' }, h('span', { class: 'tag t3' }, icon('Box', { size: 13 }), ` ${c.scenes.length} × 3D`), h('span', { class: 'tag' }, icon('Map', { size: 13 }), ` ${c.explore.length} × 2D`),
          sc.done ? h('span', { class: 'tag done' }, icon('Trophy', { size: 13 }), ` ${sc.n}/${sc.of}`) : null));
    }))));
}
