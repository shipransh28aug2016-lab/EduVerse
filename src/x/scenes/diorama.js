// Procedural low-poly dioramas with physically based materials: a multipurpose dam, a Gutenberg-style hand press,
// a steam-age cotton mill, a tiered structure (levels of government / consumer commissions) and a bank credit loop.
// Every model is a teaching schematic, not a scale reconstruction.
import { PALETTE } from '../../engines/stage.js';
import { pair } from '../../core/i18n.js';

function kit(stage) {
  const { THREE, FX } = stage;
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1, ...o });
  const add = (parent, geo, m, [x, y, z] = [0, 0, 0], shadow = true) => { const o = new THREE.Mesh(geo, typeof m === 'object' && m.isMaterial ? m : mat(m)); o.position.set(x, y, z); o.castShadow = o.receiveShadow = shadow; parent.add(o); return o; };
  return {
    THREE, mat, add,
    box: (p, [w, h, d], m, pos) => add(p, new THREE.BoxGeometry(w, h, d), m, pos),
    rbox: (p, [w, h, d], m, pos, r = 0.08) => add(p, new FX.RoundedBoxGeometry(w, h, d, 3, r), m, pos),
    cyl: (p, [rt, rb, h, seg = 32], m, pos) => add(p, new THREE.CylinderGeometry(rt, rb, h, seg), m, pos),
    cone: (p, [r, h, seg = 24], m, pos) => add(p, new THREE.ConeGeometry(r, h, seg), m, pos),
    ball: (p, r, m, pos) => add(p, new THREE.SphereGeometry(r, 24, 16), m, pos),
    glow: (c, i = 1.8) => mat(c, { emissive: c, emissiveIntensity: i, roughness: 0.3 }),
    V: (x, y, z) => new THREE.Vector3(x, y, z),
    base(r = 8, color = 0x0c1730) { const f = add(stage.scene, new THREE.CylinderGeometry(r, r * 1.03, 0.3, 72), mat(color, { roughness: 0.3, metalness: 0.6 }), [0, -0.15, 0]); return f; },
    cam(pos, target = [0, 1, 0], min = 5, max = 26) { stage.camera.position.set(...pos); stage.controls.target.set(...target); Object.assign(stage.controls, { minDistance: min, maxDistance: max, maxPolarAngle: 1.5 }); },
  };
}

