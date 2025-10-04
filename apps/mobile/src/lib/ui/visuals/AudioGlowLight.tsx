// apps/mobile/src/lib/ui/visuals/AudioGlowLight.tsx
import {
  Canvas,
  Circle,
  Group,
  Paint,
  RadialGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { Platform, View } from 'react-native';

type Props = {
  level: number; // 0..1 RMS-ish
  speaking: boolean;
  baseRadius?: number; // px
  color?: string; // brand tint (default Clara purple)
  style?: any; // optional wrapper positioning
};

export default function AudioGlowLight({
  level,
  speaking,
  baseRadius = 140,
  color = '#6C63FF',
  style,
}: Props) {
  // motion / sizing
  const radius = baseRadius + Math.min(1, level * 2) * 40; // 140..180
  const overall = 0.16 + level * 0.36; // tuned for white bg
  const speakBoost = speaking ? 1.0 : 0.8;

  // generous canvas so edges fade naturally
  const pad = radius * 1.3;
  const size = radius * 2 + pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  // radii
  const haloR = radius * 2.0; // wide white bloom
  const ringR = radius * 1.55; // subtle tinted ring
  const coreR = radius * 1.12; // hot core
  const sparkR = radius * 0.42; // center pop

  if (Platform.OS !== 'web') {
    return (
      <View
        pointerEvents="none"
        style={[{ position: 'absolute', width: size, height: size }, style]}
      >
        <Canvas
          style={{ width: size, height: size, backgroundColor: 'transparent' }}
        >
          {/* tiny white guard so gradients never sample black */}
          <Rect
            x={0}
            y={0}
            width={size}
            height={size}
            color="rgba(255,255,255,0.1)"
          />

          {/* Outer halo (white) */}
          <Group blendMode="screen">
            <Circle cx={cx} cy={cy} r={haloR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={haloR}
                  colors={[
                    `rgba(255,255,255,${(0.99 * overall).toFixed(3)})`,
                    `rgba(255,255,255,${(0.99 * overall).toFixed(3)})`,
                    'rgba(255,255,255,0.1)',
                  ]}
                  positions={[0.0, 0.74, 0.98]}
                />
              </Paint>
            </Circle>
          </Group>

          {/* Brand tint ring (very soft so it shows on white) */}
          <Group blendMode="screen">
            <Circle cx={cx} cy={cy} r={ringR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={ringR}
                  colors={[
                    hexA(color, 0.96 * overall * speakBoost),
                    hexA(color, 0.94 * overall),
                    'rgba(0,0,0,0)',
                  ]}
                  positions={[0.0, 0.66, 0.98]}
                />
              </Paint>
            </Circle>
          </Group>

          {/* Core (white) */}
          <Group blendMode="screen">
            <Circle cx={cx} cy={cy} r={coreR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={coreR}
                  colors={[
                    `rgba(255,255,255,${(0.998 * overall).toFixed(3)})`,
                    `rgba(255,255,255,${(0.2 * overall).toFixed(3)})`,
                    'rgba(255,255,255,0)',
                  ]}
                  positions={[0.0, 0.62, 0.96]}
                />
              </Paint>
            </Circle>
          </Group>

          {/* Spark highlight */}
          <Group blendMode="screen">
            <Circle cx={cx} cy={cy} r={sparkR}>
              <Paint>
                <RadialGradient
                  c={vec(cx, cy)}
                  r={sparkR}
                  colors={[
                    `rgba(255,255,255,${(0.4 * overall).toFixed(3)})`,
                    'rgba(255,255,255,0)',
                  ]}
                  positions={[0.8, 0.98]}
                />
              </Paint>
            </Circle>
          </Group>
        </Canvas>
      </View>
    );
  }

  // Web fallback: two blurred layers (white + tint), no black fringes
  const whiteSize = radius * 2;
  const tintSize = radius * 2 * 1.45;

  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <View
        style={
          {
            position: 'absolute',
            width: whiteSize,
            height: whiteSize,
            borderRadius: whiteSize / 2,
            backgroundColor: '#FFFFFF',
            opacity: 0.38 + level * 0.34,
            filter: 'blur(120px)',
          } as any
        }
      />
      <View
        style={
          {
            position: 'absolute',
            width: tintSize,
            height: tintSize,
            left: -(tintSize - whiteSize) / 2,
            top: -(tintSize - whiteSize) / 2,
            borderRadius: tintSize / 2,
            backgroundColor: speaking
              ? 'rgba(108,99,255,0.65)'
              : 'rgba(108,99,255,0.50)',
            opacity: 0.2 + level * 0.2,
            filter: 'blur(110px)',
          } as any
        }
      />
    </View>
  );
}

/* utils */
function hexA(hex: string, a: number) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const alpha = Math.max(0, Math.min(1, a));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
