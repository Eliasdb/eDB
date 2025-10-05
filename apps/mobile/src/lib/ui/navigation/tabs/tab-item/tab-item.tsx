import { ReactNode, useEffect } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Variant = 'sidebar' | 'top';

export type TabItemProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: Variant;
  iconLeft?: ReactNode | string | number;
  badge?: ReactNode | string | number;
  disabled?: boolean;
  idPrefix?: string; // 👈 ADD
};

function SafeTextOrNode({
  value,
  style,
}: {
  value?: ReactNode | string | number;
  style?: any;
}) {
  if (value == null) return null;
  if (typeof value === 'string' || typeof value === 'number') {
    return <Text style={style}>{String(value)}</Text>;
  }
  return <View>{value}</View>;
}

function Badge({
  badge,
  isDark,
}: {
  badge?: ReactNode | string | number;
  isDark: boolean;
}) {
  if (badge == null) return null;
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        borderColor: isDark
          ? 'rgba(148,163,184,0.35)'
          : 'rgba(148,163,184,0.35)',
      }}
    >
      <SafeTextOrNode
        value={badge}
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: isDark ? '#E5E7EB' : '#111827',
        }}
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
  idPrefix, // 👈 ADD
}: TabItemProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = {
    textIdle: isDark ? '#9AA3B2' : '#6B7280',
    textActive: isDark ? '#E5E7EB' : '#111827',
    bgIdle: 'transparent',
    bgActive: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
    sideStripe: isDark ? '#6366F1' : '#6366F1',
  };

  const prog = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    prog.value = withTiming(active ? 1 : 0, { duration: 160 });
  }, [active, prog]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      prog.value,
      [0, 1],
      [colors.bgIdle, colors.bgActive],
    ),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      prog.value,
      [0, 1],
      [colors.textIdle, colors.textActive],
    ),
  }));

  if (variant === 'sidebar') {
    return (
      <Pressable
        onPress={onPress}
        testID={idPrefix}
        accessibilityLabel={idPrefix}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: !!active, disabled: !!disabled }}
        style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8,
            marginVertical: 4,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: 4,
              alignSelf: 'stretch',
              backgroundColor: active ? colors.sideStripe : 'transparent',
            }}
          />
          <Animated.View
            style={[
              {
                flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
              },
              containerStyle,
            ]}
          >
            {iconLeft ? (
              <View style={{ marginRight: 8 }}>
                <SafeTextOrNode value={iconLeft} />
              </View>
            ) : null}
            <Animated.Text
              style={[{ fontSize: 15, fontWeight: '700' }, textStyle]}
            >
              {label}
            </Animated.Text>
            {badge ? (
              <View style={{ marginLeft: 'auto' }}>
                <Badge badge={badge} isDark={isDark} />
              </View>
            ) : null}
          </Animated.View>
        </View>
      </Pressable>
    );
  }

  // top variant
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
      style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
      testID={idPrefix}
      accessibilityLabel={idPrefix}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
            flexDirection: 'row',
          },
          containerStyle,
        ]}
      >
        {iconLeft ? (
          <View style={{ marginRight: 8 }}>
            <SafeTextOrNode value={iconLeft} />
          </View>
        ) : null}
        <Animated.Text style={[{ fontSize: 14, fontWeight: '800' }, textStyle]}>
          {label}
        </Animated.Text>
        {badge ? (
          <View style={{ marginLeft: 8 }}>
            <Badge badge={badge} isDark={isDark} />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
