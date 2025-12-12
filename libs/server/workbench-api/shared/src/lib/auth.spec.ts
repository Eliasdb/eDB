import { describe, expect, it } from 'vitest';
import { assertCanAccessResource } from './auth';
import { requireAuthForTest, requireRoleForTest } from './auth.test-utils';
import { ForbiddenError, UnauthorizedError } from './errors';

describe('auth helpers', () => {
  describe('requireAuth (via test adapter)', () => {
    it('does not throw when userId is present', () => {
      expect(() =>
        requireAuthForTest({ user: { userId: 'u1', roles: ['user'] } }),
      ).not.toThrow();
    });

    it('throws UnauthorizedError when user is missing', () => {
      expect(() => requireAuthForTest({})).toThrow(UnauthorizedError);
    });

    it('throws UnauthorizedError when userId is missing', () => {
      expect(() => requireAuthForTest({ user: { roles: ['user'] } })).toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('requireRole (via test adapter)', () => {
    it('does not throw when role is present', () => {
      expect(() =>
        requireRoleForTest('admin', {
          user: { userId: 'u1', roles: ['admin', 'user'] },
        }),
      ).not.toThrow();
    });

    it('throws ForbiddenError when roles missing', () => {
      expect(() =>
        requireRoleForTest('admin', {
          user: { userId: 'u1' }, // no roles array at all
        }),
      ).toThrow(ForbiddenError);
    });

    it('throws ForbiddenError when role not included', () => {
      expect(() =>
        requireRoleForTest('admin', {
          user: { userId: 'u1', roles: ['user'] },
        }),
      ).toThrow(ForbiddenError);
    });
  });

  describe('assertCanAccessResource', () => {
    it('allows owner', () => {
      const ctx = { userId: 'me', roles: [] };
      expect(() => assertCanAccessResource(ctx, 'me')).not.toThrow();
    });

    it('allows admin even if not owner', () => {
      const ctx = { userId: 'someone-else', roles: ['admin'] };
      expect(() => assertCanAccessResource(ctx, 'me')).not.toThrow();
    });

    it('throws ForbiddenError for non-owner non-admin', () => {
      const ctx = { userId: 'u2', roles: ['user'] };
      expect(() => assertCanAccessResource(ctx, 'u1')).toThrow(ForbiddenError);
    });
  });
});
