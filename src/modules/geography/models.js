// T02 Shaping of the Earth's Surface: pure model. Distance is exact arithmetic (1 cm/yr = 10 km per million years);
// every 0..1 "amount" below (trench, arc, uplift, stress…) is a schematic teaching simplification, not a forecast.
export const BOUNDARY_TYPES = ['conv-oc', 'conv-cc', 'div', 'trans'];
export const SPEED = { min: 1, max: 10, step: 1 };      // cm per year
export const TIME = { min: 0, max: 100, step: 1 };      // million years
export const EARTH_RADIUS_KM = 6371;
export const LAYERS = [                                   // depths in km (approximate, rounded textbook values)
  { id: 'crust', from: 0, to: 70, state: 'solid' },
  { id: 'mantle', from: 70, to: 2900, state: 'solid' },
  { id: 'outer_core', from: 2900, to: 5150, state: 'liquid' },
  { id: 'inner_core', from: 5150, to: 6371, state: 'solid' },
];
const CRUST_MIN_KM = 5;                                   // crust is ~5 km under oceans, up to ~70 km under mountain belts
const QUAKE_CYCLE_KM = 300;                               // schematic stick-slip cycle for the transform view
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const initialTectonics = () => ({ type: 'conv-oc', speed: 5, time: 20, labels: true });
export const convergenceKm = (speed, time) => speed * 10 * time;
export function layerAtDepth(d) {
  const L = LAYERS.find((l) => d >= l.from && d < l.to) ?? LAYERS[LAYERS.length - 1];
  return { ...L, ambiguous: d >= CRUST_MIN_KM && d < LAYERS[0].to };
}
export function tectonicState(type, speed, time) {
  const km = convergenceKm(speed, time);
  const st = { type, km, slab: 0, trench: 0, arc: 0, quakes: 0, uplift: 0, crumple: 0, newCrustKm: 0, ridge: 0, magma: 0, offsetKm: 0, stress: 0 };
  if (type === 'conv-oc') { st.slab = clamp01(km / 3000); st.trench = clamp01(km / 500); st.quakes = clamp01(km / 1000); st.arc = clamp01((km - 300) / 1500); }
  else if (type === 'conv-cc') { st.uplift = clamp01(km / 3000); st.crumple = clamp01(km / 2000); }
  else if (type === 'div') { st.newCrustKm = km; st.magma = clamp01(km / 200); st.ridge = clamp01(km / 800); }
  else if (type === 'trans') { st.offsetKm = km; st.stress = (km % QUAKE_CYCLE_KM) / QUAKE_CYCLE_KM; }
  return st;
}
