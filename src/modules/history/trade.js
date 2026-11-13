// T13 — India and the World-I (1900 BCE–1200 CE): L1 Trade routes, L2 Cultural exchange, L3 IKS gallery, L4 Artefact provenance.
import { mountLabs } from '../../components/lab-kit.js';
import { loadGeoAll } from '../../engines/viz.js';
import { trade, LAND } from './labs-trade.js';
import { exchangeMap, iksGallery, artefactProvenance } from './t13-specs.js';

export function mount(root) {
  const res = mountLabs(
    root,
    'T13',
    [trade, exchangeMap, iksGallery, artefactProvenance],
    [
      { en: 'Trade routes (L1)', hi: 'व्यापार मार्ग (L1)' },
      { en: 'Cultural exchange (L2)', hi: 'सांस्कृतिक आदान-प्रदान (L2)' },
      { en: 'Knowledge systems (L3)', hi: 'भारतीय ज्ञान प्रणाली (L3)' },
      { en: 'Artefact provenance (L4)', hi: 'पुरावशेष उत्पत्ति (L4)' },
    ],
  );
  let alive = true;
  Promise.all([
    loadGeoAll(),
    fetch(new URL('../../../data/geo/land.simplified.json', import.meta.url)).then((r) => r.json()).catch(() => null),
  ]).then(([, landJson]) => {
    if (landJson?.land) LAND.polys = landJson.land;
    if (alive) res.relabel();
  });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
