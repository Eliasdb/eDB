import type OpenAI from 'openai';
import { z } from 'zod';
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
  type Kind,
} from '../../../..//domain/types/crm.types';
import { store } from '../../../../domain/stores/store';
import { withToolLog } from '../../tools/tool-logger';
import type { ExecCtx, ToolModule } from '../registry';

const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
const CreateArgs = z.object({ kind: kindSchema, data: z.any() });
const UpdateArgs = z.object({
  kind: kindSchema,
  id: z.string().min(1),
  patch: z.any(),
});
const DeleteArgs = z.object({ kind: kindSchema, id: z.string().min(1) });
const ListArgs = z.object({ kind: kindSchema });

function parseCreate(a: z.infer<typeof CreateArgs>) {
  const schema = bodySchemaByKind[a.kind];
  const parsed = schema.parse(a.data);
  return parsed.id ? parsed : { ...parsed, id: uid(a.kind.slice(0, 2)) };
}
function parsePatch(a: z.infer<typeof UpdateArgs>) {
  const schema = patchSchemaByKind[a.kind];
  return schema.parse(a.patch);
}

/* ---- specs ---- */
const kindEnum = { enum: ['tasks', 'contacts', 'companies'] as const };

const taskCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    due: { type: 'string' },
    done: { type: 'boolean' },
    source: { type: 'string' },
  },
  required: ['title'],
  additionalProperties: false,
};

const contactCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
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
    name: { type: 'string' },
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
  additionalProperties: false,
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

export const crmModule: ToolModule = {
  namespace: 'hub',

  specsForChat(): OpenAI.Chat.Completions.ChatCompletionTool[] {
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
          description: 'List items of a kind',
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
          description: 'Create an item',
          parameters: {
            type: 'object',
            properties: {
              kind: kindEnum,
              data: { oneOf: [taskCreate, contactCreate, companyCreate] },
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
          description: 'Patch an item',
          parameters: {
            type: 'object',
            properties: {
              kind: kindEnum,
              id: { type: 'string' },
              patch: { oneOf: [taskPatch, contactPatch, companyPatch] },
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
          description: 'Delete by id',
          parameters: {
            type: 'object',
            properties: { kind: kindEnum, id: { type: 'string' } },
            required: ['kind', 'id'],
            additionalProperties: false,
          },
        },
      },
    ];
  },

  specsForRealtime() {
    // reuse the chat specs and map name '.' -> '_'
    return this.specsForChat()
      .filter((t: any) => t?.type === 'function')
      .map((t: any) => ({
        type: 'function',
        name: t.function.name.replace(/\./g, '_'),
        description: t.function.description,
        parameters: t.function.parameters,
      }));
  },

  async execute(localName, args, _ctx: ExecCtx) {
    return withToolLog(`hub.${localName}`, args, async () => {
      switch (localName) {
        case 'list':
          return store.all();
        case 'list_kind':
          return store.list(ListArgs.parse(args).kind);

        case 'create': {
          const a = CreateArgs.parse(args);
          const withId = parseCreate(a);
          store.add(a.kind as Kind, withId);
          return store.get(a.kind as Kind, withId.id);
        }

        case 'update': {
          const a = UpdateArgs.parse(args);
          const patch = parsePatch(a);
          const existing = store.get(a.kind as Kind, a.id);
          if (!existing) return { error: 'not_found' };
          const updated = { ...existing, ...patch, id: a.id };
          store.update(a.kind as Kind, a.id, updated);
          return updated;
        }

        case 'delete': {
          const a = DeleteArgs.parse(args);
          const ok = store.remove(a.kind as Kind, a.id);
          return ok ? { ok: true, id: a.id } : { error: 'not_found' };
        }

        default:
          return { error: `unknown_tool hub.${localName}` };
      }
    });
  },
};
