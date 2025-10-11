export const activityCreate = {
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

export const activityPatch = {
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
