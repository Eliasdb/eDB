import { expect, test } from '@playwright/test';

test.describe('@smoke @anon', () => {
  test('unauthenticated users see the login screen', async ({ page }) => {
    await page.goto('/');

    // bounced to Keycloak auth endpoint
    await expect(page).toHaveURL(/openid-connect\/auth/i);

    // Login page basics (robust selectors)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible(); // no level → matches h1
    await expect(page.getByLabel(/username|email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^sign in$/i }),
    ).toBeVisible();
  });
});
