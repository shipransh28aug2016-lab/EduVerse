// T15 — From Ideas to Startups: L1 Business plan, L2 Unit economics, L3 India hubs & MSMEs, L4 Creative destruction, L5 Profit & loss.
import { mountLabs } from '../../components/lab-kit.js';
import { loadGeoAll } from '../../engines/viz.js';
import { unit, pnl, planBuilder, ecosystemMap, creativeDestruction } from './t15-specs.js';

export function mount(root) {
  const res = mountLabs(
    root,
    'T15',
    [planBuilder, unit, ecosystemMap, creativeDestruction, pnl],
    [
      { en: 'Business plan (L1)', hi: 'व्यवसाय योजना (L1)' },
      { en: 'Unit economics (L2)', hi: 'इकाई अर्थशास्त्र (L2)' },
      { en: 'India startup hubs (L3)', hi: 'स्टार्टअप व MSME केंद्र (L3)' },
      { en: 'Creative destruction (L4)', hi: 'सृजनात्मक विनाश (L4)' },
      { en: 'Profit and loss (L5)', hi: 'लाभ और हानि (L5)' },
    ],
  );
  let alive = true;
  loadGeoAll().then(() => { if (alive) res.relabel(); });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
