export const companyCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    website: { type: 'string' },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },
  },
  required: ['name'],
  additionalProperties: false,
};

export const companyPatch = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    website: { type: 'string' },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },
  },
  additionalProperties: false,
};
