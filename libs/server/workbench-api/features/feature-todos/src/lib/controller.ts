import type {
  CreateTodoInputT,
  GetTodoParamsT,
  ListTodosQueryT,
  UpdateTodoInputT,
} from '@edb-workbench/api/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TodosService } from './types';

export function createTodosController(svc: TodosService) {
  return {
    list: async (
      req: FastifyRequest<{ Querystring: ListTodosQueryT }>,
      reply: FastifyReply,
    ) => {
      const { limit, offset } = req.query;
      const rows = await svc.list(limit, offset);
      return reply.code(200).send(rows);
    },
    get: async (
      req: FastifyRequest<{ Params: GetTodoParamsT }>,
      reply: FastifyReply,
    ) => {
      try {
        const row = await svc.get(req.params.id);
        return reply.code(200).send(row);
      } catch (e) {
        if ((e as Error).message === 'NOT_FOUND')
          return reply.code(404).send({ message: 'Not found' });
        throw e;
      }
    },
    create: async (
      req: FastifyRequest<{ Body: CreateTodoInputT }>,
      reply: FastifyReply,
    ) => {
      const row = await svc.create(req.body);
      return reply.code(201).send(row);
    },
    update: async (
      req: FastifyRequest<{ Params: GetTodoParamsT; Body: UpdateTodoInputT }>,
      reply: FastifyReply,
    ) => {
      try {
        const row = await svc.update(req.params.id, req.body);
        return reply.code(200).send(row);
      } catch (e) {
        if ((e as Error).message === 'NOT_FOUND')
          return reply.code(404).send({ message: 'Not found' });
        throw e;
      }
    },
    delete: async (
      req: FastifyRequest<{ Params: GetTodoParamsT }>,
      reply: FastifyReply,
    ) => {
      try {
        await svc.delete(req.params.id);
        return reply.code(204).send();
      } catch (e) {
        if ((e as Error).message === 'NOT_FOUND')
          return reply.code(404).send({ message: 'Not found' });
        throw e;
      }
    },
  };
}
