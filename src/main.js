// App shell: top bar, hash router, theme navigator, theme page (the 14-item contract), lazy module mounting.
import { h, $ } from './core/dom.js';
import * as store from './core/store.js';
import * as i18n from './core/i18n.js';
import { t } from './core/i18n.js';
import { bi, relabelBi } from './components/widgets.js';
import { UI } from './i18n/ui.js';
import { OPENINGS } from './modules/openings.js';
import { MODULES, TEACHER, LIMITS } from './modules/registry.js';
import { HERO_MEDIA, THEME_MEDIA, themeBannerEl } from './core/media.js';
import { iconEl } from './engines/viz.js';
import { icon } from './x/icons.js';
import { stageView } from './x/stage-view.js';
import { IX_ATLAS, HOME_GLOBE } from './x/ix-atlas.js';

i18n.register(UI);
const root = $('#main'), bar = $('#topbar'), foot = $('#foot');
let cur = null; // { id, mod } mounted module
let extras = []; // 3D stages owned by the shell (home globe, Class IX atlas)
const loadX = () => import('./x/page.js');
const B = (en, hi) => ({ en, hi });
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
    h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-mark' }, iconEl('GraduationCap', { size: 20, className: 'brand-ico' })), h('span', { class: 'brand-txt' }, h('b', {}, 'EduVerse'), h('span', { 'data-k': 'app.title' }, t('app.title')))),
    h('nav', { class: 'cls-nav', 'aria-label': 'Class' }, h('a', { href: '#/', 'data-cls': 'ix' }, titleEl('span', B('Class IX', 'कक्षा IX'))), h('a', { href: '#/x', 'data-cls': 'x' }, titleEl('span', B('Class X', 'कक्षा X')))),
    h('div', { class: 'tools' },
      h('div', { class: 'seg', role: 'group', 'data-k-aria': 'bar.lang', 'aria-label': t('bar.lang') }, ...L.map(([id, k]) => h('button', { type: 'button', class: 'seg-b', 'data-lang': id, 'aria-pressed': store.get().lang === id ? 'true' : 'false', 'data-k': k, onclick: () => store.set({ lang: id }) }, t(k)))),
      ...[['lowGraphics', 'bar.low', 'ZapOff'], ['reducedMotion', 'bar.motion', 'Pause'], ['projector', 'bar.proj', 'Projector'], ['teacher', 'bar.teacher', 'BookOpen']].map(([p, k, ic]) => h('button', { type: 'button', class: 'tool', 'data-pref': p, 'aria-pressed': store.get()[p] ? 'true' : 'false', 'data-k-title': k, title: t(k), onclick: () => store.set({ [p]: !store.get()[p] }) }, iconEl(ic, { size: 16 }), h('span', { class: 'tool-t', 'data-k': k }, t(k))))));
}
function renderFoot() {
  foot.replaceChildren(h('p', { 'data-k': 'foot.note' }, t('foot.note')), h('p', { 'data-k': 'foot.priv' }, t('foot.priv')));
}
function onLang() {
  bar.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === store.get().lang ? 'true' : 'false'));
  i18n.apply(bar); i18n.apply(foot); i18n.apply(root); relabelBi(root); relabelTitles(); cur?.mod?.relabel?.(); extras.forEach((x) => x.relabel?.());
}
function relabelTitles() { document.querySelectorAll('[data-title]').forEach((el) => { const o = JSON.parse(el.dataset.title); el.textContent = i18n.pair(o.en, o.hi); }); }
const titleEl = (tag, o, cls) => { const e = h(tag, { class: cls, 'data-title': JSON.stringify({ en: o.en, hi: o.hi }) }, i18n.pair(o.en, o.hi)); return e; };
const status = (th) => { const n = th.learningObjects.length, k = th.learningObjects.filter((l) => l.status === 'implemented').length; return { n, k, label: k === 0 ? 'planned' : k === n ? 'implemented' : 'partial' }; };

