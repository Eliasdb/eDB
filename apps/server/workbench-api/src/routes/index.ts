import { FastifyInstance } from 'fastify';
// Generators/agent will append new imports here:
import { registerTodosRoutes } from '@edb-workbench/api/feature-todos';

export async function registerAllRoutes(app: FastifyInstance) {
  await registerTodosRoutes(app);
}
