// apps/mobile/src/lib/ui/Subheader.tsx
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  Platform,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & {
  /** Large title (center). If you need custom center content, use `center`. */
  title?: string;
  /** Show a default back button if provided. */
  onBack?: () => void;
  /** Right-side content (e.g., Save button). */
  right?: ReactNode;
  /** Add subtle bottom border. Default: true */
  bordered?: boolean;
  /** Slight translucent bg + blur. Default: true */
  translucent?: boolean;
  /** Custom center node instead of plain text title. */
  center?: ReactNode;
  /**
   * Apply top safe-area padding. Default: false.
   * Turn this on ONLY when this header is the very first element under the notch.
   * Leave off if it already sits under another header that handles safe-area.
   */
  respectSafeAreaTop?: boolean;
  /** Fixed toolbar height (content row). Default: 56 */
  height?: number;
  /** Optional outer wrapper style (merged after height). */
  containerStyle?: StyleProp<ViewStyle>;
};

export function SubHeader({
  title,
  onBack,
  right,
  bordered = true,
  translucent = true,
  center,
  respectSafeAreaTop = false,
  height = 56,
  style,
  containerStyle,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const topPad = respectSafeAreaTop ? insets.top : 0;

  // Compose border classes per platform (hairline on native)
  const borderClasses = bordered
    ? Platform.OS === 'web'
      ? 'border-b border-border/70 dark:border-border-dark/70'
      : 'border-b-[0.5px] border-border dark:border-border-dark'
    : '';

  // Compose background + blur
  const bgClasses = translucent
    ? 'bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm'
    : 'bg-surface dark:bg-surface-dark';

  return (
    <View
      style={[{ paddingTop: topPad }, containerStyle]}
      className={[bgClasses, borderClasses].join(' ')}
    >
      <View
        style={[{ height }, style]}
        className="flex-row items-center justify-between px-2"
        {...rest}
      >
        {/* Left: Back */}
        <View className="min-w-11 h-11 items-start justify-center">
          {onBack ? <BackButton onPress={onBack} /> : null}
        </View>

        {/* Center: Title or custom */}
        <View className="flex-1 items-center justify-center px-1">
          {center ?? (
            <Text
              numberOfLines={1}
              className="text-[18px] font-bold text-text dark:text-text-dark"
              // Platform fine-tune (optional)
              style={
                Platform.select({
                  ios: { letterSpacing: 0.2 },
                  android: { letterSpacing: 0.15 },
                  web: undefined,
                }) as any
              }
            >
              {title}
            </Text>
          )}
        </View>

        {/* Right: Actions */}
        <View className="min-w-11 h-11 items-end justify-center">
          {right ?? null}
        </View>
      </View>
    </View>
  );
}

/* ---------- Reusable bits ---------- */

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.8}
      className="h-11 w-11 items-center justify-center rounded-full"
      style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
    >
      <Ionicons name="chevron-back" size={24} color="#6B7280" />
    </TouchableOpacity>
  );
}

export function TextAction({
  label,
  onPress,
  color = '#6C63FF',
}: {
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.85}
      className="h-11 px-2 items-center justify-center"
      style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
    >
      <Text className="text-[16px] font-semibold" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
