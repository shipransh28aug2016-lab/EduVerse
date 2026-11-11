// Geometry for the plate-boundary explorer, derived ONLY from tectonicState(). The 3D scene and the 2D SVG section both draw this
// same output, so they cannot disagree. Scene units are schematic (labelled "not to scale" in the UI).
import { tectonicState } from './models.js';

const MAX_VIS_KM = 3000;                  // distance at which plate motion fills its visual range
const vis = (km, range) => range * Math.min(1, km / MAX_VIS_KM);
const A = (deg) => (deg * Math.PI) / 180;
const ALPHA = A(32), CA = Math.cos(ALPHA), SA = Math.sin(ALPHA);

export function profile(type, speed, time) {
  const st = tectonicState(type, speed, time);
  const out = { state: st, view: type === 'trans' ? 'plan' : 'section', shapes: [], strata: [], cones: [], foci: [], arrows: [], labels: [], bounds: { x0: -9, x1: 9, y0: -4, y1: 3.2 } };
  const add = (id, kind, pts) => out.shapes.push({ id, kind, pts });
  const mantle = (x0, x1) => add('mantle', 'mantle', [[x0, -3.8], [x1, -3.8], [x1, -0.9], [x0, -0.9]]);

  if (type === 'conv-oc') {
    const s = st.slab, tr = 0.5 * st.trench, L = 5.2 * s, xt = -0.6;
    const slabTop = (x) => (x <= xt ? -tr : -tr - (x - xt) * Math.tan(ALPHA));
    const tipX = xt + L * CA;
    mantle(-8.5, 8.5);
    // oceanic plate: flat, bends into the trench, then descends as the slab
    const top = [[-8, 0], [xt - 1.6, 0], [xt, -tr]], bot = [[-8, -0.9], [xt - 1.6, -0.9], [xt, -tr - 0.9]];
    if (L > 0.01) { top.push([tipX, slabTop(tipX)]); bot.push([tipX, slabTop(tipX) - 0.9 / CA]); }
    add('oceanic', 'oceanic', [...top, ...bot.reverse()]);
    // continental plate rests on the descending slab
    const cx = []; for (let x = xt + 0.2; x <= 8.001; x += 0.4) cx.push(x);
    const pts = [[xt + 0.2, -0.2], [xt + 1.6, 0.4], [8, 0.4]];
    const bottom = cx.map((x) => [x, x > tipX ? -1.1 : Math.max(-1.1, slabTop(x))]).reverse();
    add('continental', 'continental', [...pts, ...bottom]);
    add('water', 'water', [[-8, 0], [xt - 1.6, 0], [xt, -tr], [xt + 0.2, -0.2], [xt + 0.2, 0.25], [-8, 0.25]]);
    for (let k = 0; k < 3; k++) if (st.arc > 0.03) out.cones.push({ x: xt + 2.8 + k * 1.2, y: 0.4, h: 1.0 * st.arc * (0.75 + 0.25 * k), r: 0.45 });
    const n = Math.round(st.quakes * 8);
    for (let i = 0; i < n; i++) { const u = 0.4 + (i / 8) * Math.max(L - 0.3, 0.01); out.foci.push({ x: xt + u * CA, y: -tr - u * SA - 0.35 }); }
    out.arrows.push({ x: -6, y: 0.7, dir: 1, kind: 'plate' }, { x: 6.5, y: 0.95, dir: -1, kind: 'plate', small: true });
    out.labels.push({ key: 'pb.lbl.oceanic', x: -5.5, y: -0.45 }, { key: 'pb.lbl.continental', x: 5.2, y: -0.4 }, { key: 'pb.lbl.mantle', x: 0, y: -2.9 });
    if (st.trench > 0.2) out.labels.push({ key: 'pb.lbl.trench', x: xt - 1.2, y: -tr - 0.55 });
    if (st.arc > 0.3) out.labels.push({ key: 'pb.lbl.volcano', x: xt + 4.0, y: 1.6 });
    if (L > 1) out.labels.push({ key: 'pb.lbl.subduct', x: xt + L * CA * 0.55 + 0.4, y: -tr - L * SA * 0.55 - 1.3 });
  }

  if (type === 'conv-cc') {
    const U = st.uplift, W = 2.0 + 1.4 * st.crumple;
    const topY = (x) => 0.4 + U * 2.6 * Math.exp(-((x / W) ** 2));
    const rootY = (x) => -1.1 - U * 1.5 * Math.exp(-((x / (W * 1.2)) ** 2));
    mantle(-8.5, 8.5);
    const xs = []; for (let x = -8; x <= 8.001; x += 0.5) xs.push(+x.toFixed(2));
    const left = xs.filter((x) => x <= 0), right = xs.filter((x) => x >= 0);
    add('contL', 'continental', [...left.map((x) => [x, topY(x)]), ...left.map((x) => [x, rootY(x)]).reverse()]);
    add('contR', 'continental2', [...right.map((x) => [x, topY(x)]), ...right.map((x) => [x, rootY(x)]).reverse()]);
    for (const d of [-0.3, -0.7]) out.strata.push(xs.map((x) => [x, d + U * 2.6 * 0.8 * Math.exp(-((x / W) ** 2)) * (d === -0.3 ? 1 : 0.55)]));
    out.arrows.push({ x: -6, y: 0.9, dir: 1, kind: 'plate' }, { x: 6, y: 0.9, dir: -1, kind: 'plate' });
    out.labels.push({ key: 'pb.lbl.contL', x: -5.2, y: -0.3 }, { key: 'pb.lbl.contR', x: 5.2, y: -0.3 }, { key: 'pb.lbl.mantle', x: 0, y: -2.9 });
    if (U > 0.25) out.labels.push({ key: 'pb.lbl.fold', x: 0, y: topY(0) + 0.6 });
    if (U > 0.5) out.labels.push({ key: 'pb.lbl.root', x: 0, y: rootY(0) - 0.4 });
  }

  if (type === 'div') {
    const g = vis(st.newCrustKm, 4), half = g / 2;
    mantle(-9 - half, 9 + half);
    add('divL', 'oceanic', [[-8.5 - half, 0], [-half, 0], [-half, -0.9], [-8.5 - half, -0.9]]);
    add('divR', 'oceanic', [[half, 0], [8.5 + half, 0], [8.5 + half, -0.9], [half, -0.9]]);
    if (g > 0.05) { const r = 0.55 * st.ridge; add('newcrust', 'newcrust', [[-half, -0.9], [-half, 0], [-half * 0.5, 0 + r * 0.6], [0, r], [half * 0.5, r * 0.6], [half, 0], [half, -0.9]]); }
    if (st.magma > 0.02) add('magma', 'magma', [[-0.3 - half * 0.4, -3.8], [0.3 + half * 0.4, -3.8], [0.18 + half * 0.2, -0.9], [-0.18 - half * 0.2, -0.9]]);
    add('water', 'water', [[-8.5 - half, 0], [8.5 + half, 0], [8.5 + half, 1.2], [-8.5 - half, 1.2]]);
    if (st.ridge > 0.35) out.cones.push({ x: 0, y: 0.55 * st.ridge, h: 0.5 * st.ridge, r: 0.3 });
    out.arrows.push({ x: -5.5 - half, y: 0.55, dir: -1, kind: 'plate' }, { x: 5.5 + half, y: 0.55, dir: 1, kind: 'plate' });
    out.labels.push({ key: 'pb.lbl.plateL', x: -5.5 - half, y: -0.45 }, { key: 'pb.lbl.plateR', x: 5.5 + half, y: -0.45 }, { key: 'pb.lbl.mantle', x: -5, y: -2.9 });
    if (g > 0.3) out.labels.push({ key: 'pb.lbl.newcrust', x: 0, y: 1.5 });
    if (st.magma > 0.3) out.labels.push({ key: 'pb.lbl.magma', x: 0, y: -2.3 });
    out.bounds = { x0: -9 - half, x1: 9 + half, y0: -4, y1: 3.2 };
  }

  if (type === 'trans') {
    const off = vis(st.offsetKm, 3);
    out.bounds = { x0: -9, x1: 9, y0: -5.5, y1: 5.5 };
    add('transL', 'oceanic', [[-8, -4 + off / 2], [0, -4 + off / 2], [0, 4 + off / 2], [-8, 4 + off / 2]]);
    add('transR', 'continental', [[0, -4 - off / 2], [8, -4 - off / 2], [8, 4 - off / 2], [0, 4 - off / 2]]);
    out.strata.push([[-8, off / 2], [0, off / 2]], [[0, -off / 2], [8, -off / 2]]); // the “road” drawn across the fault, displaced by the slip
    out.arrows.push({ x: -4, y: 0.0, dir: 1, kind: 'plate', plan: true, zdir: 1 }, { x: 4, y: 0.0, dir: -1, kind: 'plate', plan: true, zdir: -1 });
    out.labels.push({ key: 'pb.lbl.plateL', x: -5, y: -3 }, { key: 'pb.lbl.plateR', x: 5, y: 3 }, { key: 'pb.lbl.fault', x: 0, y: 4.9 });
    if (off > 0.1) out.labels.push({ key: 'pb.lbl.offset', x: 0, y: -4.8 });
    out.stress = st.stress;
  }
  if (out.view === 'section') { // mantle convection: warm rock moves with the plates at the top, returns at depth (schematic)
    const d = type === 'div' ? -1 : 1;
    out.arrows.push({ x: -4, y: -1.7, dir: d, kind: 'mantle' }, { x: 4, y: -1.7, dir: -d, kind: 'mantle' }, { x: -4, y: -3.3, dir: -d, kind: 'mantle' }, { x: 4, y: -3.3, dir: d, kind: 'mantle' });
  }
  return out;
}
export const shoelace = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
