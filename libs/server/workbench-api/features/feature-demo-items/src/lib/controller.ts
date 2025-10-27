// feature-demo-items/src/lib/controller.ts (or index if you export from there)
import type { FastifyInstance } from 'fastify';

import {
  ctxFromReq,
  handler,
  optionalAuth,
  validateRequest,
} from '@edb-workbench/api/shared';

import {
  createDemoItemBodySchema,
  idParamSchema,
  listDemoItemsQuerySchema,
  updateDemoItemBodySchema,
  type CreateDemoItemBody,
  type DemoItemListResponse,
  type DemoItemSingleResponse,
  type IdParam,
  type ListDemoItemsQuery,
  type UpdateDemoItemBody,
} from './contracts';

import {
  createItem,
  deleteItem,
  getItem,
  listItems,
  updateItem,
  type RequestContext,
} from './service';

export async function registerDemoItemsRoutes(
  app: FastifyInstance,
): Promise<void> {
  // GET /demo-items
  app.get(
    '/demo-items',
    {
      preHandler: [
        optionalAuth, // <- anonymous allowed
        validateRequest<
          ListDemoItemsQuery,
          Record<string, never>,
          Record<string, never>
        >({
          querySchema: listDemoItemsQuerySchema,
        }),
      ],
    },
    handler(async (req): Promise<DemoItemListResponse> => {
      const ctx: RequestContext = ctxFromReq(req);
      return listItems(ctx, req.query as ListDemoItemsQuery);
    }),
  );

  // GET /demo-items/:id
  app.get(
    '/demo-items/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, IdParam, Record<string, never>>({
          paramsSchema: idParamSchema,
        }),
      ],
    },
    handler(async (req): Promise<DemoItemSingleResponse> => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as IdParam;
      return getItem(ctx, id);
    }),
  );

  // POST /demo-items
  app.post(
    '/demo-items',
    {
      preHandler: [
        optionalAuth,
        // later: requireAuth, requireRole('admin')
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateDemoItemBody
        >({
          bodySchema: createDemoItemBodySchema,
        }),
      ],
    },
    handler(async (req): Promise<DemoItemSingleResponse> => {
      const ctx: RequestContext = ctxFromReq(req);
      return createItem(ctx, req.body as CreateDemoItemBody);
    }),
  );

  // PATCH /demo-items/:id
  app.patch(
    '/demo-items/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, IdParam, UpdateDemoItemBody>({
          paramsSchema: idParamSchema,
          bodySchema: updateDemoItemBodySchema,
        }),
      ],
    },
    handler(async (req): Promise<DemoItemSingleResponse> => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as IdParam;
      return updateItem(ctx, id, req.body as UpdateDemoItemBody);
    }),
  );

  // DELETE /demo-items/:id
  app.delete(
    '/demo-items/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, IdParam, Record<string, never>>({
          paramsSchema: idParamSchema,
        }),
      ],
    },
    handler(async (req): Promise<{ success: true }> => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as IdParam;
      return deleteItem(ctx, id);
    }),
  );
}
