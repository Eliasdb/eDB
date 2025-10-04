// apps/mobile/src/lib/ui/navigation/TabBarTop.tsx
import { Pressable, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TabDef, TabKey } from '../../tab.types';

type Metrics = Record<string, { x: number; w: number; textW: number }>;

export function TabBarTop<K extends TabKey>({
  tabs,
  value,
  onChange,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
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

  // layout metrics
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

  // underline shared values
  const leftSV = useSharedValue(0);
  const widthSV = useSharedValue(0);
  const cur = useRef({ left: 0, w: 0 });

  const animateTo = useCallback(
    (toLeft: number, toW: number) => {
      const { left: fromLeft, w: fromW } = cur.current;
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

      cur.current = { left: toLeft, w: toW };
    },
    [leftSV, widthSV],
  );

  useEffect(() => {
    const k = String(value);
    const mm = m[k];
    if (!mm) return;
    const toLeft = mm.x + (mm.w - mm.textW) / 2;
    const toW = mm.textW;

    if (cur.current.w === 0 && cur.current.left === 0) {
      leftSV.value = toLeft;
      widthSV.value = toW;
      cur.current = { left: toLeft, w: toW };
      return;
    }
    animateTo(toLeft, toW);
  }, [value, m, animateTo, leftSV, widthSV]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: leftSV.value,
    width: widthSV.value,
  }));

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
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: c.barBg,
          borderRadius: 14,
          padding: 4,
        }}
      >
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
          />
        ))}
      </View>

      <View style={{ height: 8 }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: 3,
              borderRadius: 3,
              backgroundColor: c.indicator,
            },
            indicatorStyle,
          ]}
        />
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
}) {
  // local animated progress 0→1 (kept in a child component; no hooks inside map)
  const prog = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    prog.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, prog]);

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

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onLayout={(e) => {
        const { x, width } = e.nativeEvent.layout;
        onTabLayout(k, x, width);
      }}
      style={({ pressed }) => [
        {
          flex: 1,
          alignItems: 'center',
          borderRadius: 10,
          paddingVertical: 8,
        },
        pressed ? { opacity: 0.95 } : undefined,
      ]}
    >
      <Animated.View
        style={[{ paddingHorizontal: 10, borderRadius: 10 }, tabStyle]}
      >
        <Animated.Text
          onLayout={(e) => onTextLayout(k, e.nativeEvent.layout.width)}
          style={[{ fontSize: 14, fontWeight: '800' }, textStyle]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
