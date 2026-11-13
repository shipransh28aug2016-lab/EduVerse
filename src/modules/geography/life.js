// T11 — Life on Earth: L1 World Biomes, L2 India Biosphere Reserves, L3 Forest Harvest & Food Web, L4 Fire Planner, L5 Traditional Conservation.
import { mountLabs } from '../../components/lab-kit.js';
import { loadGeoAll } from '../../engines/viz.js';
import { harvest, foodweb, biomeMap, reserveMap, firePlanner, traditionalConservation } from './t11-specs.js';

export function mount(root) {
  const res = mountLabs(
    root,
    'T11',
    [biomeMap, reserveMap, harvest, foodweb, firePlanner, traditionalConservation],
    [
      { en: 'World biomes (L1)', hi: 'विश्व बायोम (L1)' },
      { en: 'Biosphere reserves (L2)', hi: 'जैवमंडल क्षेत्र (L2)' },
      { en: 'Forest harvest (L3)', hi: 'वन कटाई (L3)' },
      { en: 'Food web (L3)', hi: 'खाद्य-जाल (L3)' },
      { en: 'Fire prevention (L4)', hi: 'वनाग्नि सुरक्षा (L4)' },
      { en: 'Sacred groves (L5)', hi: 'पारंपरिक संरक्षण (L5)' },
    ],
  );
  let alive = true;
  loadGeoAll().then(() => { if (alive) res.relabel(); });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
