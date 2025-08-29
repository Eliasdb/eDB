import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'node:path';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

// reuse the same local state file
const stateFile = path.join(__dirname, '.auth', 'state.json');

export default defineConfig({
  // ...nxE2EPreset(__filename, { testDir: './src' }),
  ...nxE2EPreset(__filename, { testDir: './' }),
  use: {
    baseURL,
    navigationTimeout: 15000,
    actionTimeout: 15000,
    trace: 'on-first-retry',
  },
  globalSetup: './global-setup.ts', // ← runs once before tests
  webServer: {
    command: 'npx nx run eDB:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium@auth',
      grep: /@auth/,
      grepInvert: /@anon|@logout/, // <-- exclude logout from normal run
      use: { ...devices['Desktop Chrome'], storageState: './.auth/state.json' },
    },
    {
      name: 'chromium@anon',
      grep: /@anon/,
      grepInvert: /@auth|@logout/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium@logout',
      grep: /@logout/, // only logout tests
      workers: 1, // single worker
      use: { ...devices['Desktop Chrome'], storageState: './.auth/state.json' },
    },

    {
      name: 'chromium@regression',
      grep: /@regression/,
      grepInvert: /@mutates|@anon/,
      use: { ...devices['Desktop Chrome'], storageState: stateFile },
    },

    // Mutating tests: isolated, single worker, serialized.
    {
      name: 'chromium@mutates',
      grep: /@mutates/,
      workers: 1,
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'], storageState: stateFile },
    },
  ],
});
