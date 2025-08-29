import { expect, test } from '@playwright/test';

test.describe('@smoke @auth @logout', () => {
  test('logout redirects to Keycloak', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/openid-connect\/auth/i);

    // Open the overflow menu (grid icon in header).
    // If you can, add data-testid="overflow-menu" to that button and
    // replace the locator with: page.getByTestId('overflow-menu')
    const overflowBtn = page
      .getByRole('button', { name: /overflow|menu|apps|more|grid/i })
      .first();
    await expect(overflowBtn).toBeVisible();
    await overflowBtn.click();

    // Click "Logout" from the menu
    const logoutItem = page
      .getByRole('menuitem', { name: /^logout$/i })
      .first();
    await expect(logoutItem).toBeVisible();

    await Promise.all([
      page.waitForURL(/openid-connect\/auth/i, { timeout: 10_000 }),
      logoutItem.click(),
    ]);
  });
});
