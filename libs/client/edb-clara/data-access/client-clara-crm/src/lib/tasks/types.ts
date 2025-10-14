// data-access/crm/tasks/types.ts
export type Task = {
  id: string;
  title: string;
  due?: string;
  done?: boolean;
  source?: string;
  companyId?: string | null;
  contactId?: string | null;
};

export type CreateTaskInput = Omit<Task, 'id'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
