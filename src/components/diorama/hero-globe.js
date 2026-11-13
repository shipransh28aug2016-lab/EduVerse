// Interactive Home Hero 3D Globe (decoupled from theme dioramas for lean Home boot).
import { makeToolkit } from './toolkit.js';

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

