// Terrain engine (landform exploration): schematic river-profile model of weathering, erosion and deposition.
// Mass is conserved: eroded = deposited on the profile + carried to the sea. Numbers are teaching units, not field data.
export const AGENTS = ['river', 'wind', 'glacier', 'waves'];
const AGENT_K = { river: 1, wind: 0.35, glacier: 0.8, waves: 0.6 };      // relative erosive power (schematic)
export const ROCK_HARDNESS = { soft: 0.5, medium: 1, hard: 2 };            // resistance to weathering/erosion (schematic)
export const N = 20;                                                        // cells from source (0) to mouth (N-1)
export const initialProfile = (relief = 100) => Array.from({ length: N }, (_, i) => relief * (1 - i / (N - 1)) ** 1.5 + 0);
const clamp0 = (x) => Math.max(0, x);
/** Advance the profile by `steps`. rain 0..1, rock key of ROCK_HARDNESS, agent key of AGENTS. Returns profile + budgets. */
export function gradate(profile, { rain = 0.5, rock = 'medium', agent = 'river', steps = 1, vegetation = 0 } = {}) {
  const h = [...profile]; let eroded = 0, deposited = 0, sea = 0;
  const k = (0.02 * (AGENT_K[agent] ?? 1) * (0.2 + rain) * (1 - 0.6 * Math.min(1, Math.max(0, vegetation)))) / (ROCK_HARDNESS[rock] ?? 1);
  for (let s = 0; s < steps; s++) {
    const carry = new Array(N).fill(0);
    for (let i = 0; i < N - 1; i++) {
      const slope = clamp0(h[i] - h[i + 1]);
      const e = Math.min(h[i], k * slope * 10);                       // steeper = more erosion
      h[i] -= e; eroded += e; carry[i + 1] += e;
    }
    for (let i = 1; i < N; i++) {                                      // gentle gradients cannot carry load: deposit
      const slope = clamp0(h[i - 1] - h[i]), cap = 0.6 * slope + 0.05;
      const drop = i === N - 1 ? 0 : clamp0(carry[i] - cap);
      h[i] += drop; deposited += drop;
      if (i < N - 1) carry[i + 1] += carry[i] - drop;
      else sea += carry[i];
    }
  }
  return { profile: h, eroded, deposited, sea, relief: h[0] - h[N - 1] };
}
export function run(opts, years = 40) { return gradate(initialProfile(opts.relief ?? 100), { ...opts, steps: years }); }
