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
  agentIdParamSchema,
  createAgentBodySchema,
  updateAgentBodySchema,
  type CreateAgentBody,
  type UpdateAgentBody,
} from '@edb-workbench/api/models';
import type { AgentService, RequestContext } from './agent.service';

export async function registerAgentRoutes(
  app: FastifyInstance,
  svc: AgentService,
): Promise<void> {
  app.get(
    '/agents',
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
    '/agents/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: agentIdParamSchema,
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
    '/agents',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateAgentBody
        >({
          bodySchema: createAgentBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as CreateAgentBody);
    }),
  );

  app.patch(
    '/agents/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<Record<string, never>, { id: string }, UpdateAgentBody>(
          {
            paramsSchema: agentIdParamSchema,
            bodySchema: updateAgentBodySchema,
          },
        ),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as UpdateAgentBody);
    }),
  );

  app.delete(
    '/agents/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: agentIdParamSchema,
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

export { AgentService } from './agent.service';
