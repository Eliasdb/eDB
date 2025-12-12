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
  supplierIdParamSchema,
  createSupplierBodySchema,
  updateSupplierBodySchema,
  type CreateSupplierBody,
  type UpdateSupplierBody,
} from '@edb-workbench/api/models';
import type { SupplierService, RequestContext } from './supplier.service';

export async function registerSupplierRoutes(
  app: FastifyInstance,
  svc: SupplierService,
): Promise<void> {
  app.get(
    '/suppliers',
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
    '/suppliers/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: supplierIdParamSchema,
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
    '/suppliers',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateSupplierBody
        >({
          bodySchema: createSupplierBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as CreateSupplierBody);
    }),
  );

  app.patch(
    '/suppliers/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          UpdateSupplierBody
        >({
          paramsSchema: supplierIdParamSchema,
          bodySchema: updateSupplierBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as UpdateSupplierBody);
    }),
  );

  app.delete(
    '/suppliers/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: supplierIdParamSchema,
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

export { SupplierService } from './supplier.service';
