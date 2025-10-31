import type { FastifyInstance } from 'fastify';
import {
  buildPagination,
  ctxFromReq,
  handler,
  listQuerySchema,
  optionalAuth,
  validateRequest,
  type ListQueryInput,
} from '@edb-workbench/api/shared';
import {
  artistIdParamSchema,
  createArtistBodySchema,
  updateArtistBodySchema,
  type CreateArtistBody,
  type UpdateArtistBody,
} from '@edb-workbench/api/models';
import type { ArtistService, RequestContext } from './artist.service';

export async function registerArtistRoutes(
  app: FastifyInstance,
  svc: ArtistService,
): Promise<void> {
  app.get(
    '/artists',
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
      return svc.list(ctx, plan);
    }),
  );

  app.get(
    '/artists/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: artistIdParamSchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.getOne(ctx, id);
    }),
  );

  app.post(
    '/artists',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateArtistBody
        >({
          bodySchema: createArtistBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as CreateArtistBody);
    }),
  );

  app.patch(
    '/artists/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          UpdateArtistBody
        >({
          paramsSchema: artistIdParamSchema,
          bodySchema: updateArtistBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as UpdateArtistBody);
    }),
  );

  app.delete(
    '/artists/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: artistIdParamSchema,
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

export { ArtistService } from './artist.service';
