// Atmosphere engine. Layers, temperature and pressure follow the US Standard Atmosphere 1976 (ISA) up to 86 km;
// composition values are dry-air fractions (CO2 ~420 ppm in the 2020s). Local-wind model is schematic.
export const LAYERS = [
  { id: 'troposphere', from: 0, to: 12 }, { id: 'stratosphere', from: 12, to: 50 }, { id: 'mesosphere', from: 50, to: 85 }, { id: 'thermosphere', from: 85, to: 600 },
];
export const COMPOSITION = [{ id: 'N2', pct: 78.08 }, { id: 'O2', pct: 20.95 }, { id: 'Ar', pct: 0.93 }, { id: 'CO2', pct: 0.042 }, { id: 'other', pct: 0.0 }];
// ISA base heights (km), base temperature (°C) and lapse rate (°C/km)
const ISA = [[0, 15, -6.5], [11, -56.5, 0], [20, -56.5, 1.0], [32, -44.5, 2.8], [47, -2.5, 0], [51, -2.5, -2.8], [71, -58.5, -2.0], [86, -86.5, 0]];
export const layerAt = (km) => LAYERS.find((l) => km >= l.from && km < l.to) ?? LAYERS[LAYERS.length - 1];
export function temperatureC(km) {
  const h = Math.min(Math.max(km, 0), 86); let i = ISA.length - 1; while (ISA[i][0] > h) i--;
  return ISA[i][1] + ISA[i][2] * (h - ISA[i][0]);
}
const G0 = 9.80665, R = 287.053, P0 = 1013.25;
export function pressureHPa(km) {                                          // piecewise barometric formula
  const h = Math.min(Math.max(km, 0), 86); let P = P0;
  for (let i = 0; i < ISA.length - 1 && ISA[i][0] < h; i++) {
    const [h0, t0, L] = ISA[i], top = Math.min(h, ISA[i + 1][0]), T0 = t0 + 273.15, dh = (top - h0) * 1000;
    P *= L === 0 ? Math.exp((-G0 * dh) / (R * T0)) : (1 + (L / 1000 * dh) / T0) ** (-G0 / (R * (L / 1000)));
  }
  return P;
}
/** Fraction of the atmosphere's mass lying below an altitude (≈ pressure ratio). */
export const massBelow = (km) => 1 - pressureHPa(km) / P0;
// ---- land-sea breeze: land warms and cools faster than sea (lower effective heat capacity)
export const DIURNAL = { land: 8, sea: 1 };                                 // °C amplitude (schematic)
export const tempAt = (hour, mean, amp) => mean + amp * Math.sin(((hour - 9) / 24) * 2 * Math.PI);   // peak ≈ 15:00
export function localWind({ hour, mean = 28, landAmp = DIURNAL.land, seaAmp = DIURNAL.sea, cloud = 0 }) {
  const f = 1 - 0.5 * Math.min(1, Math.max(0, cloud));                      // cloud cover damps daytime heating
  const land = tempAt(hour, mean, landAmp * f), sea = tempAt(hour, mean, seaAmp), dT = land - sea;
  const speed = Math.min(12, Math.abs(dT) * (dT < 0 ? 0.7 : 1.1));          // m/s, schematic (land breeze is weaker)
  const kind = Math.abs(dT) < 0.5 ? 'calm' : dT > 0 ? 'sea-breeze' : 'land-breeze';
  return { land, sea, dT, speed, kind, surfaceFlow: kind === 'sea-breeze' ? 'sea→land' : kind === 'land-breeze' ? 'land→sea' : 'none' };
}
