import { FastifyInstance } from 'fastify';
// Generators/agent will append new imports here:
import { registerHealthRoutes } from '@edb-workbench/api/feature-health';

export async function registerAllRoutes(app: FastifyInstance) {
  await registerHealthRoutes(app);
}
