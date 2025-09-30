import React, { useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityProps,
  Animated,
  Easing,
  Pressable,
  View,
} from 'react-native';

const AnimatedKnob = Animated.createAnimatedComponent(View);

type Size = 'sm' | 'md' | 'lg';
type SwitchProps = {
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  disabled?: boolean;
  size?: Size;
  trackOnClassName?: string;
  trackOffClassName?: string;
  knobOnClassName?: string;
  knobOffClassName?: string;
} & AccessibilityProps;

const SIZES: Record<Size, { w: number; h: number; knob: number; pad: number }> =
  {
    sm: { w: 40, h: 20, knob: 18, pad: 3 },
    md: { w: 48, h: 28, knob: 22, pad: 3 },
    lg: { w: 56, h: 32, knob: 26, pad: 3 },
  };

export function Switch({
  value = false,
  onValueChange,
  disabled,
  size = 'sm',
  trackOnClassName = 'bg-primary',
  trackOffClassName = 'bg-control dark:bg-control-dark',
  knobOnClassName = 'bg-white',
  knobOffClassName = 'bg-white',
  accessibilityLabel,
  ...a11y
}: SwitchProps) {
  const { w, h, knob, pad } = SIZES[size];
  const travel = w - knob - pad * 2;

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  const trackCN = useMemo(
    () =>
      [
        'rounded-pill overflow-hidden', // clip knob + keep pill shape
        'border border-border dark:border-border-dark',
        value ? trackOnClassName : trackOffClassName,
        disabled ? 'opacity-50' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [value, disabled, trackOnClassName, trackOffClassName],
  );

  const knobCN = [
    'rounded-full shadow-sm', // add subtle separation
    'border border-black/5', // optional: outline on light bg
    value ? knobOnClassName : knobOffClassName,
  ].join(' ');

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={!!disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      className="active:opacity-90"
      hitSlop={8}
      {...a11y}
    >
      <View
        className={trackCN}
        style={{ width: w, height: h, padding: pad, justifyContent: 'center' }}
      >
        <AnimatedKnob
          className={knobCN}
          style={{ width: knob, height: knob, transform: [{ translateX }] }}
        />
      </View>
    </Pressable>
  );
}

export default Switch;
