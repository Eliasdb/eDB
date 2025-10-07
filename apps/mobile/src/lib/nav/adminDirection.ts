// apps/mobile/src/lib/nav/adminDirection.ts
import { create } from 'zustand';

type Tab = 'capabilities' | 'logs';
type Dir = 'forward' | 'backward';

const ORDER: Tab[] = ['capabilities', 'logs'];

const rank = (k: Tab) => ORDER.indexOf(k);
const getDir = (from: Tab, to: Tab): Dir =>
  rank(to) > rank(from) ? 'forward' : 'backward';

type State = { dir: Dir; setNext: (from: Tab, to: Tab) => void };

export const useAdminDir = create<State>((set) => ({
  dir: 'forward',
  setNext: (from, to) => set({ dir: getDir(from, to) }),
}));
