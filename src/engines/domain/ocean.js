// Ocean engine: tides, waves vs tsunami speed, 3D ocean-floor relief (T10.L1), and sustainable fisheries (T10.L3).
export const G = 9.81;
export const M2 = 12.4206, S2 = 12;
export const SYNODIC_DAYS = 29.53;
export const MOON_PHASES = [{ id: 'new', deg: 0 }, { id: 'first', deg: 90 }, { id: 'full', deg: 180 }, { id: 'last', deg: 270 }];

export function tidalRange(phaseDeg, am = 1, as = 0.46) {
  const p = (phaseDeg * Math.PI) / 180;
  return 2 * Math.sqrt(am * am + as * as + 2 * am * as * Math.cos(2 * p));
}
const RAD = Math.PI / 180;
export function tideHeight(t, psi0 = 0, am = 1, as = 0.46) {
  const wm = (2 * Math.PI) / M2, psi = psi0 * RAD + (2 * Math.PI * t) / (24 * SYNODIC_DAYS);
  return am * Math.cos(wm * t) + as * Math.cos(wm * t + 2 * psi);
}
export function tideSeries(psi0 = 0, hours = 72, stepH = 0.5, am = 1, as = 0.46) {
  const out = []; for (let t = 0; t <= hours + 1e-9; t += stepH) out.push({ t, h: tideHeight(t, psi0, am, as) }); return out;
}
export const tsunamiSpeed = (depthM) => Math.sqrt(G * depthM);
export const tsunamiKmh = (depthM) => tsunamiSpeed(depthM) * 3.6;
export const windWaveSpeed = (wavelengthM) => Math.sqrt((G * wavelengthM) / (2 * Math.PI));
export const arrivalHours = (distKm, depthM) => distKm / tsunamiKmh(depthM);
export function warning({ distKm, depthM, sirenMinutes = 0 }) {
  const h = arrivalHours(distKm, depthM), minutes = h * 60;
  return { hours: h, minutes, timeToEvacuate: Math.max(0, minutes - sirenMinutes) };
}

/** Ocean-floor bathymetric profile generator for T10.L1 (x: 0..100, depth in m positive downward). */
export function oceanProfile({ shelfKm = 80, trenchDepthM = 8500, ridgeHeightM = 2500 } = {}) {
  const pts = [];
  const shelfEnd = 8 + (shelfKm / 200) * 18;
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 100;
    let d;
    if (x <= shelfEnd) d = 50 + (x / shelfEnd) * 150;
    else if (x <= shelfEnd + 10) d = 200 + ((x - shelfEnd) / 10) * 3600;
    else if (x < 46) d = 3800 + Math.sin((x - 30) * 0.4) * 180;
    else if (x <= 58) d = 3900 - ridgeHeightM * Math.exp(-((x - 52) ** 2) / 12);
    else if (x < 72) d = 4000 - (Math.abs(x - 65) < 3 ? 1100 * (1 - Math.abs(x - 65) / 3) : 0);
    else if (x <= 84) d = 4000 + (trenchDepthM - 4000) * Math.exp(-((x - 78) ** 2) / 9);
    else d = 3200 - (x - 84) * 180;
    pts.push({ x, depthM: Math.max(0, Math.round(d)) });
  }
  return pts;
}

/** Coastal fishery & livelihood sustainability model for T10.L3. */
export function fisheryRun({ boats = 40, meshMm = 45, closedMonths = 2, mangrovePct = 60, years = 25 } = {}) {
  const K = 600 + mangrovePct * 4;
  const juvenileLoss = meshMm < 35 ? 1.45 : meshMm < 50 ? 1.05 : 0.85;
  const seasonalFactor = 1 - (closedMonths / 12) * 0.75;
  const effort = boats * juvenileLoss * seasonalFactor * 1.4;
  let stock = 0.75 * K;
  const series = [stock];
  let totalCatch = 0;
  for (let y = 1; y <= years; y++) {
    const r = 0.42 * (0.65 + 0.35 * (mangrovePct / 100));
    const growth = r * stock * (1 - stock / K);
    const catchY = Math.min(stock * 0.7, (effort / 100) * stock * 0.65);
    stock = Math.max(0, stock + growth - catchY);
    totalCatch += catchY;
    series.push(stock);
  }
  const sustainable = stock >= 0.3 * K;
  return { series, finalStock: stock, totalCatch, sustainable, K };
}
