// apps/mobile/src/lib/ui/visuals/AudioGlowLight.tsx
import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type Props = {
  level: number;
  speaking: boolean;
  baseRadius?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AudioGlowLight({
  level,
  speaking,
  baseRadius = 140,
  color = '#6C63FF',
  style,
}: Props) {
  const lvl = Math.max(0, Math.min(1, level || 0));
  const speakBoost = speaking ? 1.0 : 0.9;

  // Geometry
  const radius = baseRadius + lvl * 40;
  const pad = radius * 1.35;
  const size = radius * 2 + pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  const haloR = radius * 1.95;
  const tintR = radius * 1.55;
  const coreR = radius * 1.1;
  const sparkR = radius * 0.4;

  // Intensity: balanced (between your too-bright and too-dim versions)
  const haloA = 0.16 + lvl * 0.16; // soft white halo
  const tintA = (0.12 + lvl * 0.14) * speakBoost; // brand tint ring
  const coreA = 0.14 + lvl * 0.1; // inner bloom
  const sparkA = 0.16 + lvl * 0.1; // center sparkle

  const EPS = 0.001;

  const gid = useMemo(() => Math.random().toString(36).slice(2), []);
  const id = (name: string) => `${name}-${gid}`;

  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size }, style]}
    >
      <Svg width={size} height={size}>
        <Defs>
          {/* HALO */}
          <RadialGradient
            id={id('halo')}
            cx={cx}
            cy={cy}
            r={haloR}
            fx={cx}
            fy={cy}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.0} stopColor="white" stopOpacity={0.85 * haloA} />
            <Stop offset={0.72} stopColor="white" stopOpacity={0.4 * haloA} />
            <Stop offset={0.997} stopColor="white" stopOpacity={EPS} />
          </RadialGradient>

          {/* TINT */}
          <RadialGradient
            id={id('tint')}
            cx={cx}
            cy={cy}
            r={tintR}
            fx={cx}
            fy={cy}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.0} stopColor={color} stopOpacity={0.85 * tintA} />
            <Stop offset={0.68} stopColor={color} stopOpacity={0.45 * tintA} />
            <Stop offset={0.997} stopColor="white" stopOpacity={EPS} />
          </RadialGradient>

          {/* CORE */}
          <RadialGradient
            id={id('core')}
            cx={cx}
            cy={cy}
            r={coreR}
            fx={cx}
            fy={cy}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.0} stopColor="white" stopOpacity={1.0 * coreA} />
            <Stop offset={0.6} stopColor="white" stopOpacity={0.25 * coreA} />
            <Stop offset={0.98} stopColor="white" stopOpacity={EPS} />
          </RadialGradient>

          {/* SPARK */}
          <RadialGradient
            id={id('spark')}
            cx={cx}
            cy={cy}
            r={sparkR}
            fx={cx}
            fy={cy}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={0.78} stopColor="white" stopOpacity={0.7 * sparkA} />
            <Stop offset={0.99} stopColor="white" stopOpacity={EPS} />
          </RadialGradient>
        </Defs>

        {/* Draw order */}
        <Circle cx={cx} cy={cy} r={haloR} fill={`url(#${id('halo')})`} />
        <Circle cx={cx} cy={cy} r={tintR} fill={`url(#${id('tint')})`} />
        <Circle cx={cx} cy={cy} r={coreR} fill={`url(#${id('core')})`} />
        <Circle cx={cx} cy={cy} r={sparkR} fill={`url(#${id('spark')})`} />
      </Svg>
    </View>
  );
}
