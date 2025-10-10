// libs/ui/navigation/segmented.tsx (or wherever you keep it)
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, Text, useColorScheme, View, ViewStyle } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
};

type Props<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  style?: ViewStyle;
  accentColor?: string;
  /** visual hierarchy: default "primary"; use "secondary" for the lower-level control */
  variant?: 'primary' | 'secondary';
  /** compact size for the secondary look */
  size?: 'md' | 'sm';
};

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  style,
  accentColor,
  variant = 'primary',
  size = 'md',
}: Props<T>) {
  const isDark = useColorScheme() === 'dark';

  // design tokens that shift with variant/size
  const tokens = React.useMemo(() => {
    const active = accentColor ?? (isDark ? '#8B9DFF' : '#6366F1');
    const idleText = isDark ? '#9AA3B2' : '#6B7280';
    const borderPrimary = isDark ? '#2A2F3A' : '#E5E7EB';
    const borderSecondary = isDark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)';

    const isSecondary = variant === 'secondary';
    const isSm = size === 'sm';

    return {
      active,
      idleText,
      border: isSecondary ? borderSecondary : borderPrimary,
      hoverBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
      padH: isSm ? 6 : 10,
      padV: isSm ? 4 : 6,
      gap: isSm ? 6 : 10,
      underlineH: isSm ? 2 : 3,
      underlineTop: isSm ? -3 : -4,
      fontSize: isSm ? 13 : 14,
      fontWeightActive: isSm ? ('600' as const) : ('600' as const),
      fontWeightIdle: isSm ? ('500' as const) : ('500' as const),
      iconSize: isSm ? 12 : 14,
      // reduce overall top padding & border emphasis for secondary
      containerPadTop: isSecondary ? 0 : 2,
      containerGap: isSecondary ? (isSm ? 4 : 6) : 6,
      showBottomBorder: true, // keep underline baseline
      borderOpacity: isSecondary ? 0.7 : 1,
    };
  }, [accentColor, isDark, size, variant]);

  // layout metrics per tab
  const [metrics, setMetrics] = React.useState<
    Record<string, { x: number; w: number; contentW: number }>
  >({});

  // animated underline
  const leftSV = useSharedValue(0);
  const widthSV = useSharedValue(0);
  const curRef = React.useRef({ left: 0, w: 0 });

  const animateTo = React.useCallback(
    (toLeft: number, toW: number) => {
      const { left: fromLeft, w: fromW } = curRef.current;
      const stretchLeft = Math.min(fromLeft, toLeft);
      const stretchRight = Math.max(fromLeft + fromW, toLeft + toW);
      const stretchW = stretchRight - stretchLeft;

      leftSV.value = withSequence(
        withTiming(stretchLeft, {
          duration: 140,
          easing: Easing.out(Easing.cubic),
        }),
        withSpring(toLeft, { damping: 18, stiffness: 180, mass: 0.8 }),
      );
      widthSV.value = withSequence(
        withTiming(stretchW, {
          duration: 140,
          easing: Easing.out(Easing.cubic),
        }),
        withSpring(toW, { damping: 18, stiffness: 180, mass: 0.8 }),
      );
      curRef.current = { left: toLeft, w: toW };
    },
    [leftSV, widthSV],
  );

  React.useEffect(() => {
    const m = metrics[String(value)];
    if (!m) return;
    const toLeft = m.x + (m.w - m.contentW) / 2;
    const toW = m.contentW;

    if (curRef.current.w === 0 && curRef.current.left === 0) {
      leftSV.value = toLeft;
      widthSV.value = toW;
      curRef.current = { left: toLeft, w: toW };
      return;
    }
    animateTo(toLeft, toW);
  }, [value, metrics, animateTo, leftSV, widthSV]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: leftSV.value,
    width: widthSV.value,
  }));

  return (
    <View
      style={[
        {
          alignSelf: 'stretch',
          paddingHorizontal: 6,
          paddingTop: tokens.containerPadTop,
          borderBottomWidth: tokens.showBottomBorder ? 1 : 0,
          borderBottomColor: tokens.border,
          gap: tokens.containerGap,
          opacity: tokens.borderOpacity,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* tabs */}
      <View style={{ flexDirection: 'row', gap: tokens.gap }}>
        {options.map((o) => {
          const selected = o.value === value;
          const tint = selected ? tokens.active : tokens.idleText;

          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                setMetrics((s) => ({
                  ...s,
                  [o.value]: {
                    ...(s[o.value] ?? { contentW: 0 }),
                    x,
                    w: width,
                  },
                }));
              }}
              style={({ pressed }) => [
                {
                  paddingHorizontal: tokens.padH,
                  paddingVertical: tokens.padV,
                  borderRadius: 8,
                  backgroundColor: pressed ? tokens.hoverBg : 'transparent',
                },
              ]}
            >
              <View
                onLayout={(e) => {
                  const contentW = e.nativeEvent.layout.width;
                  setMetrics((s) => ({
                    ...s,
                    [o.value]: { ...(s[o.value] ?? { x: 0, w: 0 }), contentW },
                  }));
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: o.iconName ? 6 : 0,
                }}
              >
                {o.iconName ? (
                  <Ionicons
                    name={o.iconName}
                    size={tokens.iconSize}
                    color={tint}
                  />
                ) : null}
                <Text
                  style={{
                    fontSize: tokens.fontSize,
                    fontWeight: selected
                      ? tokens.fontWeightActive
                      : tokens.fontWeightIdle,
                    color: tint,
                  }}
                >
                  {o.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* underline */}
      <View style={{ height: tokens.underlineH + 4 }}>
        <Reanimated.View
          style={[
            {
              position: 'absolute',
              top: tokens.underlineTop,
              height: tokens.underlineH,
              borderRadius: tokens.underlineH,
              backgroundColor: tokens.active,
            },
            indicatorStyle,
          ]}
        />
      </View>
    </View>
  );
}
