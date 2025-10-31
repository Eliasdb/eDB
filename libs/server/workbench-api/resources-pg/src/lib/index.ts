import { makeRouteRegistry } from '@edb-workbench/api/resources';
import type { FastifyInstance } from 'fastify';

// Import ONLY infra here (nowhere else):
import {
  AlbumRepoPg,
  ArtistRepoPg,
  AuthorRepoPg,
  BookRepoPg,
  BookTagRepoPg,
  TagRepoPg,
  AgentRepoPg,
  MissionRepoPg,
} from '@edb-workbench/api/infra';

export async function registerAllRoutes(app: FastifyInstance) {
  const registry = makeRouteRegistry({
    book: BookRepoPg,
    author: AuthorRepoPg,
    tag: TagRepoPg,
    bookTag: BookTagRepoPg,
    album: AlbumRepoPg,
    artist: ArtistRepoPg,
    agent: AgentRepoPg,
    mission: MissionRepoPg,
  });
  await registry.registerAll(app);
}
