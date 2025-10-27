import { FastifyInstance } from 'fastify';

// Generators/agent will append new imports here:
import { registerDemoItemsRoutes } from '@edb-workbench/api/feature-demo-items';

export async function registerAllRoutes(app: FastifyInstance) {
  await registerDemoItemsRoutes(app);
}
