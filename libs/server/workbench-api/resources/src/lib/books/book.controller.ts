// libs/server/workbench-api/resources/src/lib/books/book.controller.ts
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
  bookIdParamSchema,
  createBookBodySchema,
  updateBookBodySchema,
  type CreateBookBody,
  type UpdateBookBody,
} from '@edb-workbench/api/models';

import type { BookService, RequestContext } from './book.service';

// No infra here. Wire in the service where you bootstrap the app.
export async function registerBookRoutes(
  app: FastifyInstance,
  svc: BookService,
): Promise<void> {
  // GET /books
  app.get(
    '/books',
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
      const q = req.query as ListQueryInput;
      const plan = buildPagination(q);
      return svc.listBooks(ctx, plan);
    }),
  );

  // GET /books/:id
  app.get(
    '/books/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: {
            parse: (data): { id: string } => {
              const parsed = bookIdParamSchema.parse(data);
              return { id: parsed.id };
            },
          },
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.getBook(ctx, id);
    }),
  );

  // POST /books
  app.post(
    '/books',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateBookBody
        >({
          bodySchema: createBookBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      // Fastify still types body as unknown at handler site; we validated → safe cast:
      return svc.createBook(ctx, req.body as CreateBookBody);
    }),
  );

  // PATCH /books/:id
  app.patch(
    '/books/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, { id: string }, UpdateBookBody>({
          paramsSchema: {
            parse: (data): { id: string } => {
              const parsed = bookIdParamSchema.parse(data);
              return { id: parsed.id };
            },
          },
          bodySchema: updateBookBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.updateBook(ctx, id, req.body as UpdateBookBody);
    }),
  );

  // DELETE /books/:id
  app.delete(
    '/books/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: {
            parse: (data): { id: string } => {
              const parsed = bookIdParamSchema.parse(data);
              return { id: parsed.id };
            },
          },
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.deleteBook(ctx, id);
    }),
  );
}
