// T10.L1 3D Ocean-Floor Cutaway & Relief Builder (Continental Shelf, Slope, Abyssal Plain, Mid-Ocean Ridge, Trench).
import * as i18n from '../../core/i18n.js';
import { oceanProfile } from '../../engines/domain/ocean.js';

export function createOcean3d(api, labelHost) {
  const { THREE, scene } = api;
  const group = new THREE.Group();
  scene.add(group);
  let labels = [];

  const clear = () => {
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

    const pts = oceanProfile({ shelfKm: S.shelfKm, trenchDepthM: S.trenchDepth, ridgeHeightM: S.ridgeHeight });
    const toX = (x) => (x / 100) * 16 - 8;
    const toY = (d) => 2.2 - (d / 10000) * 5.2;

    const shape = new THREE.Shape();
    shape.moveTo(-8, -3.5);
    shape.lineTo(-8, 2.5);
    pts.forEach((p) => shape.lineTo(toX(p.x), toY(p.depthM)));
    shape.lineTo(8, -3.5);
    shape.closePath();

    const crustGeo = new THREE.ExtrudeGeometry(shape, { depth: 7.5, bevelEnabled: false });
    crustGeo.translate(0, 0, -3.75);
    group.add(new THREE.Mesh(crustGeo, new THREE.MeshStandardMaterial({ color: 0x6f5845, roughness: 0.9 })));

    // Translucent ocean slab above seafloor
    const sea = new THREE.Mesh(new THREE.BoxGeometry(16, 4.6, 7.5), new THREE.MeshStandardMaterial({
      color: 0x1b7fa8, transparent: true, opacity: S.waterOpaque ? 0.58 : 0.25, depthWrite: false,
    }));
    sea.position.set(0, -0.05, 0);
    group.add(sea);

    // Glowing rift magma marker on Mid-Ocean Ridge
    const riftY = toY(Math.max(500, 3900 - S.ridgeHeight));
    const rift = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 7.6), new THREE.MeshBasicMaterial({ color: 0xff5a1f }));
    rift.position.set(toX(52), riftY, 0);
    group.add(rift);

    addLabel(new THREE.Vector3(-6.2, 2.3, 1), 'Continental shelf', 'महाद्वीपीय मग्नतट');
    addLabel(new THREE.Vector3(-4.0, 0.6, 1), 'Continental slope', 'महाद्वीपीय ढाल');
    addLabel(new THREE.Vector3(-1.4, -0.1, 1), 'Abyssal plain', 'गहन सागरीय मैदान');
    addLabel(new THREE.Vector3(toX(52), riftY + 0.6, 0), 'Mid-ocean ridge', 'मध्य-महासागरीय कटक');
    addLabel(new THREE.Vector3(toX(78), toY(S.trenchDepth) + 0.35, 1), 'Ocean trench', 'महासागरीय गर्त');
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
