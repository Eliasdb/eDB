import type { ToolMeta, ToolModule } from '../../../types';

const tools: ToolMeta[] = [
  {
    type: 'function',
    name: 'hub_list',
    description: 'Fetch full snapshot of tasks, contacts, companies',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    type: 'function',
    name: 'hub_list_kind',
    description: 'List items of a kind',
    parameters: {
      type: 'object',
      properties: { kind: { enum: ['tasks', 'contacts', 'companies'] } },
      required: ['kind'],
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
        kind: { enum: ['tasks', 'contacts', 'companies'] },
        data: {
          oneOf: [
            {
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
            },
            {
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
            },
            {
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
            },
          ],
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
        kind: { enum: ['tasks', 'contacts', 'companies'] },
        id: { type: 'string' },
        patch: {
          oneOf: [
            {
              type: 'object',
              properties: {
                title: { type: 'string' },
                due: { type: 'string' },
                done: { type: 'boolean' },
                source: { type: 'string' },
              },
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                avatarUrl: { type: 'string' },
                source: { type: 'string' },
              },
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                name: { type: 'string' },
                industry: { type: 'string' },
                domain: { type: 'string' },
                logoUrl: { type: 'string' },
                source: { type: 'string' },
              },
              additionalProperties: false,
            },
          ],
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
      properties: {
        kind: { enum: ['tasks', 'contacts', 'companies'] },
        id: { type: 'string' },
      },
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
    'Built-in Clara tools for your demo hub (tasks, contacts, companies). Great for prototyping end-to-end flows.',
};

export default mod;
