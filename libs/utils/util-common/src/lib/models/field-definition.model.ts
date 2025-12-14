// libs/shared/utils/src/lib/forms/models/field-definition.model.ts
import { ValidatorFn } from '@angular/forms';

export interface FieldDefinition {
  controlName: string;
  label: string;
  placeholder?: string;
  controlType: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select';
  validators?: ValidatorFn | ValidatorFn[];
  errorMessages: { [key: string]: string };
  options?: { label: string; value: unknown }[];
}
