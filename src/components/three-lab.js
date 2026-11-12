// Bridges any declarative lab-kit spec with an interactive Three.js 3D view + 2D SVG twin fallback.
import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import * as store from '../core/store.js';
import { button } from './widgets.js';
import { webglAvailable } from '../engines/webgl.js';
import { createScene } from '../engines/three-scene.js';
import { createLab } from './lab-kit.js';

export function createThreeLab(spec, themeId, create3dView, { ariaKey = 'pb.gl.aria' } = {}) {
  const glHost = h('div', { class: 'gl-host', 'aria-label': t(ariaKey), 'data-k-aria': ariaKey });
  const glLabels = h('div', { class: 'gl-labels', 'aria-hidden': 'true' });
  const view3d = h('div', { class: 'view3d', hidden: true }, glHost, glLabels);
  const modeNote = h('p', { class: 'note' });
  let api = null, view3dObj = null, destroyed = false;

  const presets = h('div', { class: 'row' }, ...['overview', 'close', 'section', 'top'].map((p) => button(`pb.cam.${p}`, () => api?.preset(p), 'btn ghost')));
  presets.hidden = true;

  const lab = createLab(spec, themeId, {
    onDraw: (S) => { if (view3dObj && api) view3dObj.update(S); },
  });

  const mainCol = lab.el.querySelector('.lab-main');
  const graphic = lab.el.querySelector('.lab-graphic');
  mainCol.insertBefore(view3d, graphic);
  mainCol.insertBefore(presets, graphic);
  mainCol.insertBefore(modeNote, graphic.nextSibling);

  const lowG = () => store.get().lowGraphics || !webglAvailable();

  async function enable() {
    if (destroyed) return;
    if (lowG()) {
      disable();
      modeNote.dataset.k = 'pb.mode.2d';
      modeNote.textContent = t('pb.mode.2d');
      return;
    }
    if (api) { view3dObj?.update(lab.state); return; }
    view3d.hidden = false;
    modeNote.dataset.k = 'pb.mode.load';
    modeNote.textContent = t('pb.mode.load');
    try {
      api = await createScene(glHost, {
        lowGraphics: store.get().lowGraphics,
        reducedMotion: store.get().reducedMotion,
        onAfterRender: () => view3dObj?.place?.(true),
      });
      if (destroyed) { api.dispose(); api = null; return; }
      view3dObj = create3dView(api, glLabels);
      view3dObj.update(lab.state);
      presets.hidden = false;
      modeNote.dataset.k = 'pb.mode.3d';
      modeNote.textContent = t('pb.mode.3d');
    } catch {
      api = null; view3dObj = null; view3d.hidden = true; presets.hidden = true;
      modeNote.dataset.k = 'pb.mode.2d';
      modeNote.textContent = t('pb.mode.2d');
    }
  }

  function disable() {
    if (!api) return;
    view3dObj?.dispose?.();
    api.dispose();
    api = null; view3dObj = null;
    glHost.replaceChildren(); glLabels.replaceChildren();
    view3d.hidden = true; presets.hidden = true;
  }

  const offStore = store.subscribe((_s, keys) => {
    if (keys.includes('lowGraphics')) { disable(); if (!destroyed && !view3d.closest('.tabpanel')?.hidden) enable(); }
  });

  return {
    ...lab,
    enable,
    disable,
    relabel() { lab.relabel(); view3dObj?.relabel?.(); modeNote.textContent = t(modeNote.dataset.k || 'pb.mode.2d'); },
    destroy() { destroyed = true; offStore(); disable(); },
  };
}
