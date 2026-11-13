// Shared Three.js diorama toolkit for Hero Globe and theme 3D stages.
import * as i18n from '../../core/i18n.js';

export function makeToolkit(api, labelHost) {
  const { THREE, scene } = api;
  const group = new THREE.Group();
  scene.add(group);
  let labels = [];
  let animated = [];

  const clear = () => {
    api.clearPickables?.();
    animated = [];
    for (const c of [...group.children]) {
      group.remove(c);
      c.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
    }
    if (labelHost) labelHost.replaceChildren();
    labels = [];
  };

  const mat = (color, { rough = 0.72, metal = 0.08, ...rest } = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...rest });
  const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; };
  const cyl = (rt, rb, h, seg, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); return o; };
  const cone = (r, h, seg, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), m); o.position.set(x, y, z); return o; };
  const sph = (r, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), m); o.position.set(x, y, z); return o; };

  function addTree(x, y, z, s = 1, col = 0x2e7d32) {
    const g = new THREE.Group();
    g.add(cyl(0.11 * s, 0.16 * s, 0.8 * s, 8, mat(0x6d4c41), 0, 0.4 * s, 0));
    g.add(sph(0.55 * s, mat(col), 0, 1.05 * s, 0));
    g.add(sph(0.42 * s, mat(col + 0x0a140a), 0.25 * s, 0.9 * s, 0.12 * s));
    g.position.set(x, y, z);
    group.add(g);
    return g;
  }

  function addHouse(x, y, z, wallCol = 0xebd4b0, roofCol = 0xb8522d, s = 1, glow = false) {
    const g = new THREE.Group();
    const w = box(1.0 * s, 0.75 * s, 0.9 * s, mat(wallCol, glow ? { emissive: 0xffb74d, emissiveIntensity: 0.45 } : {}), 0, 0.375 * s, 0);
    const r = cone(0.82 * s, 0.52 * s, 4, mat(roofCol), 0, 1.0 * s, 0);
    r.rotation.y = Math.PI / 4;
    g.add(w, r);
    g.position.set(x, y, z);
    group.add(g);
    return g;
  }

  function addLabel(v, en, hi) {
    if (!labelHost) return;
    const el = document.createElement('span');
    el.className = 'gl-lbl';
    el.textContent = i18n.pair(en, hi);
    labelHost.append(el);
    labels.push({ v, el, en, hi });
  }

  function place(showLabels = true) {
    for (const l of labels) {
      const q = api.project(l.v);
      l.el.style.transform = `translate(${q.x.toFixed(0)}px,${q.y.toFixed(0)}px) translate(-50%,-50%)`;
      l.el.hidden = !showLabels || !q.visible;
    }
  }
  const relabel = () => labels.forEach((l) => { l.el.textContent = i18n.pair(l.en, l.hi); });
  const pick = (mesh, en, hi, extra = {}) => api.markPickable?.(mesh, { en, hi, ...extra });

  function addPlinth(topCol = 0x6ba368, rimCol = 0x6e533e, w = 15, d = 10) {
    group.add(box(w, 0.9, d, mat(rimCol, { rough: 0.92 }), 0, -2.55, 0));
    group.add(box(w - 0.3, 0.25, d - 0.3, mat(topCol, { rough: 0.88 }), 0, -2.0, 0));
  }

  return {
    THREE, scene, group, clear, mat, box, cyl, cone, sph, addTree, addHouse, addLabel, addPlinth,
    place, relabel, pick, animated,
    tick(now) {
      for (const a of animated) a.fn(now * 0.001);
      if (animated.length) api.invalidate();
    },
    dispose() { clear(); scene.remove(group); },
  };
}

export function wrapDioramaBuilder(fn) {
  return (api, labelHost) => {
    const tk = makeToolkit(api, labelHost);
    let lastSig = '';
    return {
      update(S = {}) {
        const sig = JSON.stringify(S);
        if (sig === lastSig) return;
        lastSig = sig;
        tk.clear();
        fn(tk, S);
        if (tk.animated.length) api.setPlaying(true);
        api.invalidate();
      },
      place: tk.place,
      relabel: tk.relabel,
      tick: tk.tick,
      dispose: tk.dispose,
    };
  };
}
