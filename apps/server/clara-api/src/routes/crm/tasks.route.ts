import { makeCrudRouter } from '../_lib/crud-factory';
export default makeCrudRouter({ kind: 'tasks', base: '/tasks' });
