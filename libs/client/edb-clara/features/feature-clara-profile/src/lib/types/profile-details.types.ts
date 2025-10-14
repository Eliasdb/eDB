import type { TextInputProps } from 'react-native';

/** Supported field types */
export type FieldType = 'text' | 'textarea';

/** Input or textarea row */
export type FieldDef = {
  key: string;
  type: FieldType;
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
  inputProps?: TextInputProps;
  hint?: string;
};

/** A card is just a titled group of fields */
export type CardDef = {
  key: string;
  title: string;
  bordered?: boolean;
  className?: string;
  fields: FieldDef[];
};
