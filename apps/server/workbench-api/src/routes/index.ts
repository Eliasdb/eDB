import { FastifyInstance } from 'fastify';
// Generators/agent will append new imports here:
import { registerRemindersRoutes } from '@edb-workbench/api/feature-reminders';
import { registerTodosRoutes } from '@edb-workbench/api/feature-todos';

export async function registerAllRoutes(app: FastifyInstance) {
  await registerRemindersRoutes(app);
  await registerTodosRoutes(app);
}
