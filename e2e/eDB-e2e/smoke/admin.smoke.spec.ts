// import { expect, test } from '../src/fixtures/authenticated';
import { expect, test } from '@playwright/test';

test.describe('@smoke @auth', () => {
  test('/admin renders remote and header flips CTA', async ({ page }) => {
    // warm up auth
    await page.goto('/');
    await expect(page).not.toHaveURL(/openid-connect\/auth/i, {
      timeout: 15000,
    });
    await expect(page.getByRole('navigation').first()).toBeVisible();

    // go to admin through the UI
    await page.getByRole('link', { name: /to admin app/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('link', { name: /to web app/i })).toBeVisible();
  });
});
