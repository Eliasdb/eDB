// libs/shared/utils/src/lib/forms/models/field-definition.model.ts
export interface FieldDefinition {
  controlName: string;
  label: string;
  placeholder?: string;
  controlType: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select';
  validators: any[];
  errorMessages: { [key: string]: string };
  options?: { label: string; value: any }[]; // For select fields
}
