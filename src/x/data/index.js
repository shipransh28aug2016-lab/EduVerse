// Class X Social Science (CBSE 087): the four NCERT textbooks, 22 chapters.
import history from './history.js';
import geography from './geography.js';
import civics from './civics.js';
import economics from './economics.js';

export const UNITS = [
  { id: 'history', icon: 'Landmark', color: '#f5a34a', en: 'History', hi: 'इतिहास', book: { en: 'India and the Contemporary World II', hi: 'भारत और समकालीन विश्व II' } },
  { id: 'geography', icon: 'Mountain', color: '#4fd1a5', en: 'Geography', hi: 'भूगोल', book: { en: 'Contemporary India II', hi: 'समकालीन भारत II' } },
  { id: 'civics', icon: 'Scale', color: '#a78bfa', en: 'Political Science', hi: 'राजनीति विज्ञान', book: { en: 'Democratic Politics II', hi: 'लोकतांत्रिक राजनीति II' } },
  { id: 'economics', icon: 'Coins', color: '#ff7a6b', en: 'Economics', hi: 'अर्थशास्त्र', book: { en: 'Understanding Economic Development', hi: 'आर्थिक विकास की समझ' } },
];
export const CHAPTERS = [...history, ...geography, ...civics, ...economics];
export const chapter = (id) => CHAPTERS.find((c) => c.id === id);
