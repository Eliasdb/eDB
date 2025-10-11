import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores';
import type { CompanyOverviewDto } from '../../domain/types/company-overview.dto';
import { companyInitials } from '../../domain/utils/company-initials';
import { initialsFromName } from '../../domain/utils/contact-initials';
import { makeCrudRouter } from '../_lib/crud-factory';

const companiesCrud = makeCrudRouter({ kind: 'companies', base: '/companies' });

const companiesExtras: FastifyPluginAsync = async (app) => {
  const idParam = z.string().min(1);

  app.get<{ Params: { id: string } }>(
    '/companies/:id/overview',
    async (req, reply) => {
      const id = idParam.parse(req.params.id);
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
      const payload: CompanyOverviewDto = {
        company: companyWithInitials,
        contacts,
        activities,
        tasks,
        stats: {
          lastActivityAt,
          nextTaskDue: nextTask?.due ?? null,
          openTasks: tasks.filter((t) => !t.done).length,
        },
      };
      reply.send(payload);
    },
  );
};

const companiesRoute: FastifyPluginAsync = async (app) => {
  await app.register(companiesCrud);
  await app.register(companiesExtras);
};

export default companiesRoute;
