import type { TextInputProps } from 'react-native';

export type FieldDef = {
  key: string;
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder: string;
  inputProps?: TextInputProps;
};

export type CardDef = {
  key: string;
  title: string;
  fields: FieldDef[];
};

type MakeLeftCardsArgs = {
  t: (k: string, opts?: any) => string;
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
};

export function makeLeftCards({
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
}: MakeLeftCardsArgs): CardDef[] {
  return [
    {
      key: 'identity',
      title: t('personal.sections.identity'),
      fields: [
        {
          key: 'first',
          label: t('personal.fields.firstName'),
          value: firstName,
          onChangeText: setFirstName,
          placeholder: t('personal.placeholders.firstName'),
        },
        {
          key: 'last',
          label: t('personal.fields.lastName'),
          value: lastName,
          onChangeText: setLastName,
          placeholder: t('personal.placeholders.lastName'),
        },
        {
          key: 'email',
          label: t('personal.fields.email'),
          value: email,
          onChangeText: setEmail,
          placeholder: t('personal.placeholders.email'),
          inputProps: {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
        },
        {
          key: 'phone',
          label: t('personal.fields.phone'),
          value: phone,
          onChangeText: setPhone,
          placeholder: t('personal.placeholders.phone'),
          inputProps: { keyboardType: 'phone-pad' },
        },
      ],
    },
    {
      key: 'work',
      title: t('personal.sections.work'),
      fields: [
        {
          key: 'company',
          label: t('personal.fields.company'),
          value: company,
          onChangeText: setCompany,
          placeholder: t('personal.placeholders.company'),
        },
        {
          key: 'role',
          label: t('personal.fields.role'),
          value: role,
          onChangeText: setRole,
          placeholder: t('personal.placeholders.role'),
        },
      ],
    },
  ];
}
