/**
 * apps/server/clara-api/src/app/services/tools.ts
 */
import type OpenAI from 'openai';
import { z } from 'zod';
import { store } from '../../domain/store';
import type { Company, Contact, Task } from '../../domain/types';

/* ----------------------------- Schemas ----------------------------------- */

export const AddTask = z.object({
  title: z.string().min(1),
  due: z.string().optional(),
  source: z.string().optional(),
});

export const UpdateTask = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  due: z.string().optional(),
  done: z.boolean().optional(),
});

export const AddContact = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

/** ✅ New: update all fields of a contact (id required, everything else optional) */
export const UpdateContact = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

/** ✅ New: delete a contact by id */
export const DeleteContact = z.object({
  name: z.string().min(1),
});

export const AddCompany = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  domain: z.string().optional(),
  source: z.string().optional(),
});

/* ----------------------- Canonical tool executor ------------------------- */
export async function executeTool(name: string, args: unknown) {
  switch (name) {
    case 'list_hub':
      return store.all();

    case 'add_task': {
      const a = AddTask.parse(args);
      const item: Task = {
        id: `t_${Date.now()}`,
        title: a.title,
        due: a.due,
        source: a.source,
        done: false,
      };
      store.add('tasks', item);
      return store.get('tasks', item.id);
    }

    case 'update_task': {
      const a = UpdateTask.parse(args);
      const ok = store.update('tasks', a.id, a);
      return ok ? store.get('tasks', a.id) : { error: 'not_found' };
    }

    case 'add_contact': {
      const a = AddContact.parse(args);
      const item: Contact = {
        id: `c_${Date.now()}`,
        name: a.name,
        email: a.email,
        phone: a.phone,
        source: a.source,
        avatarUrl: undefined,
      };
      store.add('contacts', item);
      return store.get('contacts', item.id);
    }

    /** ✅ New: update_contact */
    case 'update_contact': {
      const a = UpdateContact.parse(args);
      const ok = store.update('contacts', a.id, a);
      return ok ? store.get('contacts', a.id) : { error: 'not_found' };
    }

    /** ✅ New: delete_contact */
    case 'delete_contact': {
      const a = DeleteContact.parse(args);
      const ok = store.remove?.('contacts', a.name); // ensure store.remove exists
      return ok ? { ok: true, name: a.name } : { error: 'not_found' };
    }

    case 'add_company': {
      const a = AddCompany.parse(args);
      const item: Company = {
        id: `co_${Date.now()}`,
        name: a.name,
        industry: a.industry,
        domain: a.domain,
        source: a.source,
        logoUrl: undefined,
      };
      store.add('companies', item);
      return store.get('companies', item.id);
    }

    default:
      return { error: `unknown_tool ${name}` };
  }
}

/* ----------------------------- Tool specs -------------------------------- */

type FunctionTool = Extract<
  OpenAI.Chat.Completions.ChatCompletionTool,
  { type: 'function' }
>;

export function toolSpecsForChat(): OpenAI.Chat.Completions.ChatCompletionTool[] {
  return [
    {
      type: 'function',
      function: {
        name: 'list_hub',
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
        name: 'add_task',
        description: 'Create a task',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            due: { type: 'string' },
            source: { type: 'string' },
          },
          required: ['title'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'update_task',
        description: 'Update an existing task',
        parameters: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            due: { type: 'string' },
            done: { type: 'boolean' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'add_contact',
        description: 'Create a contact',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            source: { type: 'string' },
          },
          required: ['name'],
          additionalProperties: false,
        },
      },
    },
    /** ✅ New: update_contact */
    {
      type: 'function',
      function: {
        name: 'update_contact',
        description: 'Update any fields of an existing contact',
        parameters: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            source: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
    },
    /** ✅ New: delete_contact */
    {
      type: 'function',
      function: {
        name: 'delete_contact',
        description: 'Delete a contact by name',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: ['name'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'add_company',
        description: 'Create a company',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            industry: { type: 'string' },
            domain: { type: 'string' },
            source: { type: 'string' },
          },
          required: ['name'],
          additionalProperties: false,
        },
      },
    },
  ];
}

/** Specs for Realtime `session.update` */
export function toolSpecsForRealtime(): Array<{
  type: 'function';
  name: string;
  description?: string;
  parameters?: any;
}> {
  const chat = toolSpecsForChat();
  const fnOnly = chat.filter((t): t is FunctionTool => t.type === 'function');
  return fnOnly.map((t) => ({
    type: 'function',
    name: t.function.name,
    description: t.function.description,
    parameters: t.function.parameters,
  }));
}
