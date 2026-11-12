// 3D data towers: a glossy-floor bar chart whose columns grow and re-colour as the learner switches data series (layers).
import { PALETTE } from '../../engines/stage.js';
import { pair } from '../../core/i18n.js';

const fmt = (v) => (Math.abs(v) >= 1000 ? v.toLocaleString('en-IN') : String(v));

export function build(stage, spec) {
  const { THREE, FX, scene, camera, controls } = stage;
  const layers = spec.series, n = spec.cats.length, gap = 1.7, HMAX = 4.6;
  stage.setBloom(0.35);
  const span = (n - 1) * gap;
  controls.target.set(0, 1.5, 0); controls.minDistance = 6; controls.maxDistance = 30; controls.maxPolarAngle = 1.5;
  camera.position.set(span * 0.3, 4.6, 6.5 + span * 0.95);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(Math.max(7, span * 0.9), 72), new THREE.MeshStandardMaterial({ color: 0x0c1730, roughness: 0.22, metalness: 0.75 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(Math.max(14, span * 1.8), 28, 0x35508a, 0x1b2c52); grid.position.y = 0.004; grid.material.transparent = true; grid.material.opacity = 0.55; scene.add(grid);

  const bars = spec.cats.map((c, i) => {
    const col = new THREE.Color(c.color || PALETTE[i % PALETTE.length]);
    const m = new THREE.Mesh(new FX.RoundedBoxGeometry(1, 1, 1, 4, 0.06), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.22, roughness: 0.28, metalness: 0.35 }));
    m.position.x = i * gap - span / 2; m.castShadow = true; m.userData = { c, v: 0, h: 0.01 }; scene.add(m); stage.pickables.push(m);
    stage.label(c, new THREE.Vector3(m.position.x, -0.02, 0.95), 'cat');
    m.userData.val = stage.label('', new THREE.Vector3(m.position.x, 0.3, 0), 'val');
    return m;
  });
  let cur = -1;
  stage.onHover((o) => (o ? `${pair(o.userData.c.en, o.userData.c.hi)}: ${fmt(o.userData.v)} ${layers[cur].unit || ''}` : ''));

  function setLayer(i) {
    if (i === cur) return; cur = i; const S = layers[i], max = S.max || Math.max(...S.values);
    bars.forEach((m, k) => {
      const v = S.values[k], h0 = m.userData.h, h1 = Math.max(0.04, (v / max) * HMAX), v0 = m.userData.v;
      m.userData.v = v;
      stage.tween(900 + k * 60, (e) => {
        const h = h0 + (h1 - h0) * e; m.userData.h = h; m.scale.y = h; m.position.y = h / 2;
        m.userData.val.position.y = h + 0.32; stage.setLabel(m.userData.val, fmt(Math.round((v0 + (v - v0) * e) * 100) / 100) + (S.suffix || ''));
      });
    });
  }
  setLayer(0);
  return { setLayer, layers };
}
