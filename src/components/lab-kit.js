// Visual-first interactive lab builder:
//  • Interactive 2D Realistic Plate with clickable concept hotspots (spots) + direct SVG [data-set] controls
//  • Interactive Visual Stage (3D/VR Diorama + 2.5D SVG + 2D Realistic Plate) + Tactile Controls + Auto-Play
//  • Compact collapsible Goal & Model Note drawer + 4-Pill Challenge Dock
import { h, esc } from '../core/dom.js';
import * as i18n from '../core/i18n.js';
import { t } from '../core/i18n.js';
import * as store from '../core/store.js';
import { playTap } from '../core/sound.js';
import { slider, chips, toggle, tabs as mkTabs, bi, relabelBi, predict, mcq, biHtml, button } from './widgets.js';
import { attachThreeStage } from './three-lab.js';
import { createTheme3d } from './diorama-3d.js';

i18n.register({
  'lab.obj': { en: 'Learning objective', hi: 'सीखने का उद्देश्य' },
  'lab.try': { en: 'Try this (guided discovery)', hi: 'यह आज़माएँ (निर्देशित खोज)' },
  'lab.live': { en: 'What is happening now', hi: 'अभी क्या हो रहा है' },
  'lab.controls': { en: 'Play & adjust', hi: 'चलाएँ व बदलें' },
  'lab.note.fictional': { en: 'Fictional numbers for teaching, not real observations.', hi: 'ये शिक्षण के लिए काल्पनिक संख्याएँ हैं, वास्तविक प्रेक्षण नहीं।' },
  'lab.note.schematic': { en: 'Schematic model: shows how the process works, not exact measurements.', hi: 'योजनाबद्ध मॉडल: प्रक्रिया कैसे काम करती है यह दिखाता है, सटीक माप नहीं।' },
  'lab.note.documented': { en: 'Based on documented science or evidence; values are rounded for teaching.', hi: 'प्रलेखित विज्ञान या साक्ष्य पर आधारित; मान शिक्षण के लिए पूर्णांकित हैं।' },
  'lab.note.reconstruction': { en: 'A reconstruction: historians infer this from evidence and may disagree.', hi: 'यह पुनर्निर्माण है: इतिहासकार इसे साक्ष्य से अनुमानित करते हैं और उनमें मतभेद हो सकता है।' },
});

export function renderPlateHtml(plate, activeIdx = -1) {
  if (!plate?.src) return '';
  const spots = Array.isArray(plate.spots) ? plate.spots : [];
  const active = activeIdx >= 0 && activeIdx < spots.length ? spots[activeIdx] : null;
  const spotsHtml = spots.map((sp, i) => (
    `<button type="button" class="plate-spot" data-spot="${i}" aria-pressed="${activeIdx === i ? 'true' : 'false'}" style="left:${sp.x}%;top:${sp.y}%" title="${esc(i18n.pair(sp.en, sp.hi))}" aria-label="${esc(i18n.pair(sp.en, sp.hi))}">${i + 1}</button>`
  )).join('');
  const calloutHtml = spots.length
    ? `<div class="plate-callout${active ? ' active' : ''}">${active
      ? `<strong>${activeIdx + 1}. ${biHtml({ en: active.en, hi: active.hi }, { block: false })}:</strong> ${biHtml(active.detail || { en: active.en, hi: active.hi }, { block: false })}`
      : `<span data-k="plate.tapHint">${esc(t('plate.tapHint'))}</span>`}</div>`
    : '';
  return `<figure class="lab-plate"><div class="plate-stage"><img src="${esc(plate.src)}" alt="${esc(i18n.pair(plate.en, plate.hi))}" loading="eager" decoding="async">${spotsHtml}</div>${calloutHtml}<figcaption class="lab-plate-cap">${biHtml({ en: plate.en, hi: plate.hi }, { block: false })}</figcaption></figure>`;
}

