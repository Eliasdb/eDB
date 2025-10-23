// explicit, tree-shakeable exports
export { HealthResponseSchema } from './lib/health.contract';
export type { HealthResponse } from './lib/health.contract';

// (optional) also expose a namespace if you like using Health.*
export * as Todos from './lib/todos.contract'; // ⬅️ export the new domain
