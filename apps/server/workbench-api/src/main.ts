import fastifyCors from '@fastify/cors';
import Fastify from 'fastify';

import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerAllRoutes } from './routes';

async function bootstrap() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  await app.register(fastifyCors, {
    origin: 'http://localhost:4200',
    credentials: true, // if sending cookies
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  });
  await registerAllRoutes(app);
  const port = Number(process.env.PORT ?? 9102);
  await app.listen({ host: '0.0.0.0', port });
}
bootstrap();
