export const contactCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    title: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    avatarUrl: { type: 'string' },
    companyId: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
};

export const contactPatch = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    title: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    avatarUrl: { type: 'string' },
    companyId: { type: 'string' },
  },
  additionalProperties: false,
};
