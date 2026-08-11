// Apply a fixed display order to the partners.
//
// `sortOrder` is what both the admin "Reorder" sheet and the public marquee
// sort by, so this writes the same field the UI would — it is the drag-and-drop
// done in one shot.
//
//   node scripts/reorder-partners.mjs --dry-run          # show the plan only
//   ADMIN_USERNAME=… ADMIN_PASSWORD=… node scripts/reorder-partners.mjs
//   TOKEN=… node scripts/reorder-partners.mjs            # skip the login call
//
// Partners not named below keep their relative order and are appended after the
// listed ones, so nothing silently jumps to the front.

const API = process.env.API_URL || 'http://localhost:4000/api';
const DRY_RUN = process.argv.includes('--dry-run');

/** The wanted order, by Georgian name. */
const ORDER = [
  'დიზაინ ავენიუ',
  'ლაბორატორია ჩემი სახლი',
  'ეშლი',
  'კასტელო',
  'ბელჰაუსი',
  'მარკო',
  'ემბავუდი',
  'ვუდსონი',
  'ოპარტი',
  'ზოდი',
  'კაფელის სახლი',
  'დორემი',
  'თერმოინდუსტრია',
  'ქებული',
  'ტესუტო',
  'დიო',
  'ანემონე',
  'ლუმოსი',
  '5 პოინტს',
  'ინკა',
];

let token = process.env.TOKEN || '';

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
  if (payload && typeof payload === 'object' && payload.success === true && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

/** Ignore the noise that stops two spellings of the same name from matching. */
function normalize(name) {
  return String(name ?? '')
    .replace(/[‎‏]/g, '')
    .replace(/["'“”„»«]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function login() {
  if (token) return;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'PATCH /partners/:id needs auth. Set ADMIN_USERNAME + ADMIN_PASSWORD, or pass TOKEN=…'
    );
  }
  const res = await api('POST', '/auth/sign-in', { username, password });
  token = res.access_token;
  if (!token) throw new Error('sign-in returned no access_token');
}

/**
 * Pair each wanted name with a partner. Exact normalized match first on the
 * Georgian name then the English one; only if that fails does it fall back to a
 * substring match, and an ambiguous fallback is reported rather than guessed.
 */
function matchPartners(partners) {
  const remaining = [...partners];
  const matched = [];
  const missing = [];

  const take = (index) => remaining.splice(index, 1)[0];

  for (const wanted of ORDER) {
    const target = normalize(wanted);

    let i = remaining.findIndex((p) => normalize(p.nameKa) === target);
    if (i === -1) i = remaining.findIndex((p) => normalize(p.nameEn) === target);

    if (i === -1) {
      const loose = remaining
        .map((p, index) => ({ p, index }))
        .filter(({ p }) => {
          const ka = normalize(p.nameKa);
          const en = normalize(p.nameEn);
          return (
            (ka && (ka.includes(target) || target.includes(ka))) ||
            (en && (en.includes(target) || target.includes(en)))
          );
        });
      if (loose.length === 1) {
        i = loose[0].index;
        console.log(`  ~ "${wanted}" → "${remaining[i].nameKa}" (loose match)`);
      } else if (loose.length > 1) {
        missing.push(
          `${wanted} (ambiguous: ${loose.map(({ p }) => p.nameKa).join(', ')})`
        );
        continue;
      }
    }

    if (i === -1) {
      missing.push(wanted);
      continue;
    }
    matched.push(take(i));
  }

  return { matched, missing, leftover: remaining };
}

async function main() {
  const partners = await api('POST', '/partners/search', {
    pagination: { page: 1, limit: 200 },
    sort: [
      { field: 'sortOrder', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ],
    data: {},
  });

  const list = Array.isArray(partners) ? partners : (partners.items ?? []);
  console.log(`Fetched ${list.length} partners from ${API}\n`);

  const { matched, missing, leftover } = matchPartners(list);

  if (missing.length) {
    console.log('\n!! Not found — these keep their current position:');
    for (const name of missing) console.log(`   - ${name}`);
  }
  if (leftover.length) {
    console.log('\n.. Not in the list — appended after, order preserved:');
    for (const p of leftover) console.log(`   - ${p.nameKa || p.nameEn}`);
  }

  const finalOrder = [...matched, ...leftover];

  console.log('\nNew order:');
  finalOrder.forEach((p, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${p.nameKa || p.nameEn}`);
  });

  if (DRY_RUN) {
    console.log('\n--dry-run: nothing written.');
    return;
  }

  await login();

  // Sequential on purpose: a partial failure then leaves an order that is still
  // readable rather than a scatter of half-applied indexes.
  for (const [index, partner] of finalOrder.entries()) {
    await api('PATCH', `/partners/${partner.id}`, { data: { sortOrder: index } });
    console.log(`  saved ${index} → ${partner.nameKa || partner.nameEn}`);
  }

  console.log(`\nDone — ${finalOrder.length} partners renumbered.`);
}

main().catch((e) => {
  console.error(`\nFailed: ${e.message}`);
  process.exit(1);
});
