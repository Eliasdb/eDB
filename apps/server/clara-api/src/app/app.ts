// apps/server/clara-api/src/app/app.ts (or wherever buildApp is)
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';

import { authPlugin } from './plugins/auth';
import { openAIPlugin } from './plugins/openai';

import chatRoutes from '../routes/chat';
import healthRoutes from '../routes/health';
import hubRoutes from '../routes/hub';
import realtimeRoutes from '../routes/realtime';
import realtimeExecRoutes from '../routes/realtime-exec';
import realtimeToolsRoutes from '../routes/realtime-tools'; // 👈 add this
import rootRoutes from '../routes/root';
import toolLogsRoutes from '../routes/tool-logs'; // ✅ correct import
import hubspotPlugin from './plugins/hubspot';

export async function buildApp() {
  const app = Fastify({ logger: true });

  // apps/server/clara-api/src/app/app.ts
  await app.register(fastifyCors, {
    origin: true, // dev: allow any; lock down in prod
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.register(multipart);

  await app.register(authPlugin);
  await app.register(openAIPlugin);
  await app.register(hubspotPlugin);

  // Base
  await app.register(rootRoutes, { prefix: '/' });
  await app.register(healthRoutes, { prefix: '/' });

  // CRM
  await app.register(hubRoutes, { prefix: '/' });

  // Chat
  await app.register(chatRoutes, { prefix: '/' });

  // Realtime
  await app.register(realtimeRoutes);
  await app.register(realtimeExecRoutes);
  await app.register(realtimeToolsRoutes, { prefix: '/' });

  // 🔎 Tool logs
  await app.register(toolLogsRoutes, { prefix: '/' });

  return app;
}
