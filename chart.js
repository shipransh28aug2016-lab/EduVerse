// Minimal SVG chart builder: labelled axes with units, grid, curves, areas, markers. Pure string output (numbers + escaped text only).
// Used by the market lab and externality lab; the same primitives will serve PPF, interest and climate graphs.
import { esc } from '../core/dom.js';

export class Chart {
  constructor({ w = 640, h = 430, m = { l: 62, r: 20, t: 18, b: 56 }, xMax, yMax, xMin = 0, yMin = 0, xTicks = 6, yTicks = 5, xLabel = '', yLabel = '', yPrefix = '', xSuffix = '' }) {
    Object.assign(this, { w, h, m, xMax, yMax, xMin, yMin, xTicks, yTicks, xLabel, yLabel, yPrefix, xSuffix });
    this.parts = []; this.over = [];
  }
  X = (v) => this.m.l + ((v - this.xMin) / (this.xMax - this.xMin)) * (this.w - this.m.l - this.m.r);
  Y = (v) => this.h - this.m.b - ((v - this.yMin) / (this.yMax - this.yMin)) * (this.h - this.m.t - this.m.b);
  invY = (py) => this.yMin + ((this.h - this.m.b - py) / (this.h - this.m.t - this.m.b)) * (this.yMax - this.yMin);
  add(s) { this.parts.push(s); return this; }
  top(s) { this.over.push(s); return this; }
  axes() {
    const { m, w, h } = this; const x0 = m.l, y0 = h - m.b;
    let g = '';
    for (let i = 0; i <= this.yTicks; i++) {
      const v = this.yMin + ((this.yMax - this.yMin) * i) / this.yTicks, y = this.Y(v);
      g += `<line class="grid" x1="${x0}" x2="${w - m.r}" y1="${y}" y2="${y}"/><text class="tick" x="${x0 - 8}" y="${y + 4}" text-anchor="end">${esc(this.yPrefix + Math.round(v))}</text>`;
    }
    for (let i = 0; i <= this.xTicks; i++) {
      const v = this.xMin + ((this.xMax - this.xMin) * i) / this.xTicks, x = this.X(v);
      g += `<line class="grid v" x1="${x}" x2="${x}" y1="${m.t}" y2="${y0}"/><text class="tick" x="${x}" y="${y0 + 18}" text-anchor="middle">${esc(Math.round(v) + this.xSuffix)}</text>`;
    }
    g += `<line class="axis" x1="${x0}" y1="${y0}" x2="${w - m.r + 6}" y2="${y0}"/><line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${m.t - 6}"/>`;
    g += `<path class="axis-head" d="M${w - m.r + 6},${y0} l-7,-4 l0,8 z"/><path class="axis-head" d="M${x0},${m.t - 6} l-4,7 l8,0 z"/>`;
    g += `<text class="axis-title" x="${(x0 + w - m.r) / 2}" y="${h - 10}" text-anchor="middle">${esc(this.xLabel)}</text>`;
    g += `<text class="axis-title" transform="translate(16,${(m.t + y0) / 2}) rotate(-90)" text-anchor="middle">${esc(this.yLabel)}</text>`;
    this.parts.unshift(g); return this;
  }
  // polyline from [x,y] data points
  line(pts, cls, { dash = false } = {}) {
    if (pts.length < 2) return this;
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${this.X(p[0]).toFixed(1)},${this.Y(p[1]).toFixed(1)}`).join('');
    return this.add(`<path class="${cls}" d="${d}" fill="none"${dash ? ' stroke-dasharray="6 5"' : ''}/>`);
  }
  poly(pts, cls) { return this.add(`<polygon class="${cls}" points="${pts.map((p) => `${this.X(p[0]).toFixed(1)},${this.Y(p[1]).toFixed(1)}`).join(' ')}"/>`); }
  hline(y, cls, x1 = this.xMin, x2 = this.xMax) { return this.add(`<line class="${cls}" x1="${this.X(x1)}" x2="${this.X(x2)}" y1="${this.Y(y)}" y2="${this.Y(y)}"/>`); }
  vline(x, cls, y1 = this.yMin, y2 = this.yMax) { return this.add(`<line class="${cls}" x1="${this.X(x)}" x2="${this.X(x)}" y1="${this.Y(y1)}" y2="${this.Y(y2)}"/>`); }
  dot(x, y, cls, r = 6) { return this.add(`<circle class="${cls}" cx="${this.X(x).toFixed(1)}" cy="${this.Y(y).toFixed(1)}" r="${r}"/>`); }
  text(x, y, s, cls = 'lbl', anchor = 'start', dx = 0, dy = 0) { return this.add(`<text class="${cls}" x="${(this.X(x) + dx).toFixed(1)}" y="${(this.Y(y) + dy).toFixed(1)}" text-anchor="${anchor}">${esc(s)}</text>`); }
  html({ label = '' } = {}) {
    return `<svg viewBox="0 0 ${this.w} ${this.h}" role="img" aria-label="${esc(label)}" class="chart" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${this.parts.join('')}${this.over.join('')}</svg>`;
  }
}
// sample a function over [lo,hi] keeping only points where fy>=0 (curves stop at the axis instead of going negative)
export function sampleCurve(f, lo, hi, n = 60, { xMax = Infinity, yMax = Infinity } = {}) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const p = lo + ((hi - lo) * i) / n, q = f(p);
    if (q >= 0 && q <= xMax && p <= yMax) pts.push([q, p]);   // [quantity, price]
  }
  return pts;
}
