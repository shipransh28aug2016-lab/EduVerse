// Lazy module registry: a theme's code and assets load only when its page is opened. Small text-only content is imported statically.
import { T09_TEACHER, T09_LIMITS } from './economics/content.js';
import { T02_TEACHER, T02_LIMITS } from './geography/content.js';
export const MODULES = {
  T02: () => import('./geography/earth.js'),
  T03: () => import('./geography/atmosphere.js'),
  T10: () => import('./geography/oceans.js'),
  T11: () => import('./geography/life.js'),
  T04: () => import('./history/early-humans.js'),
  T06: () => import('./politics/democracy.js'),
  T07: () => import('./politics/elections-plus.js'),
  T13: () => import('./history/trade.js'),
  T08: () => import('./economics/foundations.js'),
  T09: () => import('./economics/price-puzzle.js'),
  T15: () => import('./economics/startups.js'),
  T16: () => import('./economics/finance.js'),
};
export const TEACHER = { T02: T02_TEACHER, T09: T09_TEACHER };
export const LIMITS = { T02: T02_LIMITS, T09: T09_LIMITS };
