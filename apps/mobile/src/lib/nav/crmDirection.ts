import { create } from 'zustand';

export const CRM_ORDER = [
  'dashboard',
  'tasks',
  'contacts',
  'companies',
] as const;
export type CrmKey = (typeof CRM_ORDER)[number];
export type Dir = 'forward' | 'backward';

function rank(k: CrmKey) {
  return CRM_ORDER.indexOf(k);
}

function getDir(from: CrmKey, to: CrmKey): Dir {
  return rank(to) > rank(from) ? 'forward' : 'backward';
}

type State = {
  dir: Dir;
  setNext: (from: CrmKey, to: CrmKey) => void;
};

export const useCrmDir = create<State>((set) => ({
  dir: 'forward',
  setNext: (from, to) => set({ dir: getDir(from, to) }),
}));
