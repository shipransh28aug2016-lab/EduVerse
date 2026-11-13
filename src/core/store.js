// Central state: language, accessibility switches, sound, teacher mode, per-theme progress, stars, map mastery & simulation state.
// Persisted in localStorage (never sent anywhere; no login, no telemetry). Safe when storage is blocked.
const KEY = 'eduverse.ix.ss.v1';
const defaults = () => ({ lang: 'both', lowGraphics: false, reducedMotion: null, teacher: false, projector: false, sound: true, progress: {}, sim: {}, stars: {}, mapHits: {} });
let state = defaults();
const subs = new Set();
const memoryOnly = { v: false };
try { const raw = localStorage.getItem(KEY); if (raw) state = { ...defaults(), ...JSON.parse(raw) }; } catch { memoryOnly.v = true; }
if (state.reducedMotion == null) state.reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!['en', 'hi', 'both'].includes(state.lang)) state.lang = 'both';
state.stars ??= {};
state.mapHits ??= {};

const save = () => { if (memoryOnly.v) return; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { memoryOnly.v = true; } };
export const get = () => state;
export function set(patch) { Object.assign(state, patch); save(); subs.forEach((f) => f(state, Object.keys(patch))); }
export const subscribe = (f) => (subs.add(f), () => subs.delete(f));
// Simulation state survives language switches, theme switches and reloads.
export const simState = (id, init) => (state.sim[id] ??= structuredClone(init));
export const saveSim = () => save();
export const resetSim = (id) => { delete state.sim[id]; save(); };
export function progress(themeId) {
  const p = (state.progress[themeId] ??= { visited: false, predictions: {}, exit: {}, cbq: {}, reflection: '' });
  p.cbq ??= {};
  return p;
}
export const saveProgress = () => save();
export function awardStar(key) {
  if (!key || state.stars[key]) return false;
  state.stars[key] = true;
  save();
  subs.forEach((f) => f(state, ['stars']));
  return true;
}
export function recordMapHit(id) {
  if (!id || state.mapHits[id]) return false;
  state.mapHits[id] = true;
  save();
  subs.forEach((f) => f(state, ['mapHits']));
  return true;
}
export function summaryStats() {
  const visited = Object.values(state.progress).filter((p) => p?.visited).length;
  const stars = Object.keys(state.stars || {}).length;
  const mapCount = Object.keys(state.mapHits || {}).length;
  let solved = 0;
  let cbqSolved = 0;
  for (const p of Object.values(state.progress)) {
    for (const v of Object.values(p?.exit || {})) if (v?.ok) solved++;
    for (const v of Object.values(p?.cbq || {})) if (v?.ok) cbqSolved++;
  }
  return { visited, visitedCount: visited, stars, starCount: stars, solved, cbqSolved, mapCount };
}
export const storageBlocked = () => memoryOnly.v;
