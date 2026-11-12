// Lazy module registry: a theme's code and assets load only when its page is opened. Small text-only content is imported statically.
export { TEACHER, LIMITS } from './teacher-meta.js';

export const MODULES = {
  T01: () => import('./integrated/t01.js'),
  T02: () => import('./geography/earth.js'),
  T03: () => import('./geography/atmosphere.js'),
  T04: () => import('./history/early-humans.js'),
  T05: () => import('./history/state-society.js'),
  T06: () => import('./politics/democracy.js'),
  T07: () => import('./politics/elections-plus.js'),
  T08: () => import('./economics/foundations.js'),
  T09: () => import('./economics/price-puzzle.js'),
  T10: () => import('./geography/oceans.js'),
  T11: () => import('./geography/life.js'),
  T12: () => import('./history/resistance.js'),
  T13: () => import('./history/trade.js'),
  T14: () => import('./politics/authority.js'),
  T15: () => import('./economics/startups.js'),
  T16: () => import('./economics/finance.js'),
};
