// http/routes/crm.route.ts
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores/store';
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
  uid,
} from '../../domain/types/crm.types';

const route: FastifyPluginAsync = async (app) => {
  // Snapshot everything
  app.get('/hub', async (_req, reply) => reply.send(store.all()));

  // Generic list (optional filter by contactId for activities)
  app.get<{ Params: { kind: string }; Querystring: { contactId?: string } }>(
    '/hub/:kind',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const list = store.list(kind);

      if (kind === 'activities' && req.query.contactId) {
        const contactId = z.string().min(1).parse(req.query.contactId);
        return reply.send(
          (list as any[]).filter((a) => a.contactId === contactId),
        );
      }
      return reply.send(list);
    },
  );

  // Get by id
  app.get<{ Params: { kind: string; id: string } }>(
    '/hub/:kind/:id',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const id = z.string().min(1).parse(req.params.id);
      const item = store.get(kind, id);
      if (!item) return reply.code(404).send({ message: 'Not found' });
      return reply.send(item);
    },
  );

  // Create (assign id if missing)
  app.post<{ Params: { kind: string }; Body: any }>(
    '/hub/:kind',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const schema = bodySchemaByKind[kind];
      const parsed = schema.parse(req.body);
      const withId = parsed.id
        ? parsed
        : { ...parsed, id: uid(kind.slice(0, 2)) };
      store.add(kind, withId);
      return reply.code(201).send(withId);
    },
  );

  // Update (PATCH)
  app.patch<{ Params: { kind: string; id: string }; Body: any }>(
    '/hub/:kind/:id',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const id = z.string().min(1).parse(req.params.id);
      const patchSchema = patchSchemaByKind[kind];
      const patch = patchSchema.parse(req.body);
      const ok = store.update(kind, id, patch);
      if (!ok) return reply.code(404).send({ message: 'Not found' });
      return reply.send(store.get(kind, id));
    },
  );

  // Delete
  app.delete<{ Params: { kind: string; id: string } }>(
    '/hub/:kind/:id',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const id = z.string().min(1).parse(req.params.id);
      const ok = store.remove(kind, id);
      if (!ok) return reply.code(404).send({ message: 'Not found' });
      return reply.code(204).send();
    },
  );

  // Convenience: activities for a contact
  app.get<{ Params: { id: string } }>(
    '/hub/contacts/:id/activities',
    async (req, reply) => {
      const contactId = z.string().min(1).parse(req.params.id);
      const acts = store
        .list('activities')
        .filter((a) => a.contactId === contactId);
      return reply.send(acts);
    },
  );
};

export default route;
