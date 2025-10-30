import { makeRouteRegistry } from '@edb-workbench/api/resources';
import type { FastifyInstance } from 'fastify';

// Import ONLY infra here (nowhere else):
import {
  AlbumRepoPg,
  AuthorRepoPg,
  BookRepoPg,
  BookTagRepoPg,
  TagRepoPg,
} from '@edb-workbench/api/infra';

export async function registerAllRoutes(app: FastifyInstance) {
  const registry = makeRouteRegistry({
    book: BookRepoPg,
    author: AuthorRepoPg,
    tag: TagRepoPg,
    bookTag: BookTagRepoPg,
    album: AlbumRepoPg,
  });
  await registry.registerAll(app);
}