function dam(stage) {
  const k = kit(stage), { THREE, V } = k, s = stage.scene;
  k.cam([9, 8, 13.5], [0, 0.8, 0]); k.base(8.5, 0x10203c);
  k.rbox(s, [13, 0.5, 9], 0x4f7a3a, [0, 0.25, 0], 0.1);
  for (const z of [-3.7, 3.7]) { const h = k.ball(s, 1.9, k.mat(0x5f7a45, { roughness: 0.95 }), [-0.4, 0.5, z]); h.scale.set(1.5, 1.35, 0.75); const g = k.ball(s, 1.5, k.mat(0x6f8a52, { roughness: 0.95 }), [-4.2, 0.5, z]); g.scale.set(1.5, 1.1, 0.7); }
  const water = k.box(s, [6.2, 1.9, 5.2], k.mat(0x2f8fd8, { transparent: true, opacity: 0.82, roughness: 0.08, metalness: 0.3 }), [-3.3, 1.4, 0]); water.castShadow = false;
  const shape = new THREE.Shape([[-0.35, 0], [1.2, 0], [0.25, 2.5], [-0.35, 2.5]].map(([x, y]) => new THREE.Vector2(x, y)));
  const wall = k.add(s, new THREE.ExtrudeGeometry(shape, { depth: 5.4, bevelEnabled: false }), k.mat(0x9da3ab, { roughness: 0.9 }), [0, 0.5, -2.7]);
  for (const z of [-1.2, 0, 1.2]) k.box(s, [0.5, 0.5, 0.6], k.mat(0x7fd0ff, { emissive: 0x3aa0ff, emissiveIntensity: 0.9, transparent: true, opacity: 0.9 }), [0.75, 1.35, z]);
  k.box(s, [5.8, 0.12, 1.2], k.mat(0x3aa0e8, { roughness: 0.1, metalness: 0.3 }), [3.9, 0.56, 0]);
  k.rbox(s, [1.3, 0.9, 1.5], 0xe9e2d0, [1.9, 0.95, -1.9]); k.box(s, [1.4, 0.12, 1.6], 0x9a3b2e, [1.9, 1.45, -1.9]);
  k.box(s, [0.5, 0.25, 0.08], k.glow(0xffd166, 2.4), [1.9, 1.05, -1.13]);
  for (const x of [3.2, 4.8, 6.2]) { k.cyl(s, [0.04, 0.06, 1.8, 8], 0x8d99a6, [x, 1.4, -2.6]); k.box(s, [0.05, 0.05, 0.9], 0x8d99a6, [x, 2.2, -2.6]); }
  k.box(s, [3.2, 0.03, 0.03], k.glow(0xffd166, 1.2), [4.7, 2.2, -2.6]);
  k.box(s, [0.35, 0.1, 3], k.mat(0x58b6f0, { roughness: 0.15 }), [3.4, 0.57, 2]);
  const greens = [0x7fc241, 0x5fae3a, 0xc9d64b, 0x8fd16a];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k.rbox(s, [0.95, 0.1, 0.95], greens[(i + 2 * j) % 4], [4.1 + i * 1.02, 0.56, 1.75 + j * 1.02], 0.03);
  for (const [x, z] of [[-5.6, 2.2], [-5.9, 1.4], [-5.2, 1.7]]) { k.box(s, [0.4, 0.5, 0.4], 0xd9c7a3, [x, 0.72, z]); const r = k.cone(s, [0.36, 0.3, 4], 0x8a4b32, [x, 1.1, z]); r.rotation.y = Math.PI / 4; }
  const L = (en, hi, p) => stage.label({ en, hi }, V(...p));
  L('Reservoir: stored water', 'जलाशय: संचित जल', [-3.3, 2.9, 0]); L('Dam wall', 'बाँध की दीवार', [0.2, 3.5, 2.2]);
  L('Hydel powerhouse', 'जलविद्युत गृह', [1.9, 2.1, -1.9]); L('Irrigation canal and fields', 'सिंचाई नहर और खेत', [5, 1.2, 2.6]);
  L('Flood-controlled river', 'बाढ़-नियंत्रित नदी', [5.6, 1.1, 0]); L('Submerged land, displaced people', 'डूबी भूमि, विस्थापित लोग', [-5.6, 1.9, 1.8]);
  stage.onFrame((t) => { water.scale.y = 1 + Math.sin(t * 0.8) * 0.03; water.position.y = 0.45 + (1.9 * water.scale.y) / 2; });
}

