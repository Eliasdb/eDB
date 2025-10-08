// apps/mobile/src/lib/ui/visuals/AudioGlowAdaptive.tsx
import React from 'react';
import { useThemeOverride } from '../../widgets/theme-picker/uset';
import { AudioGlowDark } from './audio-glow-dark/audio-glow-dark';
import AudioGlowLight from './audio-glow-light/audio-glow-light';

type Props = {
  level: number;
  speaking: boolean;
  baseRadius?: number;
  color?: string;
  style?: any;
  /** In Storybook you can pass restore=false to avoid AsyncStorage side-effects */
  restoreThemeState?: boolean;
};

export function AudioGlowAdaptive({
  restoreThemeState = true,
  ...props
}: Props) {
  const { effective } = useThemeOverride({ restore: restoreThemeState });
  const isLight = effective === 'light';

  return isLight ? <AudioGlowLight {...props} /> : <AudioGlowDark {...props} />;
}
