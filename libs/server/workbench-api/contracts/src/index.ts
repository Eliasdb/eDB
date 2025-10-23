// expose the namespace (values/schemas)…
export * as Todos from './lib/todos.contract';

// …and ALSO re-export the types so you can import them directly
export type {
  TodoT,
  CreateTodoInputT,
  UpdateTodoInputT,
  GetTodoParamsT,
  DeleteTodoParams,   // if you need it
  ListTodosQueryT,
} from './lib/todos.contract';
