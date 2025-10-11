import 'dotenv/config';
console.log('🛢 STORE =', process.env.STORE, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
});

import Fastify from 'fastify';

import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { authPlugin } from './plugins/auth';
import errorsPlugin from './plugins/errors';
import hubspotPlugin from './plugins/hubspot';
import { openAIPlugin } from './plugins/openai';

import chatRoutes from '../routes/chat/chat';
import coreRoutes from '../routes/core';
import crmRoutes from '../routes/crm';
import realtimeRoutes from '../routes/realtime';

export async function buildApp() {
  const app = Fastify({ logger: true });
  console.log('🔥 Using store:', process.env.STORE);

  // 🔌 Plugins
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
  await app.register(errorsPlugin);

  // 🌐 Core
  await app.register(coreRoutes);

  // 📇 CRM (tasks, contacts, companies, users)
  await app.register(crmRoutes);

  // 💬 Chat
  await app.register(chatRoutes, { prefix: '/' });

  // 🎙️ Realtime
  await app.register(realtimeRoutes);

  return app;
}
