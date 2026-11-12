// Bilingual teacher panel flow notes and honest model limitations for all 16 themes.
import { T02_TEACHER, T02_LIMITS } from './geography/content.js';
import { T09_TEACHER, T09_LIMITS } from './economics/content.js';

const b = (en, hi) => ({ en, hi });

export const TEACHER = {
  T01: {
    flow: [
      b('Hook (3 min): pose a daily question about your town and ask students which school subject answers it.', 'प्रश्न (3 मिनट): अपने शहर से जुड़ा एक दैनिक प्रश्न पूछें और देखें कौन-सा विषय उसका उत्तर देता है।'),
      b('System Map & 4-Lens Explorer (15 min): pick Varanasi or Sundarbans and read Geography, History, Politics, and Economics side by side.', 'प्रणाली मानचित्र व 4-लेंस अन्वेषक (15 मिनट): एक ही स्थान को चारों दृष्टिकोणों से देखें।'),
      b('Sorter & Exit Ticket (10 min): classify real-world news questions and write a multi-lens reflection.', 'वर्गीकरण व निकास-टिकट (10 मिनट): प्रश्नों को विषयों में छाँटें।'),
    ],
    misconceptions: [
      b('“Economics is only about money, and Geography is only maps.” Both explain resources, livelihoods, and human choices.', '“अर्थशास्त्र केवल पैसा है और भूगोल केवल नक्शे।” दोनों मानव चयन और संसाधन समझाते हैं।'),
    ],
  },
  T02: T02_TEACHER,
  T03: {
    flow: [
      b('Atmosphere Cutaway & Climate Grapher (12 min): compare altitude temperature lapse vs station rainfall seasonality.', 'वायुमंडल काट व जलवायु ग्राफ़ (12 मिनट): ऊँचाई तापमान और मौसमी वर्षा की तुलना करें।'),
      b('Monsoon Map & Land-Sea Breeze (12 min): track Southwest vs Northeast wind reversals and diurnal breeze direction.', 'मानसून मानचित्र व समीर (12 मिनट): दक्षिण-पश्चिम और उत्तर-पूर्व पवन दिशा देखें।'),
      b('Flood Catchment & Carbon Footprint (10 min): test concrete vs forest runoff and household carbon choices.', 'जलग्रहण व कार्बन पदचिह्न (10 मिनट): बाढ़ अपवाह और उत्सर्जन विकल्प परखें।'),
    ],
    misconceptions: [
      b('“Weather and climate are the same thing.” Weather is today’s state; climate is the 30-year statistical pattern.', '“मौसम और जलवायु एक ही हैं।” मौसम दिन-प्रतिदिन की स्थिति है; जलवायु दीर्घकालिक औसत पैटर्न है।'),
    ],
  },
  T04: {
    flow: [
      b('Deep-Time Clock & Evidence Room (12 min): squeeze 2 million years into 24 hours; separate stone evidence from inference.', 'गहन-काल घड़ी व प्रमाण कक्ष (12 मिनट): 20 लाख वर्षों को 24 घंटे में समेटें और प्रमाण व निष्कर्ष अलग करें।'),
      b('Settlement Sim & 3D Harappan City (15 min): inspect citadel, Great Bath, drains, and granary layout in 3D.', 'बस्ती प्रयोग व 3D हड़प्पा नगर (15 मिनट): गढ़ी, विशाल स्नानागार और जल-निकासी का निरीक्षण करें।'),
      b('Comparative Bronze Age Atlas (8 min): connect Harappa with Mesopotamia, Egypt, and Yellow River.', 'तुलनात्मक सभ्यता मानचित्र (8 मिनट): हड़प्पा, मेसोपोटामिया, मिस्र व चीन की तुलना करें।'),
    ],
    misconceptions: [
      b('“Farming instantly made life easier than foraging.” Early farming raised calories per hectare but also brought harder labour and contagious disease.', '“खेती ने तुरंत जीवन आसान बना दिया।” आरंभिक खेती से अनाज बढ़ा पर श्रम और रोग जोखिम भी बढ़े।'),
    ],
  },
  T05: {
    flow: [
      b('Historical Map & Source Room (12 min): contrast literary texts, stone edicts, and coins/pottery.', 'मानचित्र व स्रोत कक्ष (12 मिनट): ग्रंथों, शिलालेखों और पुरातात्विक स्रोतों की तुलना करें।'),
      b('Empire Admin, Knowledge & Guilds (18 min): examine Arthashastra/Ashokan provinces, Takshashila/Nalanda, and Uttarapatha/Dakshinapatha trade.', 'प्रशासन, ज्ञान परंपरा व श्रेणियाँ (18 मिनट): प्रांतीय प्रशासन, विश्वविद्यालय और व्यापार मार्ग देखें।'),
    ],
  },
  T06: {
    flow: [
      b('Case Assessor & Early Traditions (12 min): test the 4 democratic criteria and read the 920 CE Uttaramerur Kudavolai rules.', 'लोकतंत्र जांच व प्रारंभिक परंपराएँ (12 मिनट): 4 मानदंड परखें और उत्तरमेरूर अभिलेख देखें।'),
      b('Parliamentary vs Presidential & Country Atlas (18 min): run a no-confidence vote and compare India, USA, France, Canada, and Russia.', 'संसदीय बनाम अध्यक्षीय व विश्व तुलना (18 मिनट): अविश्वास मत चलाएँ और देशों की तुलना करें।'),
    ],
  },
  T07: {
    flow: [
      b('ECI Workflow & Vote-to-Seat Sandbox (15 min): see how Model Code works and compare FPTP vs Runoff vs PR on one fictional vote set.', 'निर्वाचन प्रक्रिया व प्रयोगशाला (15 मिनट): आचार संहिता व FPTP बनाम आनुपातिक प्रणाली परखें।'),
      b('Delimitation, Voter Roll & Coalitions (15 min): test gerrymandering vs parity and form minimal winning coalitions.', 'परिसीमन व गठबंधन (15 मिनट): सीमा-निर्धारण और न्यूनतम बहुमत गठबंधन जाँचें।'),
    ],
  },
  T08: {
    flow: [
      b('Scarcity Board & PPF (15 min): allocate ₹100, trace bowing opportunity cost on the PPF, and discuss idle capacity.', 'दुर्लभता व PPF (15 मिनट): ₹100 का विभाजन करें और बढ़ती अवसर-लागत समझें।'),
      b('Central Problems, Systems & Safety Net (15 min): compare market, planned, and mixed economies plus shock protection.', 'केंद्रीय समस्याएँ, प्रणालियाँ व सुरक्षा-जाल (15 मिनट): प्रणालियों और संकट-सुरक्षा की तुलना करें।'),
    ],
  },
  T09: T09_TEACHER,
  T10: {
    flow: [
      b('3D Ocean Relief & Motions (15 min): sculpt shelf, slope, trench, and ridge; contrast waves, spring/neap tides, and currents.', '3D महासागर उच्चावच व गति (15 मिनट): मग्नतट, गर्त, ज्वार-भाटा और धाराएँ समझें।'),
      b('Fisheries, Coastal Hazards & Maritime Law (15 min): manage MSY, calculate tsunami evacuation minutes, and inspect UNCLOS zones.', 'मत्स्य, चक्रवात/सुनामी व समुद्री नियम (15 मिनट): टिकाऊ मत्स्य व UNCLOS देखें।'),
    ],
  },
  T11: {
    flow: [
      b('World Biomes & India Biosphere Reserves (15 min): match climate to flora/fauna and locate reserves from Nilgiri to Sundarbans.', 'विश्व बायोम व भारत जैवमंडल (15 मिनट): जलवायु के अनुसार वनस्पति और आरक्षित क्षेत्र पहचानें।'),
      b('Forest Trade-offs, Fire Mitigation & Sacred Groves (15 min): balance ecotourism, test fire drivers, and study community conservation.', 'पारिस्थितिक पर्यटन, वनाग्नि व पवित्र उपवन (15 मिनट): वनाग्नि रोकथाम और सामुदायिक संरक्षण देखें।'),
    ],
  },
  T12: {
    flow: [
      b('Regional Polities & 3D Hill Fort (15 min): inspect Chola, Rajput, Vijayanagara, Maratha, and Ahom centres; rotate the 3D hill fort cutaway.', 'क्षेत्रीय राज्य व 3D पहाड़ी दुर्ग (15 मिनट): मानचित्र पर राज्य और 3D दुर्ग रक्षा रचना देखें।'),
      b('Heritage, Bhakti Map & Continuity Timeline (15 min): trace Bhakti poets across regions and track economic-cultural resilience (1000–1700 CE).', 'विरासत, भक्ति मानचित्र व समय-रेखा (15 मिनट): 1000–1700 ई. की निरंतरता परखें।'),
    ],
  },
  T13: {
    flow: [
      b('Trade Routes & Cultural Exchange Maps (15 min): filter routes from 1900 BCE to 1200 CE and trace scripts, art, and monsoons.', 'व्यापार व सांस्कृतिक विनिमय मानचित्र (15 मिनट): प्राचीन बंदरगाह व विचार-प्रवाह देखें।'),
      b('IKS Gallery & Artefact Provenance (15 min): examine Aryabhata/Sushruta traditions and match museum finds to port origins.', 'भारतीय ज्ञान प्रणाली व पुरावशेष (15 मिनट): विज्ञान-चिकित्सा योगदान व उत्पत्ति जांचें।'),
    ],
  },
  T14: {
    flow: [
      b('Kautilya/Shukraniti & Concept Map (15 min): balance Danda and Nyaya and distinguish raw power from legitimate authority.', 'कौटिल्य/शुक्रनीति व अवधारणा मानचित्र (15 मिनट): दंड-न्याय संतुलन व वैध प्राधिकार देखें।'),
      b('Constitutional Timeline, Styles & Citizen Workflow (15 min): walk a lawful grievance from ward desk to courts.', 'संवैधानिक विकास व नागरिक प्रक्रिया (15 मिनट): वैध शिकायत प्रक्रिया का अभ्यास करें।'),
    ],
  },
  T15: {
    flow: [
      b('Business Plan & Unit Economics (15 min): test problem validation and find break-even units on the chart.', 'व्यवसाय योजना व इकाई अर्थशास्त्र (15 मिनट): प्रोटोटाइप जांच और सम-विच्छेद बिंदु निकालें।'),
      b('India Hubs, Creative Destruction & P&L (15 min): explore MSME clusters, worker reskilling curves, and shop profit/loss.', 'स्टार्टअप केंद्र, नवाचार व लाभ-हानि (15 मिनट): MSME क्लस्टर व बही-खाता देखें।'),
    ],
  },
  T16: {
    flow: [
      b('Budgeting, Inflation & Compound Interest (15 min): test 50-30-20 shocks, real purchasing power, and the Rule of 72.', 'बजट, मुद्रास्फीति व चक्रवृद्धि ब्याज (15 मिनट): क्रय-शक्ति और 72 के नियम का प्रयोग करें।'),
      b('Risk-Return, Insurance Pool & Tax Concept (15 min): pool 200 families’ risk and explore conceptual progressive tax slabs.', 'जोखिम-प्रतिफल, बीमा व कर अवधारणा (15 मिनट): जोखिम-विभाजन व सार्वजनिक सेवा वित्तपोषण समझें।'),
    ],
  },
};

