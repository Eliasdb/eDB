// vitest.config.mts
import { defineVitestConfig } from '@analogjs/vitest-angular';
export default defineVitestConfig({
  test: { environment: 'jsdom', globals: true },
});
