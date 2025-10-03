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

export type SegmentedOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  style?: ViewStyle;
  accentColor?: string;
};

/**
 * Reanimated top-tab segmented control.
 * - Compact tabs
 * - Underline animates by stretching across tabs, then springs to the word width
 * - Word-aligned underline (centered under text)
 * - Dark-mode aware
 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  style,
  accentColor,
}: Props<T>) {
  const isDark = useColorScheme() === 'dark';
  const colors = {
    border: isDark ? '#2A2F3A' : '#E5E7EB',
    idleText: isDark ? '#9AA3B2' : '#6B7280',
    active: accentColor ?? (isDark ? '#8B9DFF' : '#6366F1'),
    hoverBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
  };

  // per-tab layout metrics
  const [metrics, setMetrics] = React.useState<
    Record<string, { x: number; w: number; textW: number }>
  >({});

  // animated left/width of the underline
  const leftSV = useSharedValue(0);
  const widthSV = useSharedValue(0);

  // remember current numeric values
  const curRef = React.useRef({ left: 0, w: 0 });

  // run the stretch → settle animation
  const animateTo = React.useCallback(
    (toLeft: number, toW: number) => {
      const { left: fromLeft, w: fromW } = curRef.current;

      // compute “cover both words” stretch box
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

  // whenever selection or measurements are ready, animate to the target
  React.useEffect(() => {
    const m = metrics[String(value)];
    if (!m) return;

    const toLeft = m.x + (m.w - m.textW) / 2;
    const toW = m.textW;

    // first mount: set directly (no animation)
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
          paddingTop: 2,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          gap: 6,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* tabs */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {options.map((o) => {
          const selected = o.value === value;
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
                  [o.value]: { ...(s[o.value] ?? { textW: 0 }), x, w: width },
                }));
              }}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: pressed ? colors.hoverBg : 'transparent',
                },
              ]}
            >
              <Text
                onLayout={(e) => {
                  const textW = e.nativeEvent.layout.width;
                  setMetrics((s) => ({
                    ...s,
                    [o.value]: { ...(s[o.value] ?? { x: 0, w: 0 }), textW },
                  }));
                }}
                style={{
                  fontSize: 14,
                  fontWeight: selected ? '800' : '700',
                  color: selected ? colors.active : colors.idleText,
                }}
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* underline */}
      <View style={{ height: 6 }}>
        <Reanimated.View
          style={[
            {
              position: 'absolute',
              height: 3,
              borderRadius: 3,
              backgroundColor: colors.active,
            },
            indicatorStyle,
          ]}
        />
      </View>
    </View>
  );
}
