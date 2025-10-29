import type { FastifyInstance } from 'fastify';

// Model repo types (base set you already have)
import type {
  AuthorRepo,
  BookRepo,
  BookTagRepo,
  TagRepo,
} from '@edb-workbench/api/models';

// ─────────────────────────────────────────────
// @gen:model-imports (do not remove this line)
// generator appends: import type { FooRepo } from '@edb-workbench/api/models'
// ─────────────────────────────────────────────

// Existing resource imports
import { registerBookRoutes } from './books/book.controller';
import { BookService } from './books/book.service';

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
  // ───────────────────────────────────────────
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

      // ─────────────────────────────────────────
      // @gen:calls (do not remove this line)
      // generator appends: await registerFoosRoutes(app, fooSvc);
      // ─────────────────────────────────────────
    },
  };
}
