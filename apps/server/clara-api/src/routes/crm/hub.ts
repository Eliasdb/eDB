import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores/store'; // must expose .list/.get/.add/.update/.remove/.all
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
  uid,
} from '../../domain/types/crm.types';

const route: FastifyPluginAsync = async (app) => {
  // Snapshot: everything
  app.get('/hub', async (_req, reply) => reply.send(store.all()));

  // List per kind
  app.get<{
    Params: { kind: string };
  }>('/hub/:kind', async (req, reply) => {
    const kind = kindSchema.parse(req.params.kind);
    return reply.send(store.list(kind));
  });

  // Get by id
  app.get<{
    Params: { kind: string; id: string };
  }>('/hub/:kind/:id', async (req, reply) => {
    const kind = kindSchema.parse(req.params.kind);
    const id = z.string().min(1).parse(req.params.id);
    const item = store.get(kind, id);
    if (!item) return reply.code(404).send({ message: 'Not found' });
    return reply.send(item);
  });

  // Create
  app.post<{
    Params: { kind: string };
    Body: unknown;
  }>('/hub/:kind', async (req, reply) => {
    const kind = kindSchema.parse(req.params.kind);
    const schema = bodySchemaByKind[kind];
    const parsed = schema.parse(req.body);

    // Assign id if missing
    const withId = parsed.id
      ? parsed
      : { ...parsed, id: uid(kind.slice(0, 2)) };

    store.add(kind, withId);
    return reply.code(201).send(withId);
  });

  // Update (PATCH)
  app.patch<{
    Params: { kind: string; id: string };
    Body: unknown;
  }>('/hub/:kind/:id', async (req, reply) => {
    const kind = kindSchema.parse(req.params.kind);
    const id = z.string().min(1).parse(req.params.id);
    const patchSchema = patchSchemaByKind[kind];
    const patch = patchSchema.parse(req.body);

    const existing = store.get(kind, id);
    if (!existing) return reply.code(404).send({ message: 'Not found' });

    const updated = { ...existing, ...patch, id }; // never change id
    store.update(kind, id, updated);
    return reply.send(updated);
  });

  // Delete
  app.delete<{
    Params: { kind: string; id: string };
  }>('/hub/:kind/:id', async (req, reply) => {
    const kind = kindSchema.parse(req.params.kind);
    const id = z.string().min(1).parse(req.params.id);
    const ok = store.remove(kind, id);
    if (!ok) return reply.code(404).send({ message: 'Not found' });
    return reply.code(204).send();
  });
};

export default route;
