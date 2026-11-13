// Open-source visualization & icon toolkit powered by vendored d3 (geo, scale, shape, force, array),
// topojson-client, world-atlas, datta07/INDIAN-SHAPEFILES, and lucide.
import * as d3 from '../../vendor/d3/d3-viz.esm.js';
import { iconEl, iconSvg } from '../../vendor/lucide/lucide-icons.esm.js';
import { esc } from '../core/dom.js';
import { pair as P } from '../core/i18n.js';

export { d3, iconEl, iconSvg };

export const GEO = { india: null, world: null, countries: null, borders: null, land: null, plates: null };
let geoPromise = null;

export function loadGeoAll() {
  if (geoPromise) return geoPromise;
  const base = new URL('../../data/geo/', import.meta.url);
  const safeJson = (file) => fetch(new URL(file, base)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  geoPromise = Promise.all([
    safeJson('india.simplified.json'),
    safeJson('countries-110m.json'),
    safeJson('land.simplified.json'),
    safeJson('plates.simplified.json'),
  ]).then(([india, world, land, plates]) => {
    GEO.india = india;
    GEO.world = world;
    if (world?.objects?.countries) {
      GEO.countries = d3.feature(world, world.objects.countries);
      GEO.borders = d3.mesh(world, world.objects.countries, (a, b) => a !== b);
    }
    GEO.land = land?.land || null;
    GEO.plates = plates?.plates || null;
    return GEO;
  });
  return geoPromise;
}

const INDIA_BOX = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[[68.1, 6.7], [68.1, 37.1], [97.4, 37.1], [97.4, 6.7], [68.1, 6.7]]],
  },
};

export function indiaProjection(w = 640, h = 440, pad = 18) {
  const target = GEO.india || INDIA_BOX;
  return d3.geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], target);
}

/**
 * Render an India map SVG using d3.geoMercator + simplified Indian state boundaries.
 * stateColors: Map/object mapping state STNAME_SH or code -> fill color.
 * markers: [{ lon, lat, r, fill, label:{en,hi}, badge?, pulse? }]
 * paths: [{ coords:[[lon,lat],...], stroke, width, dash?, label? }]
 */