function destroyCur() { try { cur?.mod?.destroy?.(); extras.forEach((x) => x.destroy?.()); } catch (e) { console.warn(e); } cur = null; extras = []; }
async function route() {
  destroyCur();
  const hash = location.hash, m = hash.match(/^#\/theme\/(T\d\d)$/), x = hash.match(/^#\/x(?:\/([A-Z]\d))?$/);
  root.replaceChildren(); window.scrollTo(0, 0);
  const isX = !!x;
  document.documentElement.dataset.cls = isX ? 'x' : 'ix';
  bar.querySelectorAll('[data-cls]').forEach((a) => (a.dataset.cls === (isX ? 'x' : 'ix') ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  let title = 'Social Science IX–X';
  if (m && CUR.themes.some((t_) => t_.id === m[1])) { await themePage(m[1]); title = `${m[1]} · Class IX Social Science`; }
  else if (x && x[1]) {
    try {
      const X = await loadX();
      if (location.hash !== hash) return;
      const ch = X.CHAPTERS.find((c) => c.id === x[1]);
      if (ch) { cur = { id: ch.id, mod: X.mountChapter(root, ch.id) }; title = `${ch.en} · Class X Social Science`; } else home('x');
    } catch (e) { console.error(e); root.replaceChildren(h('p', { class: 'note err', 'data-k': 'th.err' }, t('th.err'))); }
  } else home(isX ? 'x' : 'ix');
  i18n.apply(root); root.focus({ preventScroll: true });
  document.title = `${title} · EduVerse`;
}
function card(th) {
  const s = status(th);
  const media = THEME_MEDIA[th.id];
  return h('a', { class: `card disc-${th.discipline} st-${s.label}`, href: `#/theme/${th.id}`, 'data-theme': th.id },
    media ? h('div', { class: 'card-media' },
      h('img', { src: media.src, alt: '', loading: 'lazy', decoding: 'async' }),
      h('span', { class: 'card-ico' }, iconEl(media.icon, { size: 15 }))) : null,
    h('span', { class: 'card-id' }, th.id),
    titleEl('span', th.title, 'card-title'),
    h('span', { class: 'card-meta' }, h('span', { 'data-k': DISC[th.discipline] }, t(DISC[th.discipline])), h('span', {}, ` · ${th.hours} `), h('span', { 'data-k': 'hours' }, t('hours'))),
    h('span', { class: `badge ${s.label}`, 'data-k': `st.${s.label}`, 'data-p': JSON.stringify({ k: s.k, n: s.n }) }, t(`st.${s.label}`, { k: s.k, n: s.n })));
}
function home(cls = 'ix') {
  const part = (n, label) => h('section', { class: 'part', 'aria-labelledby': `part${n}` }, h('h2', { id: `part${n}`, 'data-k': label, 'data-p': JSON.stringify({ h: CUR.themes.filter((x) => x.part === n).reduce((a, x) => a + x.hours, 0) }) }, t(label, { h: CUR.themes.filter((x) => x.part === n).reduce((a, x) => a + x.hours, 0) })), h('div', { class: 'grid' }, ...CUR.themes.filter((x) => x.part === n).map(card)));
  const globe = stageView(HOME_GLOBE, { compact: true, chrome: false }); extras.push(globe);
  const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, n), titleEl('span', label));
  const labs = CUR.themes.reduce((a, x) => a + x.learningObjects.length, 0);
  const tab = (id, href, label, sub) => h('a', { class: 'cls-tab', href, 'aria-current': cls === id ? 'page' : null }, h('b', {}, titleEl('span', label)), titleEl('small', sub));
  const list = h('div', { class: 'cls-list' });
  root.append(
    h('section', { class: 'hero hero-shell' },
      h('div', { class: 'hero-copy' },
        h('p', { class: 'eyebrow' }, icon('Sparkles', { size: 15 }), titleEl('span', B('CBSE Social Science · Classes IX and X', 'CBSE सामाजिक विज्ञान · कक्षा IX और X'))),
        h('h1', { class: 'display', 'data-k': 'home.h1' }, t('home.h1')),
        h('p', { class: 'lead', 'data-k': 'home.lead' }, t('home.lead')),
        h('div', { class: 'stats' }, stat('16', B('Class IX themes', 'कक्षा IX विषय')), stat('22', B('Class X chapters', 'कक्षा X अध्याय')), stat(String(labs + 30), B('2D explorers', '2D अन्वेषक')), stat('38', B('3D scenes', '3D दृश्य'))),
        h('p', { class: 'note', 'data-k': 'home.honest' }, t('home.honest'))),
      h('div', { class: 'hero-art' }, globe.el,
        h('img', { class: 'hero-img', src: HERO_MEDIA.src, alt: i18n.pair(HERO_MEDIA.en, HERO_MEDIA.hi), loading: 'eager', decoding: 'async' }))),
    h('nav', { class: 'cls-tabs', 'aria-label': 'Choose class' },
      tab('ix', '#/', B('Class IX', 'कक्षा IX'), B('16 themes · 2026-27 syllabus', '16 विषय · 2026-27 पाठ्यक्रम')),
      tab('x', '#/x', B('Class X', 'कक्षा X'), B('22 chapters · four NCERT textbooks', '22 अध्याय · चार NCERT पाठ्यपुस्तकें'))),
    list);
  if (cls === 'x') {
    list.append(h('p', { class: 'note', 'data-k': 'th.loading' }, t('th.loading')));
    const at = location.hash;
    loadX().then((X) => { if (location.hash === at) list.replaceChildren(...X.chapterGrid()); }).catch((e) => { console.error(e); list.replaceChildren(h('p', { class: 'note err', 'data-k': 'th.err' }, t('th.err'))); });
  } else list.append(part(1, 'home.part1'), part(2, 'home.part2'));
}
const lst = (items, fn) => h('ul', { class: 'plain' }, ...items.map((x) => h('li', {}, fn(x))));
async function themePage(id) {
  const th = CUR.themes.find((x) => x.id === id), s = status(th), idx = CUR.themes.indexOf(th);
  const media = THEME_MEDIA[id];
  store.progress(id).visited = true; store.saveProgress();
  const loChip = (l) => h('span', { class: `chip-lo ${l.status}` }, h('b', {}, l.id.split('.')[1]), ' ', i18n.pair(l.en, l.hi), ' ', h('i', { 'data-k': `lo.${l.status}` }, t(`lo.${l.status}`)));
  const opening = OPENINGS[id];
  const modSlot = h('div', { class: 'module', id: 'module' });
  const nav = h('nav', { class: 'pager', 'aria-label': 'Theme navigation' }, idx > 0 ? h('a', { href: `#/theme/${CUR.themes[idx - 1].id}`, rel: 'prev' }, '← ', CUR.themes[idx - 1].id) : h('span'), h('a', { href: '#/', 'data-k': 'nav.all' }, t('nav.all')), idx < 15 ? h('a', { href: `#/theme/${CUR.themes[idx + 1].id}`, rel: 'next' }, CUR.themes[idx + 1].id, ' →') : h('span'));
  const glossary = (window.__glossary || []).filter((g) => (g.themes || []).includes(id));
  const teach = TEACHER[id];
  root.append(...[
    h('a', { class: 'back', href: '#/', 'data-k': 'nav.back' }, t('nav.back')),
    h('header', { class: `theme-h theme-head-wrap disc-${th.discipline}` },
      h('div', { class: 'theme-head-txt' },
        h('span', { class: 'card-id' }, media ? iconEl(media.icon, { size: 15, className: 'th-ico' }) : null, id),
        titleEl('h1', th.title),
        h('p', { class: 'card-meta' }, h('span', { 'data-k': DISC[th.discipline] }, t(DISC[th.discipline])), ` · ${th.hours} `, h('span', { 'data-k': 'hours' }, t('hours')), ' · ', h('span', { class: `badge ${s.label}`, 'data-k': `st.${s.label}`, 'data-p': JSON.stringify({ k: s.k, n: s.n }) }, t(`st.${s.label}`, { k: s.k, n: s.n })))),
      themeBannerEl(id)),
    IX_ATLAS[id] ? (() => { const sv = stageView(IX_ATLAS[id]); extras.push(sv); return h('section', { class: 'atlas' }, h('h2', { class: 'xsec-h' }, icon('Earth', { size: 20 }), titleEl('span', B('3D atlas', '3D एटलस'))), sv.el); })() : null,
    h('section', { class: 'opening', 'aria-labelledby': 'op-h' }, h('h2', { id: 'op-h', 'data-k': 'th.opening' }, t('th.opening')), bi(opening, { tag: 'p', cls: 'q' })),
    modSlot,
    h('section', { class: 'subsec' }, h('h2', { 'data-k': 'th.lo' }, t('th.lo')), lst(th.learningObjects, loChip)),
    h('details', { class: 'subsec', open: th.learningObjects.every((l) => l.status === 'planned') ? '' : null }, h('summary', { 'data-k': 'th.src' }, t('th.src')), h('h3', { 'data-k': 'th.concepts' }, t('th.concepts')), lst(th.concepts, (c) => [i18n.pair(c.display || c.text, c.hi), ' ', h('small', {}, `p.${c.pdfPage}`)]), h('h3', { 'data-k': 'th.outcomes' }, t('th.outcomes')), lst(th.outcomes, (o) => [i18n.pair(o.display || o.text, o.hi), ' ', h('small', {}, `p.${o.pdfPage}`)])),
    glossary.length ? h('details', { class: 'subsec' }, h('summary', { 'data-k': 'th.gloss' }, t('th.gloss')), h('dl', { class: 'gloss' }, ...glossary.flatMap((g) => [h('dt', { 'data-term': g.id }, i18n.term(g.id)), h('dd', {}, i18n.termDef(g.id))]))) : null,
    teach ? h('details', { class: 'subsec teacher-only' }, h('summary', { 'data-k': 'th.teacher' }, t('th.teacher')), h('ol', {}, ...teach.flow.map((f) => h('li', {}, bi({ en: (f.m ? `${f.m} min — ` : '') + f.en, hi: (f.m ? `${f.m} मिनट — ` : '') + f.hi }, { tag: 'div' })))), ...(teach.prompts ? [h('h3', { 'data-k': 'th.prompts' }, t('th.prompts')), ...teach.prompts.map((p) => bi(p, { tag: 'p' }))] : []), ...(teach.misconceptions ? [h('h3', { 'data-k': 'th.misc' }, t('th.misc')), ...teach.misconceptions.map((p) => bi(p, { tag: 'p' }))] : [])) : null,
    LIMITS[id] ? h('aside', { class: 'limits' }, h('strong', { 'data-k': 'th.limits' }, t('th.limits')), ' ', bi(LIMITS[id], { tag: 'span' })) : null,
    nav].filter(Boolean));
  if (MODULES[id]) {
    modSlot.append(h('p', { class: 'note', 'data-k': 'th.loading' }, t('th.loading')));
    try { const mod = await MODULES[id](); if (location.hash !== `#/theme/${id}`) return; modSlot.replaceChildren(); cur = { id, mod: mod.mount(modSlot, {}) }; }
    catch (e) { console.error(e); modSlot.replaceChildren(h('p', { class: 'note err', 'data-k': 'th.err' }, t('th.err'))); }
  } else {
    modSlot.append(h('div', { class: 'planned-box' }, h('h2', { 'data-k': 'th.planned.h' }, t('th.planned.h')), h('p', { 'data-k': 'th.planned.p' }, t('th.planned.p'))));
  }
}
// Offline / slow-network support: cache the app after the first visit (skipped on file:// and when unsupported).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
boot().catch((e) => { console.error(e); root.textContent = 'Failed to start: ' + e.message; });
