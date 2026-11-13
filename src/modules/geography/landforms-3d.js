// T02.L5 3D Landform Gallery (River V-valley, Sea Cliff & Arch, Wind Barchan Dunes, Glacial U-valley, Karst Cavern).
import * as i18n from '../../core/i18n.js';

export function createLandform3d(api, labelHost) {
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
    el.dataset.bi = JSON.stringify({ en, hi });
    el.textContent = i18n.pair(en, hi);
    labelHost.append(el);
    labels.push({ v, el, en, hi });
  }

  function update(S) {
    clear();
    labelHost.replaceChildren();
    labels = [];
    const stage = S.stage ?? 0.5;
    const rockMat = new THREE.MeshStandardMaterial({ color: S.agent === 'wind' ? 0xd9b36c : S.agent === 'groundwater' ? 0xb5b2a8 : 0x8b7355, roughness: 0.9 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x4b8f4c, roughness: 0.9 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x2e8bc0, roughness: 0.25, transparent: true, opacity: 0.72 });
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xdff5ff, roughness: 0.35 });

    // Base plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 10), new THREE.MeshStandardMaterial({ color: 0x5c4738, roughness: 0.95 }));
    base.position.set(0, -3.2, 0);
    group.add(base);

    if (S.agent === 'river') {
      const cut = 1.0 + stage * 2.4;
      const shapeL = new THREE.Shape([new THREE.Vector2(-8, -2.6), new THREE.Vector2(-8, 2.2), new THREE.Vector2(-0.5 - stage * 1.4, 2.2 - cut), new THREE.Vector2(-0.2, -2.6)]);
      const shapeR = new THREE.Shape([new THREE.Vector2(8, -2.6), new THREE.Vector2(8, 2.2), new THREE.Vector2(0.5 + stage * 1.4, 2.2 - cut), new THREE.Vector2(0.2, -2.6)]);
      for (const sh of [shapeL, shapeR]) {
        const geo = new THREE.ExtrudeGeometry(sh, { depth: 10, bevelEnabled: false });
        geo.translate(0, 0, -5);
        group.add(new THREE.Mesh(geo, greenMat));
      }
      const stream = new THREE.Mesh(new THREE.BoxGeometry(1.1 + stage * 1.6, 0.4, 10.1), waterMat);
      stream.position.set(0, 2.1 - cut, 0);
      group.add(stream);
      api.markPickable?.(stream, { en: 'River Carving V-Valley', hi: 'V-आकार की घाटी काटती नदी' });
      addLabel(new THREE.Vector3(-4.5, 2.4, 0), 'Valley slope', 'घाटी ढलान');
      addLabel(new THREE.Vector3(0, 2.3 - cut, 3), 'River channel', 'नदी चैनल');
    } else if (S.agent === 'waves') {
      const notch = stage * 2.2;
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(7.5, 5.2, 10), rockMat);
      cliff.position.set(-4.2, -0.1, 0);
      group.add(cliff);
      const archPillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.2, 2.4), rockMat);
      archPillar.position.set(2.0 + stage * 1.5, -0.5, 0);
      group.add(archPillar);
      const sea = new THREE.Mesh(new THREE.BoxGeometry(16, 1.8, 10), waterMat);
      sea.position.set(0, -1.7, 0);
      group.add(sea);
      const beach = new THREE.Mesh(new THREE.BoxGeometry(3.5 + notch, 0.35, 9.8), new THREE.MeshStandardMaterial({ color: 0xe6cf93 }));
      beach.position.set(5.5, -2.4, 0);
      group.add(beach);
      addLabel(new THREE.Vector3(-4, 2.8, 0), 'Sea cliff', 'समुद्री भृगु');
      addLabel(new THREE.Vector3(2.0 + stage * 1.5, 1.9, 0), 'Sea stack', 'समुद्री स्तंभ');
      addLabel(new THREE.Vector3(5.5, -1.8, 2), 'Beach deposit', 'पुलिन निक्षेप');
    } else if (S.agent === 'wind') {
      const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 10), rockMat);
      floor.position.set(0, -2.4, 0);
      group.add(floor);
      for (let i = -1; i <= 1; i++) {
        const dune = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.5 + stage * 2.0, 20), rockMat);
        dune.scale.set(1.3, 1, 0.8);
        dune.position.set(i * 4.4, -1.5 + stage * 0.9, (i % 2) * 1.5);
        group.add(dune);
      }
      addLabel(new THREE.Vector3(0, 0.5 + stage * 1.5, 0), 'Barchan sand dune', 'बरखान बालू-टिब्बा');
    } else if (S.agent === 'glacier') {
      const shL = new THREE.Shape([new THREE.Vector2(-8, -2.6), new THREE.Vector2(-8, 2.6), new THREE.Vector2(-3.2, 2.4), new THREE.Vector2(-2.2, -1.8), new THREE.Vector2(-0.5, -2.6)]);
      const shR = new THREE.Shape([new THREE.Vector2(8, -2.6), new THREE.Vector2(8, 2.6), new THREE.Vector2(3.2, 2.4), new THREE.Vector2(2.2, -1.8), new THREE.Vector2(0.5, -2.6)]);
      for (const sh of [shL, shR]) {
        const geo = new THREE.ExtrudeGeometry(sh, { depth: 10, bevelEnabled: false });
        geo.translate(0, 0, -5);
        group.add(new THREE.Mesh(geo, rockMat));
      }
      const glacier = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9 + (1 - stage) * 1.8, 9.8), iceMat);
      glacier.position.set(0, -1.8 + (1 - stage) * 0.8, 0);
      group.add(glacier);
      const moraine = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 4.6, 12), rockMat);
      moraine.rotation.z = Math.PI / 2;
      moraine.position.set(0, -2.1, 4.4);
      group.add(moraine);
      addLabel(new THREE.Vector3(0, 0.5, 0), 'U-shaped glacier valley', 'U-आकार की हिमनद घाटी');
      addLabel(new THREE.Vector3(0, -1.2, 4.4), 'Terminal moraine', 'अंतिम हिमोढ़');
    } else {
      // groundwater / karst cave
      const block = new THREE.Mesh(new THREE.BoxGeometry(15, 4.2, 9), new THREE.MeshStandardMaterial({ color: 0xbcb8ad, roughness: 0.9, transparent: true, opacity: 0.65 }));
      block.position.set(0, -0.4, 0);
      group.add(block);
      const cavern = new THREE.Mesh(new THREE.SphereGeometry(1.5 + stage * 1.6, 18, 12), new THREE.MeshStandardMaterial({ color: 0x1a2634 }));
      cavern.scale.set(1.8, 0.8, 1.2);
      cavern.position.set(0, -0.8, 0);
      group.add(cavern);
      for (let i = -2; i <= 2; i++) {
        const st = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9 + stage * 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xe3dcc8 }));
        st.rotation.x = Math.PI;
        st.position.set(i * 1.0, 0.2, 0);
        group.add(st);
      }
      addLabel(new THREE.Vector3(0, 1.9, 0), 'Limestone sinkhole', 'चूना-पत्थर घोलरंध्र');
      addLabel(new THREE.Vector3(0, -0.8, 1.5), 'Cavern & stalactites', 'कंदरा व स्टैलेक्टाइट');
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
