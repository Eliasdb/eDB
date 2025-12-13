// libs/server/workbench-api/openapi/src/emit-openapi.ts
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

const registry = new OpenAPIRegistry();

// Local health schema (keeps this package self contained)
const HealthResponse: z.ZodTypeAny = z.object({
  ok: z.boolean(),
  service: z.string(),
  time: z.string(),
});

// Register component schemas
registry.register('HealthResponse', HealthResponse as any);

// Register the path using the registered component
registry.registerPath({
  method: 'get',
  path: '/api/healthz',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/HealthResponse' },
        },
      },
    },
  },
});

// Build the document
const generator = new OpenApiGeneratorV31(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.1.0',
  info: { title: 'Workbench API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:9102' }],
});

const outDir = join(process.cwd(), 'dist/apis/workbench-api');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'openapi.json'), JSON.stringify(doc, null, 2));
console.log('Wrote dist/apis/workbench-api/openapi.json');
