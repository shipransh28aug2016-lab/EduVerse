// Bridges any declarative lab-kit spec with an interactive Three.js 3D diorama + 2D SVG/plate visual twin.
import { h } from '../core/dom.js';
import { t, pair } from '../core/i18n.js';
import * as store from '../core/store.js';
import { playTap } from '../core/sound.js';
import { button } from './widgets.js';
import { webglAvailable } from '../engines/webgl.js';
import { createScene } from '../engines/three-scene.js';
import { createLab } from './lab-kit.js';

export function attachThreeStage(labEl, getState, create3dView, { ariaKey = 'pb.gl.aria', insertBeforeEl } = {}) {
  const glHost = h('div', { class: 'gl-host', 'aria-label': t(ariaKey), 'data-k-aria': ariaKey });
  const glLabels = h('div', { class: 'gl-labels', 'aria-hidden': 'true' });
  const inspectPill = h('div', { class: 'gl-inspect', hidden: true });
  const view3d = h('div', { class: 'view3d', hidden: true }, glHost, glLabels, inspectPill);
  const modeNote = h('p', { class: 'note gl-mode-note' });
  let api = null, view3dObj = null, destroyed = false, lastPick = null;

  const spinBtn = h('button', {
    type: 'button',
    class: 'btn ghost',
    'data-k': 'pb.btn.spin',
    'aria-pressed': 'false',
    onclick: () => {
      playTap();
      if (!api) return;
      const next = !api.isAutoRotate();
      api.setAutoRotate(next);
      spinBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
    },
  }, t('pb.btn.spin'));

  const presets = h('div', { class: 'row gl-presets' },
    ...['overview', 'close', 'section', 'top'].map((p) => button(`pb.cam.${p}`, () => api?.preset(p), 'btn ghost')),
    spinBtn);
  presets.hidden = true;

  const mainCol = labEl.querySelector('.lab-main');
  const anchor = insertBeforeEl || labEl.querySelector('.lab-graphic');
  mainCol.insertBefore(view3d, anchor);
  mainCol.insertBefore(presets, anchor);
  mainCol.insertBefore(modeNote, anchor.nextSibling);

  const lowG = () => store.get().lowGraphics || !webglAvailable();

  function showInspect(info) {
    lastPick = info;
    if (!info) { inspectPill.hidden = true; return; }
    playTap();
    inspectPill.textContent = pair(info.en, info.hi);
    inspectPill.hidden = false;
  }

  async function enable() {
    if (destroyed) return;
    if (lowG()) {
      disable();
      modeNote.dataset.k = 'pb.mode.2d';
      modeNote.textContent = t('pb.mode.2d');
      return;
    }
    if (api) { view3dObj?.update(getState()); return; }
    view3d.hidden = false;
    modeNote.dataset.k = 'pb.mode.load';
    modeNote.textContent = t('pb.mode.load');
    try {
      api = await createScene(glHost, {
        lowGraphics: store.get().lowGraphics,
        reducedMotion: store.get().reducedMotion,
        onTick: (now) => view3dObj?.tick?.(now),
        onAfterRender: () => view3dObj?.place?.(true),
        onPick: showInspect,
      });
      if (destroyed) { api.dispose(); api = null; return; }
      view3dObj = create3dView(api, glLabels);
      view3dObj.update(getState());
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
    api = null; view3dObj = null; lastPick = null;
    glHost.replaceChildren(); glLabels.replaceChildren();
    inspectPill.hidden = true;
    view3d.hidden = true; presets.hidden = true;
  }

  const offStore = store.subscribe((_s, keys) => {
    if (keys.includes('lowGraphics')) {
      disable();
      if (!destroyed && !view3d.closest('.tabpanel')?.hidden) enable();
    }
  });

  return {
    enable,
    disable,
    update(S) { view3dObj?.update(S); },
    relabel() {
      view3dObj?.relabel?.();
      if (lastPick && !inspectPill.hidden) inspectPill.textContent = pair(lastPick.en, lastPick.hi);
      modeNote.textContent = t(modeNote.dataset.k || 'pb.mode.2d');
    },
    destroy() { destroyed = true; offStore(); disable(); },
  };
}

export function createThreeLab(spec, themeId, create3dView, opts = {}) {
  let stage3d = null;
  const lab = createLab(spec, themeId, {
    ...opts,
    skipAuto3d: true,
    onDraw: (S) => stage3d?.update(S),
  });
  stage3d = attachThreeStage(lab.el, () => lab.state, create3dView, opts);
  return {
    ...lab,
    enable: stage3d.enable,
    disable: stage3d.disable,
    relabel() { lab.relabel(); stage3d.relabel(); },
    destroy() { stage3d.destroy(); lab.destroy?.(); },
  };
}
