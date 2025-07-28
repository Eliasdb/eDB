import { LucideIcon } from 'lucide-react';

export type OtpCred = {
  id: string;
  userLabel?: string;
  createdDate?: number;
};

// User service
export type UserInfo = {
  email: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  attributes?: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    [key: string]: string | undefined;
  };
};

export type UpdateProfilePayload = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type SessionInfo = {
  id: string;
  ipAddress: string;
  lastAccess: number;
  start: number;
  clients: Record<string, string>;
};

export type Application = {
  clientId: string;
  name: string;
  url: string;
  type: 'Internal' | 'External';
  status: 'In use' | 'Idle';
};

export type NavItem = {
  title?: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};
