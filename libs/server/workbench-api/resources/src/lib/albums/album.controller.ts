import {
  albumIdParamSchema,
  createAlbumBodySchema,
  updateAlbumBodySchema,
  type CreateAlbumBody,
  type UpdateAlbumBody,
} from '@edb-workbench/api/models';

import {
  buildPagination,
  ctxFromReq,
  handler,
  listQuerySchema,
  optionalAuth,
  validateRequest,
  type ListQueryInput,
} from '@edb-workbench/api/shared';

import type { FastifyInstance } from 'fastify';
import { applyAlbumIncludes } from './_includes.artist';
import type { AlbumService, RequestContext } from './album.service';
import type { RepoAdapters } from '../register';

export async function registerAlbumRoutes(
  app: FastifyInstance,
  svc: AlbumService,
  adapters?: RepoAdapters,
): Promise<void> {
  app.get(
    '/albums',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          ListQueryInput,
          Record<string, never>,
          Record<string, never>
        >({
          querySchema: listQuerySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const plan = buildPagination(req.query as ListQueryInput);
      return applyAlbumIncludes.list(req, await svc.list(ctx, plan), adapters);
    }),
  );

  app.get(
    '/albums/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: albumIdParamSchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return applyAlbumIncludes.one(req, await svc.getOne(ctx, id), adapters);
    }),
  );

  app.post(
    '/albums',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateAlbumBody
        >({
          bodySchema: createAlbumBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as CreateAlbumBody);
    }),
  );

  app.patch(
    '/albums/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, { id: string }, UpdateAlbumBody>(
          {
            paramsSchema: albumIdParamSchema,
            bodySchema: updateAlbumBodySchema,
          },
        ),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as UpdateAlbumBody);
    }),
  );

  app.delete(
    '/albums/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: albumIdParamSchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.remove(ctx, id);
    }),
  );
}

export { AlbumService } from './album.service';
