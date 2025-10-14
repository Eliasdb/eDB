import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text } from 'react-native';

export type BottomNavItemModel = {
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

export type BottomNavItemProps = {
  item: BottomNavItemModel;
  active: boolean;
  onChange?: (key: string) => void;
  activeTint: string;
  inactiveTint: string;
  iconSize: number;
  roundedActive: boolean;
};

export function BottomNavItem({
  item,
  active,
  onChange,
  activeTint,
  inactiveTint,
  iconSize,
  roundedActive,
}: BottomNavItemProps) {
  const focusP = useRef(new Animated.Value(active ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const iconLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusP, {
      toValue: active ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [active, focusP]);

  const onPressIn = () =>
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

  const onPressOut = () =>
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

  const popScale = focusP.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const tintOpacity = focusP.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });
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

        <Animated.View
          style={{ marginBottom: 4, transform: [{ translateY: iconLift }] }}
        >
          {typeof item.icon === 'function'
            ? item.icon({ color: labelColor, size: iconSize, focused: active })
            : item.icon}
        </Animated.View>

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
