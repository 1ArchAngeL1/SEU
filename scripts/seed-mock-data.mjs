// One-shot seeder: creates a project, 3 buildings, and units per building.
// Run: node scripts/seed-mock-data.mjs

const API = process.env.API_URL || 'http://localhost:4000/api';

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = text;
  }
  if (!res.ok) {
    throw new Error(
      `${method} ${path} → ${res.status}: ${
        typeof payload === 'string' ? payload : JSON.stringify(payload)
      }`
    );
  }
  // Backend is inconsistent: projects controller wraps in {success, data},
  // buildings/units controllers return the raw object.
  if (payload && typeof payload === 'object' && payload.success === true && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

const project = {
  name: { ka: 'სეუ ვაკის რეზიდენცია', en: 'SEU Vake Residence' },
  description: {
    ka: 'ექსკლუზიური საცხოვრებელი კომპლექსი ვაკეში — სამი ბლოკი, პანორამული ხედები',
    en: 'Exclusive residential complex in Vake with three blocks, panoramic city views and underground parking',
  },
  location: {
    address: 'Chavchavadze Ave 64, Tbilisi',
    city: 'Tbilisi',
    district: 'Vake',
  },
  status: 'under_construction',
  startDate: '2025-03-01',
  expectedCompletionDate: '2027-06-01',
  totalLandArea: 8500,
  priceRange: {
    currency: 'USD',
    minPrice: 65000,
    maxPrice: 280000,
    minPricePerSqm: 950,
    maxPricePerSqm: 1450,
  },
  isActive: true,
  isFeatured: true,
  displayOrder: 0,
};

const buildings = [
  {
    name: { ka: 'ბლოკი A', en: 'Block A' },
    block: 'A',
    floors: 12,
    basementFloors: 1,
    parkingSpaces: 60,
    totalSize: 9800,
    livableArea: 8200,
    constructionProgress: 78,
    status: 'finishing',
    description: {
      ka: 'საცხოვრებელი ბლოკი A — ძირითადი კორპუსი',
      en: 'Residential Block A — main tower facing the park',
    },
  },
  {
    name: { ka: 'ბლოკი B', en: 'Block B' },
    block: 'B',
    floors: 10,
    basementFloors: 1,
    parkingSpaces: 48,
    totalSize: 8200,
    livableArea: 6900,
    constructionProgress: 55,
    status: 'under_construction',
    description: {
      ka: 'ბლოკი B — სამხრეთ ფასადი, სრული მზის შუქი',
      en: 'Block B — south facade, full sun exposure',
    },
  },
  {
    name: { ka: 'ბლოკი C', en: 'Block C' },
    block: 'C',
    floors: 14,
    basementFloors: 2,
    parkingSpaces: 75,
    totalSize: 11200,
    livableArea: 9400,
    constructionProgress: 30,
    status: 'foundation',
    description: {
      ka: 'ბლოკი C — ყველაზე მაღალი კოშკი, პანორამული ხედებით',
      en: 'Block C — tallest tower, panoramic city views',
    },
  },
];

// Realistic unit templates: floor / position offset → apartment shape
// Mix of 1, 2, 3 bedroom units. Higher floors = pricier per sqm.
function makeUnits(building, projectId, buildingId) {
  const out = [];
  // 4 units per floor, on floors 1..min(floors, 9) — keeps the chess board
  // dense without being overwhelming
  const lastFloor = Math.min(building.floors, 9);
  const layouts = [
    { bedrooms: 1, bathrooms: 1, totalSize: 48, livableArea: 42, balconySize: 5 },
    { bedrooms: 2, bathrooms: 1, totalSize: 72, livableArea: 64, balconySize: 7 },
    { bedrooms: 2, bathrooms: 2, totalSize: 86, livableArea: 76, balconySize: 9 },
    { bedrooms: 3, bathrooms: 2, totalSize: 112, livableArea: 98, balconySize: 12 },
  ];

  for (let floor = 1; floor <= lastFloor; floor++) {
    for (let pos = 0; pos < layouts.length; pos++) {
      const layout = layouts[pos];
      const unitNumber = `${building.block}-${floor.toString().padStart(2, '0')}-${pos + 1}`;
      const floorPremium = 1 + (floor - 1) * 0.012; // ~1.2% per floor
      const sizePremium = layout.totalSize >= 100 ? 1.05 : 1;
      const pricePerSqm = Math.round(1050 * floorPremium * sizePremium);
      const amount = Math.round((pricePerSqm * layout.totalSize) / 100) * 100;

      // Status spread: ~60% available, 20% reserved, 20% sold
      const statusRoll = (floor * 7 + pos * 3) % 10;
      const status =
        statusRoll < 6 ? 'available' : statusRoll < 8 ? 'reserved' : 'sold';

      const furnishing =
        pos === 0 ? 'rough_draft' : pos === 3 ? 'finishing' : 'shell_and_core';

      out.push({
        building: buildingId,
        project: projectId,
        unitNumber,
        block: building.block,
        floor,
        type: 'living',
        status,
        bedrooms: layout.bedrooms,
        bathrooms: layout.bathrooms,
        livingRooms: 1,
        balconies: 1,
        totalSize: layout.totalSize,
        livableArea: layout.livableArea,
        balconySize: layout.balconySize,
        price: {
          currency: 'USD',
          amount,
          pricePerSqm,
        },
        furnishingStatus: furnishing,
        isActive: true,
      });
    }
  }
  return out;
}

async function main() {
  console.log(`▶ Seeding against ${API}\n`);

  console.log('Creating project…');
  const createdProject = await api('POST', '/projects', { data: project });
  console.log(`  ✓ ${createdProject.name.en} → ${createdProject.id}\n`);

  for (const b of buildings) {
    console.log(`Creating Block ${b.block} (${b.floors} floors)…`);
    const created = await api('POST', '/buildings', {
      ...b,
      project: createdProject.id,
    });
    console.log(`  ✓ Block ${created.block} → ${created.id}`);

    const units = makeUnits(b, createdProject.id, created.id);
    let okCount = 0;
    let failCount = 0;
    for (const unit of units) {
      try {
        await api('POST', '/units', unit);
        okCount++;
      } catch (e) {
        failCount++;
        console.log(`    × ${unit.unitNumber}: ${e.message.slice(0, 120)}`);
      }
    }
    console.log(
      `  ✓ Block ${b.block}: ${okCount} units created` +
        (failCount > 0 ? `, ${failCount} failed` : '')
    );
    console.log('');
  }

  console.log('✅ Seed complete. Open /admin to verify.');
}

main().catch((e) => {
  console.error('SEED FAILED:', e);
  process.exit(1);
});
