/* Shared domain types */

export type ContactStatus = 'Lead' | 'Customer' | 'Archived';

export interface ActivityItem {
  date: string;
  title: string;
  text?: string;
}

export interface Contact {
  /* core */
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: ContactStatus;

  /* extras the sidebar needs */
  tags?: string[];
  activity?: ActivityItem[];
}
