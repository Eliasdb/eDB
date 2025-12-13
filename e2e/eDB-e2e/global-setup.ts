// global-setup.ts
import { chromium } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

export default async function globalSetup() {
  const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';
  const stateFile = path.join(__dirname, '.auth', 'state.json');
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);

  // Only log in if we got bounced to Keycloak
  if (page.url().includes('/openid-connect/auth')) {
    await page.getByLabel(/username|email/i).fill('elias');
    await page.getByLabel(/^password$/i).fill('elias');
    await page.getByRole('button', { name: /^sign in$/i }).click();
  }

  // Wait until we’re back on the app
  await page.waitForURL(
    new RegExp(`^${baseURL.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`),
    { timeout: 15000 },
  );
  await page.waitForLoadState('load');

  await page.context().storageState({ path: stateFile });
  await browser.close();
}
