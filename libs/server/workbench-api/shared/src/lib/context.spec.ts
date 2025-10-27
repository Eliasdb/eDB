import { describe, expect, it } from 'vitest';
import { ctxFromReq } from './context';

describe('ctxFromReq', () => {
  it('extracts userId and roles when present', () => {
    const ctx = ctxFromReq({
      user: { userId: 'u1', roles: ['admin', 'user'] },
    });

    expect(ctx).toEqual({
      userId: 'u1',
      roles: ['admin', 'user'],
    });
  });

  it('returns null userId and [] roles when no user', () => {
    const ctx = ctxFromReq({});

    expect(ctx).toEqual({
      userId: null,
      roles: [],
    });
  });

  it('normalizes malformed roles into []', () => {
    const ctx = ctxFromReq({
      user: { userId: 'u2', roles: 'not-an-array' as unknown as string[] },
    });

    expect(ctx).toEqual({
      userId: 'u2',
      roles: [],
    });
  });

  it('normalizes missing/empty userId into null', () => {
    const ctx = ctxFromReq({
      user: { roles: ['user'] },
    });

    expect(ctx).toEqual({
      userId: null,
      roles: ['user'],
    });
  });
});
