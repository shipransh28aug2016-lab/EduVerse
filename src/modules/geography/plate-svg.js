// 2D SVG drawing of a plate-boundary profile (section view, or plan view for transform faults).
// This is the always-available fallback (no WebGL / low graphics) AND the labelled cross-section next to the 3D view.
import { esc } from '../../core/dom.js';
import { t } from '../../core/i18n.js';

export function svgProfile(p, { labels = true, W = 720, H = 400 } = {}) {
  const { x0, x1, y0, y1 } = p.bounds, sx = W / (x1 - x0), sy = H / (y1 - y0), s = Math.min(sx, sy);
  const ox = (W - (x1 - x0) * s) / 2, oy = (H - (y1 - y0) * s) / 2;
  const X = (x) => (ox + (x - x0) * s).toFixed(1);
  const plan = p.view === 'plan';
  const Y = (y) => (plan ? (oy + (y - y0) * s) : (oy + (y1 - y) * s)).toFixed(1); // plan view: +z drawn downward
  const poly = (pts) => pts.map(([a, b]) => `${X(a)},${Y(b)}`).join(' ');
  let g = `<svg viewBox="0 0 ${W} ${H}" class="chart pl" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="${esc(t(plan ? 'pb.svg.plan' : 'pb.svg.section'))}"><rect width="${W}" height="${H}" class="pl-bg ${plan ? 'plan' : 'sec'}"/>`;
  const order = ['mantle', 'magma', 'oceanic', 'continental', 'continental2', 'newcrust', 'water'];
  [...p.shapes].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind)).forEach((sh) => { g += `<polygon class="pl-${sh.kind}" points="${poly(sh.pts)}"/>`; });
  for (const line of p.strata) g += `<polyline class="pl-strata${plan ? ' road' : ''}" fill="none" points="${poly(line)}"/>`;
  for (const c of p.cones) g += `<polygon class="pl-cone" points="${X(c.x - c.r)},${Y(c.y)} ${X(c.x)},${Y(c.y + c.h)} ${X(c.x + c.r)},${Y(c.y)}"/><circle class="pl-lava" cx="${X(c.x)}" cy="${Y(c.y + c.h)}" r="${(0.1 * s).toFixed(1)}"/>`;
  for (const f of p.foci) g += `<circle class="pl-focus" cx="${X(f.x)}" cy="${Y(f.y)}" r="${(0.13 * s).toFixed(1)}"/>`;
  if (plan) { const st = p.stress ?? 0; g += `<line class="pl-fault" style="stroke-opacity:${(0.35 + 0.65 * st).toFixed(2)}" x1="${X(0)}" x2="${X(0)}" y1="${Y(y0 + 0.8)}" y2="${Y(y1 - 0.8)}"/>`; }
  for (const a of p.arrows) {
    const len = (a.small ? 0.9 : 1.4) * s, d = a.dir;
    if (plan) { const cx = +X(a.x), cy = +Y(a.y); const dz = a.zdir; g += `<g class="pl-arrow plate"><line x1="${cx}" y1="${cy - dz * len}" x2="${cx}" y2="${cy + dz * len}"/><polygon points="${cx - 7},${cy + dz * len - dz * 9} ${cx + 7},${cy + dz * len - dz * 9} ${cx},${cy + dz * len + dz * 5}"/></g>`; }
    else { const cx = +X(a.x), cy = +Y(a.y); g += `<g class="pl-arrow ${a.kind}"><line x1="${cx - d * len / 2}" y1="${cy}" x2="${cx + d * len / 2}" y2="${cy}"/><polygon points="${cx + d * len / 2 - d * 9},${cy - 6} ${cx + d * len / 2 - d * 9},${cy + 6} ${cx + d * len / 2 + d * 5},${cy}"/></g>`; }
  }
  if (labels) for (const l of p.labels) g += `<text class="pl-lbl" x="${X(l.x)}" y="${Y(l.y)}" text-anchor="middle">${esc(t(l.key))}</text>`;
  return g + '</svg>';
}
