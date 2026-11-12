// T05 — State and Society (upto 1000 CE): L1 Dated map, L2 Source room, L3 Empire admin, L4 Knowledge gallery, L5 Trade & guilds.
import { mountLabs } from '../../components/lab-kit.js';
import { loadGeoAll } from '../../engines/viz.js';
import { vedicDatedMap, sourceRoom, empireAdmin, knowledgeGallery, guildTrade } from './labs-history-early.js';

export function mount(root) {
  const res = mountLabs(
    root,
    'T05',
    [vedicDatedMap, sourceRoom, empireAdmin, knowledgeGallery, guildTrade],
    [
      { en: 'Historical map (L1)', hi: 'ऐतिहासिक मानचित्र (L1)' },
      { en: 'Source room (L2)', hi: 'स्रोत कक्ष (L2)' },
      { en: 'Empire admin (L3)', hi: 'साम्राज्य प्रशासन (L3)' },
      { en: 'Knowledge gallery (L4)', hi: 'ज्ञान परंपरा (L4)' },
      { en: 'Guilds & routes (L5)', hi: 'श्रेणी व व्यापार (L5)' },
    ],
  );
  let alive = true;
  loadGeoAll().then(() => { if (alive) res.relabel(); });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
