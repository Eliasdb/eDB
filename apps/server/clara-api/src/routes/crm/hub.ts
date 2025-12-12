// http/routes/crm.route.ts
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores';
import { type CompanyOverviewDto } from '../../domain/types/company-overview.dto';
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
  uid,
} from '../../domain/types/crm.types';
import { companyInitials } from '../../domain/utils/company-initials';
import { initialsFromName } from '../../domain/utils/contact-initials';

const route: FastifyPluginAsync = async (app) => {
  // Snapshot everything
  app.get('/hub', async (_req, reply) => {
    const all = await store.all();
    return reply.send(all);
  });

  // Generic list (optional filter by contactId for activities)
  app.get<{ Params: { kind: string }; Querystring: { contactId?: string } }>(
    '/hub/:kind',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const list = await store.list(kind);

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
      const item = await store.get(kind, id);
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
      await store.add(kind, withId);
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
      const ok = await store.update(kind, id, patch);
      if (!ok) return reply.code(404).send({ message: 'Not found' });
      const updated = await store.get(kind, id);
      return reply.send(updated);
    },
  );

  // Delete
  app.delete<{ Params: { kind: string; id: string } }>(
    '/hub/:kind/:id',
    async (req, reply) => {
      const kind = kindSchema.parse(req.params.kind);
      const id = z.string().min(1).parse(req.params.id);
      const ok = await store.remove(kind, id);
      if (!ok) return reply.code(404).send({ message: 'Not found' });
      return reply.code(204).send();
    },
  );

  // Activities for a contact
  app.get<{ Params: { id: string } }>(
    '/hub/contacts/:id/activities',
    async (req, reply) => {
      const contactId = z.string().min(1).parse(req.params.id);
      const acts = (await store.list('activities')).filter(
        (a) => a.contactId === contactId,
      );
      return reply.send(acts);
    },
  );

  // Company Overview
  app.get<{ Params: { id: string } }>(
    '/hub/companies/:id/overview',
    async (req, reply) => {
      const id = z.string().min(1).parse(req.params.id);
      const company = await store.get('companies', id);
      if (!company) return reply.code(404).send({ message: 'Not found' });

      const companyWithInitials = {
        ...company,
        initials: companyInitials(company.name),
      };

      const contacts = (await store.contactsByCompany(id)).map((c) => ({
        ...c,
        initials: initialsFromName(c.name),
      }));

      const activities = (await store.activitiesByCompany(id)).sort((a, b) =>
        a.at < b.at ? 1 : -1,
      );

      const tasks = (await store.tasksByCompany(id)).sort((a, b) =>
        String(a.due ?? '').localeCompare(String(b.due ?? '')),
      );

      const lastActivityAt = activities[0]?.at ?? null;
      const nextTask = tasks.find((t) => !t.done && t.due);
      const openTasks = tasks.filter((t) => !t.done).length;

      const payload: CompanyOverviewDto = {
        company: companyWithInitials,
        contacts,
        activities,
        tasks,
        stats: {
          lastActivityAt,
          nextTaskDue: nextTask?.due ?? null,
          openTasks,
        },
      };

      return reply.send(payload);
    },
  );

  // Contact Overview
  app.get<{ Params: { id: string } }>(
    '/hub/contacts/:id/overview',
    async (req, reply) => {
      const id = z.string().min(1).parse(req.params.id);
      const contact = await store.get('contacts', id);
      if (!contact) return reply.code(404).send({ message: 'Not found' });

      const contactWithInitials = {
        ...contact,
        initials: initialsFromName(contact.name),
      };

      const company = contact.companyId
        ? await store.get('companies', contact.companyId)
        : undefined;

      const companyWithInitials = company
        ? { ...company, initials: companyInitials(company.name) }
        : undefined;

      const activities = (await store.list('activities'))
        .filter((a) => a.contactId === id)
        .sort((a, b) => (a.at < b.at ? 1 : -1));

      const lastActivityAt = activities[0]?.at ?? null;

      const payload = {
        contact: contactWithInitials,
        company: companyWithInitials,
        activities,
        stats: { lastActivityAt },
      };

      return reply.send(payload);
    },
  );
};

export default route;
