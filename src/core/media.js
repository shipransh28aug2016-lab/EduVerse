// Media & icon metadata for all 16 themes + hero, used on home cards and theme headers.
// Respects html.low-g (Low graphics mode hides raster banners automatically via CSS).
import { h } from './dom.js';
import * as i18n from './i18n.js';

export const HERO_MEDIA = {
  src: 'assets/images/hero.jpg',
  en: 'Panoramic view of India showing the Himalaya, green valleys, ancient sandstone heritage, river boats and lively markets.',
  hi: 'हिमालय, हरित घाटियों, प्राचीन बलुआ पत्थर की धरोहर, नावों और जीवंत बाज़ारों का भारत का विहंगम दृश्य।',
};

export const THEME_MEDIA = {
  T01: { src: 'assets/images/t01.jpg', icon: 'Compass', en: 'Indian river valley town uniting history, geography, civic life and trade', hi: 'इतिहास, भूगोल, नागरिक जीवन और व्यापार को जोड़ता भारतीय नदी-घाटी नगर' },
  T02: { src: 'assets/images/t02.jpg', icon: 'Mountain', en: 'Himalayan folded sedimentary ridges and glacial gorge', hi: 'हिमालय की वलित चट्टानी शृंखला और हिमनद घाटी' },
  T03: { src: 'assets/images/t03.jpg', icon: 'CloudRain', en: 'Monsoon clouds and sunbeams over Western Ghats valleys', hi: 'पश्चिमी घाट की घाटियों पर मानसूनी बादल और सूर्य-किरणें' },
  T04: { src: 'assets/images/t04.jpg', icon: 'Landmark', en: 'Harappan baked-brick streets, drains and Great Bath courtyard', hi: 'हड़प्पा की पक्की ईंटों की सड़कें, नालियाँ और विशाल स्नानागार' },
  T05: { src: 'assets/images/t05.jpg', icon: 'ScrollText', en: 'Ancient Indian sandstone pillar, brick monastery courtyard and palm-leaf scholars', hi: 'प्राचीन भारतीय स्तंभ, ईंट विहार प्रांगण और ताड़पत्र विद्वान' },
  T06: { src: 'assets/images/t06.jpg', icon: 'Scale', en: 'Citizens gathering in sunlit Indian parliamentary courtyard dialogue', hi: 'धूप से भरे भारतीय संसदीय प्रांगण में संवाद करते नागरिक' },
  T07: { src: 'assets/images/t07.jpg', icon: 'Vote', en: 'Voters queuing at a sunlit Indian polling booth with indelible ink mark', hi: 'अमिट स्याही के निशान के साथ भारतीय मतदान केंद्र पर कतार में मतदाता' },
  T08: { src: 'assets/images/t08.jpg', icon: 'Coins', en: 'Indian farms, solar microgrid, artisan workshop and village market', hi: 'भारतीय खेत, सौर ग्रिड, शिल्पकार कार्यशाला और ग्रामीण बाज़ार' },
  T09: { src: 'assets/images/t09.jpg', icon: 'TrendingUp', en: 'Morning Indian wholesale tomato mandi with weighing scales', hi: 'तराजू और टमाटर की टोकरियों के साथ भारतीय सुबह की मंडी' },
  T10: { src: 'assets/images/t10.svg', icon: 'Waves', en: 'Indian Ocean waves above coral reef and deep seafloor canyon', hi: 'प्रवाल भित्ति और गहरी समुद्री खाई के ऊपर हिंद महासागर की लहरें' },
  T11: { src: 'assets/images/t11.svg', icon: 'Trees', en: 'Misty Indian forest biosphere reserve and river wetlands', hi: 'कोहरे से ढका भारतीय जैवमंडल आरक्षित क्षेत्र और नदी आर्द्रभूमि' },
  T12: { src: 'assets/images/t12.svg', icon: 'Shield', en: 'Indian hill fort ramparts, stepped reservoir and mandapa pavilion', hi: 'भारतीय पहाड़ी दुर्ग की प्राचीर, सीढ़ीदार बावड़ी और मंडप' },
  T13: { src: 'assets/images/t13.svg', icon: 'Ship', en: 'Ancient Malabar port with merchant ships, spices and silk bales', hi: 'व्यापारिक जहाजों, मसालों और रेशम के साथ प्राचीन मालाबार बंदरगाह' },
  T14: { src: 'assets/images/t14.svg', icon: 'BookOpen', en: 'Classical stone court with balance scales and ancient treatise', hi: 'तराजू और प्राचीन ग्रंथ के साथ शास्त्रीय न्याय-सभा' },
  T15: { src: 'assets/images/t15.svg', icon: 'Lightbulb', en: 'Indian clean-tech innovation workshop and growth chart', hi: 'भारतीय स्वच्छ-तकनीक नवाचार कार्यशाला और प्रगति ग्राफ़' },
  T16: { src: 'assets/images/t16.svg', icon: 'Wallet', en: 'Personal budget ledger, rupee coins and growing savings sapling', hi: 'व्यक्तिगत बजट बही, रुपये के सिक्के और बढ़ता बचत पौधा' },
};

export function themeBannerEl(id) {
  const m = THEME_MEDIA[id];
  if (!m) return null;
  const alt = i18n.pair(m.en, m.hi);
  return h('figure', { class: 'theme-banner' },
    h('img', { src: m.src, alt, loading: 'eager', decoding: 'async' }),
    h('figcaption', { class: 'sr-only', 'data-bi': JSON.stringify({ en: m.en, hi: m.hi }) }, alt));
}
