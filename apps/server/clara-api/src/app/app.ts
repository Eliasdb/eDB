// apps/server/clara-api/src/app/app.ts
import { fastifyCors } from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify, { FastifyInstance } from 'fastify';

import { authPlugin } from './plugins/auth';
import { openAIPlugin } from './plugins/openai';

// ---- Static route imports (no runtime path headaches)
import actionsRoutes from '../routes/actions';
import chatRoutes from '../routes/chat';
import healthRoutes from '../routes/health';
import hubRoutes from '../routes/hub';
import realtimeRoutes from '../routes/realtime';
import realtimeExecRoutes from '../routes/realtime-exec';
import realtimeToolsRoutes from '../routes/realtime-tools';
import rootRoutes from '../routes/root';
import transcribeRoutes from '../routes/transcribe';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  // Core plugins
  await app.register(fastifyCors, { origin: true });
  await app.register(multipart);

  // Optional auth + OpenAI decorator
  await app.register(authPlugin);
  await app.register(openAIPlugin);

  // Routes
  await app.register(rootRoutes, { prefix: '/' });
  await app.register(healthRoutes, { prefix: '/' });
  await app.register(hubRoutes, { prefix: '/' });
  await app.register(chatRoutes, { prefix: '/' });
  await app.register(transcribeRoutes, { prefix: '/' });
  await app.register(actionsRoutes, { prefix: '/' });
  await app.register(realtimeRoutes, { prefix: '/' });
  await app.register(realtimeToolsRoutes);
  await app.register(realtimeExecRoutes);

  return app;
}
