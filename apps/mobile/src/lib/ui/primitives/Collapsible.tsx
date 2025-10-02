// apps/mobile/src/lib/ui/Collapsible.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  View,
  ViewProps,
} from 'react-native';

export function Collapsible({
  open,
  duration = 180,
  children,
  style,
  ...rest
}: ViewProps & { open: boolean; duration?: number }) {
  const [measured, setMeasured] = useState(0);

  // Single progress value 0 → 1
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration,
      easing: Easing.out(Easing.quad),
      // IMPORTANT: height can't be native-driven, so keep this false
      useNativeDriver: false,
    }).start();
  }, [open, measured, duration]);

  // Map progress to height & opacity
  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, measured || 0],
  });
  const opacity = progress; // fades in/out with the same timing

  const onLayout = (e: LayoutChangeEvent) => {
    const next = e.nativeEvent.layout.height;
    if (next !== measured) setMeasured(next);
  };

  return (
    <Animated.View
      style={[{ height, opacity, overflow: 'hidden' }, style]}
      {...rest}
    >
      {/* Measure actual content height once */}
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}
