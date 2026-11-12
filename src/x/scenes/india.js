// Extruded 3D map of India (37 states/UTs, datta07/INDIAN-SHAPEFILES, MIT). Layers raise and colour groups of states,
// drop glowing location pins and draw animated routes. Hover a state for its name and what the layer says about it.
import { GEO } from '../../engines/viz.js';
import { pair } from '../../core/i18n.js';

const K = 0.3, LON0 = 82.8, LAT0 = 22.5, BASE = 0.14, UP = 0.55;
export const xy = (lon, lat) => [(lon - LON0) * 0.92 * K, (lat - LAT0) * K];

export function build(stage, spec) {
  const { THREE, scene, camera, controls } = stage;
  const layers = spec.layers || [spec];
  stage.setBloom(0.45);
  controls.target.set(0, 0, 0.9); controls.minDistance = 5; controls.maxDistance = 22; controls.maxPolarAngle = 1.45;
  camera.position.set(1.2, 8.6, 8.4);

  const sea = new THREE.Mesh(new THREE.CircleGeometry(11, 72), new THREE.MeshStandardMaterial({ color: 0x0b2a55, roughness: 0.25, metalness: 0.6 }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -0.02; sea.receiveShadow = true; scene.add(sea);
  const map = new THREE.Group(); map.rotation.x = -Math.PI / 2; scene.add(map);
  const baseCol = new THREE.Color('#33507c');
  const states = new Map();
  for (const f of GEO.india?.features || []) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const shapes = polys.map((rings) => new THREE.Shape(rings[0].map(([lo, la]) => new THREE.Vector2(...xy(lo, la)))));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false });
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: baseCol.clone(), roughness: 0.55, metalness: 0.15 }));
    mesh.scale.z = BASE; mesh.castShadow = mesh.receiveShadow = true; mesh.userData = { name: f.properties.name, info: null };
    for (const rings of polys) {
      const lg = new THREE.BufferGeometry().setFromPoints(rings[0].map(([lo, la]) => new THREE.Vector3(...xy(lo, la), 1.002)));
      mesh.add(new THREE.LineLoop(lg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34 })));
    }
    map.add(mesh); states.set(f.properties.name, mesh); stage.pickables.push(mesh);
  }
  stage.onHover((o) => { if (!o) return ''; const i = o.userData.info; return i ? `${o.userData.name} — ${pair(i.en, i.hi)}` : o.userData.name; });

  let group = null, movers = [], pins = [], cur = -1;
  const P = (lon, lat, h = 0) => { const [x, y] = xy(lon, lat); return new THREE.Vector3(x, h, -y); };

  function setLayer(i) {
    if (i === cur) return; cur = i; const L = layers[i];
    if (group) stage.clear(group);
    group = new THREE.Group(); scene.add(group); movers = []; pins = [];
    const want = new Map();
    for (const g of L.groups || []) for (const s of g.states) want.set(s, g);
    for (const [name, m] of states) {
      const g = want.get(name), c0 = m.material.color.clone(), c1 = g ? new THREE.Color(g.color) : baseCol, h0 = m.scale.z, h1 = g ? UP * (g.h || 1) : BASE;
      m.userData.info = g || null;
      stage.tween(900, (k) => { m.material.color.lerpColors(c0, c1, k); m.scale.z = h0 + (h1 - h0) * k; });
    }
    const top = () => { let h = BASE; for (const g of L.groups || []) h = Math.max(h, UP * (g.h || 1)); return L.groups?.length ? h : BASE; };
    for (const p of L.points || []) {
      const col = new THREE.Color(p.color || '#f5c451'), y0 = BASE, ht = 0.55 + (p.h || 0) + top() - BASE;
      const pin = new THREE.Group(); pin.position.copy(P(p.lon, p.lat, y0));
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, ht, 8), new THREE.MeshBasicMaterial({ color: col })); stem.position.y = ht / 2; pin.add(stem);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.6, roughness: 0.3 })); head.position.y = ht; pin.add(head);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.1, 32), new THREE.MeshBasicMaterial({ color: col, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012; ring.userData.o = Math.random(); pin.add(ring); pins.push(ring);
      stage.label(p, new THREE.Vector3(0, ht + 0.16, 0), 'pin', pin);
      pin.scale.setScalar(0.001); stage.tween(700, (k) => pin.scale.setScalar(Math.max(0.001, k)));
      group.add(pin);
    }
    for (const r of L.routes || []) {
      const y = top() + 0.1, col = new THREE.Color(r.color || '#f5c451');
      const pts = r.pts.map(([lo, la]) => P(lo, la, y));
      const curve = r.arc ? new THREE.QuadraticBezierCurve3(pts[0], pts[0].clone().lerp(pts[1], 0.5).setY(y + 1.6), pts[1]) : new THREE.CatmullRomCurve3(pts, !!r.closed, 'catmullrom', 0.12);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.028, 8, !!r.closed), new THREE.MeshBasicMaterial({ color: col })));
      for (let n = 0; n < (r.closed ? 3 : 1); n++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.userData = { curve, o: n / 3 }; group.add(m); movers.push(m); }
    }
  }
  const off = stage.onFrame((t) => {
    for (const m of movers) m.position.copy(m.userData.curve.getPoint((t * 0.09 + m.userData.o) % 1));
    for (const r of pins) { const k = (t * 0.7 + r.userData.o) % 1; r.scale.setScalar(1 + k * 2.4); r.material.opacity = 0.85 * (1 - k); }
  });
  setLayer(0);
  return { setLayer, layers, dispose: off };
}
