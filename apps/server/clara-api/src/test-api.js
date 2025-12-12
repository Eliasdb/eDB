// Plain Node.js E2E API test (no tsx)
// Run: API_BASE=http://localhost:9101 node apps/server/clara-api/scripts/test-api.js

const assert = require('node:assert/strict');

const API_BASE = process.env.API_BASE || 'http://localhost:9101';

// Stable IDs so rerunning is idempotent.
const co = 'co_testapi';
const ct1 = 'ct_test_alex';
const ct2 = 'ct_test_lina';
const ta1 = 'ta_test_follow';
const ta2 = 'ta_test_prep';
const ac1 = 'ac_test_intro';
const ac2 = 'ac_test_call';
const ac3 = 'ac_test_note';

async function req(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const isJSON = (res.headers.get('content-type') || '').includes(
    'application/json',
  );
  const data = isJSON && text ? JSON.parse(text) : text;
  if (!res.ok) {
    const msg = `${method} ${path} -> ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function maybeDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
  // 204/200/404 are fine for idempotent cleanup
  if (res.ok || res.status === 204 || res.status === 404) return;
  throw new Error(`DELETE ${path} -> ${res.status}`);
}

function hasKeys(obj, keys) {
  for (const k of keys) assert.ok(k in obj, `missing key ${k}`);
}
function deepContains(obj, subset) {
  for (const [k, v] of Object.entries(subset)) {
    if (v && typeof v === 'object' && !Array.isArray(v))
      deepContains(obj[k], v);
    else assert.equal(obj[k], v, `mismatch at ${k}`);
  }
}

(async () => {
  console.log(`🔎 Testing API at ${API_BASE}`);

  // Cleanup previous run
  await Promise.allSettled([
    maybeDelete(`/companies/${co}`),
    maybeDelete(`/contacts/${ct1}`),
    maybeDelete(`/contacts/${ct2}`),
    maybeDelete(`/tasks/${ta1}`),
    maybeDelete(`/tasks/${ta2}`),
    maybeDelete(`/activities/${ac1}`),
    maybeDelete(`/activities/${ac2}`),
    maybeDelete(`/activities/${ac3}`),
  ]);

  // 1) Create Company (website normalization + new fields)
  console.log('→ POST /companies');
  const createdCo = await req('POST', '/companies', {
    id: co,
    name: 'Test Co',
    website: 'test.co', // should normalize to https://
    stage: 'prospect',
    industry: 'SaaS',
    description: 'Seeded via test script',
    hq: { city: 'Ghent', country: 'Belgium' },
    employees: 42,
    employeesRange: '11-50',
    ownerContactId: null,
    primaryEmail: 'info@test.co',
    phone: '+32 9 000 00 00',
  });
  hasKeys(createdCo, [
    'id',
    'name',
    'website',
    'stage',
    'hq',
    'employeesRange',
  ]);
  assert.equal(createdCo.id, co);
  assert.equal(createdCo.website, 'https://test.co');

  // 2) GET /companies/:id
  console.log('→ GET /companies/:id');
  const co1 = await req('GET', `/companies/${co}`);
  hasKeys(co1, [
    'createdAt',
    'updatedAt',
    'hq',
    'employees',
    'employeesRange',
    'primaryEmail',
  ]);
  deepContains(co1, {
    name: 'Test Co',
    stage: 'prospect',
    hq: { city: 'Ghent', country: 'Belgium' },
  });

  // 3) PATCH merge hq
  console.log('→ PATCH /companies/:id (merge hq)');
  await req('PATCH', `/companies/${co}`, {
    hq: { line1: 'Main 12', city: 'Gent' },
  });
  const co2 = await req('GET', `/companies/${co}`);
  deepContains(co2, {
    hq: { city: 'Gent', country: 'Belgium', line1: 'Main 12' },
  });

  // 4) PATCH clear hq
  console.log('→ PATCH /companies/:id (clear hq)');
  await req('PATCH', `/companies/${co}`, { hq: null });
  const co3 = await req('GET', `/companies/${co}`);
  assert.equal(co3.hq, null);

  // 5) PATCH re-add hq fully
  console.log('→ PATCH /companies/:id (re-add hq)');
  await req('PATCH', `/companies/${co}`, {
    hq: { city: 'Ghent', country: 'Belgium', line1: 'Main 12' },
  });
  const co4 = await req('GET', `/companies/${co}`);
  deepContains(co4, {
    hq: { city: 'Ghent', country: 'Belgium', line1: 'Main 12' },
  });

  // 6) Create contacts
  console.log('→ POST /contacts (2x)');
  await req('POST', '/contacts', {
    id: ct1,
    name: 'Alex Janssens',
    email: 'alex@test.co',
    phone: '+32 470 12 34 56',
    companyId: co,
  });
  await req('POST', '/contacts', {
    id: ct2,
    name: 'Lina De Smet',
    email: 'lina@test.co',
    phone: '+32 476 22 44 11',
    companyId: co,
  });

  // 7) Create tasks
  console.log('→ POST /tasks (2x)');
  await req('POST', '/tasks', {
    id: ta1,
    title: 'Follow up after intro call',
    done: false,
    due: '2025-11-15',
    companyId: co,
    contactId: ct1,
  });
  await req('POST', '/tasks', {
    id: ta2,
    title: 'Prepare pricing options',
    done: false,
    due: '2025-11-05',
    companyId: co,
    contactId: ct2,
  });

  // 8) Create activities (ISO with offset)
  console.log('→ POST /activities (3x)');
  await req('POST', '/activities', {
    id: ac1,
    type: 'email',
    summary: 'Intro email sent',
    contactId: ct1,
    companyId: co,
    at: '2025-10-09T10:00:00+02:00',
  });
  await req('POST', '/activities', {
    id: ac2,
    type: 'call',
    summary: 'Discovery call',
    contactId: ct2,
    companyId: co,
    at: '2025-10-10T15:30:00+02:00',
  });
  await req('POST', '/activities', {
    id: ac3,
    type: 'note',
    summary: 'They need SSO',
    contactId: null,
    companyId: co,
    at: new Date().toISOString(),
  });

  // 9) Overview
  console.log('→ GET /companies/:id/overview');
  const ov = await req('GET', `/companies/${co}/overview`);
  hasKeys(ov, ['company', 'contacts', 'activities', 'tasks', 'stats']);
  assert.equal(ov.company.id, co);
  assert.equal(ov.contacts.length, 2);
  assert.equal(ov.tasks.length, 2);
  assert.equal(ov.activities.length, 3);
  hasKeys(ov.stats, ['lastActivityAt', 'nextTaskDue', 'openTasks']);
  assert.equal(ov.stats.openTasks, 2);
  assert.equal(ov.stats.nextTaskDue, '2025-11-05'); // earliest due

  // 10) Complete one task -> stats update
  console.log('→ PATCH /tasks/:id (done=true)');
  await req('PATCH', `/tasks/${ta2}`, { done: true });
  const ov2 = await req('GET', `/companies/${co}/overview`);
  assert.equal(ov2.stats.openTasks, 1);
  assert.equal(ov2.stats.nextTaskDue, '2025-11-15');

  // 11) Lists contain items
  console.log('→ GET /companies, /contacts, /tasks, /activities');
  const [lc, lct, lt, la] = await Promise.all([
    req('GET', '/companies'),
    req('GET', '/contacts'),
    req('GET', '/tasks'),
    req('GET', '/activities'),
  ]);
  assert.ok(
    lc.some((x) => x.id === co),
    'company missing from list',
  );
  assert.ok(
    lct.some((x) => x.id === ct1 || x.id === ct2),
    'contacts missing from list',
  );
  assert.ok(
    lt.some((x) => x.id === ta1 || x.id === ta2),
    'tasks missing from list',
  );
  assert.ok(
    la.some((x) => x.id === ac1 || x.id === ac2 || x.id === ac3),
    'activities missing from list',
  );

  console.log('\n✅ All endpoint checks passed!\n');

  // Optional teardown (uncomment if you want to clean up)
  // await Promise.allSettled([
  //   maybeDelete(`/companies/${co}`),
  //   maybeDelete(`/contacts/${ct1}`),
  //   maybeDelete(`/contacts/${ct2}`),
  //   maybeDelete(`/tasks/${ta1}`),
  //   maybeDelete(`/tasks/${ta2}`),
  //   maybeDelete(`/activities/${ac1}`),
  //   maybeDelete(`/activities/${ac2}`),
  //   maybeDelete(`/activities/${ac3}`),
  // ]);
})().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
