// e2e/.../regression/_helpers.ts
import { expect, Page } from '@playwright/test';

export async function ensureSubscribed(page: Page, appName: RegExp) {
  await page.goto('/catalog');
  await page.waitForLoadState('load');

  const toast = page.locator('.notification-overlay [role="status"]').first();
  const card = page.getByTestId('catalog-card').filter({ hasText: appName });
  const isSubscribed = async () =>
    (await card.getAttribute('data-subscribed')) === 'true';

  if (!(await isSubscribed())) {
    await card.locator('cds-icon-button[data-testid="subscribe-btn"]').click();
    await expect(toast).toContainText(/subscribed|success/i);
    await expect.poll(isSubscribed).toBe(true);
  }
}

export async function resetCart(page: Page) {
  await page.goto('/webshop');
  const cartButton = page.getByTestId('cart-button');
  const cartBadge = page.getByTestId('cart-badge');

  // open cart
  await cartButton.click();

  // cart drawer/root (add a test id if you can: data-testid="cart-drawer")
  const drawer = page
    .getByTestId('cart-drawer')
    .or(page.getByRole('dialog').filter({ hasText: /cart/i }))
    .or(page.locator('[data-cart], [class*="cart"]').first());

  // click all "remove" buttons
  const removeBtn = drawer
    .getByTestId('remove-line')
    .or(drawer.getByRole('button', { name: /remove|delete|trash/i }));

  let remaining = await removeBtn.count();
  while (remaining) {
    await removeBtn.first().click();
    await expect
      .poll(async () => removeBtn.count(), { message: 'removing line item' })
      .toBeLessThan(remaining);
    remaining = await removeBtn.count();
  }

  // close drawer if you have a close button
  const close = drawer.getByRole('button', { name: /close/i }).first();
  if (await close.count()) await close.click().catch(() => undefined);

  // badge should be 0 (badge may disappear entirely)
  await expect
    .poll(
      async () => {
        if ((await cartBadge.count()) === 0) return 0;
        const txt = (await cartBadge.first().textContent())?.trim() ?? '0';
        const n = parseInt(txt.replace(/\D+/g, ''), 10);
        return Number.isFinite(n) ? n : 0;
      },
      { message: 'cart should be empty' },
    )
    .toBe(0);
}

export async function readCartBadge(page: Page): Promise<number> {
  const cartBadge = page.getByTestId('cart-badge');
  if ((await cartBadge.count()) === 0) return 0;
  const txt = (await cartBadge.first().textContent())?.trim() ?? '0';
  const n = parseInt(txt.replace(/\D+/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}
