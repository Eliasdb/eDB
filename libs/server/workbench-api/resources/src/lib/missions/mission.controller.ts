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
  missionIdParamSchema,
  createMissionBodySchema,
  updateMissionBodySchema,
  type CreateMissionBody,
  type UpdateMissionBody,
} from '@edb-workbench/api/models';
import type { MissionService, RequestContext } from './mission.service';
import type { RepoAdapters } from '../register';
import { applyMissionIncludes } from './_includes.agent';

export async function registerMissionRoutes(
  app: FastifyInstance,
  svc: MissionService,
  adapters?: RepoAdapters,
): Promise<void> {
  app.get(
    '/missions',
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
      return applyMissionIncludes.list(
        req,
        await svc.list(ctx, plan),
        adapters,
      );
    }),
  );

  app.get(
    '/missions/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: missionIdParamSchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return applyMissionIncludes.one(req, await svc.getOne(ctx, id), adapters);
    }),
  );

  app.post(
    '/missions',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          Record<string, never>,
          CreateMissionBody
        >({
          bodySchema: createMissionBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      return svc.create(ctx, req.body as CreateMissionBody);
    }),
  );

  app.patch(
    '/missions/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          UpdateMissionBody
        >({
          paramsSchema: missionIdParamSchema,
          bodySchema: updateMissionBodySchema,
        }),
      ],
    },
    handler(async (req) => {
      const ctx: RequestContext = ctxFromReq(req);
      const { id } = req.params as { id: string };
      return svc.update(ctx, id, req.body as UpdateMissionBody);
    }),
  );

  app.delete(
    '/missions/:id',
    {
      preHandler: [
        optionalAuth,
        validateRequest<
          Record<string, never>,
          { id: string },
          Record<string, never>
        >({
          paramsSchema: missionIdParamSchema,
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

export { MissionService } from './mission.service';
