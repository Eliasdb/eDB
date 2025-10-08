import type { ToolMeta, ToolModule } from '../../../types';

const tools: ToolMeta[] = [
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

const mod: ToolModule = {
  key: 'hubspot',
  label: 'HubSpot',
  tabIcon: 'briefcase-outline',
  tools,
  intro:
    'Actions that talk to HubSpot — create contacts/companies and move deals between stages.',
};

export default mod;
