// apps/mobile/src/features/profile/components/ProfileFieldRenderer.tsx
import { Field, Input } from '@ui/primitives';
import { Text } from 'react-native';
import type { FieldDef } from '../../types/profile-details.types';

export function ProfileFieldRenderer({ field }: { field: FieldDef }) {
  const isTextarea = field.type === 'textarea';

  return (
    <Field key={field.key} label={field.label}>
      <Input
        value={field.value}
        onChangeText={field.onChangeText}
        placeholder={field.placeholder}
        multiline={isTextarea}
        className={isTextarea ? 'h-[220px] text-top' : undefined}
        {...field.inputProps}
      />
      {field.hint ? (
        <Text className="mt-1 text-[11px] text-text-dim dark:text-text-dimDark">
          {field.hint}
        </Text>
      ) : null}
    </Field>
  );
}
