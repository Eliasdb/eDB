import { expect, test } from '@playwright/test';

test.describe('@smoke @auth', () => {
  test('catalog renders results or an empty state', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).not.toHaveURL(/openid-connect\/auth/i);
    await expect(page.getByRole('main').first()).toBeVisible();

    const cards = page.getByTestId('catalog-card');

    // At least one card shows up
    await expect
      .poll(async () => cards.count(), { message: 'expected ≥ 1 catalog card' })
      .toBeGreaterThan(0);
  });
});
