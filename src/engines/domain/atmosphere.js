// Atmosphere & climate engine: ISA 1976 layers, diurnal coastal breeze, climate station data (T03.L2),
// Indian monsoon corridors (T03.L3), rainfall-runoff catchment balance (T03.L5), and carbon footprint (T03.L6).
export const LAYERS = [
  { id: 'troposphere', from: 0, to: 12 }, { id: 'stratosphere', from: 12, to: 50 }, { id: 'mesosphere', from: 50, to: 85 }, { id: 'thermosphere', from: 85, to: 600 },
];
export const COMPOSITION = [{ id: 'N2', pct: 78.08 }, { id: 'O2', pct: 20.95 }, { id: 'Ar', pct: 0.93 }, { id: 'CO2', pct: 0.042 }, { id: 'other', pct: 0.0 }];
const ISA = [[0, 15, -6.5], [11, -56.5, 0], [20, -56.5, 1.0], [32, -44.5, 2.8], [47, -2.5, 0], [51, -2.5, -2.8], [71, -58.5, -2.0], [86, -86.5, 0]];
export const layerAt = (km) => LAYERS.find((l) => km >= l.from && km < l.to) ?? LAYERS[LAYERS.length - 1];
export function temperatureC(km) {
  const h = Math.min(Math.max(km, 0), 86); let i = ISA.length - 1; while (ISA[i][0] > h) i--;
  return ISA[i][1] + ISA[i][2] * (h - ISA[i][0]);
}
const G0 = 9.80665, R = 287.053, P0 = 1013.25;
export function pressureHPa(km) {
  const h = Math.min(Math.max(km, 0), 86); let P = P0;
  for (let i = 0; i < ISA.length - 1 && ISA[i][0] < h; i++) {
    const [h0, t0, L] = ISA[i], top = Math.min(h, ISA[i + 1][0]), T0 = t0 + 273.15, dh = (top - h0) * 1000;
    P *= L === 0 ? Math.exp((-G0 * dh) / (R * T0)) : (1 + (L / 1000 * dh) / T0) ** (-G0 / (R * (L / 1000)));
  }
  return P;
}
export const massBelow = (km) => 1 - pressureHPa(km) / P0;
export const DIURNAL = { land: 8, sea: 1 };
export const tempAt = (hour, mean, amp) => mean + amp * Math.sin(((hour - 9) / 24) * 2 * Math.PI);
export function localWind({ hour, mean = 28, landAmp = DIURNAL.land, seaAmp = DIURNAL.sea, cloud = 0 }) {
  const f = 1 - 0.5 * Math.min(1, Math.max(0, cloud));
  const land = tempAt(hour, mean, landAmp * f), sea = tempAt(hour, mean, seaAmp), dT = land - sea;
  const speed = Math.min(12, Math.abs(dT) * (dT < 0 ? 0.7 : 1.1));
  const kind = Math.abs(dT) < 0.5 ? 'calm' : dT > 0 ? 'sea-breeze' : 'land-breeze';
  return { land, sea, dT, speed, kind, surfaceFlow: kind === 'sea-breeze' ? 'sea→land' : kind === 'land-breeze' ? 'land→sea' : 'none' };
}

/** Representative monthly normals (illustrative textbook station figures, Jan..Dec). */
export const STATIONS = {
  mumbai: {
    en: 'Mumbai (Coastal)', hi: 'मुंबई (तटीय)', lat: 19.1, lon: 72.9, elev: 14,
    temp: [24, 25, 27, 29, 30, 29, 27, 27, 28, 29, 28, 25],
    rain: [1, 1, 0, 1, 18, 520, 790, 540, 310, 85, 12, 3],
  },
  jaipur: {
    en: 'Jaipur (Semi-arid)', hi: 'जयपुर (अर्ध-शुष्क)', lat: 26.9, lon: 75.8, elev: 431,
    temp: [15, 18, 24, 30, 34, 33, 30, 28, 29, 26, 21, 16],
    rain: [7, 11, 5, 6, 16, 62, 215, 205, 82, 18, 4, 4],
  },
  leh: {
    en: 'Leh (High-altitude cold desert)', hi: 'लेह (उच्च-ऊँचाई शीत मरुस्थल)', lat: 34.2, lon: 77.6, elev: 3500,
    temp: [-7, -4, 1, 7, 11, 15, 18, 17, 13, 7, 1, -4],
    rain: [10, 8, 11, 7, 7, 4, 16, 16, 9, 3, 2, 6],
  },
  chennai: {
    en: 'Chennai (NE monsoon coast)', hi: 'चेन्नई (उत्तर-पूर्व मानसून तट)', lat: 13.1, lon: 80.3, elev: 16,
    temp: [25, 26, 28, 31, 33, 32, 31, 30, 30, 28, 26, 25],
    rain: [24, 7, 15, 18, 42, 54, 96, 138, 145, 315, 370, 175],
  },
  mawsynram: {
    en: 'Cherrapunji/Mawsynram hills (Orographic)', hi: 'चेरापूंजी/मावसिनराम पहाड़ियाँ (पर्वतीय वर्षा)', lat: 25.3, lon: 91.6, elev: 1400,
    temp: [12, 14, 17, 19, 20, 21, 21, 21, 21, 19, 16, 13],
    rain: [18, 42, 220, 740, 1350, 2750, 2950, 1980, 1220, 420, 46, 12],
  },
};

export function stationSummary(id) {
  const s = STATIONS[id] || STATIONS.mumbai;
  const totalRain = s.rain.reduce((a, b) => a + b, 0);
  const minT = Math.min(...s.temp), maxT = Math.max(...s.temp);
  return { ...s, totalRain, minT, maxT, rangeT: maxT - minT };
}

/** Mass-conserving catchment water budget: rainMm = infiltrated + damStored + surfaceRunoff. */
export function catchmentRunoff({ rainMm = 120, forestPct = 40, pavedPct = 20, checkDams = 2 } = {}) {
  const barePct = Math.max(0, 100 - forestPct - pavedPct);
  const infFrac = Math.min(0.88, Math.max(0.05, 0.72 * (forestPct / 100) + 0.35 * (barePct / 100) + 0.04 * (pavedPct / 100)));
  const infiltrated = rainMm * infFrac;
  const rawRunoff = rainMm - infiltrated;
  const damStored = Math.min(rawRunoff * 0.75, checkDams * 14);
  const surfaceRunoff = Math.max(0, rawRunoff - damStored);
  const floodRisk = surfaceRunoff > 85 ? 'high' : surfaceRunoff > 45 ? 'moderate' : 'low';
  return { rainMm, infiltrated, damStored, surfaceRunoff, floodRisk };
}

/** Illustrative personal carbon footprint (kg CO2e/year) + warming link. */
export function carbonFootprint({ electricityKwh = 120, carKm = 40, busKm = 60, diet = 'veg', solarPct = 0 } = {}) {
  const gridFactor = 0.72 * (1 - solarPct / 100);
  const electricity = electricityKwh * 12 * gridFactor;
  const transport = (carKm * 0.19 + busKm * 0.06) * 52;
  const dietMap = { veg: 850, mixed: 1350, highMeat: 2100 };
  const food = dietMap[diet] ?? 1000;
  const total = electricity + transport + food;
  return { electricity, transport, food, total };
}
