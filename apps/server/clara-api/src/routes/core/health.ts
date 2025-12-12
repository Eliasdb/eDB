import { FastifyPluginAsync } from 'fastify';
import { pool } from '../../infra/db';

const route: FastifyPluginAsync = async (app) => {
  // app.get('/health', async () => ({ ok: true, openai: app.hasOpenAI }));

  app.get('/health', async (_req, reply) => {
    const meta = await pool.query(`
      select
        current_database() as db,
        current_user as "user",
        inet_server_addr()::text as host,
        inet_server_port() as port,
        version()
    `);
    const counts = await pool.query(`
      select
        (select count(*) from companies) as companies,
        (select count(*) from contacts)  as contacts,
        (select count(*) from tasks)     as tasks,
        (select count(*) from activities)as activities
    `);
    return reply.send({ conn: meta.rows[0], counts: counts.rows[0] });
  });
};

export default route;
