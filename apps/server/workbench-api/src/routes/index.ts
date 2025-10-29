import type { FastifyInstance } from 'fastify';

// Single wire-up: app depends only on the resources→infra adapter.
import { registerAllRoutes as registerWorkbenchApiRoutes } from '@edb-workbench/api/resources-pg';

export async function registerAllRoutes(app: FastifyInstance) {
  await registerWorkbenchApiRoutes(app);
}
