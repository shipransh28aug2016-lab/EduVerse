// Rebuilds the vendored browser bundles from node_modules (run after `npm ci`): `npm run vendor`.
//  • vendor/three/three-fx.esm.js  — three.js addons (orbit controls, bloom post-processing, PBR room environment, CSS2D labels,
//                                     rounded boxes). `three` itself stays external and resolves to the vendored core build.
//  • vendor/d3/d3-plus.esm.js      — d3-hierarchy, d3-sankey, d3-interpolate, d3-ease (Class X 2D explorers).
//  • vendor/lucide/lucide-x.esm.js — extra Lucide icons for the premium shell and Class X.
//  • assets/fonts/*.woff2          — Inter, Fraunces and Noto Sans Devanagari variable fonts (SIL OFL 1.1), served locally with their licence files.
import { build } from 'esbuild';
import fs from 'node:fs';

const common = { bundle: true, format: 'esm', minify: true, legalComments: 'none', target: 'es2020', logLevel: 'warning' };
const entry = (contents) => ({ stdin: { contents, resolveDir: process.cwd(), loader: 'js' } });

await build({
  ...common, ...entry(`
export { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
export { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
export { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
export { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
export { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
export { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';`),
  outfile: 'vendor/three/three-fx.esm.js',
  plugins: [{ name: 'three-external', setup(b) { b.onResolve({ filter: /^three$/ }, () => ({ path: './three.module.min.js', external: true })); } }],
});

await build({
  ...common, ...entry(`
export { hierarchy, tree, cluster, treemap, pack, partition } from 'd3-hierarchy';
export { sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey';
export { interpolate, interpolateRgb, interpolateNumber } from 'd3-interpolate';
export { easeCubicOut, easeCubicInOut, easeBackOut, easeElasticOut } from 'd3-ease';`),
  outfile: 'vendor/d3/d3-plus.esm.js',
});

const ICONS = ['Box', 'Map', 'Earth', 'Crown', 'Factory', 'Newspaper', 'Wheat', 'Droplets', 'Pickaxe', 'TrainFront', 'Network', 'Users', 'Flag', 'ChartNoAxesCombined', 'Banknote', 'ShoppingCart', 'ShieldCheck', 'Rotate3d', 'Maximize', 'Trophy', 'Zap', 'Clock', 'Gem', 'Handshake', 'Route', 'Leaf', 'MousePointerClick', 'CircleCheck', 'CircleX', 'Star', 'Target', 'PieChart', 'Swords', 'HeartHandshake', 'Printer', 'Cog', 'Check', 'X'];
await build({
  ...common, ...entry(`
import { ${ICONS.join(', ')} } from 'lucide';
export const ICONS = { ${ICONS.join(', ')} };`),
  outfile: 'vendor/lucide/lucide-x.esm.js',
});

fs.mkdirSync('assets/fonts', { recursive: true });
for (const [from, to] of [
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter.woff2'],
  ['@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2', 'fraunces.woff2'],
  ['@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2', 'noto-devanagari.woff2'],
]) fs.copyFileSync(`node_modules/${from}`, `assets/fonts/${to}`);
// Each font keeps its own copyright notice (text files are not precached by the service worker).
for (const [pkg, to] of [['inter', 'LICENSE-inter.txt'], ['fraunces', 'LICENSE-fraunces.txt'], ['noto-sans-devanagari', 'LICENSE-noto-sans-devanagari.txt']]) fs.copyFileSync(`node_modules/@fontsource-variable/${pkg}/LICENSE`, `assets/fonts/${to}`);
for (const pkg of ['d3-sankey', 'd3-hierarchy', 'd3-interpolate', 'd3-ease']) fs.copyFileSync(`node_modules/${pkg}/LICENSE`, `vendor/d3/LICENSE-${pkg}`);
for (const f of ['vendor/three/three-fx.esm.js', 'vendor/d3/d3-plus.esm.js', 'vendor/lucide/lucide-x.esm.js']) console.log(f, (fs.statSync(f).size / 1024).toFixed(1) + ' KB');
