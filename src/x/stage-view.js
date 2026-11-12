// A framed 3D viewer for one or more declarative scenes: scene and layer switchers, legend, fullscreen, and a text
// alternative when WebGL is unavailable or Low graphics is on. The WebGL context exists only while the view is mounted.
import { h } from '../core/dom.js';
import { pair } from '../core/i18n.js';
import * as store from '../core/store.js';
import { webglAvailable } from '../engines/webgl.js';
import { loadGeoAll } from '../engines/viz.js';
import { icon } from './icons.js';

const BUILD = {
  globe: () => import('./scenes/globe.js'), india: () => import('./scenes/india.js'),
  towers: () => import('./scenes/towers.js'), diorama: () => import('./scenes/diorama.js'),
};
const S = {
  hint: { en: 'Drag to rotate · scroll or pinch to zoom · hover for details', hi: 'घुमाने के लिए खींचें · ज़ूम के लिए स्क्रॉल या पिंच · विवरण के लिए ऊपर ले जाएँ' },
  loading: { en: 'Loading 3D scene…', hi: '3D दृश्य लोड हो रहा है…' },
  off: { en: '3D view is off (Low graphics is on or this device has no WebGL). The same information is listed below.', hi: '3D दृश्य बंद है (कम ग्राफ़िक्स चालू है या इस उपकरण में WebGL नहीं है)। वही जानकारी नीचे सूचीबद्ध है।' },
  full: { en: 'Full screen', hi: 'पूर्ण स्क्रीन' }, spin: { en: 'Auto-rotate', hi: 'स्वतः घुमाव' },
};
const T = (o) => pair(o.en, o.hi);
const layersOf = (sc) => sc.layers || sc.series || null;

export function stageView(scenes, { compact = false, chrome = true } = {}) {
  const host = h('div', { class: 'stage-host' });
  const top = h('div', { class: 'stage-ui stage-top' }), bottom = h('div', { class: 'stage-ui stage-bottom' });
  const status = h('p', { class: 'stage-status', 'aria-live': 'polite' });
  const el = h('div', { class: `stage${compact ? ' compact' : ''}` }, host, top, bottom, status);
  let stage = null, built = null, si = 0, li = 0, token = 0, dead = false;

  const chip = (label, on, fn, cls = '') => h('button', { type: 'button', class: `schip ${cls}`, 'aria-pressed': on ? 'true' : 'false', onclick: fn }, label);
  function legend(sc) {
    const L = layersOf(sc)?.[li] || sc, items = L.groups || [];
    return items.length ? h('ul', { class: 'stage-legend' }, ...items.map((g) => h('li', {}, h('i', { style: `background:${g.color}` }), T(g)))) : null;
  }
  function ui() {
    const sc = scenes[si], ls = layersOf(sc);
    top.replaceChildren(...[
      scenes.length > 1 ? h('div', { class: 'schips', role: 'group' }, ...scenes.map((s, i) => chip(T(s.t), i === si, () => { if (i !== si) { si = i; li = 0; start(); } }, 'scene'))) : (chrome && sc.t ? h('span', { class: 'stage-title' }, icon('Box', { size: 15 }), ' ', T(sc.t)) : null),
      chrome && stage ? h('div', { class: 'stage-tools' },
        h('button', { type: 'button', class: 'sbtn', title: T(S.spin), 'aria-label': T(S.spin), 'aria-pressed': stage.controls.autoRotate ? 'true' : 'false', onclick: (e) => { stage.controls.autoRotate = !stage.controls.autoRotate; e.currentTarget.setAttribute('aria-pressed', stage.controls.autoRotate ? 'true' : 'false'); } }, icon('Rotate3d', { size: 17 })),
        el.requestFullscreen ? h('button', { type: 'button', class: 'sbtn', title: T(S.full), 'aria-label': T(S.full), onclick: () => (document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen()) }, icon('Maximize', { size: 17 })) : null) : null,
    ].filter(Boolean));
    bottom.replaceChildren(...[
      ls && ls.length > 1 ? h('div', { class: 'schips', role: 'group' }, ...ls.map((l, i) => chip(T(l), i === li, () => { li = i; built?.setLayer(i); ui(); }))) : null,
      legend(sc),
      stage && chrome ? h('span', { class: 'stage-hint' }, icon('MousePointerClick', { size: 14 }), ' ', T(S.hint)) : null,
    ].filter(Boolean));
  }
  // Text alternative: everything a scene shows, as a list.
  function fallback() {
    const sc = scenes[si], ls = layersOf(sc) || [sc];
    const rows = sc.kind === 'towers'
      ? sc.series.map((s) => h('li', {}, h('b', {}, T(s)), ': ', sc.cats.map((c, i) => `${T(c)} ${s.values[i]}${s.suffix || ''}`).join(' · ')))
      : sc.levels ? sc.levels.map((l) => h('li', {}, h('b', {}, T(l)), l.items?.length ? ': ' + l.items.map(T).join(' · ') : ''))
        : ls.map((l) => h('li', {}, l.en ? h('b', {}, T(l)) : null, l.en ? ': ' : '', [...(l.groups || []).map((g) => `${T(g)} (${g.states.join(', ')})`), ...(l.points || []).map(T)].join(' · ')));
    host.replaceChildren(h('div', { class: 'stage-fallback' }, h('p', {}, T(S.off)), h('ul', {}, ...rows)));
  }
  async function start() {
    const my = ++token; stop(); ui();
    if (store.get().lowGraphics || !webglAvailable()) { el.classList.add('is-flat'); status.textContent = ''; fallback(); return; }
    el.classList.remove('is-flat'); host.replaceChildren(); status.textContent = T(S.loading);
    try {
      const sc = scenes[si];
      const [{ createStage }, mod] = await Promise.all([import('../engines/stage.js'), BUILD[sc.kind](), sc.kind === 'globe' || sc.kind === 'india' ? loadGeoAll() : null]);
      if (my !== token || dead) return;
      const st = await createStage(host, { reducedMotion: store.get().reducedMotion, lift: chrome ? 0.08 : 0 });
      if (my !== token || dead) { st.dispose(); return; }
      stage = st; built = mod.build(stage, sc); if (li) built.setLayer(li);
      status.textContent = ''; ui();
    } catch (e) { console.warn('3D stage failed', e); if (my === token) { stop(); el.classList.add('is-flat'); status.textContent = ''; fallback(); } }
  }
  function stop() { built?.dispose?.(); built = null; stage?.dispose(); stage = null; }
  const off = store.subscribe((_s, keys) => { if (keys.includes('lowGraphics') || keys.includes('reducedMotion')) start(); });
  start();
  return {
    el,
    relabel() { stage?.relabel(); ui(); if (!stage) { if (el.classList.contains('is-flat')) fallback(); } },
    destroy() { dead = true; token++; off(); stop(); },
    debug: () => ({ scene: si, layer: li, live: !!stage }),
  };
}
