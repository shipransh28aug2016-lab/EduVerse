// Part 2 Theme 3D Diorama Builders (T09, T11, T13, T14, T15, T16).
export const PART2_BUILDERS = {
  T09(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addHouse, addLabel, addPlinth, pick } = tk;
    const isStreet = S.k !== undefined || S.tax !== undefined;
    if (isStreet) {
      addPlinth(0x334155, 0x1e293b, 15.5, 10);
      const k = S.tax ? 10 : (S.k ?? 4);
      const lit = !!S.tax || k >= 6;
      for (let i = 0; i < 10; i++) {
        const side = i < 5 ? -1 : 1, x = -5.2 + (i % 5) * 2.6;
        const pays = !!S.tax || i < k;
        addHouse(x, -1.88, side * 2.7, pays ? 0xf7dfba : 0x64748b, pays ? 0xc2410c : 0x475569, 0.9, pays);
      }
      group.add(cyl(0.12, 0.15, 4.0, 10, mat(0x475569), 0, 0.1, 0));
      const bulb = sph(0.42, mat(lit ? 0xfacc15 : 0x334155, lit ? { emissive: 0xfde047, emissiveIntensity: 1.0 } : {}), 0, 2.25, 0);
      group.add(bulb);
      if (lit) group.add(tk.cone(3.6, 3.8, 18, new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.18, depthWrite: false }), 0, 0.1, 0));
      pick(bulb, 'Solar Community Streetlight', 'सौर सामुदायिक स्ट्रीटलाइट');
      addLabel(new THREE.Vector3(0, 3.0, 0), lit ? 'Streetlight ON!' : 'Needs More Payers', lit ? 'बत्ती जली!' : 'अधिक योगदान चाहिए');
    } else {
      addPlinth(0xe2c799, 0x7c5338, 15, 10);
      const p = S.price ?? 50, eqP = S.eqP ?? 50;
      const tilt = Math.max(-0.38, Math.min(0.38, (p - eqP) / 65));
      group.add(cyl(0.24, 0.45, 3.4, 14, mat(0xb45309, { metal: 0.55 }), 0, -0.2, 0));
      const beam = box(7.8, 0.22, 0.28, mat(0xd97706, { metal: 0.65 }), 0, 1.5, 0);
      beam.rotation.z = tilt;
      group.add(beam);
      const panL = cyl(1.3, 1.0, 0.25, 16, mat(0xdc2626), -3.4, 0.4 - Math.sin(tilt) * 3.4, 0);
      const panR = cyl(1.3, 1.0, 0.25, 16, mat(0x2563eb), 3.4, 0.4 + Math.sin(tilt) * 3.4, 0);
      group.add(panL, panR);
      pick(panL, 'Buyer Demand Crate', 'खरीदार माँग');
      pick(panR, 'Seller Supply Crate', 'विक्रेता पूर्ति');
      addLabel(new THREE.Vector3(-3.4, 1.2, 0), 'Demand (Buyers)', 'माँग (खरीदार)');
      addLabel(new THREE.Vector3(3.4, 1.2, 0), 'Supply (Sellers)', 'पूर्ति (विक्रेता)');
      addLabel(new THREE.Vector3(0, 2.3, 0), `Price ₹${Math.round(p)}`, `कीमत ₹${Math.round(p)}`);
    }
  },

  // T11: Sal-Forest & Sacred Grove Biosphere Diorama
  T11(tk, S) {
    const { THREE, group, mat, cyl, cone, sph, addTree, addLabel, addPlinth, pick } = tk;
    addPlinth(0x3f8f4e, 0x5c4033, 15.5, 10.5);
    // Sacred Grove stone sanctuary ring
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      group.add(cyl(0.22, 0.28, 0.65, 6, mat(0x94a3b8), Math.cos(a) * 1.9, -1.6, Math.sin(a) * 1.9));
    }
    const forestRatio = Math.max(0.2, Math.min(1, 1 - ((S.harvest ?? 40) / 180)));
    const count = Math.round(forestRatio * 18);
    for (let i = 0; i < count; i++) {
      const ang = i * 2.399;
      const rad = 1.2 + Math.sqrt(i + 1) * 1.25;
      addTree(Math.cos(ang) * rad * 1.2, -1.88, Math.sin(ang) * rad * 0.85, 0.8 + (i % 3) * 0.2, i % 2 ? 0x1b5e20 : 0x2e7d32);
    }
    // Forest stream + firewatch tower
    group.add(tk.box(14.5, 0.18, 1.25, mat(0x0ea5e9), 0, -1.84, 3.0));
    const tower = tk.box(0.85, 3.4, 0.85, mat(0x9a3412), 4.8, -0.2, -2.5);
    group.add(tower, cone(1.0, 0.8, 4, mat(0xca8a04), 4.8, 1.9, -2.5));
    pick(tower, 'Forest Watchtower & Sacred Grove', 'वन निरीक्षण मीनार व देव-कुंज');
    addLabel(new THREE.Vector3(0, 0.3, 0), 'Sacred Sal Grove', 'पवित्र साल देव-वन');
    addLabel(new THREE.Vector3(4.8, 2.5, -2.5), 'Biosphere Watch', 'जैवमंडल सुरक्षा');
  },

  // T13: Indian Ocean Spice & Silk Route 3D Globe
  T13(tk, S) {
    const { THREE, group, mat, sph, addLabel, pick, animated } = tk;
    const globe = sph(3.4, mat(0x0369a1, { rough: 0.4 }), 0, -0.3, 0);
    group.add(globe);
    // India + Eurasia + Africa sculpted slabs
    const india = sph(1.1, mat(0x4d9952), 0.3, 0.65, 3.0);
    india.scale.set(0.7, 0.9, 0.35);
    const africa = sph(1.3, mat(0xd9b36c), -2.4, 0.1, 2.1);
    africa.scale.set(0.6, 1.0, 0.5);
    const seAsia = sph(1.15, mat(0x52a866), 2.5, 0.2, 2.0);
    seAsia.scale.set(0.7, 0.7, 0.5);
    group.add(india, africa, seAsia);
    pick(india, 'Indian Ports (Lothal, Muziris, Tamralipti)', 'भारतीय बंदरगाह');
    // Glowing golden trade arcs
    const curve1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.2, 0.4, 3.35), new THREE.Vector3(-1.3, 0.8, 4.4), new THREE.Vector3(-2.3, 0.3, 2.7));
    const curve2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.6, 0.2, 3.3), new THREE.Vector3(1.8, 0.6, 4.2), new THREE.Vector3(2.6, 0.1, 2.5));
    for (const cv of [curve1, curve2]) {
      group.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 28, 0.08, 8, false), new THREE.MeshBasicMaterial({ color: 0xfbbf24 })));
    }
    const ship = sph(0.22, mat(0xffffff, { emissive: 0xf59e0b, emissiveIntensity: 0.8 }), 0, 0.6, 4.0);
    group.add(ship);
    animated.push({
      fn: (t) => {
        const pt = curve2.getPoint((t * 0.28) % 1);
        ship.position.copy(pt);
      },
    });
    addLabel(new THREE.Vector3(0.3, 1.4, 3.4), 'India Spice Crossroads', 'भारतीय व्यापार संगम');
    addLabel(new THREE.Vector3(-2.4, 1.1, 2.4), 'Red Sea & Africa', 'लाल सागर व अफ़्रीका');
    addLabel(new THREE.Vector3(2.6, 1.0, 2.3), 'Suvarnabhumi (SE Asia)', 'दक्षिण-पूर्व एशिया');
  },

  // T14: Constitutional Hierarchy Steps & Justice Balance Scales
  T14(tk, S) {
    const { THREE, group, mat, box, cyl, addLabel, addPlinth, pick } = tk;
    addPlinth(0xe6d5b8, 0x6b4e3d, 15, 10);
    const active = S.escalated ? 2 : 1;
    for (let i = 0; i < 3; i++) {
      const w = 10 - i * 2.5, step = box(w, 0.85, 6.2 - i * 1.4, mat(i <= active ? 0xd97706 : 0xb8a389), 0, -1.55 + i * 0.85, 0);
      group.add(step);
      pick(step, ['Local Gram Sabha / Ward', 'District / State Court', 'Constitutional Apex'][i], ['ग्राम सभा / वार्ड', 'ज़िला / उच्च न्यायालय', 'संवैधानिक शीर्ष'][i]);
    }
    // Golden scales of justice at summit
    group.add(cyl(0.18, 0.25, 3.0, 12, mat(0xf59e0b, { metal: 0.7 }), 0, 1.8, 0));
    const arm = box(4.6, 0.14, 0.18, mat(0xfbbf24, { metal: 0.7 }), 0, 3.2, 0);
    if (!S.escalated) arm.rotation.z = 0.08;
    group.add(arm, cyl(0.95, 0.85, 0.2, 16, mat(0xfde047, { metal: 0.5 }), -2.1, 2.3, 0), cyl(0.95, 0.85, 0.2, 16, mat(0xfde047, { metal: 0.5 }), 2.1, 2.3, 0));
    addLabel(new THREE.Vector3(0, 3.8, 0), 'Rule of Law & Justice', 'कानून का शासन व न्याय');
    addLabel(new THREE.Vector3(0, -1.2, 3.0), 'Citizens & Local Sabha', 'नागरिक व ग्राम सभा');
  },

  // T15: Solar Craft Startup Stall & Break-Even Profit Towers
  T15(tk, S) {
    const { THREE, group, mat, box, cyl, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdbeafe, 0x475569, 15, 10);
    addHouse(-3.8, -1.88, 0, 0xfef3c7, 0x0284c7, 1.5, true);
    const solar = box(2.4, 0.14, 1.3, mat(0x1d4ed8, { emissive: 0x1e40af, emissiveIntensity: 0.4 }), -3.8, 0.4, 0);
    solar.rotation.x = 0.3;
    group.add(solar);
    const units = S.units ?? 120, price = S.price ?? 40, rev = (units * price) / 2000;
    const cost = ((S.fixed ?? 1500) + units * (S.varCost ?? 25)) / 2000;
    const revCol = box(1.8, Math.max(0.4, Math.min(5, rev)), 1.8, mat(0x16a34a), 1.4, -1.9 + Math.max(0.4, Math.min(5, rev)) / 2, 0);
    const costCol = box(1.8, Math.max(0.4, Math.min(5, cost)), 1.8, mat(0xef4444), 4.0, -1.9 + Math.max(0.4, Math.min(5, cost)) / 2, 0);
    group.add(revCol, costCol);
    pick(revCol, 'Sales Revenue Tower', 'बिक्री आय स्तंभ');
    pick(costCol, 'Total Cost Tower', 'कुल लागत स्तंभ');
    addLabel(new THREE.Vector3(-3.8, 1.3, 0), 'Solar Craft Stall', 'सौर शिल्प स्टॉल');
    addLabel(new THREE.Vector3(1.4, 2.3, 0), 'Revenue', 'आय');
    addLabel(new THREE.Vector3(4.0, 2.3, 0), 'Cost', 'लागत');
  },

  // T16: 3D Budget Coin Jars, Compounding Tree & Civic Town
  T16(tk, S) {
    const { THREE, group, mat, box, cyl, addTree, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0xf1f5f9, 0x64748b, 15.5, 10);
    const inc = S.income ?? 20000;
    const needs = Math.min(1, (S.needs ?? 11000) / Math.max(1, inc));
    const wants = Math.min(1, (S.wants ?? 5000) / Math.max(1, inc));
    const save = Math.max(0.05, 1 - needs - wants);
    const jars = [
      [-4.4, needs, 0x0284c7, 'Needs', 'आवश्यकताएँ'],
      [0, wants, 0xd97706, 'Wants', 'इच्छाएँ'],
      [4.4, save, 0x16a34a, 'Savings', 'बचत'],
    ];
    for (const [x, frac, col, en, hi] of jars) {
      const glass = cyl(1.3, 1.3, 3.4, 20, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.25, depthWrite: false }), x, -0.2, 0);
      const h = Math.max(0.25, frac * 3.2);
      const coins = cyl(1.12, 1.12, h, 20, mat(col, { metal: 0.35 }), x, -1.9 + h / 2, 0);
      group.add(glass, coins);
      pick(coins, en, hi);
      addLabel(new THREE.Vector3(x, 1.9, 0), `${en} ${Math.round(frac * 100)}%`, `${hi} ${Math.round(frac * 100)}%`);
    }
    if (S.years || S.tax) {
      addTree(0, -1.85, -3.2, 1.35, 0xeab308);
      addHouse(4.8, -1.85, -3.0, 0xfef3c7, 0x0284c7, 0.9, true);
    }
  },
};
