// apps/mobile/src/lib/ui/navigation/TabBarTop.tsx
import { useCallback, useEffect, useState } from 'react';
import { Pressable, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { TabDef, TabKey } from '../../tab.types';

type Metrics = Record<string, { x: number; w: number; textW: number }>;

export function TabBarTop<K extends TabKey>({
  tabs,
  value,
  onChange,
  idPrefix,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
  idPrefix?: string;
}) {
  const isDark = useColorScheme() === 'dark';
  const c = {
    border: isDark ? '#2A2F3A' : '#E5E7EB',
    idleText: isDark ? '#9AA3B2' : '#6B7280',
    activeText: isDark ? '#C7D2FE' : '#4F46E5',
    idleBg: 'transparent',
    activeBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    indicator: isDark ? '#8B9DFF' : '#6366F1',
    barBg: isDark ? 'rgba(28,32,38,0.7)' : 'rgba(243,244,246,0.7)',
  };

  // measure per-tab
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

  // keep scrollX so chips can still be scrollable
  const MAX_INLINE = 3;
  const hasScroll = tabs.length > MAX_INLINE;
  const twoWide = !hasScroll && tabs.length === 2;

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <View
      collapsable={false}
      style={{
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
        flexShrink: 0,
      }}
    >
      <View
        style={{
          backgroundColor: c.barBg,
          borderRadius: 14,
          padding: 4,
          overflow: 'hidden', // clip chip underlines to the rail
        }}
      >
        {hasScroll ? (
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
            scrollEventThrottle={16}
            onScroll={onScroll}
          >
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {tabs.map((t) => (
                <TopTabItem
                  key={String(t.key)}
                  k={String(t.key)}
                  label={t.label}
                  active={t.key === value}
                  colors={c}
                  onPress={() => onChange(t.key)}
                  onTabLayout={setTabLayout}
                  onTextLayout={setTextWidth}
                  a11yId={idPrefix ? `${idPrefix}${String(t.key)}` : undefined}
                  itemStyle={{ minWidth: 110 }}
                  chipFullWidth={true}
                  textW={m[String(t.key)]?.textW ?? 0}
                />
              ))}
            </View>
          </Animated.ScrollView>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {tabs.map((t) => (
              <TopTabItem
                key={String(t.key)}
                k={String(t.key)}
                label={t.label}
                active={t.key === value}
                colors={c}
                onPress={() => onChange(t.key)}
                onTabLayout={setTabLayout}
                onTextLayout={setTextWidth}
                a11yId={idPrefix ? `${idPrefix}${String(t.key)}` : undefined}
                itemStyle={{ flex: 1 }} // equal columns
                chipFullWidth={twoWide}
                textW={m[String(t.key)]?.textW ?? 0}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function TopTabItem({
  k,
  label,
  active,
  colors,
  onPress,
  onTabLayout,
  onTextLayout,
  a11yId,
  itemStyle,
  chipFullWidth,
  textW,
}: {
  k: string;
  label: string;
  active: boolean;
  colors: {
    idleText: string;
    activeText: string;
    idleBg: string;
    activeBg: string;
  };
  onPress: () => void;
  onTabLayout: (key: string, x: number, w: number) => void;
  onTextLayout: (key: string, textW: number) => void;
  a11yId?: string;
  itemStyle?: any;
  chipFullWidth?: boolean;
  textW: number;
}) {
  // 0→1 active progress
  const prog = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    prog.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, prog]);

  // bg + text color interpolation
  const tabStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      prog.value,
      [0, 1],
      [colors.idleBg, colors.activeBg],
    ),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      prog.value,
      [0, 1],
      [colors.idleText, colors.activeText],
    ),
  }));

  // local underline lives INSIDE the chip → cannot overflow borders
  const underlineW = useSharedValue(0);
  useEffect(() => {
    const target = active ? Math.max(0, textW) : 0;
    // stretch in fast, settle with spring
    underlineW.value = active
      ? withSpring(target, { damping: 18, stiffness: 180, mass: 0.8 })
      : withTiming(0, { duration: 120, easing: Easing.out(Easing.cubic) });
  }, [active, textW, underlineW]);

  const underlineStyle = useAnimatedStyle(() => ({
    width: Math.max(0, Math.round(underlineW.value)),
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
      style={[{ alignItems: 'center', justifyContent: 'center' }, itemStyle]}
    >
      <Animated.View
        style={[
          {
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: chipFullWidth ? '100%' : undefined, // two tabs = full column
          },
          tabStyle,
        ]}
      >
        <Animated.Text
          onLayout={(e) => onTextLayout(k, e.nativeEvent.layout.width)}
          style={[
            { fontSize: 14, fontWeight: '700', textAlign: 'center' },
            textStyle,
          ]}
        >
          {label}
        </Animated.Text>

        {/* Per-chip underline (non-absolute) */}
        <View
          style={{
            height: 6,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={[
              {
                height: 3,
                borderRadius: 3,
                backgroundColor:
                  colors.activeText === '#C7D2FE' ? '#8B9DFF' : '#6366F1',
              },
              underlineStyle,
            ]}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}
