// Combined UI dictionary barrel (backward-compatible re-export; runtime loads src/i18n/core.js + lazy module slices).
import { UI_CORE } from './core.js';
import { UI_T02 } from './modules/t02.js';
import { UI_T04 } from './modules/t04.js';
import { UI_T07 } from './modules/t07.js';
import { UI_T09 } from './modules/t09.js';
import { UI_BRIDGE } from './modules/bridge.js';

export const UI = { ...UI_CORE, ...UI_T02, ...UI_T04, ...UI_T07, ...UI_T09, ...UI_BRIDGE };
