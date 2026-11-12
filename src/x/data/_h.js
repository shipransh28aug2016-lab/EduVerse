// Authoring helpers for Class X chapter data. Coordinates are written (lat, lon), the way an atlas index lists them.
export const b = (en, hi) => ({ en, hi });
export const C = { gold: '#f5c451', teal: '#4fd1c5', coral: '#ff7a6b', violet: '#a78bfa', sky: '#60a5fa', green: '#86efac', pink: '#f9a8d4', orange: '#fdba74' };
export const pt = (lat, lon, en, hi, color = C.gold, h = 0) => ({ lat, lon, en, hi, color, h });
export const arc = (from, to, color = C.gold, en, hi) => ({ from: [from[1], from[0]], to: [to[1], to[0]], color, en, hi });
export const route = (pts, color = C.gold, o = {}) => ({ pts: pts.map(([la, lo]) => [lo, la]), color, ...o });
export const f = (lat, lon) => [lon, lat];
export const grp = (en, hi, color, states, h = 1) => ({ en, hi, color, states, h });
export const idea = (en, hi, den, dhi) => ({ en, hi, d: b(den, dhi) });
export const ev = (y, en, hi, den, dhi) => ({ y, en, hi, d: den ? b(den, dhi) : null });
export const q = (en, hi, opts, a, wen, whi) => ({ q: b(en, hi), o: opts.map(([e, h]) => b(e, h)), a, why: b(wen, whi) });
export const node = (en, hi, kids, den, dhi) => ({ en, hi, ...(kids ? { children: kids } : {}), ...(den ? { d: b(den, dhi) } : {}) });
export const step = (en, hi, den, dhi) => ({ en, hi, d: b(den, dhi) });
