// Interactive 3D Diorama Library facade (delegates to modular chunks under src/components/diorama/).
import { wrapDioramaBuilder } from './diorama/toolkit.js';
import { createHeroGlobe3d } from './diorama/hero-globe.js';
import { PART1_BUILDERS } from './diorama/part1.js';
import { PART2_BUILDERS } from './diorama/part2.js';
import { hasTheme3d, loadTheme3d } from './diorama/loader.js';

const BUILDERS = { ...PART1_BUILDERS, ...PART2_BUILDERS };

export { createHeroGlobe3d, hasTheme3d, loadTheme3d };

export function createTheme3d(themeId) {
  const fn = BUILDERS[themeId];
  return fn ? wrapDioramaBuilder(fn) : null;
}
