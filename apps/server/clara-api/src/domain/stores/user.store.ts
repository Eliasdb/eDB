// apps/server/clara-api/src/domain/user.store.ts
import { User } from '../types/user.types';

const mem = new Map<string, User>();
const uid = () =>
  `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const userStore = {
  list(): User[] {
    return [...mem.values()];
  },
  get(id: string) {
    return mem.get(id);
  },
  add(input: User): User {
    const id = input.id ?? uid();
    const user = { ...input, id };
    mem.set(id, user);
    return user;
  },
  update(id: string, patch: Partial<User>): User | undefined {
    const cur = mem.get(id);
    if (!cur) return;
    const next = { ...cur, ...patch, id };
    mem.set(id, next);
    return next;
  },
  remove(id: string) {
    return mem.delete(id);
  },
  clear() {
    mem.clear();
  },
};
