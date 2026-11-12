// Ecosystem engine: forest harvest, predator-prey Lotka-Volterra food web,
// world biomes (T11.L1), India biosphere reserves (T11.L2), and forest-fire risk (T11.L4).
export const forest = { K: 1000, r: 0.4 };
export const maxSustainableYield = (K = forest.K, r = forest.r) => (r * K) / 4;
export function harvestRun({ K = forest.K, r = forest.r, stock0 = 800, harvest = 80, years = 50 } = {}) {
  const s = [stock0]; let x = stock0, total = 0, collapsedAt = null;
  for (let y = 1; y <= years; y++) {
    const grow = r * x * (1 - x / K), take = Math.min(x + grow, harvest);
    x = Math.max(0, x + grow - take); total += take; s.push(x);
    if (x <= 1e-6 && collapsedAt == null) collapsedAt = y;
  }
  return { stock: s, total, collapsedAt, final: x, sustainable: collapsedAt == null && s[s.length - 1] >= 0.2 * K };
}
export function webRun({ x0 = 40, y0 = 9, a = 0.6, b = 0.025, e = 0.5, m = 0.5, years = 40, dt = 0.05, cullYear = null, cullFrac = 0 } = {}) {
  const f = (x, y) => [a * x - b * x * y, e * b * x * y - m * y];
  const out = [{ t: 0, prey: x0, pred: y0 }]; let x = x0, y = y0, t = 0, nextCull = cullYear;
  const n = Math.round(years / dt);
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y), k2 = f(x + (dt / 2) * k1[0], y + (dt / 2) * k1[1]), k3 = f(x + (dt / 2) * k2[0], y + (dt / 2) * k2[1]), k4 = f(x + dt * k3[0], y + dt * k3[1]);
    x += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); t += dt;
    if (nextCull != null && t >= nextCull) { y *= 1 - cullFrac; nextCull = null; }
    if (i % Math.round(0.25 / dt) === 0) out.push({ t, prey: x, pred: y });
  }
  return out;
}

export const BIOMES = [
  { id: 'rainforest', color: '#1b7a43', en: 'Tropical Rainforest', hi: 'उष्णकटिबंधीय वर्षावन', temp: [24, 30], rain: [2000, 4000], lon: -60, lat: -3, indiaEx: { en: 'Western Ghats & Andaman', hi: 'पश्चिमी घाट और अंडमान' } },
  { id: 'savanna', color: '#c8a93b', en: 'Tropical Savanna & Grassland', hi: 'उष्णकटिबंधीय सवाना और घासभूमि', temp: [20, 30], rain: [600, 1400], lon: 25, lat: -8, indiaEx: { en: 'Deccan Thorn & Grasslands', hi: 'दक्कन घासभूमि' } },
  { id: 'desert', color: '#e29d4b', en: 'Hot & Cold Desert', hi: 'गर्म और ठंडा मरुस्थल', temp: [5, 38], rain: [20, 250], lon: 15, lat: 23, indiaEx: { en: 'Thar & Ladakh', hi: 'थार और लद्दाख' } },
  { id: 'temperate', color: '#5fa858', en: 'Temperate Deciduous Forest', hi: 'शीतोष्ण पर्णपाती वन', temp: [8, 20], rain: [750, 1500], lon: 12, lat: 49, indiaEx: { en: 'Mid-Himalayan Oak Belt', hi: 'मध्य-हिमालयी बांज वन' } },
  { id: 'taiga', color: '#2b6a6c', en: 'Boreal Coniferous (Taiga)', hi: 'शंकुधारी वन (टैगा)', temp: [-5, 10], rain: [350, 750], lon: 95, lat: 60, indiaEx: { en: 'Upper Himalayan Pine/Fir', hi: 'उच्च हिमालयी देवदार/फ़र' } },
  { id: 'tundra', color: '#8ca9c4', en: 'Alpine & Arctic Tundra', hi: 'अल्पाइन और आर्कटिक टुंड्रा', temp: [-18, 3], rain: [100, 350], lon: -100, lat: 68, indiaEx: { en: 'Trans-Himalayan Snowline', hi: 'पार-हिमालयी हिमरेखा' } },
];

