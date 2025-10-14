// data-access/crm/activities/types.ts
export type ActivityType =
  | 'note'
  | 'call'
  | 'email'
  | 'meeting'
  | 'status'
  | 'system';

export type Activity = {
  id: string;
  type: ActivityType;
  at: string; // ISO timestamp
  summary: string;
  companyId?: string | null;
  contactId?: string | null;
};

export type CreateActivityInput = Omit<Activity, 'id'>;
export type UpdateActivityInput = Partial<CreateActivityInput>;
