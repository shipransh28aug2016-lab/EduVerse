// Lazy module registry: a theme's code and assets load only when its page is opened. Small text-only content is imported statically.
import { T09_TEACHER, T09_LIMITS } from './economics/content.js';
import { T02_TEACHER, T02_LIMITS } from './geography/content.js';
export const MODULES = {
  T02: () => import('./geography/tectonics.js'),
  T04: () => import('./history/early-humans.js'),
  T07: () => import('./politics/elections.js'),
  T09: () => import('./economics/price-puzzle.js'),
};
export const TEACHER = { T02: T02_TEACHER, T09: T09_TEACHER };
export const LIMITS = { T02: T02_LIMITS, T09: T09_LIMITS };
