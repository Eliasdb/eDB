import { Reminders } from '@edb-workbench/api/contracts';
import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { createRemindersController } from './controller';
import { createInMemoryRemindersRepo } from './repo';
import { createRemindersService } from './service';

export async function registerRemindersRoutes(app: FastifyInstance) {
  // Wire up layers
  const repo = createInMemoryRemindersRepo();
  const svc = createRemindersService(repo);
  const ctrl = createRemindersController(svc);

  // Register JSON Schemas from Zod
  // We assume your contracts namespace (Reminders) exports:
  //   Todo, CreateTodoInput, UpdateTodoInput, GetTodoParams, ListTodosQuery
  // Adjust if your domain model changes.
  const schemas = [
    { id: 'Todo', schema: zodToJsonSchema(Reminders.Todo, 'Todo') },
    {
      id: 'CreateTodoInput',
      schema: zodToJsonSchema(Reminders.CreateTodoInput, 'CreateTodoInput'),
    },
    {
      id: 'UpdateTodoInput',
      schema: zodToJsonSchema(Reminders.UpdateTodoInput, 'UpdateTodoInput'),
    },
    {
      id: 'GetTodoParams',
      schema: zodToJsonSchema(Reminders.GetTodoParams, 'GetTodoParams'),
    },
    {
      id: 'ListTodosQuery',
      schema: zodToJsonSchema(Reminders.ListTodosQuery, 'ListTodosQuery'),
    },
  ];

  for (const { id, schema } of schemas) {
    app.addSchema({ $id: id, ...schema });
  }

  // Routes
  // GET /api/<domainFileName>
  app.get(
    '/api/reminders',
    {
      schema: {
        querystring: { $ref: 'ListTodosQuery#' },
        response: {
          200: { type: 'array', items: { $ref: 'Todo#' } },
        },
      },
    },
    ctrl.list,
  );

  // GET /api/<domainFileName>/:id
  app.get(
    '/api/reminders/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        response: {
          200: { $ref: 'Todo#' },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    ctrl.get,
  );

  // POST /api/<domainFileName>
  app.post(
    '/api/reminders',
    {
      schema: {
        body: { $ref: 'CreateTodoInput#' },
        response: {
          201: { $ref: 'Todo#' },
        },
      },
    },
    ctrl.create,
  );

  // PATCH /api/<domainFileName>/:id
  app.patch(
    '/api/reminders/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        body: { $ref: 'UpdateTodoInput#' },
        response: {
          200: { $ref: 'Todo#' },
        },
      },
    },
    ctrl.update,
  );

  // DELETE /api/<domainFileName>/:id
  app.delete(
    '/api/reminders/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        response: {
          204: { type: 'null' },
        },
      },
    },
    ctrl.delete,
  );
}