export function createInteractivePlate(getPlate, onSet) {
  const wrap = h('div', { class: 'plate-wrap' });
  let activeIdx = -1;
  function update() {
    const p = typeof getPlate === 'function' ? getPlate() : getPlate;
    if (!p?.src) { wrap.innerHTML = ''; return; }
    if (activeIdx >= (p.spots?.length || 0)) activeIdx = -1;
    wrap.innerHTML = renderPlateHtml(p, activeIdx);
    wrap.querySelectorAll('[data-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playTap();
        const idx = Number(btn.dataset.spot);
        activeIdx = idx;
        const sp = p.spots?.[idx];
        if (sp?.set) onSet?.(sp.set);
        update();
      });
    });
  }
  update();
  return { el: wrap, update, relabel: update, reset() { activeIdx = -1; update(); } };
}

export function createLab(spec, themeId, { onDraw, skipAuto3d = false } = {}) {
  const S = store.simState(spec.id, spec.init());
  const base = spec.init(); for (const k of Object.keys(base)) if (!(k in S)) S[k] = base[k];
  S.done ??= {};
  const prog = store.progress(themeId);
  prog.exit ??= {}; prog.reflect ??= {};
  const persist = () => store.saveSim();
  const dict = {};
  const widgets = {};
  let demoTimer = 0;
  let activeSpotIdx = -1;
  let lastPlate = null;

  const chartBox = h('div', { class: 'chart-box lab-graphic', 'aria-live': 'off' });
  const read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
  const side = h('div', { class: 'lab-side' }, h('h3', { 'data-k': 'lab.controls' }, t('lab.controls')));

  for (const c of spec.controls) {
    const key = `${spec.id}.c.${c.id}`; dict[key] = c.label;
    if (c.hint) dict[`${key}.hint`] = c.hint;
    for (const o of c.options ?? []) dict[`${key}.${o.id}`] = o;
  }
  i18n.register(dict);
  for (const c of spec.controls) {
    const key = `${spec.id}.c.${c.id}`;
    if (c.type === 'slider') {
      widgets[c.id] = slider({ id: `${spec.id}-${c.id}`.replace(/\./g, '-'), labelKey: key, min: c.min, max: c.max, step: c.step ?? 1, value: S[c.id], format: c.fmt ?? String, hintKey: c.hint ? `${key}.hint` : undefined, onInput: (v) => { S[c.id] = v; draw(); } });
    } else if (c.type === 'chips') {
      widgets[c.id] = chips({ name: `${spec.id}-${c.id}`, value: S[c.id], options: c.options.map((o) => ({ id: o.id, key: `${key}.${o.id}` })), onSelect: (v) => { S[c.id] = v; draw(); } });
      side.append(h('div', { class: 'ctl-row ctl-label', 'data-k': key }, t(key)));
    } else if (c.type === 'toggle') {
      widgets[c.id] = toggle({ id: `${spec.id}-${c.id}`.replace(/\./g, '-'), labelKey: key, checked: S[c.id], onChange: (v) => { S[c.id] = v; draw(); } });
    }
    side.append(widgets[c.id].root);
  }

  function sync() {
    for (const c of spec.controls) {
      const w = widgets[c.id];
      if (!w) continue;
      if (c.type === 'chips') w.select(S[c.id]);
      else w.set(S[c.id]);
    }
    draw();
  }
  function stopDemo() { if (demoTimer) { clearInterval(demoTimer); demoTimer = 0; demoBtn.dataset.k = 'lab.playDemo'; demoBtn.textContent = t('lab.playDemo'); demoBtn.setAttribute('aria-pressed', 'false'); } }
  function reset() { stopDemo(); activeSpotIdx = -1; Object.assign(S, spec.init()); S.done = S.done ?? {}; sync(); }

  chartBox.addEventListener('click', (e) => {
    const spotBtn = e.target.closest?.('[data-spot]');
    if (spotBtn && lastPlate?.spots) {
      playTap();
      const idx = Number(spotBtn.dataset.spot);
      activeSpotIdx = idx;
      const sp = lastPlate.spots[idx];
      if (sp?.set) { Object.assign(S, sp.set); sync(); }
      else draw();
      return;
    }
    const svgTarget = e.target.closest?.('[data-set]');
    if (svgTarget) {
      try {
        const patch = JSON.parse(svgTarget.getAttribute('data-set'));
        playTap();
        Object.assign(S, patch);
        sync();
      } catch {}
    }
  });

  function draw() {
    persist();
    const v = spec.view(S);
    lastPlate = v.plate || null;
    if (activeSpotIdx >= (lastPlate?.spots?.length || 0)) activeSpotIdx = -1;
    const plateHtml = renderPlateHtml(v.plate, activeSpotIdx);
    chartBox.innerHTML = plateHtml + v.svg;
    chartBox.querySelectorAll('svg[role="img"]').forEach((svg) => { if (v.aria && !svg.getAttribute('aria-label')) svg.setAttribute('aria-label', v.aria); });
    read.innerHTML = v.lines.map((l) => `<div class="ro-line ${l.cls ?? ''}">${biHtml(l, { block: true })}</div>`).join('');
    onDraw?.(S);
  }

  // Auto-play demo button: gently cycles the first slider or chip so passive exploration comes alive
  const demoBtn = h('button', {
    type: 'button',
    class: 'btn ghost demo-btn',
    'data-k': 'lab.playDemo',
    'aria-pressed': 'false',
    onclick: () => {
      playTap();
      if (demoTimer) { stopDemo(); return; }
      const primary = spec.controls.find((c) => c.type === 'slider') || spec.controls[0];
      if (!primary) return;
      demoBtn.dataset.k = 'lab.pauseDemo';
      demoBtn.textContent = t('lab.pauseDemo');
      demoBtn.setAttribute('aria-pressed', 'true');
      let dir = 1;
      demoTimer = setInterval(() => {
        if (primary.type === 'slider') {
          const step = (primary.max - primary.min) / 14;
          let nv = S[primary.id] + step * dir;
          if (nv >= primary.max) { nv = primary.max; dir = -1; }
          else if (nv <= primary.min) { nv = primary.min; dir = 1; }
          const snap = primary.step ? Math.round(nv / primary.step) * primary.step : nv;
          S[primary.id] = Math.max(primary.min, Math.min(primary.max, snap));
        } else if (primary.type === 'chips') {
          const idx = primary.options.findIndex((o) => o.id === S[primary.id]);
          S[primary.id] = primary.options[(idx + 1) % primary.options.length].id;
        } else if (primary.type === 'toggle') {
          S[primary.id] = !S[primary.id];
        }
        sync();
      }, 950);
    },
  }, t('lab.playDemo'));

  const noteKey = `lab.note.${spec.note?.kind ?? 'schematic'}`;
  const note = h('p', { class: `note lab-note ${spec.note?.kind ?? 'schematic'}` }, h('strong', { 'data-k': noteKey }, t(noteKey)), spec.note?.en ? ' ' : null, spec.note?.en ? bi({ en: spec.note.en, hi: spec.note.hi }, { tag: 'span' }) : null);
  const objFold = h('details', { class: 'goal-pill' },
    h('summary', { 'data-k': 'lab.goalBtn' }, t('lab.goalBtn')),
    h('div', { class: 'goal-body' },
      h('section', { class: 'objective' }, h('h3', { 'data-k': 'lab.obj' }, t('lab.obj')), bi(spec.objective, { tag: 'p', cls: 'lead' })),
      note));

  const discover = spec.discover?.length ? h('div', { class: 'dock-panel' }, h('ol', { class: 'try' }, ...spec.discover.map((d) => h('li', {}, bi(d, { tag: 'span' }))))) : null;
  const preds = (spec.predictions ?? []).map((p) => predict({ ...p, run: () => { const r = p.run(S); sync(); return r; }, explain: () => p.explain(S) }, { done: S.done, onDone: persist }));
  const predBox = preds.length ? h('div', { class: 'dock-panel' }, ...preds) : null;
  const exitEls = (spec.exit ?? []).map((q) => mcq(q, { done: S.done, onDone: (id, v) => { prog.exit[`${spec.id}.${id}`] = v; store.saveProgress(); persist(); } }));
  const ta = h('textarea', { class: 'reflect', rows: 3, 'data-k-aria': 'reflect.aria', placeholder: t('reflect.ph') }); ta.value = prog.reflect[spec.id] || '';
  ta.addEventListener('input', () => { prog.reflect[spec.id] = ta.value; store.saveProgress(); });
  const exitBox = exitEls.length ? h('div', { class: 'dock-panel' }, ...exitEls.map((e) => h('div', { class: 'exit-q' }, e))) : null;
  const noteBox = spec.reflect ? h('div', { class: 'dock-panel' }, bi(spec.reflect, { tag: 'p', cls: 'note' }), ta, h('p', { class: 'note', 'data-k': 'reflect.local' }, t('reflect.local'))) : null;

  const dockList = [];
  if (predBox) dockList.push({ id: 'predict', key: 'lab.dock.predict', el: predBox });
  if (discover) dockList.push({ id: 'try', key: 'lab.dock.try', el: discover });
  if (exitBox) dockList.push({ id: 'quiz', key: 'lab.dock.quiz', el: exitBox });
  if (noteBox) dockList.push({ id: 'reflect', key: 'lab.dock.note', el: noteBox });
  const dock = dockList.length ? mkTabs({ active: dockList[0].id, tabs: dockList }) : null;

  side.append(h('div', { class: 'row' }, demoBtn, button('btn.reset', reset, 'btn')));
  const el = h('div', { class: 'lab', id: `lab-${spec.id.replace(/\./g, '-')}` },
    objFold,
    h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, chartBox, h('h3', { class: 'sr-only', 'data-k': 'lab.live' }, t('lab.live')), read), side),
    dock ? h('section', { class: 'lab-dock' }, dock.root) : null);

  let auto3d = null;
  if (!skipAuto3d) {
    const builder = createTheme3d(themeId);
    if (builder) {
      auto3d = attachThreeStage(el, () => S, builder, { themeId });
      const prevOnDraw = onDraw;
      onDraw = (st) => { prevOnDraw?.(st); auto3d?.update(st); };
    }
  }
  draw();
  i18n.apply(el);

  return {
    el, state: S, reset, draw,
    enable3d: () => auto3d?.enable?.(),
    disable3d: () => auto3d?.disable?.(),
    relabel() { preds.forEach((p) => p.relabel()); exitEls.forEach((q) => q.relabel()); relabelBi(el); i18n.apply(el); ta.placeholder = t('reflect.ph'); auto3d?.relabel?.(); draw(); },
    destroy() { stopDemo(); auto3d?.destroy?.(); },
    debug: () => ({ state: { ...S }, view: spec.view(S) }),
  };
}

