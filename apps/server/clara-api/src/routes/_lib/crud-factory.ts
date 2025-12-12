import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores';
import {
  bodySchemaByKind,
  patchSchemaByKind,
  uid,
  type Kind,
} from '../../domain/types/crm.types';

type MakeCrudOpts<K extends Kind> = {
  kind: K;
  base: string; // e.g. '/companies'
};

export function makeCrudRouter<K extends Kind>({
  kind,
  base,
}: MakeCrudOpts<K>): FastifyPluginAsync {
  const idParam = z.string().min(1);

  return async (app) => {
    // list
    app.get(base, async (_req, reply) => {
      const rows = await store.list(kind);
      reply.send(rows);
    });

    // get by id
    app.get<{ Params: { id: string } }>(`${base}/:id`, async (req, reply) => {
      const id = idParam.parse(req.params.id);
      const row = await store.get(kind, id);
      if (!row) return reply.code(404).send({ message: 'Not found' });
      reply.send(row);
    });

    // create
    app.post<{ Body: any }>(base, async (req, reply) => {
      const schema = bodySchemaByKind[kind];
      const parsed = schema.parse(req.body);
      const withId = parsed.id
        ? parsed
        : { ...parsed, id: uid(kind.slice(0, 2)) };
      await store.add(kind, withId);
      reply.code(201).send(withId);
    });

    // patch
    app.patch<{ Params: { id: string }; Body: any }>(
      `${base}/:id`,
      async (req, reply) => {
        const id = idParam.parse(req.params.id);
        const patch = patchSchemaByKind[kind].parse(req.body);
        const ok = await store.update(kind, id, patch);
        if (!ok) return reply.code(404).send({ message: 'Not found' });
        reply.send(await store.get(kind, id));
      },
    );

    // delete
    app.delete<{ Params: { id: string } }>(
      `${base}/:id`,
      async (req, reply) => {
        const id = idParam.parse(req.params.id);
        const ok = await store.remove(kind, id);
        if (!ok) return reply.code(404).send({ message: 'Not found' });
        reply.code(204).send();
      },
    );
  };
}
