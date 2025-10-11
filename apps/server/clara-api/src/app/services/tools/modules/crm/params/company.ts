export const companyCreate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    website: { type: ['string', 'null'] },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },

    // NEW
    industry: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    hq: {
      anyOf: [{ type: 'object', additionalProperties: true }, { type: 'null' }],
    },
    employees: { type: ['number', 'null'] },
    employeesRange: { type: ['string', 'null'] },
    ownerContactId: { type: ['string', 'null'] },
    primaryEmail: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'] },
  },
  required: ['name'],
  additionalProperties: false,
};

export const companyPatch = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    website: { type: ['string', 'null'] },
    stage: { enum: ['lead', 'prospect', 'customer', 'inactive'] },

    // NEW (nullable so we can clear)
    industry: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    hq: {
      anyOf: [{ type: 'object', additionalProperties: true }, { type: 'null' }],
    },
    employees: { type: ['number', 'null'] },
    employeesRange: { type: ['string', 'null'] },
    ownerContactId: { type: ['string', 'null'] },
    primaryEmail: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'] },
  },
  additionalProperties: false,
};
