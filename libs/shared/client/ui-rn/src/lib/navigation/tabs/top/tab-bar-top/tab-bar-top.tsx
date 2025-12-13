// apps/mobile/src/lib/ui/navigation/TabBarTop.tsx
import { useCallback, useEffect, useState } from 'react';
import { Pressable, View, useColorScheme, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { TabDef, TabKey } from '../../tab.types';

type Metrics = Record<string, { x: number; w: number; textW: number }>;

export function TabBarTop({
  tabs,
  value,
  onChange,
  idPrefix,
}: {
  tabs: TabDef[];
  value: TabKey;
  onChange: (k: TabKey) => void;
  idPrefix?: string;
}) {
  const isDark = useColorScheme() === 'dark';

  const c = {
    railBg: isDark ? 'rgba(24,27,33,0.75)' : 'rgba(248,250,252,0.75)',
    railBorder: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)',
    thumbBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    textIdle: isDark ? '#96A0AE' : '#6B7280',
    textActive: isDark ? '#D7DCFF' : '#4F46E5',
    pageBorder: isDark ? '#2A2F3A' : '#E5E7EB',
  };

  // Layout metrics for each tab
  const [m, setM] = useState<Metrics>({});
  const setTabLayout = useCallback(
    (key: string, x: number, w: number) =>
      setM((s) => ({ ...s, [key]: { ...(s[key] ?? { textW: 0 }), x, w } })),
    [],
  );
  const setTextWidth = useCallback(
    (key: string, textW: number) =>
      setM((s) => ({ ...s, [key]: { ...(s[key] ?? { x: 0, w: 0 }), textW } })),
    [],
  );

  const MAX_INLINE = 3;
  const hasScroll = tabs.length > MAX_INLINE;
  const twoWide = !hasScroll && tabs.length === 2;

  // Thumb animation (works for both modes)
  const activeX = useSharedValue(0);
  const activeW = useSharedValue(0);
  useEffect(() => {
    const k = String(value);
    const mm = m[k];
    if (!mm) return;
    activeX.value = withSpring(mm.x, {
      damping: 18,
      stiffness: 220,
      mass: 0.9,
    });
    activeW.value = withSpring(mm.w, {
      damping: 18,
      stiffness: 220,
      mass: 0.9,
    });
  }, [value, m, activeX, activeW]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value }],
    width: Math.max(0, activeW.value),
  }));

  const railPad = 6;
  const railRadius = 14;

  return (
    <View
      collapsable={false}
      style={{
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: c.pageBorder,
        flexShrink: 0,
      }}
    >
      <View
        style={{
          backgroundColor: c.railBg,
          borderRadius: railRadius,
          padding: railPad,
          borderWidth: 1,
          borderColor: c.railBorder,
          overflow: 'hidden',
        }}
      >
        {hasScroll ? (
          // SCROLLABLE segmented control (thumb inside scroll content)
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              paddingHorizontal: 2,
            }}
            scrollEventThrottle={16}
          >
            <View
              style={{ position: 'relative', flexDirection: 'row', gap: 8 }}
            >
              {/* sliding thumb lives inside the scrolled content */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 10,
                    backgroundColor: c.thumbBg,
                  },
                  thumbStyle,
                ]}
              />
              {tabs.map((t) => (
                <ChipTab
                  key={String(t.key)}
                  k={String(t.key)}
                  label={t.label}
                  active={t.key === value}
                  onPress={() => onChange(t.key)}
                  onTabLayout={setTabLayout}
                  onTextLayout={setTextWidth}
                  a11yId={idPrefix ? `${idPrefix}${String(t.key)}` : undefined}
                  itemStyle={{ paddingHorizontal: 6, minWidth: 110 }}
                  fullWidth={false}
                  colors={{ idle: c.textIdle, active: c.textActive }}
                />
              ))}
            </View>
          </Animated.ScrollView>
        ) : (
          // NON-SCROLL: equal columns, same thumb approach
          <View style={{ position: 'relative' }}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  borderRadius: 10,
                  backgroundColor: c.thumbBg,
                },
                thumbStyle,
              ]}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {tabs.map((t) => (
                <ChipTab
                  key={String(t.key)}
                  k={String(t.key)}
                  label={t.label}
                  active={t.key === value}
                  onPress={() => onChange(t.key)}
                  onTabLayout={setTabLayout}
                  onTextLayout={setTextWidth}
                  a11yId={idPrefix ? `${idPrefix}${String(t.key)}` : undefined}
                  itemStyle={{ flex: 1 }}
                  fullWidth={twoWide}
                  colors={{ idle: c.textIdle, active: c.textActive }}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ChipTab({
  k,
  label,
  active,
  onPress,
  onTabLayout,
  onTextLayout,
  a11yId,
  itemStyle,
  fullWidth,
  colors,
}: {
  k: string;
  label: string;
  active: boolean;
  onPress: () => void;
  onTabLayout: (key: string, x: number, w: number) => void;
  onTextLayout: (key: string, textW: number) => void;
  a11yId?: string;
  itemStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  colors: { idle: string; active: string };
}) {
  const prog = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    prog.value = withTiming(active ? 1 : 0, { duration: 160 });
  }, [active, prog]);

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(prog.value, [0, 1], [colors.idle, colors.active]),
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      testID={a11yId}
      accessibilityLabel={a11yId}
      onLayout={(e) => {
        const { x, width } = e.nativeEvent.layout;
        onTabLayout(k, x, width);
      }}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        itemStyle,
      ]}
    >
      <Animated.Text
        onLayout={(e) => onTextLayout(k, e.nativeEvent.layout.width)}
        style={[
          {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            fontSize: 14,
            fontWeight: '700',
            textAlign: 'center',
            width: fullWidth ? '100%' : undefined,
          },
          textStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
