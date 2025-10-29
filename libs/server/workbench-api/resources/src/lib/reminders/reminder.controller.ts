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

import {
  __singular__IdParamSchema,
  create__Cap__BodySchema,
  update__Cap__BodySchema,
  type Create__Cap__Body,
  type Update__Cap__Body,
} from '@edb-workbench/api/models';

import type { __Cap__Service, RequestContext } from './__singular__.service';

// Registers: GET /__routeBase__, GET/POST/PATCH/DELETE /__routeBase__/:id
export async function register__Cap__Routes(
  app: FastifyInstance,
  svc: __Cap__Service,
): Promise<void> {
  // list
  app.get(
    '/__routeBase__',
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

  // get one
  app.get(
    '/__routeBase__/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: __singular__IdParamSchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.getOne(ctx, id);
    }),
  );

  // create
  app.post(
    '/__routeBase__',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          Create__Cap__Body
        >({
          bodySchema: create__Cap__BodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as Create__Cap__Body);
    }),
  );

  // update
  app.patch(
    '/__routeBase__/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Update__Cap__Body
        >({
          paramsSchema: __singular__IdParamSchema,
          bodySchema: update__Cap__BodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as Update__Cap__Body);
    }),
  );

  // delete
  app.delete(
    '/__routeBase__/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: __singular__IdParamSchema,
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

// re-export for convenience
export { __Cap__Service } from './__singular__.service';
