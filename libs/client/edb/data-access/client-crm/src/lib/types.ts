export type ContactStatus = 'Lead' | 'Prospect' | 'Customer' | 'Inactive' | 'Archived';

export interface CompanyDto {
  id: string;
  name: string;
  vatNumber?: string;
  website?: string;
}

export interface ContactDto {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;

  companyId: string;
  companyName: string;
  status: ContactStatus;

  createdAt?: string;
  updatedAt?: string;
}
