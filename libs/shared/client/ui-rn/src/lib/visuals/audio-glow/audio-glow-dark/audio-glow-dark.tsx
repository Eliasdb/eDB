// apps/mobile/src/lib/ui/visuals/AudioGlow.tsx
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Paint,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { Platform, View, type ViewStyle } from 'react-native';
import { useThemePreference } from '../../../providers';

type Props = {
  level: number; // 0..1 RMS-ish
  speaking: boolean;
  baseRadius?: number; // px
  color?: string; // API compat (web fallback only)
};

export function AudioGlowDark({
  level,
  speaking,
  baseRadius = 140,
  color = 'rgba(108,99,255,1)',
}: Props) {
  const { effective } = useThemePreference(); // ← use YOUR provider
  const isLight = effective === 'light';

  // shared dynamics
  const radius = baseRadius + Math.min(1, level * 2) * 40; // 140..180
  const base = '#6C63FF';
  const speakBoost = speaking ? 1.0 : 0.85;

  // tuned per scheme (lighter + longer blur on light so it “adds light”)
  const overallOpacity =
    (isLight ? 0.16 : 0.22) + level * (isLight ? 0.4 : 0.5);

  if (Platform.OS !== 'web') {
    // Native (Skia): additive blending avoids dirty greys on white.
    const blend = 'plus' as const;

    const blurCore = isLight ? 96 : 80;
    const blurHalo = isLight ? 160 : 140;
    const blurSpark = isLight ? 52 : 40;

    const pad = Math.max(blurHalo * 1.4, 140);
    const size = radius * 2 + pad * 2;
    const cx = size / 2;
    const cy = size / 2;

    const haloR = radius * (isLight ? 1.75 : 1.55);
    const coreR = radius * 1.08;
    const sparkR = radius * 0.4;

    // LIGHT: faster falloff + more white in the center
    const haloColors = isLight
      ? [
          rgba(base, 0.32 * speakBoost * overallOpacity),
          rgba(base, 0.12 * speakBoost * overallOpacity),
          rgba(base, 0.04 * speakBoost * overallOpacity),
          rgba(base, 0.0),
        ]
      : [
          rgba(base, 0.45 * speakBoost * overallOpacity),
          rgba(base, 0.22 * speakBoost * overallOpacity),
          rgba(base, 0.08 * speakBoost * overallOpacity),
          rgba(base, 0.0),
        ];
    const haloPos = isLight ? [0.0, 0.42, 0.72, 0.98] : [0.0, 0.55, 0.85, 0.99];

    const coreColors = isLight
      ? [
          rgba('#FFFFFF', 0.35 * overallOpacity), // more white to brighten
          rgba(base, 0.35 * speakBoost * overallOpacity),
          rgba(base, 0.1 * speakBoost * overallOpacity),
          rgba(base, 0.0),
        ]
      : [
          rgba(base, 0.95 * speakBoost * overallOpacity),
          rgba(base, 0.6 * speakBoost * overallOpacity),
          rgba(base, 0.16 * speakBoost * overallOpacity),
          rgba(base, 0.0),
        ];
    const corePos = [0.0, 0.38, 0.74, 0.96];

    const sparkColors = [
      rgba('#FFFFFF', 0.3 * overallOpacity),
      rgba(base, isLight ? 0.12 * overallOpacity : 0.16 * overallOpacity),
      rgba(base, 0.0),
    ];
    const sparkPos = [0.0, 0.6, 0.98];

    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          opacity: 1,
        }}
      >
        <Canvas style={{ width: size, height: size }}>
          {/* Halo */}
          <Group blendMode={blend}>
            {/* Skia blur style accepts string literal; suppress RN style rule */}
            {/* eslint-disable-next-line react/style-prop-object */}
            <BlurMask blur={blurHalo} style="normal" />
            <Circle cx={cx} cy={cy} r={haloR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={haloR}
                  colors={haloColors}
                  positions={haloPos}
                />
              </Paint>
            </Circle>
          </Group>

          {/* Core */}
          <Group blendMode={blend}>
            {/* eslint-disable-next-line react/style-prop-object */}
            <BlurMask blur={blurCore} style="normal" />
            <Circle cx={cx} cy={cy} r={coreR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={coreR}
                  colors={coreColors}
                  positions={corePos}
                />
              </Paint>
            </Circle>
          </Group>

          {/* Spark */}
          <Group blendMode={blend}>
            {/* eslint-disable-next-line react/style-prop-object */}
            <BlurMask blur={blurSpark} style="normal" />
            <Circle cx={cx} cy={cy} r={sparkR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={sparkR}
                  colors={sparkColors}
                  positions={sparkPos}
                />
              </Paint>
            </Circle>
          </Group>
        </Canvas>
      </View>
    );
  }

  // Web fallback (uses CSS blur; try mixBlendMode if you wrap it)
  const tintedWeb = speaking
    ? 'rgba(108,99,255,0.85)'
    : 'rgba(108,99,255,0.70)';

  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: tintedWeb ?? color,
          opacity: overallOpacity,
        },
        Platform.OS === 'web'
          ? ({
              // web-only style (RN web supports filter)
              filter: isLight ? 'blur(110px)' : 'blur(90px)',
            } satisfies ViewStyle)
          : {},
      ]}
    />
  );
}

/* util */
function rgba(hex: string, a: number) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const alpha = Math.max(0, Math.min(1, a));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
