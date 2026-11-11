// Timeline engine: generic linear and logarithmic placement of events measured in "years before present" (ya).
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const linear = (ya, span) => clamp01(1 - ya / span);
export const log = (ya, span, floor = 100) => clamp01(1 - (Math.log10(Math.max(ya, floor)) - Math.log10(floor)) / (Math.log10(span) - Math.log10(floor)));
export const bceToYa = (year, present = 2026) => present - year;           // year is astronomical-style: negative = BCE, positive = CE (no year 0 in history; 1 BCE = -1 → handled below)
export const yearToYa = (year, present = 2026) => (year < 0 ? present + Math.abs(year) - 1 : present - year);
export const yaToLabel = (ya, present = 2026) => { const y = present - ya; return y <= 0 ? `${Math.abs(y - 1)} BCE` : `${y} CE`; };
/** Events active (start <= year <= end) in a list of {start,end} using the same year convention (BCE negative). */
export const activeAt = (items, year) => items.filter((e) => year >= e.start && year <= e.end);
