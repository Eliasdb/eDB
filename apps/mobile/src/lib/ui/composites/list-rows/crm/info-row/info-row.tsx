// libs/ui/primitives/info-rows.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Key–Value row: small dim label, big value (used for stats panels). */
export function KeyValueRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value?: string | number | null;
}) {
  return (
    <View className="flex-row items-center gap-10 px-4 py-3">
      <View className="w-5 items-center">
        <Ionicons name={icon} size={16} color="#94A3B8" />
      </View>
      <View className="flex-1">
        <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
          {label}
        </Text>
        <Text className="text-text dark:text-text-dark text-[15px] font-medium">
          {value ?? '—'}
        </Text>
      </View>
    </View>
  );
}

/** Two-line row: primary text + secondary hint (contacts, activities, tasks). */
export function TwoLineRow({
  icon,
  primary,
  secondary,
}: {
  icon?: IconName; // <- optional now
  primary: string | React.ReactNode;
  secondary?: string | React.ReactNode;
}) {
  return (
    <View className="flex-row items-center px-4 py-3">
      {icon ? (
        <View className="w-5 items-center mr-3">
          <Ionicons name={icon} size={16} color="#94A3B8" />
        </View>
      ) : null}

      <View className="flex-1">
        {typeof primary === 'string' ? (
          <Text className="text-text dark:text-text-dark text-[15px] font-medium">
            {primary}
          </Text>
        ) : (
          primary
        )}
        {secondary ? (
          typeof secondary === 'string' ? (
            <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
              {secondary}
            </Text>
          ) : (
            secondary
          )
        ) : null}
      </View>
    </View>
  );
}