function press(stage) {
  const k = kit(stage), { V } = k, s = stage.scene, wood = k.mat(0x7a4a22, { roughness: 0.75 }), dark = k.mat(0x4a2c14, { roughness: 0.8 }), iron = k.mat(0x3a3f47, { metalness: 0.85, roughness: 0.35 });
  k.cam([7.5, 5.5, 10.5], [0, 2.3, 0], 4, 22); k.base(6, 0x1a1420);
  k.rbox(s, [5.4, 0.3, 2.6], dark, [0, 0.15, 0], 0.05);
  for (const x of [-1.5, 1.5]) { k.rbox(s, [0.45, 4.6, 0.6], wood, [x, 2.6, 0], 0.05); k.rbox(s, [0.7, 0.25, 1.9], dark, [x, 0.42, 0], 0.04); }
  k.rbox(s, [3.9, 0.55, 0.7], wood, [0, 4.9, 0], 0.06); k.rbox(s, [3.5, 0.4, 0.65], wood, [0, 3.55, 0], 0.05);
  k.rbox(s, [4.8, 0.3, 1.6], wood, [0.5, 1.3, 0], 0.05);
  for (const x of [-1.2, 2.4]) k.rbox(s, [0.25, 1.1, 1.3], dark, [x, 0.75, 0], 0.04);
  k.box(s, [1.7, 0.14, 1.15], iron, [0, 1.52, 0]);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) k.box(s, [0.15, 0.06, 0.15], k.mat(0xb9bec6, { metalness: 0.9, roughness: 0.3 }), [-0.7 + i * 0.2, 1.62, -0.42 + j * 0.21]);
  const moving = new k.THREE.Group(); s.add(moving);
  const screw = k.cyl(moving, [0.16, 0.16, 2.3, 16], iron, [0, 3.2, 0]);
  for (let i = 0; i < 9; i++) { const r = k.add(moving, new k.THREE.TorusGeometry(0.17, 0.03, 8, 20), iron, [0, 2.3 + i * 0.2, 0]); r.rotation.x = Math.PI / 2.15; }
  k.rbox(moving, [1.9, 0.3, 1.3], wood, [0, 2.0, 0], 0.05);
  const lever = k.cyl(moving, [0.06, 0.06, 2.6, 10], wood, [1.0, 3.0, 0.5]); lever.rotation.z = Math.PI / 2;
  const paper = k.box(s, [1.55, 0.02, 1.0], k.mat(0xfbf6e6, { roughness: 0.95 }), [0, 1.68, 0]);
  for (let i = 0; i < 7; i++) k.box(s, [1.4, 0.03, 0.95], k.mat(0xf6efdb, { roughness: 0.95 }), [2.15, 1.47 + i * 0.035, 0.05 * Math.sin(i)]);
  for (const z of [-0.55, 0.55]) { k.ball(s, 0.2, k.mat(0x1a1a1a, { roughness: 0.4 }), [-1.95, 1.65, z]); k.cyl(s, [0.05, 0.05, 0.35, 8], wood, [-1.95, 1.95, z]); }
  const L = (en, hi, p) => stage.label({ en, hi }, V(...p));
  L('Screw: turns to press down', 'पेंच: घुमाने पर दबाव', [0, 4.45, 0.5]); L('Platen: flat pressing plate', 'प्लैटन: दबाने की प्लेट', [-1.0, 2.25, 0.9]);
  L('Movable metal type', 'चल धातु टाइप', [0, 1.75, 1.0]); L('Printed sheets', 'छपे पन्ने', [2.2, 2.05, 0]); L('Ink balls', 'स्याही की गेंदें', [-1.95, 2.35, 0]);
  stage.onFrame((t) => { const c = (Math.sin(t * 1.3) + 1) / 2, y = -0.2 * c; moving.position.y = y; screw.rotation.y = c * 4; lever.rotation.y = c * 0.9; paper.material.color.setHex(c > 0.92 ? 0xe8dcc0 : 0xfbf6e6); });
}

