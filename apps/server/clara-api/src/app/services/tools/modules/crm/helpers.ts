// apps/server/clara-api/src/app/services/tools/modules/crm/helpers.ts
import { z } from 'zod';
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
} from '../../../../../domain/types/crm.types';

export const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const CreateArgs = z.object({ kind: kindSchema, data: z.any() });
export const UpdateArgs = z.object({
  kind: kindSchema,
  id: z.string().min(1),
  patch: z.any(),
});
export const DeleteArgs = z.object({ kind: kindSchema, id: z.string().min(1) });
export const ListArgs = z.object({
  kind: kindSchema,
  contactId: z.string().optional(),
});

export function parseCreate(a: z.infer<typeof CreateArgs>) {
  const schema = bodySchemaByKind[a.kind];
  const parsed = schema.parse(a.data);
  return parsed.id
    ? parsed
    : { ...parsed, id: uid((a.kind as string).slice(0, 2)) };
}

export function parsePatch(a: z.infer<typeof UpdateArgs>) {
  const schema = patchSchemaByKind[a.kind];
  return schema.parse(a.patch);
}

// JSON schema fragment reused in specs
export const kindEnum = {
  enum: ['tasks', 'contacts', 'companies', 'activities'] as const,
};
