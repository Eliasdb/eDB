import '@analogjs/vitest-angular/setup-zone';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { vi } from 'vitest';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

vi.mock('flatpickr/dist/plugins/rangePlugin', () => ({
  rangePlugin: vi.fn(),
}));

vi.mock('flatpickr', () => ({
  __esModule: true,
  default: vi.fn(),
}));
