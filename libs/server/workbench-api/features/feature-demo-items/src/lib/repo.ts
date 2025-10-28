import type { PaginationPlan } from '@edb-workbench/api/shared';
import { randomUUID } from 'crypto';
import type { DemoItem, UpdateDemoItemBody } from './contracts';

// in-memory mock db
const demoItems: DemoItem[] = [];

/**
 * list with filtering / search / sort / pagination
 */
export function listDemoItemsRepo(args: {
  plan: PaginationPlan;
  search?: string;
}): { rows: DemoItem[]; total: number } {
  const { plan, search } = args;

  let results = [...demoItems];

  // search (title contains)
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    results = results.filter((item) => item.title.toLowerCase().includes(q));
  }

  // filters: key=value from plan.filters
  Object.entries(plan.filters).forEach(([key, value]) => {
    results = results.filter((item) => {
      const itemVal = (item as Record<string, unknown>)[key];
      return String(itemVal) === value;
    });
  });

  // sorting
  if (plan.sorters.length > 0) {
    results.sort((a, b) => {
      for (const { field, dir } of plan.sorters) {
        const av = (a as Record<string, unknown>)[field];
        const bv = (b as Record<string, unknown>)[field];

        if (av === bv) continue;
        if (av == null) return dir === 'asc' ? -1 : 1;
        if (bv == null) return dir === 'asc' ? 1 : -1;

        if (av < bv) return dir === 'asc' ? -1 : 1;
        if (av > bv) return dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const total = results.length;

  // pagination slice
  const sliced = results.slice(plan.offset, plan.offset + plan.limit);

  return { rows: sliced, total };
}

/**
 * single item
 */
export function getDemoItemByIdRepo(id: string): DemoItem | undefined {
  return demoItems.find((it) => it.id === id);
}

/**
 * create
 */
export function createDemoItemRepo(ownerId: string, title: string): DemoItem {
  const now = new Date().toISOString();
  const record: DemoItem = {
    id: randomUUID(),
    title,
    status: 'active',
    ownerId,
    createdAt: now,
    updatedAt: now,
  };
  demoItems.push(record);
  return record;
}

/**
 * update
 */
export function updateDemoItemRepo(
  id: string,
  patch: UpdateDemoItemBody,
): DemoItem | undefined {
  const idx = demoItems.findIndex((it) => it.id === id);
  if (idx === -1) {
    return undefined;
  }

  const current = demoItems[idx];
  const updated: DemoItem = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  demoItems[idx] = updated;
  return updated;
}

/**
 * delete
 */
export function deleteDemoItemRepo(id: string): boolean {
  const idx = demoItems.findIndex((it) => it.id === id);
  if (idx === -1) {
    return false;
  }
  demoItems.splice(idx, 1);
  return true;
}

// ONLY for tests. Do not call from prod code.
export function __clearAllDemoItemsForTests() {
  // wipe in-memory array in place
  (demoItems as DemoItem[]).length = 0;
}

// handy to let tests peek at current rows
export function __getAllDemoItemsForTests() {
  return demoItems;
}