function factory(stage) {
  const k = kit(stage), { V, THREE } = k, s = stage.scene, brick = k.mat(0x9a4a35, { roughness: 0.85 });
  k.cam([10, 7.5, 14], [0, 1.8, 0]); k.base(8.5, 0x141a26);
  k.rbox(s, [13, 0.3, 9], 0x3b4a3a, [0, 0.15, 0], 0.08);
  k.box(s, [7, 2.4, 3.4], brick, [-1, 1.5, -1]);
  for (let i = 0; i < 5; i++) {
    const tri = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(1.4, 0), new THREE.Vector2(0, 0.9)]);
    k.add(s, new THREE.ExtrudeGeometry(tri, { depth: 3.4, bevelEnabled: false }), k.mat(0x4b5563, { roughness: 0.5, metalness: 0.4 }), [-4.5 + i * 1.4, 2.7, -2.7]);
    k.box(s, [0.04, 0.7, 3.0], k.glow(0xffe29a, 1.6), [-4.48 + i * 1.4, 3.1, -1]);
  }
  for (let i = 0; i < 6; i++) k.box(s, [0.55, 0.9, 0.06], k.glow(0xffd166, 2.2), [-3.9 + i * 1.15, 1.6, 0.72]);
  k.box(s, [0.9, 1.4, 0.08], 0x2a1a12, [2.0, 1.0, 0.72]);
  k.cyl(s, [0.32, 0.5, 6.2, 20], brick, [3.6, 3.4, -1.6]); k.cyl(s, [0.4, 0.4, 0.25, 20], 0x5a2a20, [3.6, 6.5, -1.6]);
  const puffs = Array.from({ length: 9 }, (_, i) => { const p = k.ball(s, 0.35, k.mat(0xc9ced6, { transparent: true, opacity: 0.6, roughness: 1 }), [3.6, 7, -1.6]); p.castShadow = false; p.userData.o = i / 9; return p; });
  const wheel = new THREE.Group(); wheel.position.set(4.6, 1.5, 0.6); s.add(wheel);
  k.add(wheel, new THREE.TorusGeometry(1.0, 0.09, 10, 40), k.mat(0x2b2f36, { metalness: 0.9, roughness: 0.3 }));
  for (let i = 0; i < 6; i++) { const sp = k.box(wheel, [1.95, 0.07, 0.07], k.mat(0x2b2f36, { metalness: 0.9, roughness: 0.3 })); sp.rotation.z = (i * Math.PI) / 6; }
  k.rbox(s, [1.6, 1.0, 1.0], k.mat(0x39424e, { metalness: 0.7, roughness: 0.4 }), [4.6, 0.8, -0.3]);
  for (let i = 0; i < 5; i++) k.rbox(s, [0.7, 0.5, 0.5], k.mat(0xf4f1e8, { roughness: 1 }), [-4.6 + (i % 3) * 0.78, 0.55 + Math.floor(i / 3) * 0.5, 2.2], 0.12);
  for (const z of [3.1, 3.5]) k.box(s, [12.5, 0.06, 0.06], k.mat(0x8d99a6, { metalness: 0.9, roughness: 0.3 }), [0, 0.36, z]);
  for (let i = 0; i < 16; i++) k.box(s, [0.14, 0.04, 0.7], 0x4a2c14, [-6 + i * 0.8, 0.32, 3.3]);
  const cart = new THREE.Group(); s.add(cart);
  k.rbox(cart, [1.3, 0.6, 0.6], k.mat(0x1f2937, { metalness: 0.6, roughness: 0.4 }), [0, 0.85, 3.3]); k.cyl(cart, [0.14, 0.18, 0.5, 12], 0x111827, [0.35, 1.35, 3.3]);
  k.rbox(cart, [1.1, 0.45, 0.55], 0x7a4a22, [-1.35, 0.75, 3.3]); k.rbox(cart, [0.9, 0.3, 0.45], k.mat(0xf4f1e8, { roughness: 1 }), [-1.35, 1.1, 3.3], 0.1);
  for (let i = 0; i < 4; i++) { k.box(s, [0.7, 0.7, 0.7], 0xb9a58a, [-5.3 + i * 0.85, 0.65, -3.6]); const r = k.cone(s, [0.55, 0.4, 4], 0x6b3a2a, [-5.3 + i * 0.85, 1.2, -3.6]); r.rotation.y = Math.PI / 4; }
  const L = (en, hi, p) => stage.label({ en, hi }, V(...p));
  L('Cotton mill: many workers under one roof', 'सूती मिल: एक छत के नीचे अनेक मज़दूर', [-1, 4.2, -1]); L('Chimney: steam power', 'चिमनी: भाप शक्ति', [3.6, 7.3, -1.6]);
  L('Steam engine flywheel', 'भाप इंजन का चक्का', [4.6, 3.0, 0.6]); L('Raw cotton bales', 'कच्ची कपास की गाँठें', [-4, 1.9, 2.2]);
  L('Railway: goods to ports and markets', 'रेल: माल बंदरगाह और बाज़ार तक', [0.5, 1.9, 3.3]); L("Workers' quarters", 'मज़दूरों की बस्ती', [-4, 2.0, -3.6]);
  stage.onFrame((t) => {
    wheel.rotation.z = -t * 1.6; cart.position.x = ((t * 0.9) % 13) - 6;
    for (const p of puffs) { const c = (t * 0.12 + p.userData.o) % 1; p.position.set(3.6 + c * 2.2, 6.8 + c * 3.2, -1.6 - c * 0.8); p.scale.setScalar(0.5 + c * 2); p.material.opacity = 0.6 * (1 - c); }
  });
}

