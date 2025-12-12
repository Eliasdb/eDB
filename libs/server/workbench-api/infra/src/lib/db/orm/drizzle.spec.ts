import { describe, expect, it } from 'vitest';
import { db } from './drizzle';

describe('drizzle connection smoke test', () => {
  it('SELECT 1 works', async () => {
    const result = await db.execute('SELECT 1');
    expect(result).toBeTruthy();
  });
});
