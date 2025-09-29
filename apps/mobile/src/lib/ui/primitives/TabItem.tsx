import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Variant = 'sidebar' | 'top';

export type TabItemProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: Variant;
  iconLeft?: React.ReactNode;
  badge?: React.ReactNode; // e.g. <Text className="...">3</Text>
  disabled?: boolean;
};

export default function TabItem({
  label,
  active,
  onPress,
  variant = 'top',
  iconLeft,
  badge,
  disabled,
}: TabItemProps) {
  if (variant === 'sidebar') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`mx-2 my-1 rounded-xl overflow-hidden ${active ? 'bg-muted dark:bg-muted-dark' : ''}`}
        style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
        accessibilityRole="tab"
        accessibilityState={{ selected: !!active, disabled: !!disabled }}
      >
        <View className="flex-row items-center">
          <View
            className={`w-1 self-stretch ${active ? 'bg-primary' : 'bg-transparent'}`}
          />
          <View className="flex-1 px-3 py-2.5 flex-row items-center gap-2">
            {iconLeft}
            <Text
              className={`text-[15px] font-semibold ${
                active
                  ? 'text-text dark:text-text-dark'
                  : 'text-text-dim dark:text-text-dimDark'
              }`}
            >
              {label}
            </Text>
            {badge ? <View className="ml-auto">{badge}</View> : null}
          </View>
        </View>
      </Pressable>
    );
  }

  // variant === 'top'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 items-center py-2 rounded-lg ${active ? 'bg-white dark:bg-surface-dark shadow-card' : ''}`}
      style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
    >
      <View className="flex-row items-center gap-2">
        {iconLeft}
        <Text
          className={`text-[14px] font-semibold ${
            active
              ? 'text-text dark:text-text-dark'
              : 'text-text-dim dark:text-text-dimDark'
          }`}
        >
          {label}
        </Text>
        {badge}
      </View>
    </Pressable>
  );
}
