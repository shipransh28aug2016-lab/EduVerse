// Tiny dependency-free Web Audio synthesizer for playful tactile feedback (gentle wooden clicks & chime).
// Completely offline (no audio files), never throws in headless/restricted browsers, respects store.get().sound.
import * as store from './store.js';

let ctx = null;
function getCtx() {
  if (!store.get().sound || typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}

function tone(freq, dur = 0.08, type = 'sine', gain = 0.045, delay = 0) {
  const c = getCtx();
  if (!c) return;
  try {
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch { /* audio blocked before gesture */ }
}

export const playTap = () => tone(520, 0.045, 'triangle', 0.032);
export const playFlip = () => { tone(440, 0.05, 'sine', 0.03, 0); tone(660, 0.07, 'sine', 0.03, 0.035); };
export const playWin = () => { tone(523.25, 0.11, 'triangle', 0.05, 0); tone(659.25, 0.12, 'triangle', 0.05, 0.08); tone(783.99, 0.18, 'sine', 0.055, 0.16); };
export const playTry = () => { tone(310, 0.11, 'sine', 0.038, 0); tone(260, 0.13, 'sine', 0.035, 0.07); };
