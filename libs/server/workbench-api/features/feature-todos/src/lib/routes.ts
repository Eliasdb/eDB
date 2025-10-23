import { Todos } from '@edb-workbench/api/contracts';
import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createTodosController } from './controller';
import { createInMemoryTodosRepo } from './repo';
import { createTodosService } from './service';

export async function registerTodosRoutes(app: FastifyInstance) {
  // repo + service + controller
  const repo = createInMemoryTodosRepo();
  const svc = createTodosService(repo);
  const ctrl = createTodosController(svc);

  // register JSON Schemas (give $id for $ref)
  const schemas = [
    { id: 'Todo', schema: zodToJsonSchema(Todos.Todo, 'Todo') },
    {
      id: 'CreateTodoInput',
      schema: zodToJsonSchema(Todos.CreateTodoInput, 'CreateTodoInput'),
    },
    {
      id: 'UpdateTodoInput',
      schema: zodToJsonSchema(Todos.UpdateTodoInput, 'UpdateTodoInput'),
    },
    {
      id: 'GetTodoParams',
      schema: zodToJsonSchema(Todos.GetTodoParams, 'GetTodoParams'),
    },
    {
      id: 'ListTodosQuery',
      schema: zodToJsonSchema(Todos.ListTodosQuery, 'ListTodosQuery'),
    },
  ];
  for (const { id, schema } of schemas) {
    app.addSchema({ $id: id, ...schema });
  }

  // routes
  app.get(
    '/api/todos',
    {
      schema: {
        querystring: { $ref: 'ListTodosQuery#' },
        response: { 200: { type: 'array', items: { $ref: 'Todo#' } } },
      },
    },
    ctrl.list,
  );

  app.get(
    '/api/todos/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        response: {
          200: { $ref: 'Todo#' },
          404: { type: 'object', properties: { message: { type: 'string' } } },
        },
      },
    },
    ctrl.get,
  );

  app.post(
    '/api/todos',
    {
      schema: {
        body: { $ref: 'CreateTodoInput#' },
        response: { 201: { $ref: 'Todo#' } },
      },
    },
    ctrl.create,
  );

  app.patch(
    '/api/todos/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        body: { $ref: 'UpdateTodoInput#' },
        response: { 200: { $ref: 'Todo#' } },
      },
    },
    ctrl.update,
  );

  app.delete(
    '/api/todos/:id',
    {
      schema: {
        params: { $ref: 'GetTodoParams#' },
        response: { 204: { type: 'null' } },
      },
    },
    ctrl.delete,
  );
}
