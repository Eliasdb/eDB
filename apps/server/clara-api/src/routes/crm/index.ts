// apps/server/clara-api/src/routes/crm/index.ts
import type { FastifyPluginAsync } from 'fastify';

// legacy (generic hub endpoints)
import hubRoutes from './hub';

// new per-entity routers (compose CRUD factory + extras)
import activitiesRoute from './activities.route';
import companiesRoute from './companies.route';
import contactsRoute from './contacts.route';
import tasksRoute from './tasks.route';

const crm: FastifyPluginAsync = async (app) => {
  // ✅ legacy hub (backwards-compat). These already prefix themselves with /hub.
  await app.register(hubRoutes);

  // ✅ new, explicit entity routes. Each file mounts its own base:
  // /companies, /contacts, /activities, /tasks
  await app.register(companiesRoute);
  await app.register(contactsRoute);
  await app.register(activitiesRoute);
  await app.register(tasksRoute);
};

export default crm;
