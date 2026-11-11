// Ocean engine: tides (spring/neap), waves vs tsunami speed. Physics: shallow-water wave speed c = sqrt(g d); deep-water c = sqrt(g λ / 2π).
export const G = 9.81;
export const M2 = 12.4206, S2 = 12;                                         // semi-diurnal lunar and solar periods (hours)
export const SYNODIC_DAYS = 29.53;
export const MOON_PHASES = [{ id: 'new', deg: 0 }, { id: 'first', deg: 90 }, { id: 'full', deg: 180 }, { id: 'last', deg: 270 }];
/** Tidal range (m) for a moon phase angle; M2 amplitude am, S2 amplitude as (≈0.46 am). Spring at new/full moon, neap at quarters. */
export function tidalRange(phaseDeg, am = 1, as = 0.46) {
  const p = (phaseDeg * Math.PI) / 180;
  return 2 * Math.sqrt(am * am + as * as + 2 * am * as * Math.cos(2 * p));
}
const RAD = Math.PI / 180;
/** Water level (m) at time t (hours) when the Sun–Moon elongation is psi0 degrees at t=0.
 *  Lunar (M2) and solar (S2) tides: tide = am cos(wm t) + as cos(wm t + 2 psi(t)); psi advances 360° per synodic month,
 *  so the solar term has a 12 h period and the two drift in and out of step (spring/neap). */
export function tideHeight(t, psi0 = 0, am = 1, as = 0.46) {
  const wm = (2 * Math.PI) / M2, psi = psi0 * RAD + (2 * Math.PI * t) / (24 * SYNODIC_DAYS);
  return am * Math.cos(wm * t) + as * Math.cos(wm * t + 2 * psi);
}
export function tideSeries(psi0 = 0, hours = 72, stepH = 0.5, am = 1, as = 0.46) {
  const out = []; for (let t = 0; t <= hours + 1e-9; t += stepH) out.push({ t, h: tideHeight(t, psi0, am, as) }); return out;
}
export const tsunamiSpeed = (depthM) => Math.sqrt(G * depthM);              // m/s
export const tsunamiKmh = (depthM) => tsunamiSpeed(depthM) * 3.6;
export const windWaveSpeed = (wavelengthM) => Math.sqrt((G * wavelengthM) / (2 * Math.PI));
/** Hours for a tsunami to cross distKm of constant depth. */
export const arrivalHours = (distKm, depthM) => distKm / tsunamiKmh(depthM);
export function warning({ distKm, depthM, sirenMinutes = 0 }) {
  const h = arrivalHours(distKm, depthM), minutes = h * 60;
  return { hours: h, minutes, timeToEvacuate: Math.max(0, minutes - sirenMinutes) };
}
