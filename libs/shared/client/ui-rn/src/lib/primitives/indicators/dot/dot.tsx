// apps/mobile/src/lib/ui/primitives/indicators/dot/dot.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, type ViewProps } from 'react-native';

type DotProps = ViewProps & {
  /** Semantic status: picks success/danger color automatically */
  ok?: boolean;
  /** Explicit color, overrides `ok` mapping (hex or rgba) */
  color?: string;
  /** Size in px (diameter). Default: 10 */
  size?: number;

  /** Enable pulsing (new name) */
  pulse?: boolean;
  /** Back-compat: alias for `pulse` */
  on?: boolean;
};

const SUCCESS = '#16a34a';
const DANGER = '#ef4444';
const DEFAULT = '#10B981';

export function Dot({
  ok,
  color,
  size = 10,
  pulse,
  on, // legacy alias
  style,
  ...rest
}: DotProps) {
  const shouldPulse = pulse ?? on ?? false;

  // Resolve color priority: explicit color > ok mapping > default
  const dotColor = color ?? (ok == null ? DEFAULT : ok ? SUCCESS : DANGER);

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (shouldPulse) {
      loop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.6,
              duration: 900,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      loop.start();
    } else {
      // ensure static state when not pulsing
      scale.setValue(1);
      opacity.setValue(1);
    }

    return () => {
      loop?.stop?.();
      scale.setValue(1);
      opacity.setValue(1);
    };
  }, [shouldPulse, scale, opacity]);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...rest}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
          transform: [{ scale }],
          opacity,
        }}
      />
    </View>
  );
}

export default Dot;
