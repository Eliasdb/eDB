// apps/mobile/src/lib/ui/primitives/TabItem.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Variant = 'sidebar' | 'top';

export type TabItemProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: Variant;
  iconLeft?: React.ReactNode | string | number;
  badge?: React.ReactNode | string | number;
  disabled?: boolean;
};

function SafeTextOrNode({
  value,
  className,
  style,
}: {
  value?: React.ReactNode | string | number;
  className?: string;
  style?: any;
}) {
  if (value == null) return null;
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Text className={className} style={style}>
        {String(value)}
      </Text>
    );
  }
  return <View>{value}</View>;
}

function Badge({ badge }: { badge?: React.ReactNode | string | number }) {
  if (badge == null) return null;
  return (
    <View className="px-2 py-0.5 rounded-full bg-muted/70 dark:bg-muted-dark/70 border border-border/60 dark:border-border-dark/60">
      <SafeTextOrNode
        value={badge}
        className="text-[12px] font-semibold text-text dark:text-text-dark"
      />
    </View>
  );
}

export default function TabItem({
  label,
  active = false,
  onPress,
  variant = 'top',
  iconLeft,
  badge,
  disabled = false,
}: TabItemProps) {
  if (variant === 'sidebar') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: !!active, disabled: !!disabled }}
        className={`mx-2 my-1 rounded-xl ${active ? 'bg-muted/60 dark:bg-muted-dark/60' : ''} ${disabled ? 'opacity-50' : ''}`}
        style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
      >
        <View className="flex-row items-center">
          <View
            className={`w-[4px] self-stretch ${active ? 'bg-primary' : 'bg-transparent'}`}
          />
          <View className="flex-1 px-3 py-2.5 flex-row items-center">
            {iconLeft ? (
              <View style={{ marginRight: 8 }}>
                <SafeTextOrNode value={iconLeft} className="text-[12px]" />
              </View>
            ) : null}
            <Text
              className={`text-[15px] font-semibold ${
                active
                  ? 'text-text dark:text-text-dark'
                  : 'text-text-dim dark:text-text-dimDark'
              }`}
            >
              {label}
            </Text>
            <View style={{ marginLeft: 'auto' }}>
              <Badge badge={badge} />
            </View>
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
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
      className={`flex-1 items-center py-2 rounded-xl ${active ? 'bg-white dark:bg-surface-dark' : ''} ${disabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
    >
      <View className="flex-row items-center">
        {iconLeft ? (
          <View style={{ marginRight: 8 }}>
            <SafeTextOrNode value={iconLeft} className="text-[12px]" />
          </View>
        ) : null}
        <Text
          className={`text-[14px] font-extrabold ${
            active
              ? 'text-text dark:text-text-dark'
              : 'text-text-dim dark:text-text-dimDark'
          }`}
        >
          {label}
        </Text>
        {badge ? (
          <View style={{ marginLeft: 8 }}>
            <Badge badge={badge} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
