import { expect, test } from '@playwright/test';

test.describe('@regression @auth @mutates', () => {
  test('subscribe → dashboard shows app → unsubscribe (idempotent)', async ({
    page,
  }) => {
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');

    const card = page.getByTestId('catalog-card').first();
    await expect(card).toBeVisible();

    // card exposes data-subscribed="true|false"
    const isSubscribed = async () =>
      (await card.getAttribute('data-subscribed')) === 'true';

    // Carbon toasts live here (success/error)
    const toast = page.locator('.notification-overlay [role="status"]').first();
    const waitToastGone = async () => {
      if ((await toast.count()) > 0) {
        await toast
          .first()
          .waitFor({ state: 'hidden', timeout: 6000 })
          .catch(() => {});
      }
    };

    // target the OUTER cds-icon-button only (single element)
    const subscribeBtn = card.locator(
      'cds-icon-button[data-testid="subscribe-btn"]',
    );
    const unsubscribeBtn = card.locator(
      'cds-icon-button[data-testid="unsubscribe-btn"]',
    );

    // Normalize to UNsubscribed
    if (await isSubscribed()) {
      await waitToastGone();
      await unsubscribeBtn.scrollIntoViewIfNeeded();
      await unsubscribeBtn.click();
      await expect(toast).toContainText(/unsubscribed|removed|success/i);
      await expect.poll(isSubscribed).toBe(false);
    }

    // Subscribe
    await waitToastGone();
    await subscribeBtn.scrollIntoViewIfNeeded();
    await subscribeBtn.click();
    await expect(toast).toContainText(/subscribed|success/i);
    await expect.poll(isSubscribed).toBe(true);

    // Dashboard shows the app
    await page.getByRole('link', { name: /my edb|home|dashboard/i }).click();
    await expect(page).toHaveURL(/\/($|\?)/);

    // Prefer stable test ids in your dashboard list (add them if you haven’t)
    const list = page.getByTestId('my-apps-list');
    await expect(list).toBeVisible();
    await expect(list.getByTestId('my-app-card').first()).toBeVisible();

    // Cleanup (so the test is idempotent)
    await page.getByRole('link', { name: /catalog/i }).click();
    await page.waitForLoadState('networkidle');
    await waitToastGone();
    await unsubscribeBtn.scrollIntoViewIfNeeded();
    await unsubscribeBtn.click();
    await expect(toast).toContainText(/unsubscribed|success/i);
    await expect.poll(isSubscribed).toBe(false);
  });
});
