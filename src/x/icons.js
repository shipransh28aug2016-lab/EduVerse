// Icon lookup across both vendored Lucide bundles (ISC).
import { ICONS as X } from '../../vendor/lucide/lucide-x.esm.js';
import { iconEl as base } from '../../vendor/lucide/lucide-icons.esm.js';

const NS = 'http://www.w3.org/2000/svg';
export function icon(name, { size = 18, strokeWidth = 2, className = 'icon' } = {}) {
  const def = X[name];
  if (!def) return base(name, { size, strokeWidth, className });
  const svg = document.createElementNS(NS, 'svg');
  for (const [k, v] of Object.entries({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: className, 'aria-hidden': 'true' })) svg.setAttribute(k, v);
  for (const [tag, attrs] of def) { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); svg.append(n); }
  return svg;
}
