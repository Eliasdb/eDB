import { SettingsGroup } from '../../../models/settings.model';

export const settingsGroups: SettingsGroup[] = [
  {
    id: 'id-and-password',
    header: 'ID and Password',
    headerIcon: 'faKey',
    rows: [
      {
        label: 'E-mail',
        payloadKey: 'email',
        getValue: (profile) => profile?.email || 'yoooo',
      },
      {
        label: 'Password',
        payloadKey: 'password',
        getValue: () => '••••••••••••',
      },
    ],
  },
  {
    id: 'contact-information',
    header: 'Contact Information',
    headerIcon: 'faContactCard',
    rows: [
      {
        label: 'Name',
        payloadKey: 'firstName',
        getValue: (profile) =>
          profile ? `${profile.firstName} ${profile.lastName}` : '',
      },
      {
        label: 'Display name',
        payloadKey: 'displayName',
        getValue: (profile) => profile?.displayName || 'Inactive',
      },
      {
        label: 'Email address',
        payloadKey: 'email',
        getValue: (profile) => profile?.email || '',
      },
      {
        label: 'Phone number',
        payloadKey: 'phoneNumber',
        getValue: (profile) => profile?.phoneNumber || 'Inactive',
      },
      {
        label: 'Country or region of residence',
        payloadKey: 'country',
        getValue: (profile) => profile?.country || '',
      },
      {
        label: 'Preferred language for communication',
        payloadKey: 'preferredLanguage',
        getValue: (profile) => profile?.preferredLanguage || 'Inactive',
      },
    ],
  },
  {
    id: 'company',
    header: 'Company',
    headerIcon: 'faBuilding',
    rows: [
      {
        label: 'Organization information',
        payloadKey: 'company',
        getValue: (profile) => profile?.company || '',
      },
      {
        label: 'Work information',
        payloadKey: 'title',
        getValue: (profile) => profile?.title || 'Inactive',
      },
    ],
  },
  {
    id: 'addresses',
    header: 'Addresses',
    headerIcon: 'faMapMarkerAlt',
    rows: [
      {
        label: 'Address information',
        payloadKey: 'address',
        getValue: (profile) => profile?.address || 'Inactive',
      },
    ],
  },
  {
    id: 'offboarding',
    header: 'Offboarding',
    headerIcon: 'faSignOutAlt',
    rows: [
      {
        label: 'Deactivate Account',
        payloadKey: 'deactivate',
        getValue: () => 'Click to deactivate your account',
      },
    ],
  },
];
