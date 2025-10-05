// apps/mobile/src/lib/ui/primitives/BottomNav.tsx
import { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomNavItem = {
  key: string;
  label: string;
  icon?:
    | ReactNode
    | ((p: { color: string; size: number; focused: boolean }) => ReactNode);
  badge?: number | string | boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  activeTint?: string;
  inactiveTint?: string;
  iconSize?: number;
  elevate?: boolean;
  roundedActive?: boolean;
  style?: StyleProp<ViewStyle>; // style from navigator (absolute bottom, width, etc.)
};

export default function BottomNav({
  items,
  activeKey,
  onChange,
  activeTint = '#6C63FF',
  inactiveTint = '#6B7280',
  iconSize = 24,
  elevate = true,
  roundedActive = true,
  style,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 6);

  return (
    <View
      style={[
        style,
        { alignSelf: 'stretch', width: '100%', backgroundColor: undefined },
      ]}
    >
      <View
        className="bg-white dark:bg-surface-dark border-t border-border dark:border-border-dark"
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: padBottom + 8,
          ...(Platform.OS === 'android' && elevate ? { elevation: 10 } : null),
          ...(Platform.OS !== 'android' && elevate
            ? {
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: -2 },
              }
            : null),
        }}
      >
        {/* fixed-height track centers pills */}
        <View
          style={{
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
          }}
        >
          {items.map((it) => (
            <AnimatedTabItem
              key={it.key}
              item={it}
              active={activeKey === it.key}
              onChange={onChange}
              activeTint={activeTint}
              inactiveTint={inactiveTint}
              iconSize={iconSize}
              roundedActive={roundedActive}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

/* ---------------- Animated Tab Item ---------------- */

function AnimatedTabItem({
  item,
  active,
  onChange,
  activeTint,
  inactiveTint,
  iconSize,
  roundedActive,
}: {
  item: BottomNavItem;
  active: boolean;
  onChange?: (key: string) => void;
  activeTint: string;
  inactiveTint: string;
  iconSize: number;
  roundedActive: boolean;
}) {
  // focus progress (0 -> 1)
  const focusP = useRef(new Animated.Value(active ? 1 : 0)).current;
  // press scale & icon lift
  const pressScale = useRef(new Animated.Value(1)).current;
  const iconLift = useRef(new Animated.Value(0)).current;

  // animate focus changes (route switches)
  useEffect(() => {
    Animated.timing(focusP, {
      toValue: active ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true, // we only drive transforms/opacity with this value
    }).start();
  }, [active, focusP]);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 0.96,
        damping: 12,
        stiffness: 200,
        mass: 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(iconLift, {
        toValue: -3,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };
  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        damping: 12,
        stiffness: 200,
        mass: 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(iconLift, {
        toValue: 0,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // scale the whole pill slightly when focused (nice pop)
  const popScale = focusP.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  // tint overlay opacity (since backgroundColor can't use native driver)
  const tintOpacity = focusP.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  // active vs inactive label color (instant; icons are handled by RN’s renderer)
  const labelColor = active ? activeTint : inactiveTint;

  return (
    <Pressable
      onPress={() => {
        item.onPress?.();
        onChange?.(item.key);
      }}
      onLongPress={item.onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      testID={item.testID}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View
        style={{
          transform: [{ scale: Animated.multiply(pressScale, popScale) }],
          paddingHorizontal: 11,
          paddingVertical: 8,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* tinted background as an animated overlay (opacity-only so it’s native-driver friendly) */}
        {roundedActive ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              backgroundColor: activeTint,
              opacity: tintOpacity,
            }}
          />
        ) : null}

        {/* icon */}
        <Animated.View
          style={{ marginBottom: 4, transform: [{ translateY: iconLift }] }}
        >
          {typeof item.icon === 'function'
            ? item.icon({ color: labelColor, size: iconSize, focused: active })
            : item.icon}
        </Animated.View>

        {/* label */}
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{
            fontSize: 12,
            lineHeight: 14,
            fontWeight: '700',
            color: labelColor,
            includeFontPadding: false as any,
          }}
        >
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
