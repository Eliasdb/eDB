import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & {
  title?: string;
  /** Show a default back button if provided */
  onBack?: () => void;
  /** Right side content (e.g., Save button) */
  right?: React.ReactNode;
  /** Add a subtle bottom border (default: true) */
  bordered?: boolean;
  /** Slight translucent bg + blur (default: true) */
  translucent?: boolean;
  /** Custom center content (if you don’t want plain text title) */
  center?: React.ReactNode;
};

export function Subheader({
  title,
  onBack,
  right,
  bordered = true,
  translucent = true,
  center,
  style,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const H = 56;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={[
        translucent
          ? 'bg-surface/95 dark:bg-surface-dark/95'
          : 'bg-surface dark:bg-surface-dark',
        translucent ? 'backdrop-blur-sm' : '',
        bordered
          ? Platform.OS === 'web'
            ? 'border-b border-border/70 dark:border-border-dark/70'
            : 'border-b-[0.5px] border-border dark:border-border-dark'
          : '',
      ].join(' ')}
    >
      <View
        style={[{ height: H }, style]}
        className="flex-row items-center justify-between px-3"
        {...rest}
      >
        <View className="min-w-11 h-11 items-start justify-center">
          {onBack ? <BackButton onPress={onBack} /> : null}
        </View>

        <View className="flex-1 items-center justify-center px-1">
          {center ?? (
            <Text
              className="text-[18px] font-bold text-text dark:text-text-dark"
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        <View className="min-w-11 h-11 items-end justify-center">
          {right ?? null}
        </View>
      </View>
    </View>
  );
}

/* ---------- helper actions you can reuse ---------- */

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-90"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="chevron-back" size={24} color="#6B7280" />
    </TouchableOpacity>
  );
}

export function TextAction({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-11 px-2 items-center justify-center active:opacity-95"
    >
      <Text className="text-[16px] font-semibold text-primary">{label}</Text>
    </TouchableOpacity>
  );
}
