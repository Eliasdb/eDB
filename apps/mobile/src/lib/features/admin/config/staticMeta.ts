// Static capabilities for the UI (no network).
// Exports a display-ready list `CAPABILITY_ITEMS` so screens can render directly.

import type {
  CapabilityItem,
  CrudAction,
  JSONSchema,
  ToolMeta,
} from '../types';

/* ---------- raw tools (schema-like) ---------- */
const RAW_TOOLS: ToolMeta[] = [
  // -------------------- Internal (hub_*) --------------------
  {
    type: 'function',
    name: 'hub_list',
    description: 'Fetch full snapshot of tasks, contacts, companies',
    parameters: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hub_list_kind',
    description: 'List items of a kind',
    parameters: {
      type: 'object',
      properties: {
        kind: { enum: ['tasks', 'contacts', 'companies'] },
      },
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

  // -------------------- HubSpot --------------------
  {
    type: 'function',
    name: 'hubspot_upsert_contact',
    description: 'Create/update HubSpot contact by email',
    parameters: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        phone: { type: 'string' },
        company: { type: 'string' },
      },
      required: ['email'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hubspot_update_deal_stage',
    description: 'Move deal to stage',
    parameters: {
      type: 'object',
      properties: {
        dealId: { type: 'string' },
        stage: { type: 'string' },
        pipeline: { type: 'string' },
      },
      required: ['dealId', 'stage'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'hubspot_create_company_and_link',
    description: 'Create company and optionally link contact',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        domain: { type: 'string' },
        contactId: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
];

/* ---------- helpers (local so screens don’t need them) ---------- */
function toTitle(name: string) {
  const human = name.replace(/^hub_/, '').replace(/_/g, ' ');
  return human
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
function actionFromName(name: string): CrudAction {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'create';
  if (n.includes('update')) return 'update';
  if (n.includes('delete')) return 'delete';
  if (n.includes('list') || n.includes('read')) return 'read';
  return 'other';
}
function pickIcon(
  name: string,
):
  | 'add-circle-outline'
  | 'build-outline'
  | 'trash-outline'
  | 'list-circle-outline'
  | 'reorder-four-outline'
  | 'document-text-outline'
  | 'grid-outline'
  | 'construct-outline' {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'add-circle-outline';
  if (n.includes('update')) return 'build-outline';
  if (n.includes('delete')) return 'trash-outline';
  if (n.includes('list') && n.includes('kind')) return 'list-circle-outline';
  if (n.includes('list')) return 'reorder-four-outline';
  if (n.includes('read')) return 'document-text-outline';
  if (n.includes('hub')) return 'grid-outline';
  return 'construct-outline';
}
function summarizeParams(schema?: JSONSchema): CapabilityItem['summary'] {
  if (!schema || typeof schema !== 'object') return;

  const out: CapabilityItem['summary'] = {};

  const kindEnum = schema?.properties?.kind?.enum as string[] | undefined;
  if (Array.isArray(kindEnum) && kindEnum.length) out.kinds = kindEnum;

  const req = schema?.required as string[] | undefined;
  if (Array.isArray(req) && req.length) out.required = req;

  const props = schema?.properties as Record<string, any> | undefined;
  if (props && typeof props === 'object') {
    const keys = Object.keys(props).filter((k) => k !== 'kind');
    if (keys.length) out.fields = keys;
  }

  const oneOf = schema?.properties?.data?.oneOf as JSONSchema[] | undefined;
  if (Array.isArray(oneOf) && oneOf.length) {
    out.variants = oneOf.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
  }

  const rootOne = Array.isArray(schema?.oneOf) ? (schema.oneOf as any[]) : [];
  if (rootOne.length) {
    const rootVariants = rootOne.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
    out.variants = [...(out.variants ?? []), ...rootVariants];
  }

  if (!out.kinds && !out.required && !out.fields && !out.variants) return;
  return out;
}

/* ---------- display-ready items ---------- */
export const CAPABILITY_ITEMS: CapabilityItem[] = RAW_TOOLS.map((t) => ({
  icon: pickIcon(t.name),
  title: toTitle(t.name),
  name: t.name,
  action: actionFromName(t.name),
  description: t.description,
  summary: summarizeParams(t.parameters),
}));

/* Optional: keep a raw meta export if you need `instructions` elsewhere */
export const RAW_CAPABILITIES_META = {
  instructions:
    'You are Clara. When the user asks to create/update/list tasks, contacts, or companies, ALWAYS call the correct tool immediately, then confirm briefly. Default to English unless told otherwise.',
  tools: RAW_TOOLS,
};
