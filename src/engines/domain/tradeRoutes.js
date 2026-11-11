// Historical maps and trade routes engine. Coordinates are modern city locations; dates are APPROXIMATE spans of documented use
// (negative = BCE). Routes are schematic straight legs between documented places, NOT surveyed paths. Sources: see docs/SOURCES.md.
export const CITIES = {
  lothal: { lat: 22.52, lon: 72.25, en: 'Lothal', hi: 'लोथल' }, bahrain: { lat: 26.2, lon: 50.55, en: 'Dilmun (Bahrain)', hi: 'दिल्मुन (बहरीन)' }, ur: { lat: 30.96, lon: 46.1, en: 'Ur', hi: 'उर' },
  changan: { lat: 34.3, lon: 108.9, en: 'Chang’an', hi: 'चांगान' }, dunhuang: { lat: 40.14, lon: 94.66, en: 'Dunhuang', hi: 'दुनहुआंग' }, kashgar: { lat: 39.47, lon: 75.99, en: 'Kashgar', hi: 'काशगर' },
  taxila: { lat: 33.75, lon: 72.8, en: 'Taxila', hi: 'तक्षशिला' }, samarkand: { lat: 39.65, lon: 66.96, en: 'Samarkand', hi: 'समरकंद' }, antioch: { lat: 36.2, lon: 36.16, en: 'Antioch', hi: 'एंटिओक' },
  berenike: { lat: 23.91, lon: 35.48, en: 'Berenike', hi: 'बेरेनिके' }, muziris: { lat: 10.2, lon: 76.2, en: 'Muziris', hi: 'मुज़िरिस' }, barygaza: { lat: 21.7, lon: 72.99, en: 'Barygaza (Bharuch)', hi: 'बैरीगाज़ा (भरूच)' },
  tamralipti: { lat: 22.3, lon: 87.92, en: 'Tamralipti', hi: 'ताम्रलिप्ति' }, palembang: { lat: -2.99, lon: 104.76, en: 'Palembang (Srivijaya)', hi: 'पालेम्बांग (श्रीविजय)' },
};
export const MODES = { caravan: { kmPerDay: 30, en: 'caravan', hi: 'कारवाँ' }, sea: { kmPerDay: 120, en: 'sailing ship', hi: 'पालदार जहाज़' } };
export const ROUTES = [
  { id: 'indus-mesopotamia', start: -2600, end: -1900, mode: 'sea', stops: ['lothal', 'bahrain', 'ur'], goods: [{ en: 'carnelian beads', hi: 'कार्नेलियन मनके' }, { en: 'cotton cloth', hi: 'सूती कपड़ा' }, { en: 'timber', hi: 'लकड़ी' }], note: { en: 'Mature Harappan trade with Mesopotamia; cuneiform texts name the land of Meluhha.', hi: 'परिपक्व हड़प्पा का मेसोपोटामिया से व्यापार; कीलाक्षर पाठों में मेलुहा का उल्लेख है।' } },
  { id: 'silk-road', start: -130, end: 1450, mode: 'caravan', stops: ['changan', 'dunhuang', 'kashgar', 'samarkand', 'antioch'], goods: [{ en: 'silk', hi: 'रेशम' }, { en: 'horses', hi: 'घोड़े' }, { en: 'paper (later)', hi: 'काग़ज़ (बाद में)' }], note: { en: 'Overland routes linking China to the Mediterranean; branches reached Taxila and northern India.', hi: 'चीन को भूमध्यसागर से जोड़ने वाले स्थल-मार्ग; शाखाएँ तक्षशिला और उत्तर भारत तक पहुँचती थीं।' } },
  { id: 'silk-india-branch', start: -130, end: 1450, mode: 'caravan', stops: ['kashgar', 'taxila'], goods: [{ en: 'Buddhist texts and ideas', hi: 'बौद्ध ग्रंथ और विचार' }], note: { en: 'A branch carrying goods and ideas between Central Asia and the north-west of the subcontinent.', hi: 'मध्य एशिया और उपमहाद्वीप के उत्तर-पश्चिम के बीच वस्तुएँ और विचार ले जाने वाली शाखा।' } },
  { id: 'roman-india', start: -30, end: 300, mode: 'sea', stops: ['berenike', 'muziris'], goods: [{ en: 'pepper', hi: 'काली मिर्च' }, { en: 'Roman gold coins', hi: 'रोमन स्वर्ण सिक्के' }, { en: 'pearls', hi: 'मोती' }], note: { en: 'Monsoon-wind voyages between the Red Sea and the Malabar coast, described in the Periplus (1st century CE).', hi: 'मानसूनी हवाओं पर लाल सागर और मालाबार तट के बीच यात्राएँ, जिनका वर्णन पेरिप्लस (पहली सदी ई.) में है।' } },
  { id: 'barygaza', start: -30, end: 300, mode: 'sea', stops: ['berenike', 'barygaza'], goods: [{ en: 'cotton textiles', hi: 'सूती वस्त्र' }, { en: 'spices', hi: 'मसाले' }], note: { en: 'Barygaza on the Gujarat coast was a major port named in the Periplus.', hi: 'गुजरात तट का बैरीगाज़ा पेरिप्लस में वर्णित प्रमुख बंदरगाह था।' } },
  { id: 'bay-of-bengal', start: 200, end: 1200, mode: 'sea', stops: ['tamralipti', 'palembang'], goods: [{ en: 'spices', hi: 'मसाले' }, { en: 'Buddhist and Hindu ideas', hi: 'बौद्ध और हिंदू विचार' }], note: { en: 'Links between the Bengal coast and Southeast Asian ports such as those of Srivijaya.', hi: 'बंगाल तट और श्रीविजय जैसे दक्षिण-पूर्व एशियाई बंदरगाहों के बीच संपर्क।' } },
];
const R_EARTH = 6371;
export function haversineKm(a, b) {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(x));
}
export const routeKm = (r) => r.stops.slice(1).reduce((s, id, i) => s + haversineKm(CITIES[r.stops[i]], CITIES[id]), 0);
export const travelDays = (r) => routeKm(r) / MODES[r.mode].kmPerDay;
export const activeRoutes = (year) => ROUTES.filter((r) => year >= r.start && year <= r.end);
export const goodsAt = (year) => [...new Set(activeRoutes(year).flatMap((r) => r.goods.map((g) => g.en)))];
export const yearLabel = (y) => (y < 0 ? `${-y} BCE` : `${y} CE`);
/** Equirectangular projection to an SVG box. */
export const project = ({ lat, lon }, w = 640, h = 320, lonMin = 20, lonMax = 125, latMin = -12, latMax = 48) =>
  [((lon - lonMin) / (lonMax - lonMin)) * w, ((latMax - lat) / (latMax - latMin)) * h];
