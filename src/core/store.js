// Central state: language, accessibility switches, teacher mode, per-theme progress and per-simulation state.
// Persisted in localStorage (never sent anywhere; no login, no telemetry). Safe when storage is blocked.
const KEY = 'eduverse.ix.ss.v1';
const defaults = () => ({ lang: 'both', lowGraphics: false, reducedMotion: null, teacher: false, projector: false, progress: {}, sim: {} });
let state = defaults();
const subs = new Set();
const memoryOnly = { v: false };
try { const raw = localStorage.getItem(KEY); if (raw) state = { ...defaults(), ...JSON.parse(raw) }; } catch { memoryOnly.v = true; }
if (state.reducedMotion == null) state.reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!['en', 'hi', 'both'].includes(state.lang)) state.lang = 'both';

const save = () => { if (memoryOnly.v) return; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { memoryOnly.v = true; } };
export const get = () => state;
export function set(patch) { Object.assign(state, patch); save(); subs.forEach((f) => f(state, Object.keys(patch))); }
export const subscribe = (f) => (subs.add(f), () => subs.delete(f));
// Simulation state survives language switches, theme switches and reloads.
export const simState = (id, init) => (state.sim[id] ??= structuredClone(init));
export const saveSim = () => save();
export const resetSim = (id) => { delete state.sim[id]; save(); };
export function progress(themeId) { return (state.progress[themeId] ??= { visited: false, predictions: {}, exit: {}, reflection: '' }); }
export const saveProgress = () => save();
export const storageBlocked = () => memoryOnly.v;
