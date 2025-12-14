import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it } from 'vitest';

import { registerDemoItemsRoutes } from './controller';

// we import repo internals so we can reset in-memory state between tests
import * as repo from './repo';

// tiny helper: boot a fresh Fastify with just this feature registered
async function makeApp() {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
  await registerDemoItemsRoutes(app);
  return app;
}

describe('demo-items feature (e2e-ish)', () => {
  beforeEach(() => {
    // wipe in-memory store before every test
    if (typeof repo.__clearAllDemoItemsForTests === 'function') {
      repo.__clearAllDemoItemsForTests();
    }
  });

  // ─────────────────────────────────────────────
  // basic CRUD
  // ─────────────────────────────────────────────

  it('POST /demo-items creates an item', async () => {
    const app = await makeApp();

    const res = await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: {
        title: 'First thing',
      },
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      item: {
        id: string;
        title: string;
        status: string;
        ownerId: string;
        createdAt: string;
        updatedAt: string;
      };
    };

    expect(body.item.title).toBe('First thing');
    expect(body.item.status).toBe('active');
    expect(body.item.id).toMatch(/^[0-9a-fA-F-]{10,}$/); // loose UUID-ish
    expect(body.item.ownerId).toBeTruthy(); // "demo-user" in demo mode
  });

  it('GET /demo-items lists with pagination defaults', async () => {
    const app = await makeApp();

    // create a couple
    await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'Item A' },
    });
    await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'Item B' },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/demo-items',
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      items: Array<{ title: string }>;
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
      nextPage: number | null;
    };

    // should list both
    const titles = body.items.map((i) => i.title).sort();
    expect(titles).toEqual(['Item A', 'Item B']);

    expect(body.page).toBe(1);
    expect(body.pageSize).toBeGreaterThan(0);
    expect(body.total).toBe(2);
    expect(body.hasMore).toBe(false);
  });

  it('GET /demo-items/:id returns one item, 404 after delete', async () => {
    const app = await makeApp();

    // create one
    const createRes = await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'To be read' },
    });

    const { item } = createRes.json() as {
      item: { id: string; title: string };
    };

    // can read it
    const getRes = await app.inject({
      method: 'GET',
      url: `/demo-items/${item.id}`,
    });
    expect(getRes.statusCode).toBe(200);
    expect(getRes.json().item.title).toBe('To be read');

    // delete it
    const delRes = await app.inject({
      method: 'DELETE',
      url: `/demo-items/${item.id}`,
    });
    expect(delRes.statusCode).toBe(200);
    expect(delRes.json()).toEqual({ success: true });

    // now should 404
    const gone = await app.inject({
      method: 'GET',
      url: `/demo-items/${item.id}`,
    });
    expect(gone.statusCode).toBe(404);
  });

  it('PATCH /demo-items/:id updates fields', async () => {
    const app = await makeApp();

    // create first
    const createRes = await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'Draft' },
    });

    const createdBody = createRes.json() as {
      item: { id: string; status: string; title: string };
    };
    const itemId = createdBody.item.id;

    // now patch it
    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/demo-items/${itemId}`,
      payload: {
        title: 'Published',
        status: 'archived',
      },
    });

    expect(patchRes.statusCode).toBe(200);

    const patchedBody = patchRes.json() as {
      item: { id: string; status: string; title: string };
    };

    expect(patchedBody.item.id).toBe(itemId);
    expect(patchedBody.item.title).toBe('Published');
    expect(patchedBody.item.status).toBe('archived');
  });

  it('DELETE /demo-items/:id removes item and GET 404s', async () => {
    const app = await makeApp();

    // create one
    const createRes = await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'To be deleted' },
    });

    const { item } = createRes.json() as { item: { id: string } };

    // delete it
    const delRes = await app.inject({
      method: 'DELETE',
      url: `/demo-items/${item.id}`,
    });

    expect(delRes.statusCode).toBe(200);
    expect(delRes.json()).toEqual({ success: true });

    // try to fetch again -> should 404
    const getRes = await app.inject({
      method: 'GET',
      url: `/demo-items/${item.id}`,
    });

    expect(getRes.statusCode).toBe(404);
  });

  // ─────────────────────────────────────────────
  // Extended behavior / platform guarantees
  // ─────────────────────────────────────────────

  it('supports explicit pagination (page / pageSize / hasMore / nextPage)', async () => {
    const app = await makeApp();

    // create 25 demo-items so we can paginate
    for (let i = 0; i < 25; i++) {
      await app.inject({
        method: 'POST',
        url: '/demo-items',
        payload: {
          title: `Item ${i.toString().padStart(2, '0')}`,
        },
      });
    }

    // page 1, size 10
    const page1 = await app.inject({
      method: 'GET',
      url: '/demo-items?page=1&pageSize=10',
    });
    expect(page1.statusCode).toBe(200);

    const json1 = page1.json() as {
      items: Array<{ title: string }>;
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
      nextPage: number | null;
    };

    expect(json1.items.length).toBe(10);
    expect(json1.page).toBe(1);
    expect(json1.pageSize).toBe(10);
    expect(json1.total).toBe(25);
    expect(json1.hasMore).toBe(true);
    expect(json1.nextPage).toBe(2);

    // page 3, size 10 (should only have 5 left)
    const page3 = await app.inject({
      method: 'GET',
      url: '/demo-items?page=3&pageSize=10',
    });
    expect(page3.statusCode).toBe(200);

    const json3 = page3.json() as {
      items: Array<{ title: string }>;
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
      nextPage: number | null;
    };

    expect(json3.items.length).toBe(5);
    expect(json3.page).toBe(3);
    expect(json3.pageSize).toBe(10);
    expect(json3.total).toBe(25);
    expect(json3.hasMore).toBe(false);
    expect(json3.nextPage).toBe(null);
  });

  it('supports free-text search (?search=term) against title', async () => {
    const app = await makeApp();

    // create two with different titles
    await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'Red Apple' },
    });
    await app.inject({
      method: 'POST',
      url: '/demo-items',
      payload: { title: 'Green Banana' },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/demo-items?search=apple',
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      items: Array<{ title: string }>;
      total: number;
    };

    // only "Red Apple" should show up
    expect(body.items.length).toBe(1);
    expect(body.items[0].title).toBe('Red Apple');
    expect(body.total).toBe(1);
  });

  it('supports filtering via ?filter=key=value', async () => {
    const app = await makeApp();

    // we'll use the "status" field for filtering
    // create multiple records with different status values
    const base = [
      { title: 'One', status: 'active' },
      { title: 'Two', status: 'archived' },
      { title: 'Three', status: 'active' },
    ];

    for (const row of base) {
      await app.inject({
        method: 'POST',
        url: '/demo-items',
        payload: { title: row.title },
      });
      // We PATCH to set status because POST always sets status='active'
      await app.inject({
        method: 'PATCH',
        url: `/demo-items/${repo.__getAllDemoItemsForTests?.().slice(-1)[0].id}`,
        payload: { status: row.status },
      });
    }

    // filter for status=archived
    const res = await app.inject({
      method: 'GET',
      url: '/demo-items?filter=status=archived',
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      items: Array<{ title: string; status: string }>;
    };

    // every returned item should have status=archived
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((it) => it.status === 'archived')).toBe(true);
  });

  it('supports sorting (?sort=field:asc or field:desc)', async () => {
    const app = await makeApp();

    // create items with controlled titles so ordering is obvious
    const titles = ['Zulu', 'Alpha', 'Bravo'];
    for (const t of titles) {
      await app.inject({
        method: 'POST',
        url: '/demo-items',
        payload: { title: t },
      });
    }

    // ASC sort by title
    const ascRes = await app.inject({
      method: 'GET',
      url: '/demo-items?sort=title:asc',
    });
    expect(ascRes.statusCode).toBe(200);

    const ascJson = ascRes.json() as {
      items: Array<{ title: string }>;
    };

    const ascTitles = ascJson.items.map((i) => i.title);
    // should be alphabetical
    // NOTE: default JS string compare. Expected: ['Alpha','Bravo','Zulu']
    expect(ascTitles).toEqual(['Alpha', 'Bravo', 'Zulu']);

    // DESC sort by title
    const descRes = await app.inject({
      method: 'GET',
      url: '/demo-items?sort=title:desc',
    });
    expect(descRes.statusCode).toBe(200);

    const descJson = descRes.json() as {
      items: Array<{ title: string }>;
    };

    const descTitles = descJson.items.map((i) => i.title);
    // reverse alpha
    expect(descTitles).toEqual(['Zulu', 'Bravo', 'Alpha']);
  });
});
