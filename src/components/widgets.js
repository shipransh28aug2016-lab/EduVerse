import { h, esc, fmt } from '../core/dom.js';
import * as i18n from '../core/i18n.js';
import { t, pairHtml } from '../core/i18n.js';

// Labelled range slider. Large touch target (CSS .range), keyboard accessible (native input).
export function slider({ id, labelKey, min, max, step = 1, value, format = (v) => String(v), onInput, hintKey, ariaKey }) {
  const input = h('input', { type: 'range', id, min, max, step, value, class: 'range', 'aria-labelledby': `${id}-l` });
  const out = h('output', { for: id, class: 'range-val' }, format(value));
  const lab = h('label', { id: `${id}-l`, for: id, 'data-k': labelKey }, t(labelKey));
  const root = h('div', { class: 'ctl' }, h('div', { class: 'ctl-row' }, lab, out), input, hintKey ? h('div', { class: 'ctl-hint', 'data-k': hintKey }, t(hintKey)) : null);
  input.addEventListener('input', () => { const v = +input.value; out.textContent = format(v); onInput?.(v); });
  return { root, input, set(v) { input.value = v; out.textContent = format(+input.value); }, setRange(lo, hi) { input.min = lo; input.max = hi; }, get: () => +input.value, setFormat(f) { format = f; out.textContent = f(+input.value); } };
}
export function button(key, onClick, cls = 'btn') { return h('button', { type: 'button', class: cls, 'data-k': key, onclick: onClick }, t(key)); }
export function toggle({ id, labelKey, checked, onChange }) {
  const cb = h('input', { type: 'checkbox', id, checked: checked || null, class: 'switch-in' });
  cb.checked = !!checked;
  cb.addEventListener('change', () => onChange?.(cb.checked));
  return { root: h('label', { class: 'switch', for: id }, cb, h('span', { class: 'switch-track', 'aria-hidden': 'true' }), h('span', { 'data-k': labelKey }, t(labelKey))), input: cb, set(v) { cb.checked = !!v; } };
}
// Segmented chips (radio semantics)
export function chips({ name, options, value, onSelect }) {
  const root = h('div', { class: 'chips', role: 'radiogroup' });
  const btns = options.map((o) => {
    const b = h('button', { type: 'button', role: 'radio', 'aria-checked': o.id === value ? 'true' : 'false', class: 'chip', dataset: { id: o.id }, 'data-k': o.key, onclick: () => { select(o.id); onSelect?.(o.id); } }, t(o.key));
    root.append(b); return b;
  });
  function select(id) { btns.forEach((b) => b.setAttribute('aria-checked', b.dataset.id === id ? 'true' : 'false')); }
  return { root, select };
}
export function tabs({ tabs: list, active, onChange }) {
  const bar = h('div', { class: 'tabbar', role: 'tablist' });
  const panels = h('div', { class: 'tabpanels' });
  const els = {};
  list.forEach((tb) => {
    const b = h('button', { type: 'button', role: 'tab', id: `tab-${tb.id}`, 'aria-controls': `panel-${tb.id}`, class: 'tab', 'data-k': tb.key, onclick: () => show(tb.id), onkeydown: (e) => keynav(e, tb.id) }, t(tb.key));
    const p = h('div', { role: 'tabpanel', id: `panel-${tb.id}`, 'aria-labelledby': `tab-${tb.id}`, class: 'tabpanel', hidden: true }, tb.el);
    els[tb.id] = { b, p }; bar.append(b); panels.append(p);
  });
  function keynav(e, id) {
    const ids = list.map((x) => x.id); const i = ids.indexOf(id);
    if (e.key === 'ArrowRight') show(ids[(i + 1) % ids.length], true); else if (e.key === 'ArrowLeft') show(ids[(i - 1 + ids.length) % ids.length], true);
  }
  function show(id, focus) {
    for (const [k, { b, p }] of Object.entries(els)) { const on = k === id; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; p.hidden = !on; }
    if (focus) els[id].b.focus();
    onChange?.(id);
  }
  show(active || list[0].id);
  return { root: h('div', { class: 'tabs' }, bar, panels), show };
}

