import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerAllRoutes } from './routes';

async function bootstrap() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  await registerAllRoutes(app);
  const port = Number(process.env.PORT ?? 9102);
  await app.listen({ host: '0.0.0.0', port });
}
bootstrap();