/** Tabbed module made of several labs; attaches lazy single-context 3D Diorama switching across tabs. */
export function mountLabs(root, themeId, defs, tabs) {
  const labs = defs.map((d) => createLab(d, themeId));
  const dict = {}; defs.forEach((d, i) => { dict[`${themeId}.tab.${d.id}`] = tabs[i]; }); i18n.register(dict);
  const ui = store.simState(`${themeId}.ui`, { tab: defs[0].id.replace(/\./g, '-') });
  const sync3dTab = (tabId) => {
    labs.forEach((l, idx) => {
      if (defs[idx].id.replace(/\./g, '-') === tabId) l.enable3d?.();
      else l.disable3d?.();
    });
  };
  const tb = mkTabs({
    active: ui.tab,
    onChange: (id) => { ui.tab = id; store.saveSim(); sync3dTab(id); },
    tabs: defs.map((d, i) => ({ id: d.id.replace(/\./g, '-'), key: `${themeId}.tab.${d.id}`, el: labs[i].el })),
  });
  root.append(tb.root); i18n.apply(root);
  sync3dTab(ui.tab);
  return {
    relabel() { labs.forEach((l) => l.relabel()); i18n.apply(root); },
    destroy() { labs.forEach((l) => l.destroy?.()); },
    debug: () => Object.fromEntries(labs.map((l, i) => [defs[i].id, l.debug()])),
  };
}
export { esc };
