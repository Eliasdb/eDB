// e2e/.../regression/webshop.spec.ts
import { expect, test } from '@playwright/test';
import { ensureSubscribed, readCartBadge, resetCart } from './_helpers';

test.describe('@regression @auth', () => {
  test.describe.configure({ mode: 'serial' }); // run this file linearly

  test('dashboard “Launch” opens the Webshop app', async ({ page }) => {
    await ensureSubscribed(page, /webshop/i);

    await page.goto('/');
    await page
      .getByTestId('my-apps-list')
      .getByTestId('my-app-card')
      .filter({ hasText: /webshop/i })
      .getByRole('button', { name: /launch/i })
      .click();

    await expect(page).toHaveURL(/\/webshop(\/|$)/);
    await expect(page.getByTestId('webshop-root')).toBeVisible();
  });

  test('Launch Webshop and open a book details', async ({ page }) => {
    await ensureSubscribed(page, /webshop/i);

    await page.goto('/');
    await page
      .getByTestId('my-apps-list')
      .getByTestId('my-app-card')
      .filter({ hasText: /webshop/i })
      .getByRole('link', { name: /launch/i })
      .click();

    await expect(page).toHaveURL(/\/webshop(\/|$)/);
    await expect(page.getByTestId('webshop-root')).toBeVisible();

    const first = page.getByTestId('book-card').first();
    await expect(first).toBeVisible();
    await first.getByTestId('book-thumb-link').click();

    await expect(page).toHaveURL(/\/webshop\/books\/\d+$/);
    await expect(page.getByTestId('book-details-root')).toBeVisible();
    await expect(page.getByTestId('add-to-cart')).toBeVisible();
  });

  test('add to cart bumps badge (1 distinct item)', async ({ page }) => {
    await ensureSubscribed(page, /webshop/i);
    await resetCart(page); // 👈 local setup for THIS test

    // Launch
    await page.goto('/');
    await page
      .getByTestId('my-apps-list')
      .getByTestId('my-app-card')
      .filter({ hasText: /webshop/i })
      .getByRole('link', { name: /launch/i })
      .click();

    await expect(page).toHaveURL(/\/webshop(\/|$)/);

    // Open first book and add
    await page
      .getByTestId('book-card')
      .first()
      .getByTestId('book-thumb-link')
      .click();
    await expect(page.getByTestId('book-details-root')).toBeVisible();

    // sanity from reset
    expect(await readCartBadge(page)).toBe(0);

    await page.getByTestId('add-to-cart').click();

    await expect
      .poll(() => readCartBadge(page), { message: 'badge should be 1' })
      .toBe(1);
  });

  test('adding two DISTINCT books shows 2 on the badge', async ({ page }) => {
    await ensureSubscribed(page, /webshop/i);
    await resetCart(page); // 👈 local setup again

    // Launch
    await page.goto('/');
    await page
      .getByTestId('my-apps-list')
      .getByTestId('my-app-card')
      .filter({ hasText: /webshop/i })
      .getByRole('link', { name: /launch/i })
      .click();

    await expect(page).toHaveURL(/\/webshop(\/|$)/);

    const addByIndex = async (i: number) => {
      await page.goto('/webshop');
      const card = page.getByTestId('book-card').nth(i);
      await expect(card).toBeVisible();
      await card.getByTestId('book-thumb-link').click();
      await page.getByTestId('add-to-cart').click();
    };

    await addByIndex(0);
    await addByIndex(1);

    await expect
      .poll(() => readCartBadge(page), { message: 'badge should be 2' })
      .toBe(2);
  });
});
