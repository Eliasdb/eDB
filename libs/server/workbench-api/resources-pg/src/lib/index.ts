import { makeRouteRegistry } from '@edb-workbench/api/resources';
import type { FastifyInstance } from 'fastify';

// Import ONLY infra here (nowhere else):
import {
  AuthorRepoPg,
  BookRepoPg,
  BookTagRepoPg,
  TagRepoPg,
  SupplierRepoPg,
  GadgetRepoPg,
} from '@edb-workbench/api/infra';

export async function registerAllRoutes(app: FastifyInstance) {
  const registry = makeRouteRegistry({
    book: BookRepoPg,
    author: AuthorRepoPg,
    tag: TagRepoPg,
    bookTag: BookTagRepoPg,
    supplier: SupplierRepoPg,
    gadget: GadgetRepoPg,
  });
  await registry.registerAll(app);
}
