import { z } from 'zod';

export const HealthResponseSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  version: z.string(),
});

// If you want a typed payload in routes/tests:
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
