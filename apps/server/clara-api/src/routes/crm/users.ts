// apps/server/clara-api/src/routes/users.ts
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { userStore } from '../../domain/stores/user.store';
import { UserPatchSchema, UserSchema } from '../../domain/types/user.types';

// small helper
const IdParam = z.object({ id: z.string().min(1) });

const routes: FastifyPluginAsync = async (app) => {
  // list
  app.get('/users', async (_req, reply) => {
    reply.send(userStore.list());
  });

  // create
  app.post<{ Body: unknown }>('/users', async (req, reply) => {
    const body = UserSchema.parse(req.body);
    const created = userStore.add(body);
    reply.code(201).send(created);
  });

  // read
  app.get<{ Params: { id: string } }>('/users/:id', async (req, reply) => {
    const { id } = IdParam.parse(req.params);
    const user = userStore.get(id);
    if (!user) return reply.code(404).send({ message: 'Not found' });
    reply.send(user);
  });

  // patch
  app.patch<{ Params: { id: string }; Body: unknown }>(
    '/users/:id',
    async (req, reply) => {
      const { id } = IdParam.parse(req.params);
      const patch = UserPatchSchema.parse(req.body);
      const next = userStore.update(id, patch);
      if (!next) return reply.code(404).send({ message: 'Not found' });
      reply.send(next);
    },
  );

  // delete
  app.delete<{ Params: { id: string } }>('/users/:id', async (req, reply) => {
    const { id } = IdParam.parse(req.params);
    const ok = userStore.remove(id);
    if (!ok) return reply.code(404).send({ message: 'Not found' });
    reply.code(204).send();
  });
};

export default routes;
