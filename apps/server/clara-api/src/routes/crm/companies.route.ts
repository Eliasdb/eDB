import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../../domain/stores';
import type { CompanyOverviewDto } from '../../domain/types/company-overview.dto';
import { companyInitials } from '../../domain/utils/company-initials';
import { initialsFromName } from '../../domain/utils/contact-initials';
import { makeCrudRouter } from '../_lib/crud-factory';

const companiesCrud = makeCrudRouter({ kind: 'companies', base: '/companies' });

// ---- helper: latest touch timestamp across contacts -------------------------
function latestContactTouch(
  contacts: Array<{ createdAt?: string | null; updatedAt?: string | null }>,
): string | null {
  let max: string | null = null;
  for (const c of contacts) {
    const ts = c.updatedAt ?? c.createdAt ?? null;
    if (!ts) continue;
    if (!max || ts > max) max = ts; // ISO strings compare lexicographically
  }
  return max;
}

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

      const lastActivityAt = activities[0]?.at ?? null; // timeline-wide
      const lastContactActivityAt = latestContactTouch(contacts); // 👈 contacts-scoped
      const nextTask = tasks.find((t) => !t.done && t.due);

      // If your DTO doesn’t have contactsCount/lastContactActivityAt yet,
      // add them there too. (Or keep this payload untyped until then.)
      const payload = {
        company: companyWithInitials,
        contacts,
        activities,
        tasks,
        stats: {
          lastActivityAt,
          lastContactActivityAt, // ✅ new
          contactsCount: contacts.length, // ✅ handy count
          nextTaskDue: nextTask?.due ?? null,
          openTasks: tasks.filter((t) => !t.done).length,
        },
      } satisfies CompanyOverviewDto as unknown as CompanyOverviewDto;

      reply.send(payload);
    },
  );
};

const companiesRoute: FastifyPluginAsync = async (app) => {
  await app.register(companiesCrud);
  await app.register(companiesExtras);
};

export default companiesRoute;
