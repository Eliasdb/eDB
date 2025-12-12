import { create } from 'zustand';

export const ADMIN_ORDER = ['capabilities', 'logs'] as const;
export type AdminTab = (typeof ADMIN_ORDER)[number];
export type Dir = 'forward' | 'backward';

const rank = (k: AdminTab) => ADMIN_ORDER.indexOf(k);
const getDir = (from: AdminTab, to: AdminTab): Dir =>
  rank(to) > rank(from) ? 'forward' : 'backward';

type State = { dir: Dir; setNext: (from: AdminTab, to: AdminTab) => void };

export const useAdminDir = create<State>((set) => ({
  dir: 'forward',
  setNext: (from, to) => set({ dir: getDir(from, to) }),
}));
