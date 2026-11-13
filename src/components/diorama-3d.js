// Interactive 3D Diorama Library for Home Hero Globe + Themes T01, T03, T05, T06, T07, T08, T09, T11, T13, T14, T15, T16.
// (T02 uses plate-3d & landforms-3d; T04 uses harappan-3d; T10 uses ocean-3d; T12 uses fort-3d.)
import * as i18n from '../core/i18n.js';

function makeToolkit(api, labelHost) {
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

// ================================================================ Home Hero 3D Interactive Globe
export function createHeroGlobe3d(api) {
  const tk = makeToolkit(api, null);
  const { THREE, group, mat, sph, cyl } = tk;
  api.target.set(0, 0, 0);

  const globe = new THREE.Group();
  group.add(globe);
  // Deep ocean core
  globe.add(sph(4.1, mat(0x1474a6, { rough: 0.35, metal: 0.12 })));
  // Sculpted continental shelves & green highlands
  const patches = [
    [1.1, 0.9, 1.3, 0.35, 0.85, 0x3b9b54, 'India & Plateau', 'भारत व पठार', 'T01'],
    [1.3, 1.3, 0.8, 0.25, 0.55, 0x8d6e63, 'Himalaya Belt', 'हिमालय शृंखला', 'T02'],
    [0.6, 0.4, 2.0, 0.7, 1.0, 0x4caf50, 'Afro-Eurasia Trade', 'अफ़्रीका-यूरेशिया व्यापार', 'T13'],
    [-0.4, 0.6, -2.2, 0.55, 1.1, 0x55a868, 'Americas Systems', 'अमेरिकी प्रणालियाँ', 'T06'],
    [1.9, -0.4, -0.7, 0.45, 0.75, 0x66bb6a, 'Asia-Pacific Oceans', 'एशिया-प्रशांत सागर', 'T10'],
  ];
  for (const [lat, lon, r, sx, sy, col, en, hi, theme] of patches) {
    const m = sph(r, mat(col, { rough: 0.82 }));
    m.scale.set(sx, sy, sx);
    const phi = Math.PI / 2 - lat * 0.48, theta = lon + 0.6;
    m.position.set(3.85 * Math.sin(phi) * Math.cos(theta), 3.85 * Math.cos(phi), 3.85 * Math.sin(phi) * Math.sin(theta));
    globe.add(m);
    tk.pick(m, en, hi, { theme });
  }
  // Atmosphere glow shell
  globe.add(sph(4.42, new THREE.MeshBasicMaterial({ color: 0x64d2ff, transparent: true, opacity: 0.14, side: THREE.BackSide })));
  // Orbiting satellite + golden ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(5.35, 0.035, 8, 64), new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55 }));
  ring.rotation.set(1.15, 0.35, 0);
  group.add(ring);
  const sat = new THREE.Group();
  sat.add(tk.box(0.45, 0.28, 0.28, mat(0xf59e0b, { metal: 0.5 })));
  sat.add(tk.box(1.1, 0.05, 0.34, mat(0x2563eb)));
  ring.add(sat);
  tk.pick(sat, 'Orbiting Earth Explorer', 'परिक्रमा करता उपग्रह', { theme: 'T03' });

  tk.animated.push({
    fn: (t) => {
      globe.rotation.y = t * 0.25;
      sat.position.set(Math.cos(t * 0.8) * 5.35, Math.sin(t * 0.8) * 5.35, 0);
      sat.rotation.z = t * 0.8;
    },
  });
  api.setPlaying(true);
  api.invalidate();
  return { update() {}, place() {}, relabel() {}, tick: tk.tick, dispose: tk.dispose };
}

// ================================================================ Theme 3D Diorama Builders
const BUILDERS = {
  // T01: Interconnected Valley Island (People, Place, Time, Resources, Institutions, Decisions)
  T01(tk, S) {
    const { group, mat, box, cyl, cone, sph, addTree, addHouse, addLabel, addPlinth, pick, animated } = tk;
    const shock = !!S.shock;
    addPlinth(shock ? 0xb59c5c : 0x5ca05b, 0x6b4e3d, 15.5, 10.5);
    // Granite hill plateau ridge
    const hill = cone(3.8, 3.3, 7, mat(shock ? 0x9b8259 : 0x4d8b55, { rough: 0.9 }), -4.3, -0.35, -2.0);
    group.add(hill);
    pick(hill, 'Place & Plateau Hills', 'स्थान व पठारी पहाड़ियाँ');
    // Winding river slab
    const river = box(14.8, 0.26, shock ? 0.8 : 1.75, mat(shock ? 0x60a5fa : 0x0284c7, { rough: 0.2, metal: 0.15 }), 0, -1.8, 0.8);
    group.add(river);
    pick(river, 'River & Water Resources', 'नदी व जल संसाधन');
    // Gram Sabha pavilion under sal/banyan tree
    const sabha = cyl(1.25, 1.35, 0.4, 8, mat(0xd4a373), -1.8, -1.68, -2.2);
    const roof = cone(1.5, 0.85, 8, mat(0x7b3fa0), -1.8, -0.5, -2.2);
    group.add(sabha, roof, cyl(0.1, 0.1, 1.0, 6, mat(0x8d6e63), -2.5, -1.1, -2.2), cyl(0.1, 0.1, 1.0, 6, mat(0x8d6e63), -1.1, -1.1, -2.2));
    pick(sabha, 'Institutions (Gram Sabha)', 'संस्थाएँ (ग्राम सभा)');
    addTree(-3.4, -1.85, -2.5, 1.15, 0x2e7d32);
    // Ancient stone torana arch (History)
    group.add(box(0.32, 1.8, 0.32, mat(0xb5651d), 2.3, -1.0, -2.4), box(0.32, 1.8, 0.32, mat(0xb5651d), 3.7, -1.0, -2.4), box(2.1, 0.32, 0.42, mat(0xc27046), 3.0, -0.05, -2.4));
    // Village homes & bazaar stalls (People & Economics)
    addHouse(4.6, -1.88, 2.3, 0xf3e0c2, 0xc0392b, 1.05);
    addHouse(2.7, -1.88, 2.6, 0xead5b4, 0xd97706, 0.95);
    addTree(5.4, -1.88, -1.5, 0.95, 0x388e3c);
    // Highlight beacon over focused node/lens
    const focusMap = {
      people: [4.6, 0.2, 2.3], place: [-4.3, 1.8, -2.0], time: [3.0, 1.1, -2.4],
      resources: [0, -0.4, 0.8], institutions: [-1.8, 0.7, -2.2], decisions: [0, 0.6, 0],
      varanasi: [0, 0.2, 0.8], leh: [-4.3, 1.8, -2.0], ranchi: [-2.2, 0.8, -1.8], chotanagpur: [-2.2, 0.8, -1.8], sundarbans: [4.6, 0.2, 2.3], bengaluru: [2.7, 0.2, 2.6],
    };
    const bp = focusMap[S.focus || S.place || 'decisions'] || [0, 0.6, 0];
    const beacon = sph(0.45, mat(0xffca28, { emissive: 0xffa000, emissiveIntensity: 0.85 }), bp[0], bp[1], bp[2]);
    group.add(beacon);
    animated.push({ fn: (t) => { beacon.position.y = bp[1] + Math.sin(t * 3.2) * 0.25; } });
    addLabel(new tk.THREE.Vector3(-4.3, 1.8, -2.0), 'Hills & Climate', 'पहाड़ व जलवायु');
    addLabel(new tk.THREE.Vector3(-1.8, 0.6, -2.2), 'Civic Sabha', 'नागरिक सभा');
    addLabel(new tk.THREE.Vector3(3.0, 0.7, -2.4), 'Heritage Arch', 'ऐतिहासिक द्वार');
    addLabel(new tk.THREE.Vector3(4.0, 0.0, 2.5), 'Market & Homes', 'बाज़ार व बस्ती');
  },

  // T03: Atmosphere Globe + Monsoon Watershed Valley
  T03(tk, S) {
    const { THREE, group, mat, box, cyl, cone, sph, addTree, addLabel, addPlinth, pick, animated } = tk;
    const isAtm = S.alt !== undefined;
    if (isAtm) {
      // Glowing Earth + concentric atmosphere shells + probe marker
      group.add(sph(2.2, mat(0x1f7a8c, { rough: 0.45 }), 0, -0.6, 0));
      group.add(sph(2.25, mat(0x4caf50, { rough: 0.8 }), 0.6, -0.4, 1.1));
      const shells = [
        [2.7, 0x38bdf8, 0.22, 'Troposphere', 'क्षोभमंडल'],
        [3.35, 0xa855f7, 0.16, 'Stratosphere (Ozone)', 'समतापमंडल (ओज़ोन)'],
        [4.0, 0xec4899, 0.12, 'Mesosphere', 'मध्यमंडल'],
      ];
      for (const [r, col, op, en, hi] of shells) {
        const sh = sph(r, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, wireframe: false, depthWrite: false }), 0, -0.6, 0);
        group.add(sh);
        pick(sh, en, hi);
      }
      const probeY = -0.6 + 2.25 + Math.min(2.3, (S.alt / 100) * 2.3);
      const probe = sph(0.28, mat(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 }), 0, probeY, 0);
      group.add(probe);
      addLabel(new THREE.Vector3(0, probeY + 0.5, 0), `Probe ${S.alt} km`, `जाँच यान ${S.alt} किमी`);
    } else {
      addPlinth(0x4f9153, 0x5d4436, 15.5, 10);
      const forestCount = Math.round(((S.forestPct ?? 45) / 100) * 14);
      const hill = cone(4.5, 3.0, 7, mat(0x528258), -4.2, -0.45, -1.2);
      group.add(hill);
      for (let i = 0; i < forestCount; i++) {
        addTree(-6.2 + (i % 5) * 1.15, -1.8 + (i < 5 ? 0.8 : 0.2), -2.8 + Math.floor(i / 5) * 1.8, 0.85);
      }
      // Dam & blue reservoir water level rising with checkDams & rain
      const dams = S.checkDams ?? 2;
      const waterH = 0.25 + Math.min(1.3, ((S.rainMm ?? 120) / 250) * 0.9);
      if (dams > 0) group.add(box(0.55, 1.35, 3.6, mat(0x78716c), 1.4, -1.25, 0.6));
      const pool = box(4.2, waterH, 3.4, mat(0x0284c7, { transparent: true, opacity: 0.8 }), -0.7, -1.9 + waterH / 2, 0.6);
      group.add(pool);
      pick(pool, 'Check-Dam Reservoir', 'चेक-डैम जलाशय');
      // Solar panels if S.solarPct > 0
      const solar = S.solarPct ?? 40;
      if (solar > 0) {
        const roof = box(2.4, 0.18, 1.6, mat(0x1d4ed8, { metal: 0.6, emissive: 0x1e3a8a, emissiveIntensity: 0.35 }), 4.6, -0.6, 1.6);
        roof.rotation.x = 0.35;
        group.add(box(2.6, 1.1, 2.0, mat(0xf4e4c1), 4.6, -1.35, 1.6), roof);
      }
      // Floating monsoon clouds
      const clouds = new THREE.Group();
      for (let i = 0; i < 3; i++) clouds.add(sph(0.75, mat(0xf8fafc), -4.5 + i * 0.9, 2.2 + (i % 2) * 0.25, -1.0));
      group.add(clouds);
      animated.push({ fn: (t) => { clouds.position.x = Math.sin(t * 0.7) * 1.4; } });
      addLabel(new THREE.Vector3(-4.2, 2.8, -1.0), 'Monsoon Clouds', 'मानसूनी बादल');
      addLabel(new tk.THREE.Vector3(1.4, -0.2, 0.6), 'Watershed Check-Dam', 'चेक-डैम जल संचयन');
    }
  },

  // T05: Ashokan Pillar, Stupa & Palm-Leaf Knowledge Courtyard
  T05(tk, S) {
    const { THREE, group, mat, box, cyl, cone, sph, addTree, addLabel, addPlinth, pick } = tk;
    addPlinth(0xd6be94, 0x7c5c43, 15, 10);
    // Hemispherical Sanchi-style Stupa
    const drum = cyl(2.6, 2.7, 0.85, 24, mat(0xb86843), -3.2, -1.45, -0.5);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xc9885b));
    dome.position.set(-3.2, -1.05, -0.5);
    const harmika = box(0.9, 0.55, 0.9, mat(0xe6c38d), -3.2, 1.4, -0.5);
    group.add(drum, dome, harmika);
    pick(dome, 'Ancient Brick Stupa', 'प्राचीन ईंट स्तूप');
    // Polished sandstone Ashokan Pillar
    const shaft = cyl(0.32, 0.44, 4.2, 18, mat(0xd9b07e, { rough: 0.35, metal: 0.15 }), 2.2, 0.2, 0.2);
    const cap = cyl(0.62, 0.42, 0.55, 14, mat(0xeab308, { metal: 0.45 }), 2.2, 2.45, 0.2);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 8, 20), mat(0xfacc15, { metal: 0.6 }));
    wheel.position.set(2.2, 3.15, 0.2);
    group.add(shaft, cap, wheel);
    pick(shaft, 'Polished Pillar Edict', 'पॉलिश स्तंभ अभिलेख');
    // Manuscript stone table & terracotta pots
    group.add(box(2.2, 0.45, 1.3, mat(0x9a7b56), 5.0, -1.65, 2.2), box(1.3, 0.12, 0.6, mat(0xfff1c9), 5.0, -1.35, 2.2));
    addTree(-5.8, -1.85, 3.2, 1.0, 0x4b8f4c);
    addLabel(new THREE.Vector3(-3.2, 2.0, -0.5), 'Monument & Stupa', 'स्मारक व स्तूप');
    addLabel(new THREE.Vector3(2.2, 3.6, 0.2), 'Stone Inscription Pillar', 'शिलालेख स्तंभ');
    addLabel(new THREE.Vector3(5.0, -0.7, 2.2), 'Palm-Leaf Archive', 'ताड़पत्र अभिलेख');
  },

  // T06: Circular Parliament & Gram Sabha Rotunda
  T06(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdcc5a1, 0x6b5344, 15, 10.5);
    const support = S.support ?? 62;
    const fell = !!(S.vote && support < 51 && (S.system || 'parliamentary') === 'parliamentary');
    // Concentric sandstone colonnade pillars
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 1.4 - Math.PI * 0.7;
      const pil = cyl(0.24, 0.28, 3.2, 12, mat(0xd49b6a), Math.sin(a) * 6.0, -0.3, -Math.cos(a) * 4.5);
      group.add(pil);
    }
    // 20 MP / citizen seats lighting green (support) vs coral (opposition)
    const greenN = Math.round((support / 100) * 20);
    for (let i = 0; i < 20; i++) {
      const row = i < 10 ? 0 : 1;
      const idx = i % 10;
      const ang = -1.25 + (idx / 9) * 2.5;
      const rad = 2.6 + row * 1.3;
      const col = i < greenN ? 0x16a34a : 0xdc2626;
      const seat = box(0.68, 0.55 + row * 0.35, 0.62, mat(col), Math.sin(ang) * rad, -1.6 + row * 0.2, Math.cos(ang) * rad - 0.5);
      group.add(seat);
    }
    // Speaker & Executive center podium
    const pod = cyl(1.2, 1.3, 0.6, 16, mat(fell ? 0xdc2626 : 0x0284c7, { emissive: fell ? 0x991b1b : 0x0369a1, emissiveIntensity: 0.3 }), 0, -1.55, -2.0);
    group.add(pod);
    pick(pod, 'Parliamentary Chamber', 'संसद व लोकतांत्रिक सभा');
    addLabel(new THREE.Vector3(0, 0.2, -2.0), fell ? 'Lost Confidence' : `Majority ${support}%`, fell ? 'विश्वासमत खोया' : `बहुमत ${support}%`);
    addLabel(new THREE.Vector3(3.4, -0.4, 1.5), 'Elected Seats', 'निर्वाचित प्रतिनिधि');
  },

  // T07: 3D Constituency Hex Grid & Seat Parliament Towers
  T07(tk, S) {
    const { THREE, group, mat, box, cyl, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdbe4ee, 0x475569, 15.5, 10);
    const cols = [0xdc2626, 0x2563eb, 0x16a34a, 0xd97706];
    const names = ['R', 'B', 'G', 'Y'];
    const swing = S.swing ?? 0;
    const blueBoost = Math.max(0, Math.round(swing / 4));
    for (let i = 0; i < 10; i++) {
      const r = Math.floor(i / 5), c = i % 5;
      const partyIdx = i < (3 + blueBoost) ? 1 : i < 7 ? 0 : i < 9 ? 2 : 3;
      const h = 1.1 + ((i * 7 + Math.abs(swing)) % 4) * 0.45;
      const hex = cyl(0.95, 1.0, h, 6, mat(cols[partyIdx]), -4.8 + c * 2.4, -1.9 + h / 2, -1.6 + r * 2.8);
      group.add(hex);
      pick(hex, `Constituency ${i + 1} (${names[partyIdx]})`, `क्षेत्र ${i + 1} (${names[partyIdx]})`);
    }
    addLabel(new THREE.Vector3(0, 1.4, -0.2), '10 Constituencies → Seat Towers', '10 निर्वाचन क्षेत्र → सीट स्तंभ');
  },

  // T08: Terraced Farm & Craft Resource Island (PPF / Scarcity / Safety Net)
  T08(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addTree, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0x7ca965, 0x6b4e3d, 15.5, 10);
    const a = S.a ?? 5, b = S.b ?? 5;
    const wheatN = Math.max(1, Math.min(8, Math.round((a / 12) * 8)));
    const vegN = Math.max(1, Math.min(8, Math.round((b / 12) * 8)));
    for (let i = 0; i < wheatN; i++) {
      const plot = box(1.2, 0.5 + (i % 2) * 0.25, 1.6, mat(0xeab308), -5.6 + (i % 4) * 1.45, -1.6, -1.8 + Math.floor(i / 4) * 2.2);
      group.add(plot);
      pick(plot, 'Golden Wheat Plots', 'गेहूँ के खेत');
    }
    for (let i = 0; i < vegN; i++) {
      const plot = box(1.2, 0.45 + (i % 2) * 0.2, 1.6, mat(0x16a34a), 1.4 + (i % 4) * 1.45, -1.6, -1.8 + Math.floor(i / 4) * 2.2);
      group.add(plot);
      pick(plot, 'Vegetable Terraces', 'सब्ज़ी की खेती');
    }
    addHouse(0, -1.88, 2.7, 0xf2dfc2, 0xb8522d, 1.15, !!S.tech);
    if (S.tech) {
      const solar = box(1.8, 0.14, 1.1, mat(0x2563eb, { emissive: 0x1d4ed8, emissiveIntensity: 0.4 }), 0, -0.1, 2.7);
      solar.rotation.x = 0.35;
      group.add(solar);
    }
    addTree(-6.2, -1.85, 3.0, 1.0);
    addLabel(new THREE.Vector3(-3.4, 0.1, -0.7), 'Grain Production', 'अनाज उत्पादन');
    addLabel(new THREE.Vector3(3.6, 0.1, -0.7), 'Vegetable & Craft Choice', 'सब्ज़ी व शिल्प विकल्प');
  },

  // T09: Living Mandi Balance Scales & Streetlight Village
  T09(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addHouse, addLabel, addPlinth, pick } = tk;
    const isStreet = S.k !== undefined || S.tax !== undefined;
    if (isStreet) {
      addPlinth(0x334155, 0x1e293b, 15.5, 10);
      const k = S.tax ? 10 : (S.k ?? 4);
      const lit = !!S.tax || k >= 6;
      for (let i = 0; i < 10; i++) {
        const side = i < 5 ? -1 : 1, x = -5.2 + (i % 5) * 2.6;
        const pays = !!S.tax || i < k;
        addHouse(x, -1.88, side * 2.7, pays ? 0xf7dfba : 0x64748b, pays ? 0xc2410c : 0x475569, 0.9, pays);
      }
      group.add(cyl(0.12, 0.15, 4.0, 10, mat(0x475569), 0, 0.1, 0));
      const bulb = sph(0.42, mat(lit ? 0xfacc15 : 0x334155, lit ? { emissive: 0xfde047, emissiveIntensity: 1.0 } : {}), 0, 2.25, 0);
      group.add(bulb);
      if (lit) group.add(tk.cone(3.6, 3.8, 18, new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.18, depthWrite: false }), 0, 0.1, 0));
      pick(bulb, 'Solar Community Streetlight', 'सौर सामुदायिक स्ट्रीटलाइट');
      addLabel(new THREE.Vector3(0, 3.0, 0), lit ? 'Streetlight ON!' : 'Needs More Payers', lit ? 'बत्ती जली!' : 'अधिक योगदान चाहिए');
    } else {
      addPlinth(0xe2c799, 0x7c5338, 15, 10);
      const p = S.price ?? 50, eqP = S.eqP ?? 50;
      const tilt = Math.max(-0.38, Math.min(0.38, (p - eqP) / 65));
      group.add(cyl(0.24, 0.45, 3.4, 14, mat(0xb45309, { metal: 0.55 }), 0, -0.2, 0));
      const beam = box(7.8, 0.22, 0.28, mat(0xd97706, { metal: 0.65 }), 0, 1.5, 0);
      beam.rotation.z = tilt;
      group.add(beam);
      const panL = cyl(1.3, 1.0, 0.25, 16, mat(0xdc2626), -3.4, 0.4 - Math.sin(tilt) * 3.4, 0);
      const panR = cyl(1.3, 1.0, 0.25, 16, mat(0x2563eb), 3.4, 0.4 + Math.sin(tilt) * 3.4, 0);
      group.add(panL, panR);
      pick(panL, 'Buyer Demand Crate', 'खरीदार माँग');
      pick(panR, 'Seller Supply Crate', 'विक्रेता पूर्ति');
      addLabel(new THREE.Vector3(-3.4, 1.2, 0), 'Demand (Buyers)', 'माँग (खरीदार)');
      addLabel(new THREE.Vector3(3.4, 1.2, 0), 'Supply (Sellers)', 'पूर्ति (विक्रेता)');
      addLabel(new THREE.Vector3(0, 2.3, 0), `Price ₹${Math.round(p)}`, `कीमत ₹${Math.round(p)}`);
    }
  },

  // T11: Sal-Forest & Sacred Grove Biosphere Diorama
  T11(tk, S) {
    const { THREE, group, mat, cyl, cone, sph, addTree, addLabel, addPlinth, pick } = tk;
    addPlinth(0x3f8f4e, 0x5c4033, 15.5, 10.5);
    // Sacred Grove stone sanctuary ring
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      group.add(cyl(0.22, 0.28, 0.65, 6, mat(0x94a3b8), Math.cos(a) * 1.9, -1.6, Math.sin(a) * 1.9));
    }
    const forestRatio = Math.max(0.2, Math.min(1, 1 - ((S.harvest ?? 40) / 180)));
    const count = Math.round(forestRatio * 18);
    for (let i = 0; i < count; i++) {
      const ang = i * 2.399;
      const rad = 1.2 + Math.sqrt(i + 1) * 1.25;
      addTree(Math.cos(ang) * rad * 1.2, -1.88, Math.sin(ang) * rad * 0.85, 0.8 + (i % 3) * 0.2, i % 2 ? 0x1b5e20 : 0x2e7d32);
    }
    // Forest stream + firewatch tower
    group.add(tk.box(14.5, 0.18, 1.25, mat(0x0ea5e9), 0, -1.84, 3.0));
    const tower = tk.box(0.85, 3.4, 0.85, mat(0x9a3412), 4.8, -0.2, -2.5);
    group.add(tower, cone(1.0, 0.8, 4, mat(0xca8a04), 4.8, 1.9, -2.5));
    pick(tower, 'Forest Watchtower & Sacred Grove', 'वन निरीक्षण मीनार व देव-कुंज');
    addLabel(new THREE.Vector3(0, 0.3, 0), 'Sacred Sal Grove', 'पवित्र साल देव-वन');
    addLabel(new THREE.Vector3(4.8, 2.5, -2.5), 'Biosphere Watch', 'जैवमंडल सुरक्षा');
  },

  // T13: Indian Ocean Spice & Silk Route 3D Globe
  T13(tk, S) {
    const { THREE, group, mat, sph, addLabel, pick, animated } = tk;
    const globe = sph(3.4, mat(0x0369a1, { rough: 0.4 }), 0, -0.3, 0);
    group.add(globe);
    // India + Eurasia + Africa sculpted slabs
    const india = sph(1.1, mat(0x4d9952), 0.3, 0.65, 3.0);
    india.scale.set(0.7, 0.9, 0.35);
    const africa = sph(1.3, mat(0xd9b36c), -2.4, 0.1, 2.1);
    africa.scale.set(0.6, 1.0, 0.5);
    const seAsia = sph(1.15, mat(0x52a866), 2.5, 0.2, 2.0);
    seAsia.scale.set(0.7, 0.7, 0.5);
    group.add(india, africa, seAsia);
    pick(india, 'Indian Ports (Lothal, Muziris, Tamralipti)', 'भारतीय बंदरगाह');
    // Glowing golden trade arcs
    const curve1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.2, 0.4, 3.35), new THREE.Vector3(-1.3, 0.8, 4.4), new THREE.Vector3(-2.3, 0.3, 2.7));
    const curve2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.6, 0.2, 3.3), new THREE.Vector3(1.8, 0.6, 4.2), new THREE.Vector3(2.6, 0.1, 2.5));
    for (const cv of [curve1, curve2]) {
      group.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 28, 0.08, 8, false), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })));
    }
    const ship = sph(0.22, mat(0xffffff, { emissive: 0xf59e0b, emissiveIntensity: 0.8 }), 0, 0.6, 4.0);
    group.add(ship);
    animated.push({
      fn: (t) => {
        const pt = curve2.getPoint((t * 0.28) % 1);
        ship.position.copy(pt);
      },
    });
    addLabel(new THREE.Vector3(0.3, 1.4, 3.4), 'India Spice Crossroads', 'भारतीय व्यापार संगम');
    addLabel(new THREE.Vector3(-2.4, 1.1, 2.4), 'Red Sea & Africa', 'लाल सागर व अफ़्रीका');
    addLabel(new THREE.Vector3(2.6, 1.0, 2.3), 'Suvarnabhumi (SE Asia)', 'दक्षिण-पूर्व एशिया');
  },

  // T14: Constitutional Hierarchy Steps & Justice Balance Scales
  T14(tk, S) {
    const { THREE, group, mat, box, cyl, addLabel, addPlinth, pick } = tk;
    addPlinth(0xe6d5b8, 0x6b4e3d, 15, 10);
    const active = S.escalated ? 2 : 1;
    for (let i = 0; i < 3; i++) {
      const w = 10 - i * 2.5, step = box(w, 0.85, 6.2 - i * 1.4, mat(i <= active ? 0xd97706 : 0xb8a389), 0, -1.55 + i * 0.85, 0);
      group.add(step);
      pick(step, ['Local Gram Sabha / Ward', 'District / State Court', 'Constitutional Apex'][i], ['ग्राम सभा / वार्ड', 'ज़िला / उच्च न्यायालय', 'संवैधानिक शीर्ष'][i]);
    }
    // Golden scales of justice at summit
    group.add(cyl(0.18, 0.25, 3.0, 12, mat(0xf59e0b, { metal: 0.7 }), 0, 1.8, 0));
    const arm = box(4.6, 0.14, 0.18, mat(0xfbbf24, { metal: 0.7 }), 0, 3.2, 0);
    if (!S.escalated) arm.rotation.z = 0.08;
    group.add(arm, cyl(0.95, 0.85, 0.2, 16, mat(0xfde047, { metal: 0.5 }), -2.1, 2.3, 0), cyl(0.95, 0.85, 0.2, 16, mat(0xfde047, { metal: 0.5 }), 2.1, 2.3, 0));
    addLabel(new THREE.Vector3(0, 3.8, 0), 'Rule of Law & Justice', 'कानून का शासन व न्याय');
    addLabel(new THREE.Vector3(0, -1.2, 3.0), 'Citizens & Local Sabha', 'नागरिक व ग्राम सभा');
  },

  // T15: Solar Craft Startup Stall & Break-Even Profit Towers
  T15(tk, S) {
    const { THREE, group, mat, box, cyl, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdbeafe, 0x475569, 15, 10);
    addHouse(-3.8, -1.88, 0, 0xfef3c7, 0x0284c7, 1.5, true);
    const solar = box(2.4, 0.14, 1.3, mat(0x1d4ed8, { emissive: 0x1e40af, emissiveIntensity: 0.4 }), -3.8, 0.4, 0);
    solar.rotation.x = 0.3;
    group.add(solar);
    const units = S.units ?? 120, price = S.price ?? 40, rev = (units * price) / 2000;
    const cost = ((S.fixed ?? 1500) + units * (S.varCost ?? 25)) / 2000;
    const revCol = box(1.8, Math.max(0.4, Math.min(5, rev)), 1.8, mat(0x16a34a), 1.4, -1.9 + Math.max(0.4, Math.min(5, rev)) / 2, 0);
    const costCol = box(1.8, Math.max(0.4, Math.min(5, cost)), 1.8, mat(0xef4444), 4.0, -1.9 + Math.max(0.4, Math.min(5, cost)) / 2, 0);
    group.add(revCol, costCol);
    pick(revCol, 'Sales Revenue Tower', 'बिक्री आय स्तंभ');
    pick(costCol, 'Total Cost Tower', 'कुल लागत स्तंभ');
    addLabel(new THREE.Vector3(-3.8, 1.3, 0), 'Solar Craft Stall', 'सौर शिल्प स्टॉल');
    addLabel(new THREE.Vector3(1.4, 2.3, 0), 'Revenue', 'आय');
    addLabel(new THREE.Vector3(4.0, 2.3, 0), 'Cost', 'लागत');
  },

  // T16: 3D Budget Coin Jars, Compounding Tree & Civic Town
  T16(tk, S) {
    const { THREE, group, mat, box, cyl, addTree, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0xf1f5f9, 0x64748b, 15.5, 10);
    const inc = S.income ?? 20000;
    const needs = Math.min(1, (S.needs ?? 11000) / Math.max(1, inc));
    const wants = Math.min(1, (S.wants ?? 5000) / Math.max(1, inc));
    const save = Math.max(0.05, 1 - needs - wants);
    const jars = [
      [-4.4, needs, 0x0284c7, 'Needs', 'आवश्यकताएँ'],
      [0, wants, 0xd97706, 'Wants', 'इच्छाएँ'],
      [4.4, save, 0x16a34a, 'Savings', 'बचत'],
    ];
    for (const [x, frac, col, en, hi] of jars) {
      const glass = cyl(1.3, 1.3, 3.4, 20, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.25, depthWrite: false }), x, -0.2, 0);
      const h = Math.max(0.25, frac * 3.2);
      const coins = cyl(1.12, 1.12, h, 20, mat(col, { metal: 0.35 }), x, -1.9 + h / 2, 0);
      group.add(glass, coins);
      pick(coins, en, hi);
      addLabel(new THREE.Vector3(x, 1.9, 0), `${en} ${Math.round(frac * 100)}%`, `${hi} ${Math.round(frac * 100)}%`);
    }
    if (S.years || S.tax) {
      addTree(0, -1.85, -3.2, 1.35, 0xeab308);
      addHouse(4.8, -1.85, -3.0, 0xfef3c7, 0x0284c7, 0.9, true);
    }
  },
};

export function createTheme3d(themeId) {
  const fn = BUILDERS[themeId];
  if (!fn) return null;
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
