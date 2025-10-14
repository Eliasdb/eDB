// apps/mobile/src/lib/ui/Skeleton.tsx
import { useColorScheme } from 'nativewind';
import { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type SkeletonProps = {
  width?: number | `${number}%` | 'auto'; // ✅ stricter union
  height?: number | `${number}%` | 'auto';
  radius?: number;
  style?: ViewStyle | ViewStyle[];
  className?: string;
};

export function Skeleton({
  width,
  height,
  radius = 6,
  style,
  className,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colorScheme === 'dark' ? '#2d2f36' : '#e3e6ed',
          opacity,
        },
        style,
      ]}
    />
  );
}
