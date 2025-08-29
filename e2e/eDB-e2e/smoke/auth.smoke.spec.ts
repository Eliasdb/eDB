import { expect, test } from '@playwright/test';

test.describe('@smoke @auth', () => {
  test('logged-in users see the app shell', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/openid-connect\/auth/i);
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /to admin app/i }),
    ).toBeVisible();
  });
});
