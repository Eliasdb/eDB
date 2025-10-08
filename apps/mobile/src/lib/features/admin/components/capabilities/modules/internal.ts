import type { ToolMeta, ToolModule } from '../../../types';

/* ── Shared enums used in parameters ─────────────────────────────────────── */
const KIND_ENUM = {
  enum: ['tasks', 'contacts', 'companies', 'activities'] as const,
};

/* ── JSON Schemas for create/patch payloads ──────────────────────────────── */
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

const activityCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    contactId: { type: 'string' }, // required
    type: {
      enum: ['note', 'call', 'email', 'meeting', 'task', 'status', 'system'],
    },
    at: { type: 'string' }, // ISO
    by: { type: 'string' },
    summary: { type: 'string' },
    payload: {
      type: 'object',
      properties: {
        durationMin: { type: 'number' },
        outcome: { type: 'string' },
        followUpAt: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, url: { type: 'string' } },
            required: ['name', 'url'],
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  required: ['contactId', 'type', 'summary', 'at'],
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

const activityPatch = {
  type: 'object',
  properties: {
    contactId: { type: 'string' },
    type: {
      enum: ['note', 'call', 'email', 'meeting', 'task', 'status', 'system'],
    },
    at: { type: 'string' },
    by: { type: 'string' },
    summary: { type: 'string' },
    payload: {
      type: 'object',
      properties: {
        durationMin: { type: 'number' },
        outcome: { type: 'string' },
        followUpAt: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, url: { type: 'string' } },
            required: ['name', 'url'],
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

/* ── Tools ───────────────────────────────────────────────────────────────── */
const tools: ToolMeta[] = [
  {
    type: 'function',
    name: 'hub_list',
    description:
      'Fetch full snapshot of tasks, contacts, companies, activities',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    type: 'function',
    name: 'hub_list_kind',
    description:
      'List items of a kind; for activities you can filter by contactId',
    parameters: {
      type: 'object',
      properties: {
        kind: KIND_ENUM,
        contactId: { type: 'string' }, // optional; used when kind === 'activities'
      },
      required: ['kind'],
      additionalProperties: false,
    },
  },
  // Optional: convenience tool that always filters by contact
  {
    type: 'function',
    name: 'hub_activities_for_contact',
    description: 'List activities for a contact (newest first)',
    parameters: {
      type: 'object',
      properties: { contactId: { type: 'string' } },
      required: ['contactId'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hub_create',
    description: 'Create an item',
    parameters: {
      type: 'object',
      properties: {
        kind: KIND_ENUM,
        data: {
          oneOf: [taskCreate, contactCreate, companyCreate, activityCreate],
        },
      },
      required: ['kind', 'data'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hub_update',
    description: 'Patch an item',
    parameters: {
      type: 'object',
      properties: {
        kind: KIND_ENUM,
        id: { type: 'string' },
        patch: {
          oneOf: [taskPatch, contactPatch, companyPatch, activityPatch],
        },
      },
      required: ['kind', 'id', 'patch'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hub_delete',
    description: 'Delete by id',
    parameters: {
      type: 'object',
      properties: { kind: KIND_ENUM, id: { type: 'string' } },
      required: ['kind', 'id'],
      additionalProperties: false,
    },
  },
];

const mod: ToolModule = {
  key: 'internal',
  label: 'Internal',
  tabIcon: 'cube-outline',
  tools,
  intro:
    'Built-in Clara tools for your demo hub (tasks, contacts, companies, activities). Great for prototyping end-to-end flows.',
};

export default mod;
