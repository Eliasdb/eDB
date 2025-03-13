export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  company: string;
  phoneNumber?: string;
  displayName: string;
  preferredLanguage: string;
  title: string;
  role: string; // e.g., 'user', 'admin'
  address: string;
}
export interface SettingsRow {
  label: string;
  payloadKey: string;
  getValue: (profile?: UserProfile) => string;
}

export interface SettingsGroup {
  id: string;
  header: string;
  headerIcon: string;
  rows: SettingsRow[];
}
