// ✅ use default exports
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';

// your plugins will be proper FastifyPluginAsync after the changes below
import { authPlugin } from './plugins/auth';
import { openAIPlugin } from './plugins/openai';

import actionsRoutes from '../routes/actions';
import chatRoutes from '../routes/chat';
import healthRoutes from '../routes/health';
import hubRoutes from '../routes/hub';
import realtimeRoutes from '../routes/realtime';
import realtimeExecRoutes from '../routes/realtime-exec';
import realtimeToolsRoutes from '../routes/realtime-tools';
import rootRoutes from '../routes/root';
import transcribeRoutes from '../routes/transcribe';

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Base utilities FIRST
  await app.register(fastifyCors, { origin: true });
  await app.register(multipart);

  // Your plugins
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
