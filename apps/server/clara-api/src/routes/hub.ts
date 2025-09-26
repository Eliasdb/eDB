import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../domain/store'; // must expose .list/.get/.add/.update/.remove/.all

// ---- Schemas ---------------------------------------------------------------

const TaskSchema = z.object({
  id: z.string().min(1).optional(), // server will add if missing
  title: z.string().min(1),
  due: z.string().optional(),
  done: z.boolean().optional(),
  source: z.string().optional(),
});

const ContactSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  source: z.string().optional(),
});

const CompanySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  industry: z.string().optional(),
  domain: z.string().optional(),
  logoUrl: z.string().url().optional(),
  source: z.string().optional(),
});

// Type discriminator
const kindSchema = z.enum(['tasks', 'contacts', 'companies']);
type Kind = z.infer<typeof kindSchema>;

// Small id helper (no extra deps)
const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

// Per-kind schema helpers
const bodySchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskSchema,
  contacts: ContactSchema,
  companies: CompanySchema,
};

// Patch schemas (all optional)
const patchSchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskSchema.partial(),
  contacts: ContactSchema.partial(),
  companies: CompanySchema.partial(),
};

// ---- Route -----------------------------------------------------------------

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