export const LIMITS = {
  T01: b('Illustrative four-lens summaries and simplified six-node society graph for introductory framing.', 'प्रारंभिक समझ के लिए संक्षिप्त चार-लेंस विवरण और 6-नोड समाज आरेख।'),
  T02: T02_LIMITS,
  T03: b('Standard Atmosphere curve, schematic wind pressures, and simplified catchment/carbon formulas for conceptual understanding — not real weather forecasts.', 'मानक वायुमंडल वक्र और सरलीकृत पवन-अपवाह-कार्बन सूत्र केवल अवधारणात्मक समझ हेतु हैं — मौसम पूर्वानुमान नहीं।'),
  T04: b('Dates are approximate archaeological ranges; the 3D Harappan town is a synthetic educational reconstruction, not a survey of one exact dig.', 'तिथियाँ अनुमानित पुरातात्विक परास हैं; 3D हड़प्पा नगर एक शैक्षिक पुनर्निर्माण है, किसी एक उत्खनन का सटीक मानचित्र नहीं।'),
  T05: b('Schematic regional extents and simplified governance flow diagrams representing centuries of diverse change.', 'सदियों के विविध ऐतिहासिक परिवर्तनों के लिए योजनाबद्ध क्षेत्रीय विस्तार और सरलीकृत प्रशासन आरेख।'),
  T06: b('Fictional assessment cases and concise constitutional summaries; real democracies involve many evolving institutions.', 'काल्पनिक परीक्षण केस और संक्षिप्त संवैधानिक तुलना; वास्तविक लोकतंत्र में कई गतिशील संस्थाएँ होती हैं।'),
  T07: b('All party names, block populations, and vote shares in the sandboxes are strictly fictional for teaching mechanics.', 'प्रयोगशालाओं में सभी दल, मत-प्रतिशत और ब्लॉक जनसंख्या केवल शिक्षण हेतु काल्पनिक हैं।'),
  T08: b('Smooth straight/curved frontier models with fictional rupee figures to demonstrate opportunity cost and safety-net arithmetic.', 'अवसर-लागत व सुरक्षा-जाल गणित दिखाने हेतु काल्पनिक रुपये और सरल वक्र मॉडल।'),
  T09: T09_LIMITS,
  T10: b('Vertical ocean depth in 3D cutaway is strongly exaggerated; logistics fisheries and tsunami speeds are textbook order-of-magnitude models.', '3D समुद्री काट में गहराई अतिरंजित है; मत्स्य और सुनामी मॉडल पाठ्यपुस्तकीय परिमाण दिखाने हेतु हैं।'),
  T11: b('Simplified biome boundaries, reserve markers, and heuristic fire-risk / ecotourism formulas — check local forest advisories for real conditions.', 'सरल बायोम सीमाएँ, आरक्षित क्षेत्र बिंदु और वनाग्नि-जोखिम के शैक्षिक सूत्र।'),
  T12: b('3D hill fort is an architectural composite; regional polity boundaries varied considerably across 1000–1700 CE.', '3D पहाड़ी दुर्ग एक समग्र स्थापत्य पुनर्निर्माण है; 1000–1700 ई. में क्षेत्रीय सीमाएँ समय-समय पर बदलती रहीं।'),
  T13: b('Ports and routes are simplified great-circle arcs across multiple centuries; verify exact dates against textbook chronologies.', 'बंदरगाह व मार्ग अनेक सदियों के सरलीकृत चाप हैं; सटीक तिथियों के लिए पाठ्यपुस्तक देखें।'),
  T14: b('Conceptual governance indicators and fictional grievance timelines illustrating constitutional accountability.', 'संवैधानिक जवाबदेही दर्शाने वाले अवधारणात्मक शासन सूचक और काल्पनिक शिकायत प्रक्रिया।'),
  T15: b('Fictional small-business prices, simplified Schumpeterian transition curves, and illustrative startup hubs.', 'काल्पनिक व्यवसाय मूल्य, सरल नवाचार वक्र और प्रतिनिधि भारतीय स्टार्टअप केंद्र।'),
  T16: b('Hypothetical interest/inflation examples and strictly unitless tax-slab illustrations — never live statutory tax rates or financial advice.', 'काल्पनिक ब्याज/मुद्रास्फीति उदाहरण और इकाई-रहित कर-स्तर चित्रण — ये वास्तविक वैधानिक कर दरें या वित्तीय सलाह नहीं हैं।'),
};
