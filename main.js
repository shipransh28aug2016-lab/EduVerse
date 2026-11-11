// App shell: top bar, hash router, theme navigator, theme page (the 14-item contract), lazy module mounting.
import { h, esc, $ } from './core/dom.js';
import * as store from './core/store.js';
import * as i18n from './core/i18n.js';
import { t } from './core/i18n.js';
import { bi, relabelBi } from './components/widgets.js';
import { UI } from './i18n/ui.js';
import { OPENINGS } from './modules/openings.js';
import { MODULES, TEACHER, LIMITS } from './modules/registry.js';

i18n.register(UI);
const root = $('#main'), bar = $('#topbar'), foot = $('#foot');
let cur = null; // { id, mod } mounted module
let CUR = null; // curriculum manifest
const DISC = { geography: 'disc.geography', history: 'disc.history', 'political-science': 'disc.political', economics: 'disc.economics', integrated: 'disc.integrated' };

async function boot() {
  const [cur_, gl] = await Promise.all([fetch('src/curriculum/curriculum.json').then((r) => r.json()), fetch('data/glossary.json').then((r) => r.json())]);
  CUR = cur_; i18n.setGlossary(gl.terms); window.__glossary = gl.terms;
  renderBar(); renderFoot(); applyPrefs();
  addEventListener('hashchange', route);
  store.subscribe((s, keys) => { if (keys.includes('lang')) onLang(); if (keys.some((k) => ['lowGraphics', 'reducedMotion', 'projector', 'teacher'].includes(k))) applyPrefs(); });
  route();
}
function applyPrefs() {
  const s = store.get(), c = document.documentElement.classList;
  c.toggle('low-g', !!s.lowGraphics); c.toggle('reduce-motion', !!s.reducedMotion); c.toggle('projector', !!s.projector); c.toggle('teacher', !!s.teacher);
  bar.querySelectorAll('[data-pref]').forEach((b) => b.setAttribute('aria-pressed', s[b.dataset.pref] ? 'true' : 'false'));
}
function renderBar() {
  const L = [['en', 'lang.en'], ['hi', 'lang.hi'], ['both', 'lang.both']];
  bar.replaceChildren(
    h('a', { class: 'brand', href: '#/', 'data-k': 'app.title' }, t('app.title')),
    h('div', { class: 'tools' },
      h('div', { class: 'seg', role: 'group', 'data-k-aria': 'bar.lang', 'aria-label': t('bar.lang') }, ...L.map(([id, k]) => h('button', { type: 'button', class: 'seg-b', 'data-lang': id, 'aria-pressed': store.get().lang === id ? 'true' : 'false', 'data-k': k, onclick: () => store.set({ lang: id }) }, t(k)))),
      ...[['lowGraphics', 'bar.low'], ['reducedMotion', 'bar.motion'], ['projector', 'bar.proj'], ['teacher', 'bar.teacher']].map(([p, k]) => h('button', { type: 'button', class: 'tool', 'data-pref': p, 'aria-pressed': store.get()[p] ? 'true' : 'false', 'data-k': k, onclick: () => store.set({ [p]: !store.get()[p] }) }, t(k)))));
}
function renderFoot() {
  foot.replaceChildren(h('p', { 'data-k': 'foot.note' }, t('foot.note')), h('p', { 'data-k': 'foot.priv' }, t('foot.priv')));
}
function onLang() {
  bar.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === store.get().lang ? 'true' : 'false'));
  i18n.apply(bar); i18n.apply(foot); i18n.apply(root); relabelBi(root); relabelTitles(); cur?.mod?.relabel?.();
}
function relabelTitles() { root.querySelectorAll('[data-title]').forEach((el) => { const o = JSON.parse(el.dataset.title); el.textContent = i18n.pair(o.en, o.hi); }); }
const titleEl = (tag, o, cls) => { const e = h(tag, { class: cls, 'data-title': JSON.stringify({ en: o.en, hi: o.hi }) }, i18n.pair(o.en, o.hi)); return e; };
const status = (th) => { const n = th.learningObjects.length, k = th.learningObjects.filter((l) => l.status === 'implemented').length; return { n, k, label: k === 0 ? 'planned' : k === n ? 'implemented' : 'partial' }; };

