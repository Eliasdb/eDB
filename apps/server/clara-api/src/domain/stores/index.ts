// domain/stores/index.ts
import { store as drizzleStore } from './drizzle.store';
import type { IStore } from './types';

export const store: IStore = drizzleStore;
