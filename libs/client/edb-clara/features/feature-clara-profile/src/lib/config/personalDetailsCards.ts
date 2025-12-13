import type { CardDef } from '../types/profile-details.types';

type TFunc = (
  key: string,
  defaultOrOpts?:
    | string
    | {
        defaultValue?: string;
        count?: number;
      },
) => string;

export type MakePersonalDetailsCardsArgs = {
  t: TFunc;
  firstName: string;
  setFirstName: (s: string) => void;
  lastName: string;
  setLastName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  company: string;
  setCompany: (s: string) => void;
  role: string;
  setRole: (s: string) => void;
  notes: string;
  setNotes: (s: string) => void;
};

/** Identity, work, and notes only — no summary card */
export function makePersonalDetailsCards({
  t,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  company,
  setCompany,
  role,
  setRole,
  notes,
  setNotes,
}: MakePersonalDetailsCardsArgs): CardDef[] {
  return [
    {
      key: 'identity',
      title: t('personal.sections.identity'),
      className: 'bg-transparent',
      bordered: false,
      fields: [
        {
          key: 'first',
          type: 'text',
          label: t('personal.fields.firstName'),
          value: firstName,
          onChangeText: setFirstName,
          placeholder: t('personal.placeholders.firstName'),
        },
        {
          key: 'last',
          type: 'text',
          label: t('personal.fields.lastName'),
          value: lastName,
          onChangeText: setLastName,
          placeholder: t('personal.placeholders.lastName'),
        },
        {
          key: 'email',
          type: 'text',
          label: t('personal.fields.email'),
          value: email,
          onChangeText: setEmail,
          placeholder: t('personal.placeholders.email'),
          inputProps: { keyboardType: 'email-address', autoCapitalize: 'none' },
          hint: t('personal.hints.email', 'For security notices only.'),
        },
        {
          key: 'phone',
          type: 'text',
          label: t('personal.fields.phone'),
          value: phone,
          onChangeText: setPhone,
          placeholder: t('personal.placeholders.phone'),
          inputProps: { keyboardType: 'phone-pad' },
          hint: t('personal.hints.phone', 'Optional for verification.'),
        },
      ],
    },
    {
      key: 'work',
      title: t('personal.sections.work'),
      className: 'bg-transparent',
      bordered: false,
      fields: [
        {
          key: 'company',
          type: 'text',
          label: t('personal.fields.company'),
          value: company,
          onChangeText: setCompany,
          placeholder: t('personal.placeholders.company'),
        },
        {
          key: 'role',
          type: 'text',
          label: t('personal.fields.role'),
          value: role,
          onChangeText: setRole,
          placeholder: t('personal.placeholders.role'),
        },
      ],
    },
    {
      key: 'notes',
      title: t('personal.sections.notes'),
      className: 'bg-transparent',
      bordered: false,
      fields: [
        {
          key: 'notes-input',
          type: 'textarea',
          label: t('personal.fields.privateNotes'),
          value: notes,
          onChangeText: setNotes,
          placeholder: t('personal.placeholders.notes'),
        },
      ],
    },
  ];
}

// apps/mobile/src/features/profile/config/constants.ts
export type PersonalDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  notes: string;
};

export const INITIAL_PERSONAL_DETAILS: PersonalDetails = {
  firstName: 'Elias',
  lastName: 'De Bock',
  email: 'elias@example.com',
  phone: '',
  company: 'Clara Labs',
  role: 'Founder',
  notes: '',
};
