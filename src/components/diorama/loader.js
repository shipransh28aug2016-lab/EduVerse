// Lazy loader for theme 3D diorama builders (keeps 3D geometry code out of initial Home & 2D-only loads).
import { wrapDioramaBuilder } from './toolkit.js';

const PART1_IDS = new Set(['T01', 'T03', 'T05', 'T06', 'T07', 'T08']);
const PART2_IDS = new Set(['T09', 'T11', 'T13', 'T14', 'T15', 'T16']);

export const hasTheme3d = (themeId) => PART1_IDS.has(themeId) || PART2_IDS.has(themeId);

export async function loadTheme3d(themeId) {
  if (PART1_IDS.has(themeId)) {
    const { PART1_BUILDERS } = await import('./part1.js');
    const fn = PART1_BUILDERS[themeId];
    return fn ? wrapDioramaBuilder(fn) : null;
  }
  if (PART2_IDS.has(themeId)) {
    const { PART2_BUILDERS } = await import('./part2.js');
    const fn = PART2_BUILDERS[themeId];
    return fn ? wrapDioramaBuilder(fn) : null;
  }
  return null;
}
