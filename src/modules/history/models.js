// T04 Early Humans: pure model for the deep-time clock. All dates are approximate "years ago" (ya) and vary by region and source.
export const SPAN = 2_000_000;          // years shown on the timeline (first stone tools to today)
export const LOG_MIN = 100;             // the log scale cannot reach 0, so it stops 100 years before today
export const AGES = [
  { id: 'palaeo', from: 2_000_000, to: 12_000 },
  { id: 'meso', from: 12_000, to: 8_000 },
  { id: 'neo', from: 8_000, to: 4_600 },
  { id: 'harappa', from: 4_600, to: 3_900 },
  { id: 'later', from: 3_900, to: 0 },
];
export const MILESTONES = [
  { id: 'tools', ya: 2_000_000 },
  { id: 'farming', ya: 8_000 },
  { id: 'cities', ya: 4_600 },
  { id: 'now', ya: 0 },
];
const clamp01 = (v) => Math.max(0, Math.min(1, v));
// position 0 (2 million years ago, left) … 1 (today, right)
export const linearPos = (ya) => clamp01(1 - ya / SPAN);
export const logPos = (ya) => clamp01(1 - (Math.log10(Math.max(ya, LOG_MIN)) - Math.log10(LOG_MIN)) / (Math.log10(SPAN) - Math.log10(LOG_MIN)));
export const ageOf = (ya) => AGES.find((a) => ya <= a.from && ya > a.to)?.id ?? null;
// the whole span squeezed into one 24-hour day ending at midnight (= today)
export const minutesBeforeMidnight = (ya) => (ya / SPAN) * 1440;
export function clockLabel(ya) {
  const minutes = minutesBeforeMidnight(ya);
  const secs = Math.max(0, Math.round((1440 - minutes) * 60)) % 86400;
  const p = (n) => String(n).padStart(2, '0');
  return { minutes, text: `${p(Math.floor(secs / 3600))}:${p(Math.floor((secs % 3600) / 60))}:${p(secs % 60)}` };
}