export const INDIA_RESERVES = [
  { id: 'nilgiri', lon: 76.6, lat: 11.4, state: 'Tamil Nadu', en: 'Nilgiri (TN / KL / KA, 1986)', hi: 'नीलगिरि (1986)', species: { en: 'Nilgiri Tahr, Lion-tailed Macaque', hi: 'नीलगिरि तहर, सिंह-पुच्छ वानर' } },
  { id: 'nanda', lon: 79.7, lat: 30.5, state: 'Uttarakhand', en: 'Nanda Devi (Uttarakhand, 1988)', hi: 'नंदा देवी (उत्तराखंड, 1988)', species: { en: 'Snow Leopard, Himalayan Musk Deer', hi: 'हिम तेंदुआ, कस्तूरी मृग' } },
  { id: 'sundarbans', lon: 88.9, lat: 21.9, state: 'West Bengal', en: 'Sundarbans (West Bengal, 1989)', hi: 'सुंदरबन (पश्चिम बंगाल, 1989)', species: { en: 'Royal Bengal Tiger, Sundari Mangroves', hi: 'बंगाल बाघ, सुंदरी मैंग्रोव' } },
  { id: 'mannar', lon: 79.1, lat: 9.1, state: 'Tamil Nadu', en: 'Gulf of Mannar (Tamil Nadu, 1989)', hi: 'मन्नार की खाड़ी (1989)', species: { en: 'Dugong, Coral Reefs', hi: 'डुगोंग (समुद्री गाय), प्रवाल भित्ति' } },
  { id: 'manas', lon: 91.0, lat: 26.7, state: 'Assam', en: 'Manas / Kaziranga belt (Assam)', hi: 'मानस / काजीरंगा क्षेत्र (असम)', species: { en: 'One-horned Rhino, Golden Langur', hi: 'एक-सींग वाला गैंडा, सुनहरा लंगूर' } },
  { id: 'pachmarhi', lon: 78.4, lat: 22.5, state: 'Madhya Pradesh', en: 'Pachmarhi (Madhya Pradesh, 1999)', hi: 'पचमढ़ी (मध्य प्रदेश, 1999)', species: { en: 'Indian Giant Squirrel, Teak & Sal', hi: 'भारतीय विशाल गिलहरी, सागौन-साल' } },
  { id: 'similipal', lon: 86.3, lat: 21.8, state: 'Odisha', en: 'Similipal (Odisha, 1994)', hi: 'सिमलीपाल (ओडिशा, 1994)', species: { en: 'Asian Elephant, Sal Forests', hi: 'एशियाई हाथी, साल वन' } },
  { id: 'nicobar', lon: 93.8, lat: 7.0, state: 'Andaman & Nicobar', en: 'Great Nicobar (A&N Islands, 1989)', hi: 'ग्रेट निकोबार (1989)', species: { en: 'Nicobar Megapode, Leatherback Turtle', hi: 'निकोबार मेगापोड, समुद्री कछुआ' } },
];

/** Forest fire triangle risk index (0..100) + spread speed (m/min). */
export function fireRisk({ tempC = 34, humidityPct = 30, windKmh = 20, dryLitter = 0.6, firebreak = false } = {}) {
  const heatFuel = Math.max(0, (tempC - 12) * 1.45) + (100 - humidityPct) * 0.45 + dryLitter * 26;
  const windBoost = windKmh * 0.55;
  const rawIndex = Math.min(100, Math.round(heatFuel + windBoost));
  const effectiveIndex = Math.max(4, Math.round(rawIndex * (firebreak ? 0.55 : 1)));
  const spreadMMin = +(Math.max(0.5, (effectiveIndex / 18) * (1 + windKmh / 25) * (firebreak ? 0.4 : 1))).toFixed(1);
  const level = effectiveIndex >= 70 ? 'extreme' : effectiveIndex >= 45 ? 'high' : 'moderate';
  return { rawIndex, effectiveIndex, spreadMMin, level };
}
