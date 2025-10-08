// app/api/tools/hub/module.ts (path as in your project)
import type OpenAI from 'openai';
import { z } from 'zod';
import { store } from '../../../../domain/stores/store';
import {
  bodySchemaByKind,
  kindSchema,
  patchSchemaByKind,
  type Kind,
} from '../../../../domain/types/crm.types';
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
const ListArgs = z.object({
  kind: kindSchema,
  contactId: z.string().optional(),
});

function parseCreate(a: z.infer<typeof CreateArgs>) {
  const schema = bodySchemaByKind[a.kind];
  const parsed = schema.parse(a.data);
  // auto id if missing
  return parsed.id
    ? parsed
    : { ...parsed, id: uid((a.kind as string).slice(0, 2)) };
}

function parsePatch(a: z.infer<typeof UpdateArgs>) {
  const schema = patchSchemaByKind[a.kind];
  return schema.parse(a.patch);
}

/* ---- JSON Schemas for tool params (aligned to lean models) ---- */
const kindEnum = {
  enum: ['tasks', 'contacts', 'companies', 'activities'] as const,
};

const taskCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    due: { type: 'string' },
    done: { type: 'boolean' },
    companyId: { type: 'string' },
    contactId: { type: 'string' },
  },
  required: ['title'],
  additionalProperties: false,
};

const contactCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    title: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    avatarUrl: { type: 'string' },
    companyId: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
};

const companyCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    domain: { type: 'string' },
    logoUrl: { type: 'string' },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },
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
    companyId: { type: 'string' },
    contactId: { type: 'string' },
  },
  additionalProperties: false,
};
const contactPatch = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    title: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    avatarUrl: { type: 'string' },
    companyId: { type: 'string' },
  },
  additionalProperties: false,
};
const companyPatch = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    domain: { type: 'string' },
    logoUrl: { type: 'string' },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },
  },
  additionalProperties: false,
};

const activityCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { enum: ['note', 'call', 'email', 'meeting', 'status', 'system'] },
    at: { type: 'string' }, // ISO
    summary: { type: 'string' },
    companyId: { type: 'string' },
    contactId: { type: 'string' },
  },
  required: ['type', 'summary', 'at'],
  additionalProperties: false,
};

const activityPatch = {
  type: 'object',
  properties: {
    type: { enum: ['note', 'call', 'email', 'meeting', 'status', 'system'] },
    at: { type: 'string' },
    summary: { type: 'string' },
    companyId: { type: 'string' },
    contactId: { type: 'string' },
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
          description:
            'Fetch full snapshot of tasks, contacts, companies, activities',
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
          description:
            'List items of a kind; for activities you can filter by contactId',
          parameters: {
            type: 'object',
            properties: {
              kind: kindEnum,
              contactId: { type: 'string' }, // optional, used only when kind==='activities'
            },
            required: ['kind'],
            additionalProperties: false,
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'hub.activities_for_contact',
          description: 'List activities for a given contact id (newest first)',
          parameters: {
            type: 'object',
            properties: { contactId: { type: 'string' } },
            required: ['contactId'],
            additionalProperties: false,
          },
        },
      },

      /* ✅ NEW: overview endpoint mirrored for tools */
      {
        type: 'function',
        function: {
          name: 'hub.company_overview',
          description:
            'Return a single-company overview: company, contacts, activities, tasks, and stats',
          parameters: {
            type: 'object',
            properties: {
              companyId: { type: 'string' },
            },
            required: ['companyId'],
            additionalProperties: false,
          },
        },
      },

      // create
      {
        type: 'function',
        function: {
          name: 'hub.create',
          description: 'Create an item',
          parameters: {
            type: 'object',
            properties: {
              kind: kindEnum,
              data: {
                oneOf: [
                  taskCreate,
                  contactCreate,
                  companyCreate,
                  activityCreate,
                ],
              },
            },
            required: ['kind', 'data'],
            additionalProperties: false,
          },
        },
      },

      // update
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
              patch: {
                oneOf: [taskPatch, contactPatch, companyPatch, activityPatch],
              },
            },
            required: ['kind', 'id', 'patch'],
            additionalProperties: false,
          },
        },
      },

      // delete
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

        case 'list_kind': {
          const a = ListArgs.parse(args);
          const items = store.list(a.kind as Kind);
          if (a.kind === 'activities' && a.contactId) {
            return (items as any[])
              .filter((x) => x.contactId === a.contactId)
              .sort((b, a) => String(a.at).localeCompare(String(b.at))); // newest first
          }
          return items;
        }

        case 'activities_for_contact': {
          const { contactId } = z
            .object({ contactId: z.string().min(1) })
            .parse(args);
          const acts = store
            .list('activities')
            .filter((a) => a.contactId === contactId)
            .sort((b, a) => String(a.at).localeCompare(String(b.at)));
          return acts;
        }

        /* ✅ NEW: compute overview via store helpers */
        case 'company_overview': {
          const { companyId } = z
            .object({ companyId: z.string().min(1) })
            .parse(args);

          const company = store.get('companies', companyId);
          if (!company) return { error: 'not_found' };

          const contacts = store.contactsByCompany(companyId);
          const activities = store
            .activitiesByCompany(companyId)
            .sort((a, b) => (a.at < b.at ? 1 : -1));
          const tasks = store
            .tasksByCompany(companyId)
            .sort((a, b) =>
              String(a.due ?? '').localeCompare(String(b.due ?? '')),
            );

          const lastActivityAt = activities[0]?.at ?? null;
          const nextTask = tasks.find((t) => !t.done && t.due);
          const openTasks = tasks.filter((t) => !t.done).length;

          return {
            company,
            contacts,
            activities,
            tasks,
            stats: {
              lastActivityAt,
              nextTaskDue: nextTask?.due ?? null,
              openTasks,
            },
          };
        }

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
