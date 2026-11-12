// T03 — Atmosphere and Climate: L1 Cutaway, L2 Climate Grapher, L3 Monsoon Map, L4 Local Breeze, L5 Catchment, L6 Carbon Footprint.
import { mountLabs } from '../../components/lab-kit.js';
import { loadGeoAll } from '../../engines/viz.js';
import { cutaway, breeze } from './labs-air-water-life.js';
import { climateGrapher, monsoonMap, catchment, carbonFootprint } from './labs-geo-extra.js';

export function mount(root) {
  const res = mountLabs(
    root,
    'T03',
    [cutaway, climateGrapher, monsoonMap, breeze, catchment, carbonFootprint],
    [
      { en: 'Atmosphere layers (L1)', hi: 'वायुमंडल परतें (L1)' },
      { en: 'Climate grapher (L2)', hi: 'जलवायु आरेख (L2)' },
      { en: 'Monsoon map (L3)', hi: 'मानसून मानचित्र (L3)' },
      { en: 'Land-sea breeze (L4)', hi: 'समीर मॉडल (L4)' },
      { en: 'Flood catchment (L5)', hi: 'बाढ़ जलग्रहण (L5)' },
      { en: 'Carbon footprint (L6)', hi: 'कार्बन पदचिह्न (L6)' },
    ],
  );
  let alive = true;
  loadGeoAll().then(() => { if (alive) res.relabel(); });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
