import { UserProfile } from './user.model';

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
