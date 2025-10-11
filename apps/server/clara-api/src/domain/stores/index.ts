// domain/stores/index.ts
import { pgStore } from './pg.store';
import type { IStore } from './types';

export const store: IStore = process.env.STORE === 'pg' ? pgStore : pgStore;
