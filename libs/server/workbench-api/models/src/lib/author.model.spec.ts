import { authorSchema, createAuthorBodySchema } from './author.model';

describe('author model contract', () => {
  it('parses a full Author row', () => {
    const parsed = authorSchema.parse({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      firstName: 'Ada',
      lastName: 'Lovelace',
      bio: 'First programmer',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });
    expect(parsed.firstName).toBe('Ada');
  });

  it('createAuthorBodySchema enforces required fields', () => {
    expect(() =>
      createAuthorBodySchema.parse({ lastName: 'Lovelace' }),
    ).toThrow();
  });
});
