// libs/ui/navigation/segmented.tsx
import { Ionicons } from '@expo/vector-icons';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
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
  iconName?: ComponentProps<typeof Ionicons>['name'];
};

type Props<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  style?: ViewStyle;
  accentColor?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
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

  // --- tokens ---
  const tokens = useMemo(() => {
    const active = accentColor ?? (isDark ? '#8B9DFF' : '#6366F1');
    const idleText = isDark ? '#9AA3B2' : '#6B7280';
    const borderPrimary = isDark ? '#2A2F3A' : '#E5E7EB';
    const borderSecondary = isDark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)';

    const isSecondary = variant === 'secondary';
    const isSm = size === 'sm';

    // native-only offset (lower underline)
    const baseTop = isSm ? -3 : -4;
    const nativeBump = Platform.select({ ios: 5, android: 5, default: 0 }); // +2 vs previous → sits lower

    return {
      active,
      idleText,
      border: isSecondary ? borderSecondary : borderPrimary,
      hoverBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
      padH: isSm ? 6 : 10,
      padV: isSm ? 4 : 6,
      gap: isSm ? 6 : 10,
      underlineH: isSm ? 2 : 3,
      underlineTop: baseTop + (nativeBump ?? 0),
      fontSize: isSm ? 13 : 14,
      fontWeightActive: '600' as const,
      fontWeightIdle: '500' as const,
      iconSize: isSm ? 12 : 14,
      containerPadTop: isSecondary ? 0 : 2,
      containerGap: isSecondary ? (isSm ? 4 : 6) : 6,
      showBottomBorder: true,
      borderOpacity: isSecondary ? 0.7 : 1,
      underlineContainerH: (isSm ? 2 : 3) + (Platform.OS === 'web' ? 6 : 10), // a touch taller on native
    };
  }, [accentColor, isDark, size, variant]);

  // --- layout metrics per tab ---
  const [metrics, setMetrics] = useState<
    Record<string, { x: number; w: number; contentW: number }>
  >({});

  // track total content width to clamp scroll
  const contentW = useMemo(() => {
    let maxRight = 0;
    for (const k in metrics) {
      const m = metrics[k];
      maxRight = Math.max(maxRight, m.x + m.w);
    }
    return maxRight;
  }, [metrics]);

  // viewport width for centering
  const [viewportW, setViewportW] = useState(0);

  // --- underline animation ---
  const leftSV = useSharedValue(0);
  const widthSV = useSharedValue(0);
  const curRef = useRef({ left: 0, w: 0 });

  const animateTo = useCallback(
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

  useEffect(() => {
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

  // --- auto-scroll to selected tab ---
  const scrollRef = useRef<ScrollView>(null);
  const scrollToSelected = useCallback(() => {
    const m = metrics[String(value)];
    if (!m || viewportW === 0 || contentW === 0) return;

    const centerOfTab = m.x + m.w / 2;
    const target = centerOfTab - viewportW / 2;
    const maxX = Math.max(0, contentW - viewportW);
    const clamped = Math.max(0, Math.min(target, maxX));

    scrollRef.current?.scrollTo({ x: clamped, y: 0, animated: true });
  }, [metrics, value, viewportW, contentW]);

  useEffect(() => {
    scrollToSelected();
  }, [value, viewportW, contentW, scrollToSelected]);

  // Keep viewport width up to date
  const onScrollViewLayout = useCallback(
    (e: any) => {
      setViewportW(e.nativeEvent.layout.width);
    },
    [setViewportW],
  );

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
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingRight: 6 }}
        onLayout={onScrollViewLayout}
      >
        <View style={{ flexDirection: 'column' }}>
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
                  style={({ pressed }) => ({
                    paddingHorizontal: tokens.padH,
                    paddingVertical: tokens.padV,
                    borderRadius: 8,
                    backgroundColor: pressed ? tokens.hoverBg : 'transparent',
                  })}
                >
                  <View
                    onLayout={(e) => {
                      const contentW = e.nativeEvent.layout.width;
                      setMetrics((s) => ({
                        ...s,
                        [o.value]: {
                          ...(s[o.value] ?? { x: 0, w: 0 }),
                          contentW,
                        },
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
          <View
            style={{
              height: tokens.underlineContainerH,
              position: 'relative',
            }}
          >
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
      </ScrollView>
    </View>
  );
}

export default Segmented;
