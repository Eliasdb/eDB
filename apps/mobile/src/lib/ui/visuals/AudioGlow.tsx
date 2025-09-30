import { View } from 'react-native';

type Props = {
  level: number; // 0..1 RMS-ish
  speaking: boolean;
  baseRadius?: number; // px, default 140
  color?: string; // base color, default Clara primary
};

export function AudioGlow({
  level,
  speaking,
  baseRadius = 140,
  color = 'rgba(108,99,255,1)',
}: Props) {
  const radius = baseRadius + Math.min(1, level * 2) * 40; // 140..180
  const opacity = 0.15 + level * 0.35; // 0.15..0.5
  const tinted = speaking ? 'rgba(108,99,255,0.65)' : 'rgba(108,99,255,0.50)';

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: tinted ?? color,
        opacity,
        // web-only nice blur (native safely ignores)
        filter: 'blur(60px)',
      }}
    />
  );
}