export function indiaMapSvg({
  w = 640, h = 440, stateColors = {}, selectedState = '', markers = [], paths = [],
  bgClass = 'sea-fill', aria = 'Map of India', extraSvg = '',
} = {}) {
  const proj = indiaProjection(w, h, 20);
  const pathGen = d3.geoPath(proj);
  let g = `<defs><linearGradient id="viz-sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cfe9fb"/><stop offset="100%" stop-color="#e8f5fe"/></linearGradient><filter id="viz-sh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#0b3052" flood-opacity=".18"/></filter></defs>`;
  g += `<rect class="${bgClass}" x="0" y="0" width="${w}" height="${h}" rx="12" style="fill:url(#viz-sea)"/>`;

  // Graticule grid over India
  for (let lon = 70; lon <= 95; lon += 5) {
    const [x] = proj([lon, 22]);
    if (x > 20 && x < w - 20) g += `<line class="grid" x1="${x.toFixed(1)}" y1="10" x2="${x.toFixed(1)}" y2="${h - 10}" opacity=".45"/><text class="txt sm mut" x="${x.toFixed(1)}" y="${h - 6}" text-anchor="middle">${lon}°E</text>`;
  }
  for (let lat = 10; lat <= 35; lat += 5) {
    const [, y] = proj([80, lat]);
    if (y > 14 && y < h - 14) g += `<line class="grid" x1="10" y1="${y.toFixed(1)}" x2="${w - 10}" y2="${y.toFixed(1)}" opacity=".45"/><text class="txt sm mut" x="8" y="${(y - 3).toFixed(1)}">${lat}°N</text>`;
  }

  if (GEO.india?.features) {
    for (const f of GEO.india.features) {
      const name = f.properties.name;
      const code = f.properties.code;
      const d = pathGen(f) || '';
      const fill = stateColors[name] || stateColors[code] || '#dce7cf';
      const sel = selectedState && (selectedState === name || selectedState === code);
      g += `<path class="india-state${sel ? ' sel' : ''}" data-state="${esc(name)}" d="${d}" fill="${esc(fill)}" stroke="${sel ? 'var(--pri)' : '#5f6f52'}" stroke-width="${sel ? '2.2' : '0.85'}"/>`;
    }
  } else {
    // Graceful vector silhouette fallback before async GeoJSON fetch finishes
    const approx = [[74.8, 34.1], [77.5, 35.5], [79.0, 32.5], [81.0, 30.2], [88.5, 27.6], [96.5, 28.9], [94.8, 24.0], [92.5, 22.0], [88.2, 21.6], [85.0, 19.5], [80.3, 13.0], [77.5, 8.1], [75.8, 11.2], [72.8, 19.0], [69.0, 22.8], [71.0, 27.5], [74.5, 31.8]];
    const d = 'M' + approx.map((c) => proj(c).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
    g += `<path class="land-fill" d="${d}" opacity=".65"/>`;
  }

  for (const p of paths) {
    const pts = p.coords.map((c) => proj(c));
    const d = d3.line().curve(d3.curveMonotoneX)(pts);
    if (d) g += `<path d="${d}" fill="none" stroke="${esc(p.stroke || 'var(--pri)')}" stroke-width="${p.width || 3}" ${p.dash ? `stroke-dasharray="${p.dash}"` : ''} stroke-linecap="round"/>`;
  }

  for (const m of markers) {
    const pt = proj([m.lon, m.lat]);
    if (!pt) continue;
    const [x, y] = pt;
    const r = m.r || 6;
    if (m.pulse) g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r + 5}" fill="${esc(m.fill || 'var(--pri)')}" opacity=".25"/>`;
    g += `<circle class="map-pin" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${esc(m.fill || 'var(--pri)')}" stroke="#fff" stroke-width="2"/>`;
    if (m.label) {
      const txt = typeof m.label === 'string' ? m.label : P(m.label.en, m.label.hi);
      const anchor = m.anchor || (x > w * 0.72 ? 'end' : 'start');
      const dx = anchor === 'end' ? -(r + 4) : (r + 4);
      g += `<text class="txt sm b" x="${(x + dx).toFixed(1)}" y="${(y + (m.dy ?? 4)).toFixed(1)}" text-anchor="${anchor}" style="paint-order:stroke;stroke:var(--card);stroke-width:3px">${esc(txt)}</text>`;
    }
  }

  if (extraSvg) g += extraSvg;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart geomap" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

/**
 * Render a world map using d3-geo (NaturalEarth1 or Orthographic globe) + world-atlas countries.
 */
export function worldMapSvg({
  w = 640, h = 340, mode = 'natural', rotate = [-78, -20], bounds = null,
  countryFills = {}, markers = [], arcs = [], aria = 'World map', extraSvg = '',
} = {}) {
  let proj;
  if (mode === 'ortho') {
    proj = d3.geoOrthographic().scale(Math.min(w, h) * 0.44).translate([w / 2, h / 2]).rotate(rotate).clipAngle(90);
  } else if (bounds) {
    proj = d3.geoNaturalEarth1().fitExtent([[12, 12], [w - 12, h - 12]], bounds);
  } else {
    proj = d3.geoNaturalEarth1().scale(w / 5.7).translate([w / 2, h / 2 + 10]);
  }
  const pathGen = d3.geoPath(proj);
  let g = '';
  if (mode === 'ortho') {
    g += `<path d="${pathGen({ type: 'Sphere' })}" class="sea-fill" stroke="var(--line)" stroke-width="1.5"/>`;
  } else {
    g += `<rect class="sea-fill" x="0" y="0" width="${w}" height="${h}" rx="10"/>`;
  }
  g += `<path d="${pathGen(d3.geoGraticule10()) || ''}" fill="none" stroke="var(--line)" stroke-width="0.6" opacity=".6"/>`;

  if (GEO.countries?.features) {
    for (const f of GEO.countries.features) {
      const d = pathGen(f);
      if (!d) continue;
      const fill = countryFills[f.id] || countryFills[f.properties?.name] || '#c9d7b8';
      g += `<path d="${d}" fill="${esc(fill)}" stroke="#6e7c61" stroke-width="0.55"/>`;
    }
  } else if (GEO.land) {
    const d = pathGen({ type: 'MultiPolygon', coordinates: GEO.land });
    if (d) g += `<path d="${d}" fill="#c9d7b8" stroke="#6e7c61" stroke-width="0.6"/>`;
  }

  for (const a of arcs) {
    const geoArc = { type: 'LineString', coordinates: a.coords };
    const d = pathGen(geoArc);
    if (d) g += `<path d="${d}" fill="none" stroke="${esc(a.stroke || 'var(--pri)')}" stroke-width="${a.width || 2.8}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} stroke-linecap="round"/>`;
  }

  for (const m of markers) {
    const pt = proj([m.lon, m.lat]);
    if (!pt) continue;
    // If orthographic, check visibility on front hemisphere
    if (mode === 'ortho') {
      const vis = d3.geoPath(proj)({ type: 'Point', coordinates: [m.lon, m.lat] });
      if (!vis) continue;
    }
    const [x, y] = pt;
    const r = m.r || 6;
    g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${esc(m.fill || 'var(--d)')}" stroke="#fff" stroke-width="2"/>`;
    if (m.label) {
      const txt = typeof m.label === 'string' ? m.label : P(m.label.en, m.label.hi);
      g += `<text class="txt sm b" x="${(x + r + 4).toFixed(1)}" y="${(y + (m.dy ?? 4)).toFixed(1)}" style="paint-order:stroke;stroke:var(--card);stroke-width:3px">${esc(txt)}</text>`;
    }
  }
  if (extraSvg) g += extraSvg;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart geomap" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

/**
 * Deterministic d3-force concept/network layout rendered directly to clean interactive SVG.
 */
export function forceGraphSvg({
  w = 640, h = 360, nodes = [], links = [], activeId = '', aria = 'Concept network',
} = {}) {
  const simNodes = nodes.map((n, i) => {
    const ang = (i / Math.max(1, nodes.length)) * Math.PI * 2;
    return { ...n, x: n.fx ?? (w / 2 + Math.cos(ang) * (w * 0.28)), y: n.fy ?? (h / 2 + Math.sin(ang) * (h * 0.28)) };
  });
  const byId = new Map(simNodes.map((n) => [n.id, n]));
  const simLinks = links.map((l) => ({ ...l, source: byId.get(l.source) || l.source, target: byId.get(l.target) || l.target })).filter((l) => l.source && l.target);

  const sim = d3.forceSimulation(simNodes)
    .force('link', d3.forceLink(simLinks).id((d) => d.id).distance((d) => d.dist || 115).strength(0.8))
    .force('charge', d3.forceManyBody().strength(-360))
    .force('collide', d3.forceCollide().radius((d) => (d.r || 48) + 8))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('x', d3.forceX(w / 2).strength(0.09))
    .force('y', d3.forceY(h / 2).strength(0.12))
    .stop();

  for (let i = 0; i < 180; i++) sim.tick();
  for (const n of simNodes) {
    n.x = Math.max(76, Math.min(w - 76, n.x));
    n.y = Math.max(36, Math.min(h - 36, n.y));
  }

  let g = `<defs><marker id="fg-ar" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0,0 L9,3.5 L0,7 z" fill="var(--mut)"/></marker></defs>`;
  for (const l of simLinks) {
    const hi = activeId && (l.source.id === activeId || l.target.id === activeId);
    const sx = l.source.x, sy = l.source.y, tx = l.target.x, ty = l.target.y;
    const mx = (sx + tx) / 2, my = (sy + ty) / 2 - 14;
    g += `<path d="M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}" fill="none" stroke="${hi ? 'var(--pri)' : 'var(--line)'}" stroke-width="${hi ? 3 : 1.8}" marker-end="url(#fg-ar)"/>`;
    if (l.label) {
      const lbl = typeof l.label === 'string' ? l.label : P(l.label.en, l.label.hi);
      g += `<text class="txt sm mut" x="${mx.toFixed(1)}" y="${(my + 4).toFixed(1)}" text-anchor="middle" style="paint-order:stroke;stroke:var(--card);stroke-width:3px">${esc(lbl)}</text>`;
    }
  }
  for (const n of simNodes) {
    const on = n.id === activeId;
    const rw = n.rw || 124, rh = n.rh || 38;
    const fill = on ? 'var(--pri)' : (n.fill || 'var(--card)');
    const stroke = on ? 'var(--pri)' : (n.stroke || 'var(--ink)');
    const txtCol = on ? 'var(--pri-ink)' : 'var(--ink)';
    const lbl = typeof n.label === 'string' ? n.label : P(n.label.en, n.label.hi);
    const shortLbl = lbl.length > 22 ? lbl.slice(0, 20) + '…' : lbl;
    g += `<g class="fg-node${on ? ' on' : ''}" data-id="${esc(n.id)}"><rect x="${(n.x - rw / 2).toFixed(1)}" y="${(n.y - rh / 2).toFixed(1)}" width="${rw}" height="${rh}" rx="10" fill="${esc(fill)}" stroke="${esc(stroke)}" stroke-width="${on ? 3 : 1.8}"/><text x="${n.x.toFixed(1)}" y="${(n.y + 4).toFixed(1)}" text-anchor="middle" fill="${esc(txtCol)}" font-size="12" font-weight="${on ? '700' : '600'}">${esc(shortLbl)}</text></g>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
