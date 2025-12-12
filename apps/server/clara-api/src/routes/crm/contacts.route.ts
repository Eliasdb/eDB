import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores';
import { companyInitials } from '../../domain/utils/company-initials';
import { initialsFromName } from '../../domain/utils/contact-initials';
import { makeCrudRouter } from '../_lib/crud-factory';

const contactsCrud = makeCrudRouter({ kind: 'contacts', base: '/contacts' });

const contactsExtras: FastifyPluginAsync = async (app) => {
  const idParam = z.string().min(1);

  app.get<{ Params: { id: string } }>(
    '/contacts/:id/activities',
    async (req, reply) => {
      const id = idParam.parse(req.params.id);
      const acts = (await store.list('activities'))
        .filter((a) => a.contactId === id)
        .sort((a, b) => (a.at < b.at ? 1 : -1));
      reply.send(acts);
    },
  );

  app.get<{ Params: { id: string } }>(
    '/contacts/:id/overview',
    async (req, reply) => {
      const id = idParam.parse(req.params.id);
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
      reply.send({
        contact: contactWithInitials,
        company: companyWithInitials,
        activities,
        stats: { lastActivityAt: activities[0]?.at ?? null },
      });
    },
  );
};

const contactsRoute: FastifyPluginAsync = async (app) => {
  await app.register(contactsCrud);
  await app.register(contactsExtras);
};

export default contactsRoute;
