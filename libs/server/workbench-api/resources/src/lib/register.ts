import type { FastifyInstance } from 'fastify';

// Model repo types (base set you already have)
import type {
  AuthorRepo,
  BookRepo,
  BookTagRepo,
  GadgetRepo,
  SupplierRepo,
  TagRepo,
} from '@edb-workbench/api/models';
// ─────────────────────────────────────────────
// @gen:model-imports (do not remove this line)
// generator appends: import type { FooRepo } from '@edb-workbench/api/models'
// ─────────────────────────────────────────────

// Existing resource imports

import { registerBookRoutes } from './books/book.controller';
import { BookService } from './books/book.service';
import { registerGadgetRoutes } from './gadgets/gadget.controller';
import { GadgetService } from './gadgets/gadget.service';
import { registerSupplierRoutes } from './suppliers/supplier.controller';
import { SupplierService } from './suppliers/supplier.service';
// ─────────────────────────────────────────────
// @gen:resource-imports (do not remove this line)

// generator appends:
//   import { registerFoosRoutes } from './foos/foo.controller';
//   import { FooService } from './foos/foo.service';
// ─────────────────────────────────────────────

export interface RepoAdapters {
  book: BookRepo;
  author: AuthorRepo;
  tag: TagRepo;
  bookTag: BookTagRepo;

  // ───────────────────────────────────────────
  // @gen:adapters (do not remove this line)
  // generator appends: foo: FooRepo;
  supplier: SupplierRepo;
  gadget: GadgetRepo;
}

export function makeRouteRegistry(adapters: RepoAdapters) {
  // Existing services
  const bookSvc = new BookService(adapters.book);

  // ───────────────────────────────────────────
  // @gen:services (do not remove this line)
  // generator appends: const fooSvc = new FooService(adapters.foo);
  // ───────────────────────────────────────────

  return {
    async registerAll(app: FastifyInstance) {
      await registerBookRoutes(app, bookSvc);

      // Health check
      app.get('/health', async () => ({
        ok: true,
        service: 'workbench-api',
        time: new Date().toISOString(),
      }));

      // ─────────────────────────────────────────
      // @gen:calls (do not remove this line)
      await registerGadgetRoutes(app, new GadgetService(adapters.gadget));

      await registerSupplierRoutes(app, new SupplierService(adapters.supplier));

      // generator appends: await registerFoosRoutes(app, fooSvc);
      // ─────────────────────────────────────────
    },
  };
}
