// T12.L2 3D Indian Hill Fort Cutaway (Plateau, Bastioned Ramparts, Bent Gateway, Water Cisterns, Granary).
import * as i18n from '../../core/i18n.js';

export function createFort3d(api, labelHost) {
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

    const hillMat = new THREE.MeshStandardMaterial({ color: 0x6b5c4d, roughness: 0.95 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xc29363, roughness: 0.85 });
    const darkStone = new THREE.MeshStandardMaterial({ color: 0x8a613b, roughness: 0.88 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x2a8cb5, roughness: 0.25 });

    // Rocky hill plateau
    const hill = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 8.2, 2.6, 8), hillMat);
    hill.position.set(0, -1.7, 0);
    group.add(hill);

    // Outer fort rampart walls
    const wallSpecs = [[0, 4.4, 9.6, 0.55], [0, -4.4, 9.6, 0.55], [-4.8, 0, 0.55, 8.8], [4.8, 0, 0.55, 8.8]];
    for (const [x, z, w, d] of wallSpecs) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.4, d), stoneMat);
      m.position.set(x, 0.25, z);
      group.add(m);
    }

    // Inner double wall if enabled
    if (S.doubleWall) {
      for (const [x, z, w, d] of [[0, 2.8, 5.8, 0.4], [0, -2.8, 5.8, 0.4], [-2.9, 0, 0.4, 5.6], [2.9, 0, 0.4, 5.6]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.7, d), darkStone);
        m.position.set(x, 0.4, z);
        group.add(m);
      }
    }

    // Round corner & flank bastions (burj)
    const bCount = Math.min(8, Math.max(2, S.bastions));
    for (let i = 0; i < bCount; i++) {
      const ang = (i / bCount) * Math.PI * 2;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 1.85, 14), darkStone);
      b.position.set(Math.cos(ang) * 4.8, 0.45, Math.sin(ang) * 4.4);
      group.add(b);
    }

    // Bent defensive gate (hatipol)
    if (S.bentGate) {
      const baffle = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.45), darkStone);
      baffle.position.set(0, 0.25, 5.3);
      group.add(baffle);
      api.markPickable?.(baffle, { en: 'Bent Gateway (Hatipol Defence)', hi: 'टेढ़ा मुख्य द्वार (हाथीपोल सुरक्षा)' });
      addLabel(new THREE.Vector3(0, 1.4, 5.3), 'Bent defensive gate', 'टेढ़ा मुख्य द्वार');
    }

    // Water cisterns / baoris inside fort
    for (let i = 0; i < S.cisterns; i++) {
      const pool = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.1), waterMat);
      pool.position.set(-1.6 + i * 1.3, -0.32, 1.3);
      group.add(pool);
      api.markPickable?.(pool, { en: 'Rain-Fed Rock Cistern', hi: 'चट्टानी वर्षा जल कुंड' });
    }

    // Palace / Granary hall
    const hall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 1.8), stoneMat);
    hall.position.set(0, 0.2, -1.1);
    group.add(hall);
    api.markPickable?.(hall, { en: 'Citadel Darbar & Granary', hi: 'मुख्य गढ़ व अन्नागार' });

    addLabel(new THREE.Vector3(4.8, 1.6, 0), 'Bastioned ramparts', 'बुर्ज व प्राचीर');
    addLabel(new THREE.Vector3(0, 0.5, 1.3), 'Rock-cut water tanks', 'वर्षा जल कुंड');
    addLabel(new THREE.Vector3(0, 1.3, -1.1), 'Citadel & granary', 'मुख्य गढ़ व अन्नागार');
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
