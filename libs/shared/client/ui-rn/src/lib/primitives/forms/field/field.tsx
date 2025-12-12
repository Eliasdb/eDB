import { ReactNode } from 'react';
import { Text, View } from 'react-native';

export type FieldProps = {
  label: string;
  helpText?: string;
  errorText?: string;
  children: ReactNode;
  className?: string;
};

export function Field({
  label,
  helpText,
  errorText,
  children,
  className,
}: FieldProps) {
  return (
    <View className={['mb-5 gap-1.5', className || ''].join(' ')}>
      <Text className="text-[14px] font-semibold text-text-dim dark:text-text-dimDark">
        {label}
      </Text>

      {children}

      {helpText ? (
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          {helpText}
        </Text>
      ) : null}

      {errorText ? (
        <Text className="text-[12px] text-danger font-medium">{errorText}</Text>
      ) : null}
    </View>
  );
}
