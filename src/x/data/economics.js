// Class X Economics — Understanding Economic Development (NCERT). Tables carry the figures printed in the textbook;
// editions differ, so every data view tells the learner to check it against the edition in use.
import { b, C, pt, arc, f, idea, ev, q, node, step } from './_h.js';

export default [
  {
    id: 'E1', unit: 'economics', no: 1, icon: 'ChartNoAxesCombined', en: 'Development', hi: 'विकास',
    hook: b('Haryana earns more per person than Kerala. Yet a child born in Kerala is more likely to survive. What is development, then?', 'हरियाणा की प्रति व्यक्ति आय केरल से अधिक है। फिर भी केरल में जन्मे बच्चे के जीवित रहने की संभावना अधिक है। तो विकास क्या है?'),
    scenes: [
      { t: b('India and its neighbours', 'भारत और उसके पड़ोसी'), kind: 'towers', cats: [{ ...b('Sri Lanka', 'श्रीलंका'), color: C.teal }, { ...b('India', 'भारत'), color: C.gold }, { ...b('Myanmar', 'म्यांमार'), color: C.violet }, { ...b('Pakistan', 'पाकिस्तान'), color: C.green }, { ...b('Nepal', 'नेपाल'), color: C.coral }, { ...b('Bangladesh', 'बांग्लादेश'), color: C.sky }], series: [
        { ...b('Gross National Income per capita', 'प्रति व्यक्ति सकल राष्ट्रीय आय'), values: [12578, 6590, 3851, 4624, 3877, 5472], unit: '2017 PPP $' },
        { ...b('Life expectancy at birth', 'जन्म के समय जीवन प्रत्याशा'), values: [76.4, 67.2, 65.7, 66.1, 68.4, 72.4], unit: 'years', max: 90 },
        { ...b('Mean years of schooling (age 25+)', 'विद्यालयी शिक्षा के औसत वर्ष (25+ आयु)'), values: [10.8, 6.7, 6.4, 4.5, 5.1, 7.4], unit: 'years', max: 12 },
        { ...b('HDI rank in the world (lower is better)', 'विश्व में HDI क्रमांक (कम बेहतर)'), values: [73, 132, 149, 161, 143, 129], unit: 'rank', max: 191 },
      ] },
      { t: b('Three states compared', 'तीन राज्यों की तुलना'), kind: 'towers', cats: [{ ...b('Haryana', 'हरियाणा'), color: C.gold }, { ...b('Kerala', 'केरल'), color: C.teal }, { ...b('Bihar', 'बिहार'), color: C.coral }], series: [
        { ...b('Per capita income, 2018–19', 'प्रति व्यक्ति आय, 2018–19'), values: [236147, 204105, 40982], unit: '₹' },
        { ...b('Infant mortality rate per 1,000 live births, 2018', 'शिशु मृत्यु दर प्रति 1,000 जीवित जन्म, 2018'), values: [30, 7, 32], unit: 'per 1,000' },
        { ...b('Literacy rate, 2017–18', 'साक्षरता दर, 2017–18'), values: [82, 94, 62], unit: '%', suffix: '%', max: 100 },
        { ...b('Net attendance ratio, secondary stage, 2017–18', 'निवल उपस्थिति अनुपात, माध्यमिक स्तर, 2017–18'), values: [61, 83, 43], unit: 'per 100', max: 100 },
      ] },
    ],
    ideas: [
      idea('Different people, different goals', 'अलग लोग, अलग लक्ष्य', 'What is development for one may be destructive for another. Besides income, people seek equal treatment, freedom, security and respect.', 'एक के लिए जो विकास है, दूसरे के लिए विनाशकारी हो सकता है। आय के अलावा लोग बराबरी का व्यवहार, स्वतंत्रता, सुरक्षा और सम्मान चाहते हैं।'),
      idea('Income is an average', 'आय एक औसत है', 'Per capita income is total income divided by population. It hides how income is distributed among people.', 'प्रति व्यक्ति आय कुल आय को जनसंख्या से भाग देकर मिलती है। यह नहीं बताती कि आय लोगों में कैसे बँटी है।'),
      idea('Public facilities', 'सार्वजनिक सुविधाएँ', 'Money cannot buy a pollution-free environment or protection from infectious disease. Kerala’s low infant mortality comes from basic health and education facilities.', 'पैसा प्रदूषण-मुक्त वातावरण या संक्रामक रोग से सुरक्षा नहीं ख़रीद सकता। केरल की कम शिशु मृत्यु दर बुनियादी स्वास्थ्य और शिक्षा सुविधाओं से है।'),
      idea('Sustainability', 'धारणीयता', 'Groundwater overuse and exhaustible fuels show that today’s level of development must be maintained for future generations.', 'भूजल का अति-उपयोग और समाप्त होने वाले ईंधन दिखाते हैं कि आज के विकास स्तर को भावी पीढ़ियों के लिए बनाए रखना होगा।'),
    ],
    explore: [{
      t: b('Whose development?', 'किसका विकास?'), kind: 'steps', steps: [
        step('Landless rural labourers', 'भूमिहीन ग्रामीण मज़दूर', 'More days of work and better wages; a local school that gives quality education to their children; no social discrimination.', 'काम के अधिक दिन और बेहतर मज़दूरी; बच्चों को अच्छी शिक्षा देने वाला स्थानीय विद्यालय; कोई सामाजिक भेदभाव नहीं।'),
        step('Prosperous farmers from Punjab', 'पंजाब के समृद्ध किसान', 'High family income through higher support prices for crops and hardworking, cheap labourers; being able to settle their children abroad.', 'फ़सलों के ऊँचे समर्थन मूल्य और मेहनती, सस्ते मज़दूरों से अधिक पारिवारिक आय; बच्चों को विदेश में बसा पाना।'),
        step('A girl from a rich urban family', 'समृद्ध शहरी परिवार की लड़की', 'As much freedom as her brother, and being able to decide what she wants to do in life.', 'भाई जितनी स्वतंत्रता, और जीवन में क्या करना है यह स्वयं तय कर पाना।'),
        step('An adivasi from the Narmada valley', 'नर्मदा घाटी का आदिवासी', 'A dam that brings electricity to industry may submerge this person’s land: development goals can conflict.', 'जो बाँध उद्योग को बिजली देता है वही इस व्यक्ति की भूमि डुबो सकता है: विकास के लक्ष्य टकरा सकते हैं।'),
      ],
    }],
    quiz: [
      q('The Human Development Report is published by', 'मानव विकास रिपोर्ट कौन प्रकाशित करता है?', [['World Bank', 'विश्व बैंक'], ['UNDP', 'UNDP'], ['IMF', 'IMF'], ['WTO', 'WTO']], 1, 'It compares countries on education, health and per capita income.', 'यह देशों की तुलना शिक्षा, स्वास्थ्य और प्रति व्यक्ति आय के आधार पर करती है।'),
      q('Infant Mortality Rate is the number of children who die before the age of one year per', 'शिशु मृत्यु दर: एक वर्ष की आयु से पहले मरने वाले बच्चों की संख्या, प्रति', [['100 live births', '100 जीवित जन्म'], ['1,000 live births', '1,000 जीवित जन्म'], ['10,000 people', '10,000 लोग'], ['1 lakh people', '1 लाख लोग']], 1, 'In that particular year.', 'उस विशेष वर्ष में।'),
      q('Which criterion does the World Bank use to classify countries?', 'विश्व बैंक देशों के वर्गीकरण में कौन-सा मापदंड उपयोग करता है?', [['Literacy rate', 'साक्षरता दर'], ['Per capita income', 'प्रति व्यक्ति आय'], ['Life expectancy', 'जीवन प्रत्याशा'], ['Population', 'जनसंख्या']], 1, 'Countries are grouped as rich (high income) or low income.', 'देशों को समृद्ध (उच्च आय) या निम्न आय वाले समूहों में रखा जाता है।'),
      q('Why does Kerala have a low infant mortality rate?', 'केरल में शिशु मृत्यु दर कम क्यों है?', [['Highest per capita income', 'सबसे अधिक प्रति व्यक्ति आय'], ['Adequate basic health and educational facilities', 'पर्याप्त बुनियादी स्वास्थ्य और शिक्षा सुविधाएँ'], ['Smallest population', 'सबसे कम जनसंख्या'], ['Most industries', 'सबसे अधिक उद्योग']], 1, 'Income by itself is not a completely adequate indicator.', 'केवल आय अपने आप में पूरी तरह पर्याप्त सूचक नहीं है।'),
    ],
    note: b('Figures are those printed in the current NCERT tables (Human Development Report 2021–22; Economic Survey; National Statistical Office). Editions differ: check your textbook.', 'आँकड़े वर्तमान NCERT तालिकाओं (मानव विकास रिपोर्ट 2021–22; आर्थिक सर्वेक्षण; राष्ट्रीय सांख्यिकी कार्यालय) के हैं। संस्करण अलग हो सकते हैं: अपनी पाठ्यपुस्तक से मिलाएँ।'),
  },
  {
    id: 'E2', unit: 'economics', no: 2, icon: 'PieChart', en: 'Sectors of the Indian Economy', hi: 'भारतीय अर्थव्यवस्था के क्षेत्रक',
    hook: b('The service sector produces most of India’s income, yet most workers are still on farms. Why?', 'भारत की अधिकांश आय सेवा क्षेत्रक से आती है, फिर भी अधिकांश कामगार अब भी खेतों में हैं। क्यों?'),
    scenes: [{ t: b('Where do people work?', 'लोग कहाँ काम करते हैं?'), kind: 'towers', cats: [{ ...b('Primary: agriculture, forestry, fishing, mining', 'प्राथमिक: कृषि, वानिकी, मत्स्य, खनन'), color: C.green }, { ...b('Secondary: manufacturing', 'द्वितीयक: विनिर्माण'), color: C.gold }, { ...b('Tertiary: services', 'तृतीयक: सेवाएँ'), color: C.sky }], series: [
      { ...b('Share of employment, 1977–78', 'रोज़गार में हिस्सा, 1977–78'), values: [71, 11, 18], unit: '%', suffix: '%', max: 100 },
      { ...b('Share of employment, 2017–18', 'रोज़गार में हिस्सा, 2017–18'), values: [44, 25, 31], unit: '%', suffix: '%', max: 100 },
    ] }],
    ideas: [
      idea('Three sectors, one chain', 'तीन क्षेत्रक, एक शृंखला', 'Primary activities use natural resources, secondary activities manufacture, tertiary activities provide services. They depend on one another.', 'प्राथमिक गतिविधियाँ प्राकृतिक संसाधन उपयोग करती हैं, द्वितीयक विनिर्माण करती हैं, तृतीयक सेवाएँ देती हैं। ये एक-दूसरे पर निर्भर हैं।'),
      idea('Counting only final goods', 'केवल अंतिम वस्तुओं की गणना', 'GDP is the value of all final goods and services produced within a country in a year; counting intermediate goods would be double counting.', 'GDP एक वर्ष में देश के भीतर उत्पादित सभी अंतिम वस्तुओं और सेवाओं का मूल्य है; मध्यवर्ती वस्तुओं को गिनना दोहरी गणना होगी।'),
      idea('Disguised unemployment', 'प्रच्छन्न बेरोज़गारी', 'More people work on a farm than are needed: if some leave, output does not fall. This underemployment is hidden.', 'खेत पर ज़रूरत से अधिक लोग काम करते हैं: कुछ हट जाएँ तो उत्पादन नहीं घटता। यह अल्प-रोज़गार छिपा रहता है।'),
      idea('Organised and unorganised', 'संगठित और असंगठित', 'Organised-sector workers have regular terms and job security; unorganised workers have low pay and no protection. MGNREGA 2005 guarantees 100 days of rural work.', 'संगठित क्षेत्रक के कामगारों को नियमित शर्तें और रोज़गार सुरक्षा मिलती है; असंगठित में कम वेतन और कोई सुरक्षा नहीं। मनरेगा 2005 ग्रामीण क्षेत्र में 100 दिन के काम की गारंटी देता है।'),
    ],
    explore: [
      { t: b('From cotton field to shop', 'कपास के खेत से दुकान तक'), kind: 'steps', steps: [
        step('Primary: growing cotton', 'प्राथमिक: कपास उगाना', 'The farmer produces cotton using land, water and sunlight.', 'किसान भूमि, जल और धूप से कपास उगाता है।'),
        step('Secondary: spinning and weaving', 'द्वितीयक: कताई और बुनाई', 'Mills turn cotton into yarn and cloth: a manufacturing process changes the natural product.', 'मिलें कपास से धागा और कपड़ा बनाती हैं: विनिर्माण प्राकृतिक उत्पाद का रूप बदलता है।'),
        step('Tertiary: transport, banking, trade', 'तृतीयक: परिवहन, बैंकिंग, व्यापार', 'Trucks, banks, warehouses and shops do not make a good but help the other two sectors.', 'ट्रक, बैंक, गोदाम और दुकानें वस्तु नहीं बनातीं पर बाक़ी दोनों क्षेत्रकों की मदद करती हैं।'),
        step('Only the final value counts', 'केवल अंतिम मूल्य गिना जाता है', 'The price of the shirt already includes the value of the cotton and the cloth.', 'क़मीज़ के दाम में कपास और कपड़े का मूल्य पहले से शामिल है।'),
      ] },
      { t: b('Ways of classifying the economy', 'अर्थव्यवस्था के वर्गीकरण के तरीक़े'), kind: 'tree', root: node('Economic activities', 'आर्थिक गतिविधियाँ', [
        node('By nature of activity', 'गतिविधि की प्रकृति से', [node('Primary', 'प्राथमिक'), node('Secondary', 'द्वितीयक'), node('Tertiary', 'तृतीयक')], 'What kind of work is done.', 'किस प्रकार का काम होता है।'),
        node('By conditions of work', 'काम की दशाओं से', [node('Organised', 'संगठित', null, 'Registered with the government; follows laws such as the Factories Act and the Minimum Wages Act.', 'सरकार में पंजीकृत; कारख़ाना अधिनियम और न्यूनतम मज़दूरी अधिनियम जैसे क़ानून मानता है।'), node('Unorganised', 'असंगठित', null, 'Small, scattered units largely outside government control; jobs are low-paid and insecure.', 'छोटी, बिखरी इकाइयाँ जो अधिकांशतः सरकारी नियंत्रण से बाहर हैं; रोज़गार कम वेतन वाला और असुरक्षित।')]),
        node('By ownership', 'स्वामित्व से', [node('Public sector', 'सार्वजनिक क्षेत्रक', null, 'The government owns most assets and provides services: Railways, post office.', 'अधिकांश परिसंपत्तियाँ सरकार की हैं और वही सेवाएँ देती है: रेलवे, डाकघर।'), node('Private sector', 'निजी क्षेत्रक', null, 'Owned by individuals or companies and guided by the motive to earn profit.', 'व्यक्तियों या कंपनियों का स्वामित्व; उद्देश्य लाभ कमाना।')]),
      ]) },
    ],
    quiz: [
      q('Why are only final goods and services counted in GDP?', 'GDP में केवल अंतिम वस्तुएँ और सेवाएँ क्यों गिनी जाती हैं?', [['To avoid double counting', 'दोहरी गणना से बचने के लिए'], ['They are cheaper', 'वे सस्ती होती हैं'], ['They are exported', 'उनका निर्यात होता है'], ['They are taxed', 'उन पर कर लगता है']], 0, 'The value of final goods already includes the value of intermediate goods.', 'अंतिम वस्तुओं के मूल्य में मध्यवर्ती वस्तुओं का मूल्य पहले से शामिल है।'),
      q('Underemployment in which people appear to be working but are not needed is called', 'वह अल्प-रोज़गार जिसमें लोग काम करते दिखते हैं पर उनकी ज़रूरत नहीं, कहलाता है', [['Seasonal unemployment', 'मौसमी बेरोज़गारी'], ['Disguised unemployment', 'प्रच्छन्न बेरोज़गारी'], ['Educated unemployment', 'शिक्षित बेरोज़गारी'], ['Frictional unemployment', 'घर्षणात्मक बेरोज़गारी']], 1, 'It is common in agriculture.', 'यह कृषि में सामान्य है।'),
      q('MGNREGA 2005 guarantees how many days of employment in a year?', 'मनरेगा 2005 वर्ष में कितने दिन के रोज़गार की गारंटी देता है?', [['50', '50'], ['100', '100'], ['150', '150'], ['365', '365']], 1, 'It is also called the Right to Work.', 'इसे काम का अधिकार भी कहते हैं।'),
      q('The service sector is also called the', 'सेवा क्षेत्रक को यह भी कहते हैं', [['Primary sector', 'प्राथमिक क्षेत्रक'], ['Secondary sector', 'द्वितीयक क्षेत्रक'], ['Tertiary sector', 'तृतीयक क्षेत्रक'], ['Public sector', 'सार्वजनिक क्षेत्रक']], 2, 'Its activities help develop the primary and secondary sectors.', 'इसकी गतिविधियाँ प्राथमिक और द्वितीयक क्षेत्रकों के विकास में मदद करती हैं।'),
    ],
    note: b('Employment shares are those printed in the NCERT chapter; check them against your edition.', 'रोज़गार के हिस्से NCERT अध्याय में छपे आँकड़े हैं; अपने संस्करण से मिलाएँ।'),
  },
  {
    id: 'E3', unit: 'economics', no: 3, icon: 'Banknote', en: 'Money and Credit', hi: 'मुद्रा और साख',
    hook: b('A bank keeps only a small part of your deposit as cash. Where does the rest of your money go?', 'बैंक आपकी जमा का केवल छोटा हिस्सा नक़द रखता है। बाक़ी पैसा कहाँ जाता है?'),
    scenes: [{ t: b('How a bank links savers and borrowers', 'बैंक बचतकर्ता और ऋणी को कैसे जोड़ता है'), kind: 'diorama', name: 'bank' }],
    ideas: [
      idea('Money as a medium of exchange', 'विनिमय के माध्यम के रूप में मुद्रा', 'Money removes the need for a double coincidence of wants that barter requires. The rupee is accepted because the law authorises it.', 'मुद्रा, वस्तु-विनिमय के लिए ज़रूरी आवश्यकताओं के दोहरे संयोग की शर्त हटाती है। रुपया इसलिए स्वीकार होता है क्योंकि क़ानून इसे अधिकृत करता है।'),
      idea('Banks create credit', 'बैंक साख बनाते हैं', 'Banks in India hold only about 15 per cent of deposits as cash and lend out the rest; the difference in interest is their main income.', 'भारत में बैंक जमा का लगभग 15 प्रतिशत ही नक़द रखते हैं और बाक़ी ऋण देते हैं; ब्याज का अंतर उनकी मुख्य आय है।'),
      idea('Terms of credit', 'ऋण की शर्तें', 'Interest rate, collateral, documentation and mode of repayment together make up the terms of credit.', 'ब्याज दर, समर्थक ऋणाधार, काग़ज़ात और चुकौती का तरीक़ा मिलकर ऋण की शर्तें बनाते हैं।'),
      idea('Formal, informal and SHGs', 'औपचारिक, अनौपचारिक और SHG', 'The Reserve Bank of India supervises formal lenders; informal lenders charge much higher interest. Self Help Groups of 15–20 members pool savings and borrow without collateral.', 'भारतीय रिज़र्व बैंक औपचारिक ऋणदाताओं की निगरानी करता है; अनौपचारिक ऋणदाता कहीं अधिक ब्याज लेते हैं। 15–20 सदस्यों के स्वयं सहायता समूह बचत जोड़ते हैं और बिना ऋणाधार ऋण लेते हैं।'),
    ],
    explore: [
      { t: b('Cost of credit calculator', 'ऋण की लागत गणक'), kind: 'loan' },
      { t: b('How a Self Help Group works', 'स्वयं सहायता समूह कैसे काम करता है'), kind: 'steps', steps: [
        step('Form a group', 'समूह बनाना', '15–20 members, usually from one neighbourhood, meet and save regularly.', 'प्रायः एक ही मोहल्ले के 15–20 सदस्य नियमित रूप से मिलते और बचत करते हैं।'),
        step('Lend to members', 'सदस्यों को ऋण', 'Members take small loans from the group itself; the interest is lower than a moneylender’s.', 'सदस्य समूह से ही छोटे ऋण लेते हैं; ब्याज साहूकार से कम होता है।'),
        step('Link with a bank', 'बैंक से जुड़ना', 'After a year or two of regular saving, the group becomes eligible for a bank loan.', 'एक-दो वर्ष की नियमित बचत के बाद समूह बैंक ऋण के योग्य हो जाता है।'),
        step('Decide together', 'मिलकर निर्णय', 'The group decides the purpose, amount, interest and repayment schedule of loans.', 'समूह ऋण का उद्देश्य, राशि, ब्याज और चुकौती कार्यक्रम तय करता है।'),
        step('No collateral needed', 'ऋणाधार की ज़रूरत नहीं', 'The group is responsible for repayment, so poor women can borrow without collateral.', 'चुकौती की ज़िम्मेदारी समूह की है, इसलिए निर्धन महिलाएँ बिना ऋणाधार ऋण ले पाती हैं।'),
      ] },
    ],
    quiz: [
      q('What does the use of money eliminate?', 'मुद्रा के उपयोग से क्या समाप्त होता है?', [['Double coincidence of wants', 'आवश्यकताओं का दोहरा संयोग'], ['Interest', 'ब्याज'], ['Collateral', 'ऋणाधार'], ['Banking', 'बैंकिंग']], 0, 'In barter, each side must want what the other offers.', 'वस्तु-विनिमय में दोनों पक्षों को एक-दूसरे की वस्तु चाहिए होती है।'),
      q('Who issues currency notes on behalf of the central government in India?', 'भारत में केंद्र सरकार की ओर से करेंसी नोट कौन जारी करता है?', [['State Bank of India', 'भारतीय स्टेट बैंक'], ['Reserve Bank of India', 'भारतीय रिज़र्व बैंक'], ['Finance Commission', 'वित्त आयोग'], ['NABARD', 'नाबार्ड']], 1, 'No other individual or organisation is allowed to issue currency.', 'किसी अन्य व्यक्ति या संस्था को मुद्रा जारी करने की अनुमति नहीं है।'),
      q('An asset the borrower owns and uses as a guarantee to the lender is called', 'ऋणी की वह परिसंपत्ति जो ऋणदाता को गारंटी के रूप में दी जाए, कहलाती है', [['Deposit', 'जमा'], ['Collateral', 'समर्थक ऋणाधार'], ['Credit', 'साख'], ['Cheque', 'चेक']], 1, 'Such as land, a building, a vehicle, livestock or bank deposits.', 'जैसे भूमि, इमारत, वाहन, पशुधन या बैंक जमा।'),
      q('About what share of their deposits do banks in India hold as cash?', 'भारत में बैंक अपनी जमा का लगभग कितना हिस्सा नक़द रखते हैं?', [['About 15%', 'लगभग 15%'], ['About 50%', 'लगभग 50%'], ['About 85%', 'लगभग 85%'], ['All of it', 'पूरा']], 0, 'This covers depositors who withdraw on any given day.', 'इससे किसी भी दिन पैसा निकालने वाले जमाकर्ताओं की माँग पूरी होती है।'),
    ],
    note: b('The bank scene is a schematic loop. The calculator is a simple-interest model with rates you set, not market rates.', 'बैंक दृश्य एक योजनाबद्ध चक्र है। गणक साधारण ब्याज का मॉडल है जिसमें दरें आप तय करते हैं, बाज़ार दरें नहीं।'),
  },
  {
    id: 'E4', unit: 'economics', no: 4, icon: 'Globe', en: 'Globalisation and the Indian Economy', hi: 'वैश्वीकरण और भारतीय अर्थव्यवस्था',
    hook: b('Your phone was designed on one continent, made on another and sold on a third. Who gains from that journey?', 'आपका फ़ोन एक महाद्वीप पर डिज़ाइन हुआ, दूसरे पर बना और तीसरे पर बिका। इस यात्रा से किसे लाभ होता है?'),
    scenes: [{
      t: b('Production across countries', 'देशों के पार उत्पादन'), kind: 'globe', dist: 3.3, layers: [
        { en: 'An MNC spreads production', hi: 'बहुराष्ट्रीय कंपनी का फैला उत्पादन', focus: f(30, 20), highlight: { 'United States of America': C.sky, China: C.coral, Mexico: C.green, Poland: C.green, India: C.gold }, points: [pt(40, -100, 'USA: design in research centres', 'अमेरिका: शोध केंद्रों में डिज़ाइन', C.sky), pt(35, 105, 'China: components, cheap manufacturing', 'चीन: पुर्ज़े, सस्ता विनिर्माण', C.coral), pt(23, -102, 'Mexico and Eastern Europe: assembly, close to markets', 'मेक्सिको और पूर्वी यूरोप: असेंबली, बाज़ारों के पास', C.green), pt(22, 78, 'India: call centres, skilled engineers', 'भारत: कॉल सेंटर, कुशल इंजीनियर')], arcs: [arc([40, -100], [35, 105], C.sky), arc([35, 105], [23, -102], C.coral), arc([35, 105], [52, 19], C.coral), arc([23, -102], [40, -100], C.green), arc([22, 78], [40, -100], C.gold)] },
        { en: 'Indian companies go global', hi: 'भारतीय कंपनियाँ विश्व में', focus: f(25, 60), highlight: { India: C.gold }, points: [pt(22, 78, 'Tata Motors, Infosys, Ranbaxy, Asian Paints, Sundaram Fasteners', 'टाटा मोटर्स, इंफ़ोसिस, रैनबैक्सी, एशियन पेंट्स, सुंदरम फ़ास्नर्स'), pt(46.2, 6.14, 'Geneva: World Trade Organization', 'जेनेवा: विश्व व्यापार संगठन', C.violet)], arcs: [arc([22, 78], [51.5, -0.13], C.gold), arc([22, 78], [38.9, -77], C.gold), arc([22, 78], [-26, 28], C.gold), arc([22, 78], [1.35, 103.8], C.gold)] },
      ],
    }],
    ideas: [
      idea('Multinational corporations', 'बहुराष्ट्रीय कंपनियाँ', 'An MNC owns or controls production in more than one nation, setting up where labour is cheap, markets are close and policies are favourable.', 'बहुराष्ट्रीय कंपनी एक से अधिक देशों में उत्पादन की मालिक या नियंत्रक होती है; वहाँ इकाई लगाती है जहाँ श्रम सस्ता, बाज़ार पास और नीतियाँ अनुकूल हों।'),
      idea('Trade integrates markets', 'व्यापार बाज़ारों को जोड़ता है', 'Foreign trade lets producers reach beyond domestic markets and gives buyers a wider choice; prices of similar goods tend to become equal.', 'विदेश व्यापार उत्पादकों को घरेलू बाज़ार से आगे पहुँचाता है और ख़रीदारों को अधिक विकल्प देता है; समान वस्तुओं के दाम बराबर होने लगते हैं।'),
      idea('Liberalisation since 1991', '1991 से उदारीकरण', 'Removing barriers such as import taxes and quotas is liberalisation. The WTO sets rules for international trade.', 'आयात कर और कोटा जैसी बाधाएँ हटाना उदारीकरण है। विश्व व्यापार संगठन अंतरराष्ट्रीय व्यापार के नियम तय करता है।'),
      idea('Uneven impact', 'असमान प्रभाव', 'Well-off consumers and large companies gained; many small producers and workers faced competition and insecure jobs. Fair globalisation needs supportive policies.', 'संपन्न उपभोक्ताओं और बड़ी कंपनियों को लाभ हुआ; कई छोटे उत्पादकों और मज़दूरों को प्रतिस्पर्धा और असुरक्षित रोज़गार झेलना पड़ा। न्यायसंगत वैश्वीकरण के लिए सहायक नीतियाँ चाहिए।'),
    ],
    explore: [
      { t: b('One product, many countries', 'एक उत्पाद, अनेक देश'), kind: 'sankey', title: b('A global production chain', 'वैश्विक उत्पादन शृंखला'), nodes: [{ id: 'd', ...b('Design: USA', 'डिज़ाइन: अमेरिका'), color: C.sky }, { id: 'c', ...b('Components: China', 'पुर्ज़े: चीन'), color: C.coral }, { id: 'm', ...b('Assembly: Mexico', 'असेंबली: मेक्सिको'), color: C.green }, { id: 'e', ...b('Assembly: Eastern Europe', 'असेंबली: पूर्वी यूरोप'), color: C.teal }, { id: 'i', ...b('Customer care: India', 'ग्राहक सेवा: भारत'), color: C.gold }, { id: 'a', ...b('Markets: Americas', 'बाज़ार: अमेरिका महाद्वीप'), color: C.violet }, { id: 'u', ...b('Markets: Europe', 'बाज़ार: यूरोप'), color: C.pink }, { id: 'w', ...b('Markets: rest of world', 'बाज़ार: शेष विश्व'), color: C.orange }], links: [{ source: 'd', target: 'c', value: 6 }, { source: 'c', target: 'm', value: 3 }, { source: 'c', target: 'e', value: 3 }, { source: 'm', target: 'a', value: 3 }, { source: 'e', target: 'u', value: 2 }, { source: 'e', target: 'w', value: 1 }, { source: 'i', target: 'a', value: 1 }, { source: 'i', target: 'u', value: 1 }] },
      { t: b('Timeline of India’s opening up', 'भारत के खुलने की समयरेखा'), kind: 'timeline', events: [
        ev('1947–91', 'Barriers to trade and investment', 'व्यापार और निवेश पर अवरोध', 'Protection was thought necessary to shield domestic producers from foreign competition.', 'घरेलू उत्पादकों को विदेशी प्रतिस्पर्धा से बचाने के लिए संरक्षण ज़रूरी माना गया।'),
        ev('1991', 'New economic policy', 'नई आर्थिक नीति', 'Barriers on foreign trade and foreign investment are removed to a large extent.', 'विदेश व्यापार और विदेशी निवेश पर अवरोध काफ़ी हद तक हटाए गए।'),
        ev('1995', 'World Trade Organization', 'विश्व व्यापार संगठन', 'Set up to liberalise international trade and frame its rules.', 'अंतरराष्ट्रीय व्यापार को उदार बनाने और नियम गढ़ने के लिए स्थापित।'),
        ev('2000s', 'Special Economic Zones', 'विशेष आर्थिक क्षेत्र', 'Industrial zones with world-class facilities and tax exemptions attract foreign companies.', 'विश्व-स्तरीय सुविधाओं और कर छूट वाले औद्योगिक क्षेत्र विदेशी कंपनियों को आकर्षित करते हैं।'),
      ] },
    ],
    quiz: [
      q('A company that owns or controls production in more than one nation is', 'एक से अधिक देशों में उत्पादन की मालिक या नियंत्रक कंपनी है', [['A cooperative', 'सहकारी समिति'], ['A multinational corporation', 'बहुराष्ट्रीय कंपनी'], ['A public sector unit', 'सार्वजनिक उपक्रम'], ['A self help group', 'स्वयं सहायता समूह']], 1, 'MNCs set up production where it is cheapest and close to markets.', 'बहुराष्ट्रीय कंपनियाँ वहाँ उत्पादन लगाती हैं जहाँ सबसे सस्ता और बाज़ार के पास हो।'),
      q('Removing barriers or restrictions set by the government on trade is called', 'व्यापार पर सरकार की बाधाएँ या प्रतिबंध हटाना कहलाता है', [['Privatisation', 'निजीकरण'], ['Liberalisation', 'उदारीकरण'], ['Nationalisation', 'राष्ट्रीयकरण'], ['Protectionism', 'संरक्षणवाद']], 1, 'A tax on imports is one example of a trade barrier.', 'आयात पर कर व्यापार अवरोध का एक उदाहरण है।'),
      q('Which organisation aims to liberalise international trade?', 'कौन-सा संगठन अंतरराष्ट्रीय व्यापार को उदार बनाना चाहता है?', [['WHO', 'WHO'], ['WTO', 'WTO'], ['UNESCO', 'UNESCO'], ['ILO', 'ILO']], 1, 'It establishes rules and sees that they are obeyed.', 'यह नियम बनाता है और उनका पालन देखता है।'),
      q('Investment made by MNCs is called', 'बहुराष्ट्रीय कंपनियों द्वारा किया गया निवेश कहलाता है', [['Foreign investment', 'विदेशी निवेश'], ['Disinvestment', 'विनिवेश'], ['Public investment', 'सार्वजनिक निवेश'], ['Subsidy', 'अनुदान']], 0, 'Money spent to buy assets such as land, buildings and machines.', 'भूमि, इमारत और मशीनों जैसी परिसंपत्तियाँ ख़रीदने पर ख़र्च किया गया धन।'),
    ],
    note: b('The production chain follows the illustrative example in the NCERT chapter; flow widths are not real trade values.', 'उत्पादन शृंखला NCERT अध्याय के उदाहरण पर आधारित है; प्रवाह की चौड़ाई वास्तविक व्यापार मूल्य नहीं दर्शाती।'),
  },
  {
    id: 'E5', unit: 'economics', no: 5, icon: 'ShieldCheck', en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार',
    hook: b('You bought a faulty phone and the shop refuses to help. What can one consumer do against a big company?', 'आपने ख़राब फ़ोन ख़रीदा और दुकानदार मदद से मना करता है। एक उपभोक्ता बड़ी कंपनी के सामने क्या कर सकता है?'),
    scenes: [{ t: b('Three-tier consumer commissions', 'त्रि-स्तरीय उपभोक्ता आयोग'), kind: 'diorama', name: 'tiers', levels: [
      { ...b('National Commission: claims above ₹10 crore', 'राष्ट्रीय आयोग: ₹10 करोड़ से अधिक के दावे'), color: C.gold, items: [b('Hears appeals from State Commissions', 'राज्य आयोगों की अपील सुनता है')] },
      { ...b('State Commission: ₹1 crore to ₹10 crore', 'राज्य आयोग: ₹1 करोड़ से ₹10 करोड़'), color: C.teal, items: [b('Hears appeals from District Commissions', 'ज़िला आयोगों की अपील सुनता है'), b('One in each state', 'हर राज्य में एक')] },
      { ...b('District Commission: claims up to ₹1 crore', 'ज़िला आयोग: ₹1 करोड़ तक के दावे'), color: C.coral, items: [b('First place to file a case', 'मामला दर्ज करने का पहला स्थान'), b('Consumer can argue in person', 'उपभोक्ता स्वयं पक्ष रख सकता है'), b('Simple procedure', 'सरल प्रक्रिया')] },
    ] }],
    ideas: [
      idea('Why rules are needed', 'नियम क्यों ज़रूरी', 'Individual consumers are weak against large producers: unfair weights, adulteration, false information and hidden charges are common.', 'बड़े उत्पादकों के सामने अकेला उपभोक्ता कमज़ोर है: ग़लत तौल, मिलावट, झूठी जानकारी और छिपे शुल्क आम हैं।'),
      idea('Consumer Protection Act', 'उपभोक्ता संरक्षण अधिनियम', 'COPRA was enacted in 1986 and replaced by the Consumer Protection Act, 2019, which also covers online purchases.', 'कोपरा 1986 में बना और उपभोक्ता संरक्षण अधिनियम 2019 ने इसका स्थान लिया, जो ऑनलाइन ख़रीद को भी शामिल करता है।'),
      idea('Rights of a consumer', 'उपभोक्ता के अधिकार', 'The rights to safety, to be informed, to choose, to seek redressal, to represent and to consumer education.', 'सुरक्षा का अधिकार, सूचना का अधिकार, चुनाव का अधिकार, क्षतिपूर्ति निवारण का अधिकार, प्रतिनिधित्व का अधिकार और उपभोक्ता शिक्षा का अधिकार।'),
      idea('Marks of quality', 'गुणवत्ता के चिह्न', 'ISI for industrial products, Agmark for agricultural products and Hallmark for jewellery help consumers get assured quality.', 'औद्योगिक उत्पादों के लिए ISI, कृषि उत्पादों के लिए एगमार्क और आभूषणों के लिए हॉलमार्क उपभोक्ता को गुणवत्ता का भरोसा देते हैं।'),
    ],
    explore: [
      { t: b('Journey of a consumer complaint', 'उपभोक्ता शिकायत की यात्रा'), kind: 'steps', steps: [
        step('Buy with a bill', 'बिल के साथ ख़रीदें', 'Keep the cash memo and warranty card: they are your proof of purchase.', 'कैश मेमो और वारंटी कार्ड सँभालें: ये आपकी ख़रीद के प्रमाण हैं।'),
        step('Complain to the seller', 'विक्रेता से शिकायत', 'Ask the shop or the company to repair, replace or refund.', 'दुकान या कंपनी से मरम्मत, बदली या धन-वापसी माँगें।'),
        step('Seek help', 'सहायता लें', 'Consumer forums and consumer protection councils guide consumers on how to file cases.', 'उपभोक्ता मंच और उपभोक्ता संरक्षण परिषदें मामला दर्ज करने में मार्गदर्शन करती हैं।'),
        step('File in the District Commission', 'ज़िला आयोग में मामला', 'You can file with or without a lawyer.', 'आप वकील के साथ या बिना मामला दर्ज कर सकते हैं।'),
        step('Appeal if needed', 'ज़रूरत हो तो अपील', 'If dissatisfied, appeal to the State Commission and then to the National Commission.', 'असंतुष्ट हों तो राज्य आयोग और फिर राष्ट्रीय आयोग में अपील करें।'),
      ] },
      { t: b('Rights of a consumer', 'उपभोक्ता के अधिकार'), kind: 'tree', root: node('Consumer rights', 'उपभोक्ता अधिकार', [
        node('Right to safety', 'सुरक्षा का अधिकार', null, 'Protection against goods and services that are hazardous to life and property.', 'जीवन और संपत्ति के लिए ख़तरनाक वस्तुओं और सेवाओं से सुरक्षा।'),
        node('Right to be informed', 'सूचना का अधिकार', null, 'Details such as ingredients, price, batch number, date of manufacture and expiry date must be given.', 'घटक, मूल्य, बैच संख्या, निर्माण तिथि और समाप्ति तिथि जैसी जानकारी देना अनिवार्य है।'),
        node('Right to choose', 'चुनाव का अधिकार', null, 'A consumer cannot be forced to buy one thing along with another.', 'उपभोक्ता को एक वस्तु के साथ दूसरी ख़रीदने को बाध्य नहीं किया जा सकता।'),
        node('Right to seek redressal', 'क्षतिपूर्ति निवारण का अधिकार', null, 'Compensation depending on the degree of damage.', 'हानि की मात्रा के अनुसार क्षतिपूर्ति।'),
        node('Right to represent', 'प्रतिनिधित्व का अधिकार', null, 'Consumers can be heard in the consumer commissions.', 'उपभोक्ता आयोगों में उपभोक्ता की बात सुनी जाती है।'),
        node('Right to consumer education', 'उपभोक्ता शिक्षा का अधिकार', null, 'To acquire the knowledge and skill to be an informed consumer.', 'जागरूक उपभोक्ता बनने के लिए ज्ञान और कौशल पाना।'),
      ]) },
    ],
    quiz: [
      q('COPRA was enacted in', 'कोपरा कब बना?', [['1976', '1976'], ['1986', '1986'], ['1996', '1996'], ['2005', '2005']], 1, 'The Consumer Protection Act, 2019 has since replaced it.', 'अब उपभोक्ता संरक्षण अधिनियम 2019 ने इसका स्थान ले लिया है।'),
      q('National Consumers’ Day is observed in India on', 'भारत में राष्ट्रीय उपभोक्ता दिवस कब मनाया जाता है?', [['15 March', '15 मार्च'], ['24 December', '24 दिसंबर'], ['26 January', '26 जनवरी'], ['5 June', '5 जून']], 1, 'The Consumer Protection Act was passed by Parliament on this day in 1986.', '1986 में इसी दिन संसद ने उपभोक्ता संरक्षण अधिनियम पारित किया।'),
      q('Which mark certifies the purity of gold jewellery?', 'सोने के आभूषणों की शुद्धता कौन-सा चिह्न प्रमाणित करता है?', [['ISI', 'ISI'], ['Agmark', 'एगमार्क'], ['Hallmark', 'हॉलमार्क'], ['ISO', 'ISO']], 2, 'Agmark is for agricultural products and ISI for industrial products.', 'एगमार्क कृषि उत्पादों और ISI औद्योगिक उत्पादों के लिए है।'),
      q('Which law lets citizens get information about the functioning of government departments?', 'कौन-सा क़ानून नागरिकों को सरकारी विभागों के कामकाज की जानकारी पाने देता है?', [['Right to Education Act', 'शिक्षा का अधिकार अधिनियम'], ['Right to Information Act, 2005', 'सूचना का अधिकार अधिनियम, 2005'], ['Factories Act', 'कारख़ाना अधिनियम'], ['MGNREGA', 'मनरेगा']], 1, 'It was enacted in October 2005.', 'यह अक्टूबर 2005 में बना।'),
    ],
    note: b('Claim limits are those given in the NCERT chapter for the Consumer Protection Act, 2019. Limits have since been revised by rules: check the current values before filing a real complaint.', 'दावा सीमाएँ उपभोक्ता संरक्षण अधिनियम 2019 के लिए NCERT अध्याय में दी गई हैं। बाद में नियमों से सीमाएँ बदली हैं: वास्तविक शिकायत से पहले वर्तमान मान देखें।'),
  },
];
