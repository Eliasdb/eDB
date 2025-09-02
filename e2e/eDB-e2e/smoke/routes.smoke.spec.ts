import { expect, test } from '@playwright/test';

test.describe('@smoke @auth', () => {
  test('renders /, /catalog, /account via app nav', async ({ page }) => {
    // 1) Boot the app so auth initializes
    await page.goto('/');
    await expect(page).not.toHaveURL(/openid-connect\/auth/i);
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.getByRole('main').first()).toBeVisible();

    // 2) Navigate to /catalog using the UI
    await page.getByRole('link', { name: /catalog/i }).click();
    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.getByRole('main').first()).toBeVisible();

    // 3) Navigate to /account using the UI
    await page.getByRole('link', { name: /account/i }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole('main').first()).toBeVisible();
  });
});
