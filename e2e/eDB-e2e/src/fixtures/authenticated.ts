// e2e/edb-e2e/src/fixtures/authenticated.ts
import { test as base, expect, Page } from '@playwright/test';

async function bootAuthed(page: Page) {
  await page.goto('/');
  // Wait until we are NOT on the Keycloak authorization URL
  await expect(async () => {
    const u = page.url();
    if (/openid-connect\/auth/i.test(u)) throw new Error('still on keycloak');
  }).toPass({ timeout: 15000 });

  await page.waitForLoadState('load');
  await expect(page.getByRole('navigation').first()).toBeVisible();
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await bootAuthed(page);
    await use(page);
  },
});

export { expect };
