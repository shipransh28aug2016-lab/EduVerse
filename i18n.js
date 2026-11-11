// Three language modes: 'en' | 'hi' | 'both'. In 'both', short labels render as  English (हिन्दी);
// paragraphs render English then Hindi. Official English terminology is therefore visible in every mode that includes English,
// and Hindi mode keeps the English term in brackets for key academic vocabulary (see term()).
import { esc } from './dom.js';
import * as store from './store.js';

const dict = {};
let glossary = new Map();
export const register = (strings) => Object.assign(dict, strings);
export const setGlossary = (terms) => { glossary = new Map(terms.map((x) => [x.id, x])); };
export const glossaryTerms = () => [...glossary.values()];
export const lang = () => store.get().lang;
const interp = (s, p) => (p ? s.replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`)) : s);

// plain-text label (safe for attributes and textContent)
export function t(key, params) {
  const e = dict[key];
  if (!e) return `⟦${key}⟧`;
  const en = interp(e.en, params), hi = interp(e.hi ?? e.en, params), l = lang();
  return l === 'en' ? en : l === 'hi' ? hi : (en === hi ? en : `${en} (${hi})`);
}
export const has = (key) => key in dict;
export const raw = (key) => dict[key];

// Pair of literal strings (for data-driven content that lives outside the UI dictionary, e.g. curriculum titles)
export function pair(en, hi, { block = false } = {}) {
  const l = lang();
  if (!hi) return en;
  if (l === 'en') return en;
  if (l === 'hi') return hi;
  return block ? `${en}\n${hi}` : `${en} (${hi})`;
}
// HTML version: block mode produces two elements so paragraphs stay readable
export function pairHtml(en, hi, { block = false, tag = 'span' } = {}) {
  const l = lang();
  if (!hi || l === 'en') return `<${tag} lang="en">${esc(en)}</${tag}>`;
  if (l === 'hi') return `<${tag} lang="hi">${esc(hi)}</${tag}>`;
  return block
    ? `<${tag} lang="en">${esc(en)}</${tag}><${tag} class="hi-line" lang="hi">${esc(hi)}</${tag}>`
    : `<span lang="en">${esc(en)}</span> <span class="hi-inline" lang="hi">(${esc(hi)})</span>`;
}
// Glossary term: English official term is always shown in hi-mode too (in brackets after the Hindi).
export function term(id, { html = false } = {}) {
  const g = glossary.get(id);
  if (!g) return html ? esc(id) : id;
  const l = lang();
  const s = l === 'en' ? g.en : l === 'hi' ? `${g.hi} (${g.en})` : `${g.en} (${g.hi})`;
  return html ? esc(s) : s;
}
export function termDef(id) {
  const g = glossary.get(id); if (!g) return '';
  const l = lang();
  return l === 'en' ? g.defEn : l === 'hi' ? g.defHi : `${g.defEn} ${g.defHi}`;
}

// Re-label every [data-k] / [data-k-aria] / [data-term] node under root. Does not touch widget state.
export function apply(root = document) {
  document.documentElement.lang = lang() === 'hi' ? 'hi' : 'en';
  root.querySelectorAll('[data-k]').forEach((el) => {
    const p = el.dataset.p ? JSON.parse(el.dataset.p) : undefined;
    const e = dict[el.dataset.k];
    if (!e) { el.textContent = `⟦${el.dataset.k}⟧`; return; }
    if (el.dataset.block !== undefined) el.innerHTML = pairHtml(interp(e.en, p), interp(e.hi ?? e.en, p), { block: true });
    else el.textContent = t(el.dataset.k, p);
  });
  root.querySelectorAll('[data-k-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.kAria)));
  root.querySelectorAll('[data-k-title]').forEach((el) => el.setAttribute('title', t(el.dataset.kTitle)));
  root.querySelectorAll('[data-term]').forEach((el) => { el.textContent = term(el.dataset.term); el.title = termDef(el.dataset.term); });
}
export const onChange = (f) => store.subscribe((s, keys) => { if (keys.includes('lang')) f(s.lang); });
