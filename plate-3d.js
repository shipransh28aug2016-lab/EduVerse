// Builds / updates the three.js meshes for a plate-boundary profile. Geometry is rebuilt from profile() on every state change
// (a handful of extruded polygons, cheap) and old geometry is disposed immediately.
import { t } from '../../core/i18n.js';

const COL = { mantle: 0xe8691e, magma: 0xff5a1f, oceanic: 0x5b7fa6, continental: 0xb98c5a, continental2: 0xa57a4f, newcrust: 0x3b2f3a, water: 0x4aa3df };
const DEPTH = 6;

export function createPlateView(api, labelHost) {
  const { THREE, scene } = api;
  const group = new THREE.Group(); scene.add(group);
  const mats = {};
  const mat = (kind) => (mats[kind] ??= new THREE.MeshStandardMaterial({
    color: COL[kind] ?? 0x888888, roughness: 0.85, metalness: 0,
    emissive: kind === 'mantle' || kind === 'magma' ? 0xcc3300 : 0x000000, emissiveIntensity: kind === 'magma' ? 0.9 : kind === 'mantle' ? 0.45 : 0,
    transparent: kind === 'water', opacity: kind === 'water' ? 0.38 : 1, depthWrite: kind !== 'water',
  }));
  Object.keys(COL).forEach(mat);
  const clearGroup = () => { for (const c of [...group.children]) { group.remove(c); c.traverse((o) => o.geometry?.dispose?.()); } };
  let labels = [];
  const stressMat = new THREE.MeshBasicMaterial({ color: 0x2255ff });

  function arrow(dirVec, color, len = 1.6, y = 0) {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, len, 8), new THREE.MeshBasicMaterial({ color }));
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.5, 12), new THREE.MeshBasicMaterial({ color }));
    shaft.position.y = 0; head.position.y = len / 2 + 0.25; g.add(shaft, head);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirVec.clone().normalize());
    return g;
  }
  function update(p, { showLabels = true } = {}) {
    clearGroup();
    const plan = p.view === 'plan';
    for (const sh of p.shapes) {
      let shape;
      if (plan) { shape = new THREE.Shape(sh.pts.map(([a, b]) => new THREE.Vector2(a, -b))); }
      else shape = new THREE.Shape(sh.pts.map(([a, b]) => new THREE.Vector2(a, b)));
      const geo = new THREE.ExtrudeGeometry(shape, { depth: plan ? 1.2 : (sh.kind === 'water' ? DEPTH : DEPTH), bevelEnabled: false, steps: 1 });
      if (plan) { geo.rotateX(-Math.PI / 2); geo.translate(0, -1.2, 0); } else geo.translate(0, 0, -DEPTH / 2);
      const m = new THREE.Mesh(geo, mat(sh.kind)); if (sh.kind === 'water') m.renderOrder = 2; group.add(m);
    }
    if (plan) { // mantle slab under the plan-view plates + a boundary strip whose colour shows stress
      const mg = new THREE.Mesh(new THREE.BoxGeometry(17, 2.6, 8.4), mat('mantle')); mg.position.set(0, -2.5, 0); group.add(mg);
      const st = p.stress ?? 0; const col = new THREE.Color(0x2255ff).lerp(new THREE.Color(0xff2b1f), st);
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 8.2), new THREE.MeshBasicMaterial({ color: col })); strip.position.set(0, 0.07, 0); group.add(strip);
    }
    for (const line of p.strata) {
      const pts = line.map(([a, b]) => (plan ? new THREE.Vector3(a, 0.04, b) : new THREE.Vector3(a, b, DEPTH / 2 + 0.02)));
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: plan ? 0xd93025 : 0x3d2b1a }));
      group.add(l);
      if (plan) { const ribbon = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(line[1][0] - line[0][0]), 0.05, 0.22), new THREE.MeshBasicMaterial({ color: 0xd93025 })); ribbon.position.set((line[0][0] + line[1][0]) / 2, 0.05, line[0][1]); group.add(ribbon); }
    }
    for (const c of p.cones) {
      if (c.h <= 0.01) continue;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(c.r, c.h, 20), new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 }));
      cone.position.set(c.x, c.y + c.h / 2, 0); group.add(cone);
      const lava = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff6a1a })); lava.position.set(c.x, c.y + c.h, 0); group.add(lava);
    }
    for (const f of p.foci) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2b2b })); s.position.set(f.x, f.y, DEPTH / 2 + 0.06); group.add(s); }
    for (const a of p.arrows) {
      const col = a.kind === 'mantle' ? 0xfff2cc : 0xffffff;
      if (plan) { const g = arrow(new THREE.Vector3(0, 0, a.zdir), col, 2.2); g.position.set(a.x, 0.35, 0); group.add(g); }
      else { const g = arrow(new THREE.Vector3(a.dir, 0, 0), col, a.small ? 1.2 : 1.8); g.position.set(a.x, a.y, DEPTH / 2 + 0.1); group.add(g); }
    }
    // label overlay anchors
    labels = p.labels.map((l) => ({ key: l.key, v: plan ? new THREE.Vector3(l.x, 0.6, l.y) : new THREE.Vector3(l.x, l.y, DEPTH / 2 + 0.2) }));
    labelHost.replaceChildren(...labels.map((l) => { const e = document.createElement('span'); e.className = 'gl-lbl'; e.dataset.key = l.key; e.textContent = t(l.key); e.hidden = !showLabels; l.el = e; return e; }));
    api.invalidate();
  }
  function place(showLabels) {
    for (const l of labels) { const q = api.project(l.v); l.el.style.transform = `translate(${q.x.toFixed(0)}px,${q.y.toFixed(0)}px) translate(-50%,-50%)`; l.el.hidden = !showLabels || !q.visible; }
  }
  const relabel = () => labels.forEach((l) => { l.el.textContent = t(l.key); });
  return { update, place, relabel, group, dispose() { clearGroup(); scene.remove(group); Object.values(mats).forEach((m) => m.dispose()); stressMat.dispose(); } };
}
