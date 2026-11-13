// T04.L4 3D Harappan Planned City Reconstruction (Citadel, Great Bath, Granary, Lower Town Grid, Covered Drains).
import * as i18n from '../../core/i18n.js';

export function createHarappan3d(api, labelHost) {
  const { THREE, scene } = api;
  const group = new THREE.Group();
  scene.add(group);
  let labels = [];

  const clear = () => {
    api.clearPickables?.();
    for (const c of [...group.children]) {
      group.remove(c);
      c.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
    }
  };

  function addLabel(v, en, hi) {
    const el = document.createElement('span');
    el.className = 'gl-lbl';
    el.textContent = i18n.pair(en, hi);
    labelHost.append(el);
    labels.push({ v, el, en, hi });
  }

  function update(S) {
    clear();
    labelHost.replaceChildren();
    labels = [];

    const brick = new THREE.MeshStandardMaterial({ color: 0xc27046, roughness: 0.9 });
    const darkBrick = new THREE.MeshStandardMaterial({ color: 0x9b5332, roughness: 0.92 });
    const earth = new THREE.MeshStandardMaterial({ color: 0xd9be8c, roughness: 0.95 });
    const water = new THREE.MeshStandardMaterial({ color: 0x2c8fb8, roughness: 0.25 });

    // Ground platform
    const ground = new THREE.Mesh(new THREE.BoxGeometry(17, 0.6, 12), earth);
    ground.position.set(0, -2.5, 0);
    group.add(ground);

    // Citadel raised mud-brick platform on the West (-x)
    const citadel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.6, 9.6), darkBrick);
    citadel.position.set(-4.8, -1.4, 0);
    group.add(citadel);

    if (S.greatBath) {
      const surround = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.5, 3.0), brick);
      surround.position.set(-4.8, -0.35, -1.8);
      group.add(surround);
      const pool = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 1.9), water);
      pool.position.set(-4.8, -0.1, -1.8);
      group.add(pool);
      api.markPickable?.(pool, { en: 'Great Bath (Bitumen-Sealed Pool)', hi: 'विशाल स्नानागार (जलरोधी कुंड)' });
      addLabel(new THREE.Vector3(-4.8, 0.8, -1.8), 'Great Bath (Citadel)', 'विशाल स्नानागार (दुर्ग)');
    }
    if (S.granary) {
      const gran = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 2.6), brick);
      gran.position.set(-4.8, 0.0, 2.2);
      group.add(gran);
      api.markPickable?.(gran, { en: 'State Granary Storage', hi: 'राज्य अन्नागार भंडार' });
      addLabel(new THREE.Vector3(-4.8, 1.1, 2.2), 'Great Granary', 'विशाल अन्नागार');
    }

    // Lower Town houses — arranged on neat right-angle grid if gridStreets is true
    const cols = 3, rows = 3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jx = S.gridStreets ? 0 : ((r * 3 + c) % 2 ? 0.55 : -0.45);
        const jz = S.gridStreets ? 0 : ((r + c) % 2 ? -0.4 : 0.45);
        const h = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.0 + ((r + c) % 2) * 0.4, 1.9), brick);
        h.position.set(0.8 + c * 2.8 + jx, -1.7, -3.3 + r * 3.3 + jz);
        group.add(h);
        if (c < (S.wells ?? 2)) {
          const well = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 12), darkBrick);
          well.position.set(0.8 + c * 2.8 + jx + 0.55, -1.95, -3.3 + r * 3.3 + jz + 0.65);
          group.add(well);
        }
      }
    }
    addLabel(new THREE.Vector3(3.6, -0.4, -3.2), 'Lower Town grid', 'निचला नगर ग्रिड');

    if (S.coveredDrains) {
      for (let r = 0; r < rows - 1; r++) {
        const drain = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.16, 0.35), new THREE.MeshStandardMaterial({ color: 0x4b5563 }));
        drain.position.set(3.6, -2.12, -1.65 + r * 3.3);
        group.add(drain);
      }
      addLabel(new THREE.Vector3(4.0, -1.4, 1.6), 'Covered street drains', 'ढकी सड़क नालियाँ');
    }
    api.invalidate();
  }

  function place(showLabels) {
    for (const l of labels) {
      const q = api.project(l.v);
      l.el.style.transform = `translate(${q.x.toFixed(0)}px,${q.y.toFixed(0)}px) translate(-50%,-50%)`;
      l.el.hidden = !showLabels || !q.visible;
    }
  }
  const relabel = () => labels.forEach((l) => { l.el.textContent = i18n.pair(l.en, l.hi); });
  return { update, place, relabel, dispose() { clear(); scene.remove(group); } };
}