/** spec.levels: top → bottom [{ en, hi, color, items: [{en, hi}] }] */
function tiers(stage, spec) {
  const k = kit(stage), { V, THREE } = k, s = stage.scene, n = spec.levels.length, H = 1.25;
  k.cam([9, 7.5, 13], [0, n * H * 0.5, 0]); k.base(7.5);
  spec.levels.forEach((lv, i) => {
    const r = 1.5 + i * 1.35, y = (n - 1 - i) * H, col = new THREE.Color(lv.color || PALETTE[i % PALETTE.length]);
    const disc = k.cyl(s, [r, r, 0.38, 72], k.mat(col, { roughness: 0.3, metalness: 0.45, emissive: col, emissiveIntensity: 0.12 }), [0, y + 0.19, 0]);
    disc.userData = lv; stage.pickables.push(disc);
    const items = lv.items || [], inner = i === 0 ? 0 : 1.5 + (i - 1) * 1.35;
    items.forEach((it, j) => {
      const a = (j / items.length) * Math.PI * 2 + i * 0.5, rr = i === 0 ? r * 0.55 : (r + inner) / 2;
      const p = k.cyl(s, [0.13, 0.13, 0.75, 16], k.mat(0xf7f3e8, { roughness: 0.35, metalness: 0.2 }), [Math.cos(a) * rr, y + 0.75, Math.sin(a) * rr]);
      k.ball(s, 0.11, k.glow(col, 1.5), [p.position.x, y + 1.2, p.position.z]); p.userData = { ...lv, one: it }; stage.pickables.push(p);
    });
    stage.label(lv, V(r * 0.72, y + 0.75, r * 0.72), 'tier');
  });
  stage.onHover((o) => { if (!o) return ''; const u = o.userData; return u.one ? `${pair(u.en, u.hi)} → ${pair(u.one.en, u.one.hi)}` : `${pair(u.en, u.hi)}: ${(u.items || []).map((x) => pair(x.en, x.hi)).join(' · ')}`; });
}

