import React, { useEffect, useRef } from 'react';
import {
  AccessibilityProps,
  Animated,
  Easing,
  Pressable,
  View,
} from 'react-native';

type Size = 'sm' | 'md' | 'lg';

export type SwitchProps = {
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  disabled?: boolean;
  size?: Size;
  trackOnColor?: string;
  trackOffColor?: string;
  knobColor?: string;
  trackBorderColor?: string;
} & AccessibilityProps;

const SIZES: Record<Size, { w: number; h: number; knob: number; pad: number }> =
  {
    sm: { w: 40, h: 20, knob: 14, pad: 3 },
    md: { w: 48, h: 28, knob: 22, pad: 3 },
    lg: { w: 56, h: 32, knob: 26, pad: 3 },
  };

export function Switch({
  value = false,
  onValueChange,
  disabled,
  size = 'sm',
  trackOnColor = '#6C63FF',
  trackOffColor = '#e2e8f0',
  knobColor = '#ffffff',
  trackBorderColor = '#e5e7eb',
  accessibilityLabel,
  ...a11y
}: SwitchProps) {
  const { w, h, knob, pad } = SIZES[size];

  // ⬇️ adjustment for right-side padding
  const padOn = 2;
  const travel = w - knob - pad * 2 - padOn;

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={!!disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
        style={{
          width: w,
          height: h,
          padding: pad,
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: value ? trackOnColor : trackOffColor,
          borderWidth: 1,
          borderColor: trackBorderColor,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            width: knob,
            height: knob,
            borderRadius: knob / 2,
            backgroundColor: knobColor,
            transform: [{ translateX }],
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </View>
    </Pressable>
  );
}

export default Switch;
