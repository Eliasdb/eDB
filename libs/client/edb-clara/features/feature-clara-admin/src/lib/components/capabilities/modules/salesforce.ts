import type { ToolMeta, ToolModule } from '../../../types';

const tools: ToolMeta[] = [
  {
    type: 'function',
    name: 'salesforce_upsert_lead',
    description: 'Create/update Salesforce lead',
    parameters: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        company: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['email'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'salesforce_update_opportunity_stage',
    description: 'Update opportunity stage',
    parameters: {
      type: 'object',
      properties: {
        opportunityId: { type: 'string' },
        stageName: { type: 'string' },
      },
      required: ['opportunityId', 'stageName'],
      additionalProperties: false,
    },
  },
];

const mod: ToolModule = {
  key: 'salesforce',
  label: 'Salesforce',
  tabIcon: 'cloud-outline',
  tools,
  intro:
    'Salesforce operations such as creating or updating objects and syncing records.',
};

export default mod;
