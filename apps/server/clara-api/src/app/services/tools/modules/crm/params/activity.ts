export const activityCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { enum: ['note', 'call', 'email', 'meeting', 'status', 'system'] },
    at: { type: 'string' }, // ISO
    summary: { type: 'string' },
    contactId: { type: ['string', 'null'] },
    companyId: { type: ['string', 'null'] },
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
    companyId: { type: ['string', 'null'] }, // <- allow null
    contactId: { type: ['string', 'null'] }, // <- allow null
  },
  additionalProperties: false,
};
