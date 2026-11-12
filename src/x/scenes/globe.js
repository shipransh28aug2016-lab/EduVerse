// Interactive 3D globe: real country outlines (Natural Earth 110m via world-atlas) painted onto a sphere with d3-geo,
// atmosphere glow, highlighted countries, labelled places and animated great-circle arcs. Layers switch with a camera fly-to.
import { d3, GEO } from '../../engines/viz.js';

const W = 2048, H = 1024;
export const ll2v = (THREE, lon, lat, r = 1) => {
  const phi = ((lon + 180) / 360) * Math.PI * 2, la = (lat * Math.PI) / 180;
  return new THREE.Vector3(-Math.cos(phi) * Math.cos(la) * r, Math.sin(la) * r, Math.sin(phi) * Math.cos(la) * r);
};

function paint(ctx, highlight = {}) {
  const proj = d3.geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
  const path = d3.geoPath(proj, ctx);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b2350'); g.addColorStop(0.5, '#0a2f6b'); g.addColorStop(1, '#0b2350');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = 'rgba(160,200,255,.13)'; ctx.lineWidth = 1; ctx.stroke();
  for (const f of GEO.countries?.features || []) {
    const c = highlight[f.properties.name];
    ctx.beginPath(); path(f);
    ctx.fillStyle = c || '#2c5a86'; ctx.fill();
    ctx.strokeStyle = c ? 'rgba(255,255,255,.9)' : 'rgba(190,220,255,.35)'; ctx.lineWidth = c ? 1.6 : 0.8; ctx.stroke();
  }
}

export function build(stage, spec) {
  const { THREE, scene, camera, controls } = stage;
  const layers = spec.layers || [spec];
  stage.setBloom(0.38); stage.stars();
  controls.minDistance = 1.5; controls.maxDistance = 6; controls.target.set(0, 0, 0);

  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.3, roughness: 0.8, metalness: 0.05 }));
  scene.add(globe);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 48), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0.,0.,1.)),2.4);gl_FragColor=vec4(.35,.62,1.,1.)*i;}',
  }));
  scene.add(atmo);

  let group = null, movers = [], rings = [], cur = -1;
  const camFor = (focus, dist = 3) => ll2v(THREE, focus[0], focus[1], dist).add(new THREE.Vector3(0, 0.25, 0));

  function setLayer(i, instant = false) {
    if (i === cur) return; cur = i; const L = layers[i];
    if (group) stage.clear(group);
    group = new THREE.Group(); scene.add(group); movers = []; rings = [];
    paint(ctx, L.highlight); tex.needsUpdate = true;
    for (const p of L.points || []) {
      const v = ll2v(THREE, p.lon, p.lat, 1.006), col = new THREE.Color(p.color || '#f5c451');
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.016, 16, 12), new THREE.MeshBasicMaterial({ color: col })); dot.position.copy(v); group.add(dot);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.022, 0.03, 32), new THREE.MeshBasicMaterial({ color: col, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      ring.position.copy(v); ring.lookAt(v.clone().multiplyScalar(2)); ring.userData.o = Math.random(); group.add(ring); rings.push(ring);
      stage.label(p, v.clone().multiplyScalar(1.05), 'pin', group);
    }
    for (const a of L.arcs || []) {
      const A = ll2v(THREE, a.from[0], a.from[1]), B = ll2v(THREE, a.to[0], a.to[1]), ang = A.angleTo(B), lift = 0.08 + 0.42 * (ang / Math.PI);
      const pts = Array.from({ length: 49 }, (_, k) => { const t = k / 48; return A.clone().lerp(B, t).normalize().multiplyScalar(1.004 + lift * Math.sin(Math.PI * t)); });
      const curve = new THREE.CatmullRomCurve3(pts), col = new THREE.Color(a.color || '#f5c451');
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.0045, 6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85 })));
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.userData = { curve, o: Math.random() }; group.add(m); movers.push(m);
      if (a.en) stage.label(a, curve.getPoint(0.5), 'arc', group);
    }
    const to = camFor(L.focus || spec.focus || [78, 22], L.dist || spec.dist || 3);
    if (instant) camera.position.copy(to); else stage.flyTo(to, new THREE.Vector3());
  }
  // labels on the far side of the globe are hidden
  const off = stage.onFrame((t) => {
    for (const m of movers) m.position.copy(m.userData.curve.getPoint((t * 0.22 + m.userData.o) % 1));
    for (const r of rings) { const k = (t * 0.6 + r.userData.o) % 1; r.scale.setScalar(1 + k * 2.2); r.material.opacity = 0.9 * (1 - k); }
    const cd = camera.position.clone().normalize();
    group?.children.forEach((o) => { if (o.isCSS2DObject) o.element.style.opacity = o.position.clone().normalize().dot(cd) > 0.18 ? '1' : '0'; });
  });
  setLayer(0, true);
  return { setLayer, layers, dispose: off };
}
