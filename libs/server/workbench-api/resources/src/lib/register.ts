import type { FastifyInstance } from 'fastify';

// Model repo types (base set you already have)
import type {
  AgentRepo,
  AlbumRepo,
  ArtistRepo,
  AuthorRepo,
  BookRepo,
  BookTagRepo,
  MissionRepo,
  TagRepo,
} from '@edb-workbench/api/models';

// ─────────────────────────────────────────────
// @gen:model-imports (do not remove this line)
// generator appends: import type { FooRepo } from '@edb-workbench/api/models'
// ─────────────────────────────────────────────

// Existing resource imports
import { registerAgentRoutes } from './agents/agent.controller';
import { AgentService } from './agents/agent.service';
import { registerAlbumRoutes } from './albums/album.controller';
import { AlbumService } from './albums/album.service';
import { registerArtistRoutes } from './artists/artist.controller';
import { ArtistService } from './artists/artist.service';
import { registerBookRoutes } from './books/book.controller';
import { BookService } from './books/book.service';
import { registerMissionRoutes } from './missions/mission.controller';
import { MissionService } from './missions/mission.service';

// ─────────────────────────────────────────────
// @gen:resource-imports (do not remove this line, adapters)

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
  album: AlbumRepo;
  artist: ArtistRepo;
  agent: AgentRepo;
  mission: MissionRepo;
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
      await registerAlbumRoutes(
        app,
        new AlbumService(adapters.album),
        adapters,
      );
      await registerArtistRoutes(app, new ArtistService(adapters.artist));
      await registerAgentRoutes(app, new AgentService(adapters.agent));
      await registerMissionRoutes(app, new MissionService(adapters.mission));
      // await registerMissionRoutes(app, new MissionService(adapters.mission), adapters); // <-- REQUIRED
    },
  };
}