function destroyCur() { try { cur?.mod?.destroy?.(); } catch (e) { console.warn(e); } cur = null; }
async function route() {
  destroyCur();
  const m = location.hash.match(/^#\/theme\/(T\d\d)$/);
  root.replaceChildren(); window.scrollTo(0, 0);
  if (m && CUR.themes.some((x) => x.id === m[1])) await themePage(m[1]); else home();
  i18n.apply(root); root.focus({ preventScroll: true });
  document.title = (m ? `${m[1]} · ` : '') + 'Class IX Social Science';
}
function card(th) {
  const s = status(th);
  return h('a', { class: `card disc-${th.discipline} st-${s.label}`, href: `#/theme/${th.id}`, 'data-theme': th.id },
    h('span', { class: 'card-id' }, th.id), titleEl('span', th.title, 'card-title'),
    h('span', { class: 'card-meta' }, h('span', { 'data-k': DISC[th.discipline] }, t(DISC[th.discipline])), h('span', {}, ` · ${th.hours} `), h('span', { 'data-k': 'hours' }, t('hours'))),
    h('span', { class: `badge ${s.label}`, 'data-k': `st.${s.label}`, 'data-p': JSON.stringify({ k: s.k, n: s.n }) }, t(`st.${s.label}`, { k: s.k, n: s.n })));
}
function home() {
  const part = (n, label) => h('section', { class: 'part', 'aria-labelledby': `part${n}` }, h('h2', { id: `part${n}`, 'data-k': label, 'data-p': JSON.stringify({ h: CUR.themes.filter((x) => x.part === n).reduce((a, x) => a + x.hours, 0) }) }, t(label, { h: CUR.themes.filter((x) => x.part === n).reduce((a, x) => a + x.hours, 0) })), h('div', { class: 'grid' }, ...CUR.themes.filter((x) => x.part === n).map(card)));
  root.append(h('section', { class: 'hero' }, h('h1', { 'data-k': 'home.h1' }, t('home.h1')), h('p', { class: 'lead', 'data-k': 'home.lead' }, t('home.lead')), h('p', { class: 'note', 'data-k': 'home.honest' }, t('home.honest'))), part(1, 'home.part1'), part(2, 'home.part2'));
}
const lst = (items, fn) => h('ul', { class: 'plain' }, ...items.map((x) => h('li', {}, fn(x))));
async function themePage(id) {
  const th = CUR.themes.find((x) => x.id === id), s = status(th), idx = CUR.themes.indexOf(th);
  store.progress(id).visited = true; store.saveProgress();
  const loChip = (l) => h('span', { class: `chip-lo ${l.status}` }, h('b', {}, l.id.split('.')[1]), ' ', i18n.pair(l.en, l.hi), ' ', h('i', { 'data-k': `lo.${l.status}` }, t(`lo.${l.status}`)));
  const opening = OPENINGS[id];
  const modSlot = h('div', { class: 'module', id: 'module' });
  const nav = h('nav', { class: 'pager', 'aria-label': 'Theme navigation' }, idx > 0 ? h('a', { href: `#/theme/${CUR.themes[idx - 1].id}`, rel: 'prev' }, '← ', CUR.themes[idx - 1].id) : h('span'), h('a', { href: '#/', 'data-k': 'nav.all' }, t('nav.all')), idx < 15 ? h('a', { href: `#/theme/${CUR.themes[idx + 1].id}`, rel: 'next' }, CUR.themes[idx + 1].id, ' →') : h('span'));
  const glossary = (window.__glossary || []).filter((g) => (g.themes || []).includes(id));
  const teach = TEACHER[id];
  root.append(
    h('a', { class: 'back', href: '#/', 'data-k': 'nav.back' }, t('nav.back')),
    h('header', { class: 'theme-h' }, h('span', { class: 'card-id' }, id), titleEl('h1', th.title), h('p', { class: 'card-meta' }, h('span', { 'data-k': DISC[th.discipline] }, t(DISC[th.discipline])), ` · ${th.hours} `, h('span', { 'data-k': 'hours' }, t('hours')), ' · ', h('span', { class: `badge ${s.label}`, 'data-k': `st.${s.label}`, 'data-p': JSON.stringify({ k: s.k, n: s.n }) }, t(`st.${s.label}`, { k: s.k, n: s.n })))),
    h('section', { class: 'opening', 'aria-labelledby': 'op-h' }, h('h2', { id: 'op-h', 'data-k': 'th.opening' }, t('th.opening')), bi(opening, { tag: 'p', cls: 'q' })),
    modSlot,
    h('section', { class: 'subsec' }, h('h2', { 'data-k': 'th.lo' }, t('th.lo')), lst(th.learningObjects, loChip)),
    h('details', { class: 'subsec', open: th.learningObjects.every((l) => l.status === 'planned') ? '' : null }, h('summary', { 'data-k': 'th.src' }, t('th.src')), h('h3', { 'data-k': 'th.concepts' }, t('th.concepts')), lst(th.concepts, (c) => [i18n.pair(c.display || c.text, c.hi), ' ', h('small', {}, `p.${c.pdfPage}`)]), h('h3', { 'data-k': 'th.outcomes' }, t('th.outcomes')), lst(th.outcomes, (o) => [i18n.pair(o.display || o.text, o.hi), ' ', h('small', {}, `p.${o.pdfPage}`)])),
    glossary.length ? h('details', { class: 'subsec' }, h('summary', { 'data-k': 'th.gloss' }, t('th.gloss')), h('dl', { class: 'gloss' }, ...glossary.flatMap((g) => [h('dt', { 'data-term': g.id }, i18n.term(g.id)), h('dd', {}, i18n.termDef(g.id))]))) : null,
    teach ? h('details', { class: 'subsec teacher-only' }, h('summary', { 'data-k': 'th.teacher' }, t('th.teacher')), h('ol', {}, ...teach.flow.map((f) => h('li', {}, bi({ en: (f.m ? `${f.m} min — ` : '') + f.en, hi: (f.m ? `${f.m} मिनट — ` : '') + f.hi }, { tag: 'div' })))), ...(teach.prompts ? [h('h3', { 'data-k': 'th.prompts' }, t('th.prompts')), ...teach.prompts.map((p) => bi(p, { tag: 'p' }))] : []), ...(teach.misconceptions ? [h('h3', { 'data-k': 'th.misc' }, t('th.misc')), ...teach.misconceptions.map((p) => bi(p, { tag: 'p' }))] : [])) : null,
    LIMITS[id] ? h('aside', { class: 'limits' }, h('strong', { 'data-k': 'th.limits' }, t('th.limits')), ' ', bi(LIMITS[id], { tag: 'span' })) : null,
    nav);
  if (MODULES[id]) {
    modSlot.append(h('p', { class: 'note', 'data-k': 'th.loading' }, t('th.loading')));
    try { const mod = await MODULES[id](); if (location.hash !== `#/theme/${id}`) return; modSlot.replaceChildren(); cur = { id, mod: mod.mount(modSlot, {}) }; }
    catch (e) { console.error(e); modSlot.replaceChildren(h('p', { class: 'note err', 'data-k': 'th.err' }, t('th.err'))); }
  } else {
    modSlot.append(h('div', { class: 'planned-box' }, h('h2', { 'data-k': 'th.planned.h' }, t('th.planned.h')), h('p', { 'data-k': 'th.planned.p' }, t('th.planned.p'))));
  }
}
boot().catch((e) => { console.error(e); root.textContent = 'Failed to start: ' + e.message; });
