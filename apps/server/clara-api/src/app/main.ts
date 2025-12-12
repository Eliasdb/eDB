import { buildApp } from './app';

(async () => {
  const app = await buildApp();
  const port = Number(process.env.PORT ?? 9101);
  await app.listen({ port, host: '0.0.0.0' });
})();
