// apps/mobile/src/lib/ui/Collapsible.tsx
import React, { useRef, useState } from 'react';
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
  const h = useRef(new Animated.Value(0)).current;
  const o = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(h, {
        toValue: open ? measured : 0,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(o, {
        toValue: open ? 1 : 0,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, measured, duration]);

  const onLayout = (e: LayoutChangeEvent) => {
    const next = e.nativeEvent.layout.height;
    if (next !== measured) setMeasured(next);
  };

  return (
    <Animated.View
      style={[{ height: h, opacity: o, overflow: 'hidden' }, style]}
      {...rest}
    >
      {/* measure once inside */}
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}