// Bilingual content block: {en,hi}. Re-rendered by i18n.apply via data-bi (stored as JSON in dataset).
export function bi(obj, { tag = 'p', cls = '' } = {}) {
  const el = h(tag, { class: cls });
  el.dataset.bi = JSON.stringify(obj);
  el.innerHTML = pairHtml(obj.en, obj.hi, { block: true });
  return el;
}
export function relabelBi(root) { root.querySelectorAll('[data-bi]').forEach((el) => { const o = JSON.parse(el.dataset.bi); el.innerHTML = pairHtml(o.en, o.hi, { block: !el.hasAttribute('data-inline') }); }); }
// HTML string that re-labels itself when the language changes (used for options and feedback text)
export const biHtml = (o, { block = false } = {}) => `<span data-bi="${esc(JSON.stringify({ en: o.en, hi: o.hi }))}"${block ? '' : ' data-inline'}>${pairHtml(o.en, o.hi, { block })}</span>`;

// Prediction-before-action: student commits to an answer, THEN the experiment is applied and graded against the model.
// def: { id, stem:{en,hi}, options:[{id,en,hi}], run(): outcomeOptionId, explain(): {en,hi}, apply() }
export function predict(def, { done = {}, onDone } = {}) {
  const root = h('div', { class: 'predict' });
  const stem = bi(def.stem, { tag: 'div', cls: 'predict-stem' });
  const opts = h('div', { class: 'predict-opts', role: 'radiogroup' });
  const fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const state = done[def.id] || null;
  const render = (choice) => {
    opts.innerHTML = '';
    def.options.forEach((o) => {
      const b = h('button', { type: 'button', role: 'radio', class: 'opt' + (choice === o.id ? ' picked' : ''), 'aria-checked': choice === o.id ? 'true' : 'false', disabled: choice ? true : null });
      b.innerHTML = biHtml(o);
      b.addEventListener('click', () => commit(o.id));
      opts.append(b);
    });
  };
  function commit(choice) {
    const actual = def.run();           // applies the experiment to the live simulation and returns the model's outcome
    const ok = actual === choice;
    done[def.id] = { choice, ok };
    onDone?.(def.id, done[def.id]);
    showResult(choice, actual, ok);
  }
  function showResult(choice, actual, ok) {
    render(choice);
    [...opts.children].forEach((b, i) => { const id = def.options[i].id; b.classList.toggle('right', id === actual); b.classList.toggle('wrong', id === choice && !ok); });
    fb.className = 'feedback ' + (ok ? 'ok' : 'try');
    fb.innerHTML = `<strong data-k="${ok ? 'fb.right' : 'fb.notquite'}">${esc(t(ok ? 'fb.right' : 'fb.notquite'))}</strong> ` + biHtml(def.explain(), { block: true });
  }
  render(state?.choice || null);
  root.append(h('div', { class: 'predict-tag', 'data-k': 'predict.tag' }, t('predict.tag')), stem, opts, fb);
  root.relabel = () => { relabelBi(root); i18n.apply(root); };
  return root;
}

// Multiple-choice check with hint, retry and an explanatory (not just correct/incorrect) response.
export function mcq(def, { done = {}, onDone } = {}) {
  const root = h('div', { class: 'mcq' });
  const fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
  const opts = h('div', { class: 'predict-opts', role: 'radiogroup' });
  const hint = h('button', { type: 'button', class: 'btn ghost', 'data-k': 'mcq.hint', onclick: () => { fb.className = 'feedback hint'; fb.innerHTML = biHtml(def.hint); } }, t('mcq.hint'));
  let attempts = done[def.id]?.attempts || 0, solved = !!done[def.id]?.ok;
  def.options.forEach((o) => {
    const b = h('button', { type: 'button', role: 'radio', class: 'opt', 'aria-checked': 'false' });
    b.innerHTML = biHtml(o);
    b.addEventListener('click', () => {
      if (solved) return;
      attempts++;
      const ok = o.id === def.correct;
      [...opts.children].forEach((x) => x.classList.remove('wrong'));
      if (ok) { solved = true; b.classList.add('right'); }
      else b.classList.add('wrong');
      done[def.id] = { attempts, ok: solved || false };
      onDone?.(def.id, done[def.id]);
      const why = ok ? def.explain : (o.why || def.explain);
      fb.className = 'feedback ' + (ok ? 'ok' : 'try');
      fb.innerHTML = `<strong data-k="${ok ? 'fb.right' : 'fb.notquite'}">${esc(t(ok ? 'fb.right' : 'fb.notquite'))}</strong> ` + biHtml(why, { block: true }) + (ok ? '' : `<div class="again" data-k="mcq.again">${esc(t('mcq.again'))}</div>`);
    });
    opts.append(b);
  });
  root.append(bi(def.stem, { tag: 'div', cls: 'predict-stem' }), opts, h('div', { class: 'row' }, hint), fb);
  root.relabel = () => { relabelBi(root); i18n.apply(root); };
  return root;
}
export { fmt };
