import { expect, test, type Locator } from '@playwright/test';

async function ensureUnsubscribed(params: {
  isSubscribed: () => Promise<boolean>;
  waitToastGone: () => Promise<void>;
  unsubscribeBtn: Locator;
  toast: Locator;
}) {
  const { isSubscribed, waitToastGone, unsubscribeBtn, toast } = params;
  if (!(await isSubscribed())) return;
  await waitToastGone();
  await unsubscribeBtn.scrollIntoViewIfNeeded();
  await unsubscribeBtn.click();
  await expect(toast).toContainText(/unsubscribed|removed|success/i);
  await expect.poll(isSubscribed).toBe(false);
}

async function subscribeOnce(params: {
  waitToastGone: () => Promise<void>;
  subscribeBtn: Locator;
  toast: Locator;
  isSubscribed: () => Promise<boolean>;
}) {
  const { waitToastGone, subscribeBtn, toast, isSubscribed } = params;
  await waitToastGone();
  await subscribeBtn.scrollIntoViewIfNeeded();
  await subscribeBtn.click();
  await expect(toast).toContainText(/subscribed|success/i);
  await expect.poll(isSubscribed).toBe(true);
}

async function waitToastHidden(toast: Locator) {
  if ((await toast.count()) === 0) return;
  await toast
    .first()
    .waitFor({ state: 'hidden', timeout: 6000 })
    .catch(() => undefined);
}

test.describe('@regression @auth @mutates', () => {
  test('subscribe → dashboard shows app → unsubscribe (idempotent)', async ({
    page,
  }) => {
    await page.goto('/catalog');
    await page.waitForLoadState('load');

    const card = page.getByTestId('catalog-card').first();
    await expect(card).toBeVisible();

    const isSubscribed = async () =>
      (await card.getAttribute('data-subscribed')) === 'true';

    const toast = page.locator('.notification-overlay [role="status"]').first();
    const waitToastGone = () => waitToastHidden(toast);

    const subscribeBtn = card.locator(
      'cds-icon-button[data-testid="subscribe-btn"]',
    );
    const unsubscribeBtn = card.locator(
      'cds-icon-button[data-testid="unsubscribe-btn"]',
    );

    await ensureUnsubscribed({
      isSubscribed,
      waitToastGone,
      unsubscribeBtn,
      toast,
    });

    await subscribeOnce({ waitToastGone, subscribeBtn, toast, isSubscribed });

    await page.getByRole('link', { name: /my edb|home|dashboard/i }).click();
    await expect(page).toHaveURL(/\/($|\?)/);

    const list = page.getByTestId('my-apps-list');
    await expect(list).toBeVisible();
    await expect(list.getByTestId('my-app-card').first()).toBeVisible();

    await page.getByRole('link', { name: /catalog/i }).click();
    await page.waitForLoadState('load');
    await waitToastGone();
    await unsubscribeBtn.scrollIntoViewIfNeeded();
    await unsubscribeBtn.click();
    await expect(toast).toContainText(/unsubscribed|success/i);
    await expect.poll(isSubscribed).toBe(false);
  });
});
