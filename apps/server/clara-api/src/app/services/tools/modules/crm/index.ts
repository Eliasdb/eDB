// apps/server/clara-api/src/app/services/tools/modules/crm/index.ts
import type OpenAI from 'openai';
import { z } from 'zod';
import { store } from '../../../../../domain/stores';
import { type Kind } from '../../../../../domain/types/crm.types';
import { withToolLog } from '../../../tools/tool-logger';
import type { ExecCtx, ToolModule } from '../../registry';

import {
  CreateArgs,
  DeleteArgs,
  kindEnum,
  ListArgs,
  parseCreate,
  parsePatch,
  UpdateArgs,
} from './helpers';

import { activityCreate, activityPatch } from './params/activity';
import { companyCreate, companyPatch } from './params/company';
import { contactCreate, contactPatch } from './params/contact';
import { taskCreate, taskPatch } from './params/task';

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
            properties: { kind: kindEnum, contactId: { type: 'string' } },
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
      {
        type: 'function',
        function: {
          name: 'hub.company_overview',
          description:
            'Return a single-company overview: company, contacts, activities, tasks, and stats',
          parameters: {
            type: 'object',
            properties: { companyId: { type: 'string' } },
            required: ['companyId'],
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
          return await store.all();

        case 'list_kind': {
          const a = ListArgs.parse(args);
          const items = await store.list(a.kind as Kind);
          if (a.kind === 'activities' && a.contactId) {
            return (items as any[])
              .filter((x) => x.contactId === a.contactId)
              .sort((a, b) => String(b.at).localeCompare(String(a.at))); // newest first
          }
          return items;
        }

        case 'activities_for_contact': {
          const { contactId } = z
            .object({ contactId: z.string().min(1) })
            .parse(args);
          const acts = (await store.list('activities'))
            .filter((a) => a.contactId === contactId)
            .sort((a, b) => String(b.at).localeCompare(String(a.at)));
          return acts;
        }

        case 'company_overview': {
          const { companyId } = z
            .object({ companyId: z.string().min(1) })
            .parse(args);
          const company = await store.get('companies', companyId);
          if (!company) return { error: 'not_found' };

          const contacts = await store.contactsByCompany(companyId);
          const activities = (await store.activitiesByCompany(companyId)).sort(
            (a, b) => (a.at < b.at ? 1 : -1),
          );
          const tasks = (await store.tasksByCompany(companyId)).sort((a, b) =>
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
          await store.add(a.kind as Kind, withId);
          return await store.get(a.kind as Kind, withId.id);
        }

        case 'update': {
          const a = UpdateArgs.parse(args);
          const patch = parsePatch(a);
          const exists = await store.get(a.kind as Kind, a.id);
          if (!exists) return { error: 'not_found' };
          const ok = await store.update(a.kind as Kind, a.id, patch as any);
          if (!ok) return { error: 'not_updated' };
          return await store.get(a.kind as Kind, a.id);
        }

        case 'delete': {
          const a = DeleteArgs.parse(args);
          const prev = await store.get(a.kind as Kind, a.id); // <- grab before removing
          const ok = await store.remove(a.kind as Kind, a.id);
          return ok
            ? { ok: true, id: a.id, prev } // <- include prev so client can invalidate precisely
            : { error: 'not_found' };
        }

        default:
          return { error: `unknown_tool hub.${localName}` };
      }
    });
  },
};

export default crmModule;