function bank(stage) {
  const k = kit(stage), { V, THREE } = k, s = stage.scene, stone = k.mat(0xece6d6, { roughness: 0.55 }), gold = k.mat(0xf5c451, { metalness: 0.9, roughness: 0.25 });
  k.cam([0, 7.5, 16], [0, 1.6, 0]); k.base(8.5);
  k.rbox(s, [4.4, 0.35, 3], stone, [0, 0.18, 0], 0.05); k.rbox(s, [4.0, 0.25, 2.7], stone, [0, 0.47, 0], 0.05);
  for (let i = 0; i < 5; i++) k.cyl(s, [0.17, 0.2, 2.2, 18], stone, [-1.6 + i * 0.8, 1.7, 1.05]);
  k.box(s, [3.7, 2.2, 1.9], k.mat(0xd8d0bb), [0, 1.7, -0.2]); k.rbox(s, [4.2, 0.3, 2.9], stone, [0, 2.95, 0], 0.05);
  const ped = k.add(s, new THREE.CylinderGeometry(0.01, 2.4, 1.1, 3), gold, [0, 3.65, 0.4]); ped.rotation.y = Math.PI / 2; ped.scale.z = 0.55;
  k.box(s, [0.9, 1.3, 0.06], k.glow(0xffd166, 1.4), [0, 1.25, 0.78]);
  for (const [x, z, c] of [[-6, 1.2, 0xe07a5f], [-5.2, -0.4, 0x81b29a], [-6.3, -1.5, 0xf2cc8f]]) { k.rbox(s, [0.9, 0.8, 0.9], c, [x, 0.4, z], 0.05); const r = k.cone(s, [0.8, 0.6, 4], 0x3d405b, [x, 1.1, z]); r.rotation.y = Math.PI / 4; }
  k.rbox(s, [1.2, 0.9, 1], 0x60a5fa, [5.6, 0.45, 1.6], 0.05); k.box(s, [1.4, 0.1, 1.2], 0xff7a6b, [5.6, 0.95, 1.6]);
  for (let i = 0; i < 6; i++) k.rbox(s, [0.5, 0.08, 0.5], [0x7fc241, 0xc9d64b][i % 2], [5 + (i % 3) * 0.55, 0.05, -0.3 - Math.floor(i / 3) * 0.55], 0.02);
  k.box(s, [1.3, 0.8, 0.9], 0x6b7280, [6, 0.4, -2.3]); k.cyl(s, [0.1, 0.14, 1.2, 10], 0x4b5563, [6.4, 1.2, -2.3]);
  const arc = (a, b, h) => new THREE.QuadraticBezierCurve3(V(...a), V((a[0] + b[0]) / 2, h, (a[2] + b[2]) / 2), V(...b));
  const flows = [
    { c: arc([-5.6, 1.2, 0], [-1.2, 2.2, 1.4], 4.6), col: 0x4fd1c5, n: 5 },
    { c: arc([1.2, 2.2, 1.4], [5.6, 1.2, 0.5], 4.6), col: 0xf5c451, n: 5 },
    { c: arc([5.6, 0.6, -1.2], [1, 0.9, -1.2], 2.4), col: 0xff7a6b, n: 4 },
    { c: arc([-1, 0.9, -1.2], [-5.6, 0.6, -1.2], 2.4), col: 0xa78bfa, n: 3 },
  ];
  const coins = [];
  for (const f of flows) {
    s.add(new THREE.Mesh(new THREE.TubeGeometry(f.c, 48, 0.02, 6), new THREE.MeshBasicMaterial({ color: f.col, transparent: true, opacity: 0.55 })));
    for (let i = 0; i < f.n; i++) { const c = k.cyl(s, [0.14, 0.14, 0.04, 20], k.mat(f.col, { emissive: f.col, emissiveIntensity: 0.9, metalness: 0.8, roughness: 0.25 })); c.rotation.x = Math.PI / 2; c.userData = { c: f.c, o: i / f.n }; coins.push(c); }
  }
  const L = (en, hi, p, cls) => stage.label({ en, hi }, V(...p), cls);
  L('Bank', 'बैंक', [0, 4.6, 0.4], 'tier'); L('Depositors', 'जमाकर्ता', [-5.8, 2.0, 0]); L('Borrowers: shops, farms, industry', 'ऋणी: दुकान, खेत, उद्योग', [5.8, 2.2, 0]);
  L('Deposits (earn interest)', 'जमा (ब्याज मिलता है)', [-3.4, 4.0, 0.7], 'arc'); L('Loans', 'ऋण', [3.4, 4.0, 0.9], 'arc');
  L('Repayment + higher interest', 'चुकौती + अधिक ब्याज', [3.3, 2.2, -1.2], 'arc'); L('Interest paid to depositors', 'जमाकर्ताओं को ब्याज', [-3.3, 2.2, -1.2], 'arc');
  stage.onFrame((t) => { for (const c of coins) { c.position.copy(c.userData.c.getPoint((t * 0.16 + c.userData.o) % 1)); c.rotation.z = t * 3; } });
}

const BUILDERS = { dam, press, factory, tiers, bank };
export function build(stage, spec) { stage.setBloom(0.4); BUILDERS[spec.name](stage, spec); return { layers: null, setLayer() {} }; }
