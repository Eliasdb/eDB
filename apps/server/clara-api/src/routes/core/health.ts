import { FastifyPluginAsync } from 'fastify';
import { pool } from '../../infra/db';

const route: FastifyPluginAsync = async (app) => {
  app.get('/health', async (_req, reply) => {
    const meta = await pool.query(`
      select
        current_database() as db,
        current_user as "user",
        inet_server_addr()::text as host,
        inet_server_port() as port,
        version()
    `);

    return reply.send({
      ok: true,
      openai: app.hasOpenAI,
      conn: meta.rows[0],
    });
  });
};

export default route;
