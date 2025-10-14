// libs/ui/primitives/info-rows.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

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

const EmDash = () => (
  <View style={{ height: 16, justifyContent: 'center' }}>
    <View
      style={{
        width: 16,
        height: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(148,163,184,0.55)',
      }}
    />
  </View>
);

/** Compact value under a small label (stacked), with an icon. */
export function FieldRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value?: string | number | null;
}) {
  const has = value != null && value !== '';
  return (
    <View className="flex-row items-start gap-10 px-4 py-3">
      <View className="w-5 items-center pt-0.5">
        <Ionicons name={icon} size={16} color="#94A3B8" />
      </View>

      <View className="flex-1">
        <Text className="text-text-dim dark:text-text-dimDark text-[12px] mb-[2px]">
          {label}
        </Text>
        {has ? (
          <Text className="text-text dark:text-text-dark text-[15px] font-medium">
            {String(value)}
          </Text>
        ) : (
          <EmDash />
        )}
      </View>
    </View>
  );
}

/** Same visual as FieldRow, but clickable and shows a subtle chevron. */
export function LinkFieldRow({
  icon,
  label,
  value,
  href,
}: {
  icon: IconName;
  label: string;
  value?: string | number | null;
  href?: string | null;
}) {
  const body = <FieldRow icon={icon} label={label} value={value} />;

  if (!href) return body;

  return (
    <Pressable
      onPress={() => Linking.openURL(href)}
      accessibilityRole="link"
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={{ borderRadius: 10 }}
    >
      <View className="flex-row items-center">
        <View style={{ flex: 1 }}>{body}</View>
        <View style={{ paddingRight: 14 }}>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </View>
      </View>
    </Pressable>
  );
}
