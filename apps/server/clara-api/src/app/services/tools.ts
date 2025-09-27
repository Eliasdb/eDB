// apps/server/clara-api/src/app/services/tools.ts
import OpenAI from 'openai';
import { z } from 'zod';
import { byKind, kind, patchByKind, type Kind } from '../../domain/schemas';
import { store } from '../../domain/store';

/** helpers */
const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const CreateArgs = z.object({
  kind,
  data: z.any(), // validated against byKind[kind]
});
const UpdateArgs = z.object({
  kind,
  id: z.string().min(1),
  patch: z.any(), // validated against patchByKind[kind]
});
const DeleteArgs = z.object({
  kind,
  id: z.string().min(1),
});
const ListArgs = z.object({ kind });

/** Generic validation per kind */
function parseCreate(a: z.infer<typeof CreateArgs>) {
  const schema = byKind[a.kind];
  const parsed = schema.parse(a.data);
  return parsed.id ? parsed : { ...parsed, id: uid(a.kind.slice(0, 2)) };
}
function parsePatch(a: z.infer<typeof UpdateArgs>) {
  const schema = patchByKind[a.kind];
  return schema.parse(a.patch);
}

/** The one executor the voice client calls */
export async function executeTool(name: string, args: unknown) {
  switch (name) {
    case 'hub.list': {
      return store.all();
    }
    case 'hub.list_kind': {
      const a = ListArgs.parse(args);
      return store.list(a.kind);
    }
    case 'hub.create': {
      const a = CreateArgs.parse(args);
      const withId = parseCreate(a);
      store.add(a.kind as Kind, withId);
      return store.get(a.kind as Kind, withId.id);
    }
    case 'hub.update': {
      const a = UpdateArgs.parse(args);
      const patch = parsePatch(a);
      const existing = store.get(a.kind as Kind, a.id);
      if (!existing) return { error: 'not_found' };
      const updated = { ...existing, ...patch, id: a.id };
      store.update(a.kind as Kind, a.id, updated);
      return updated;
    }
    case 'hub.delete': {
      const a = DeleteArgs.parse(args);
      const ok = store.remove(a.kind as Kind, a.id);
      return ok ? { ok: true, id: a.id } : { error: 'not_found' };
    }
    default:
      // Back-compat aliases (optional)
      if (name === 'add_task')
        return executeTool('hub.create', { kind: 'tasks', data: args });
      if (name === 'update_task')
        return executeTool('hub.update', { kind: 'tasks', ...(args as any) });
      if (name === 'add_contact')
        return executeTool('hub.create', { kind: 'contacts', data: args });
      if (name === 'update_contact')
        return executeTool('hub.update', {
          kind: 'contacts',
          ...(args as any),
        });
      if (name === 'add_company')
        return executeTool('hub.create', { kind: 'companies', data: args });
      return { error: `unknown_tool ${name}` };
  }
}

// apps/server/clara-api/src/app/services/tools.ts (continued)
type FnTool = Extract<
  OpenAI.Chat.Completions.ChatCompletionTool,
  { type: 'function' }
>;

// apps/server/clara-api/src/app/services/tools.ts

export function toolSpecsForChat(): OpenAI.Chat.Completions.ChatCompletionTool[] {
  const kindEnum = { enum: ['tasks', 'contacts', 'companies'] as const };

  const taskCreate = {
    type: 'object',
    properties: {
      id: { type: 'string' }, // optional (server can assign)
      title: { type: 'string' }, // required
      due: { type: 'string' }, // optional
      done: { type: 'boolean' }, // optional
      source: { type: 'string' }, // optional
    },
    required: ['title'],
    additionalProperties: false,
  };

  const contactCreate = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' }, // required
      email: { type: 'string' },
      phone: { type: 'string' },
      avatarUrl: { type: 'string' },
      source: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  };

  const companyCreate = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' }, // required
      industry: { type: 'string' },
      domain: { type: 'string' },
      logoUrl: { type: 'string' },
      source: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  };

  const taskPatch = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      due: { type: 'string' },
      done: { type: 'boolean' },
      source: { type: 'string' },
    },
    additionalProperties: false, // all optional
  };

  const contactPatch = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      avatarUrl: { type: 'string' },
      source: { type: 'string' },
    },
    additionalProperties: false,
  };

  const companyPatch = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      industry: { type: 'string' },
      domain: { type: 'string' },
      logoUrl: { type: 'string' },
      source: { type: 'string' },
    },
    additionalProperties: false,
  };

  return [
    {
      type: 'function',
      function: {
        name: 'hub.list',
        description: 'Fetch full snapshot of tasks, contacts, companies',
        parameters: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'hub.list_kind',
        description: 'List all items of a kind',
        parameters: {
          type: 'object',
          properties: { kind: kindEnum },
          required: ['kind'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'hub.create',
        description: 'Create an item for a kind',
        parameters: {
          type: 'object',
          properties: {
            kind: kindEnum,
            data: {
              oneOf: [taskCreate, contactCreate, companyCreate],
            },
          },
          required: ['kind', 'data'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'hub.update',
        description: 'Update fields of an item for a kind (id required)',
        parameters: {
          type: 'object',
          properties: {
            kind: kindEnum,
            id: { type: 'string' },
            patch: {
              oneOf: [taskPatch, contactPatch, companyPatch],
            },
          },
          required: ['kind', 'id', 'patch'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'hub.delete',
        description: 'Delete an item by id for a kind',
        parameters: {
          type: 'object',
          properties: { kind: kindEnum, id: { type: 'string' } },
          required: ['kind', 'id'],
          additionalProperties: false,
        },
      },
    },
  ];
}

// apps/server/clara-api/src/app/services/tools.ts

// runtime guard (from earlier)
function isFunctionTool(
  t: OpenAI.Chat.Completions.ChatCompletionTool,
): t is OpenAI.Chat.Completions.ChatCompletionTool & {
  type: 'function';
  function: any;
} {
  return (t as any)?.type === 'function' && !!(t as any)?.function;
}

export function toolSpecsForRealtime(): Array<{
  type: 'function';
  name: string;
  description?: string;
  parameters?: any;
}> {
  return toolSpecsForChat()
    .filter(isFunctionTool)
    .map((t) => ({
      type: 'function',
      // 👇 sanitize: dots → underscores to satisfy ^[a-zA-Z0-9_-]+$
      name: t.function.name.replace(/\./g, '_'),
      description: t.function.description,
      parameters: t.function.parameters,
    }));
}
