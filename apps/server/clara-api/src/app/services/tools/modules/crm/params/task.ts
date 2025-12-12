export const taskCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    due: { type: 'string' },
    done: { type: 'boolean' },
    companyId: { type: 'string' },
    contactId: { type: 'string' },
  },
  required: ['title'],
  additionalProperties: false,
};

export const taskPatch = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    due: { type: 'string' },
    done: { type: 'boolean' },
    companyId: { type: 'string' },
    contactId: { type: 'string' },
  },
  additionalProperties: false,
};
