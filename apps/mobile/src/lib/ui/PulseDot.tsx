// apps/mobile/src/app/components/PulseDot.tsx
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

type Props = {
  on?: boolean;
  size?: number;
  color?: string; // pass tokens like your success hex, e.g. '#10B981'
};

export default function PulseDot({
  on = false,
  size = 10,
  color = '#10B981',
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (on) {
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
    }
    return () => {
      loop?.stop?.();
      scale.setValue(1);
      opacity.setValue(1);
    };
  }, [on, opacity, scale]);

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Animated.View
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale }],
          opacity,
        }}
      />
    </View>
  );
}
