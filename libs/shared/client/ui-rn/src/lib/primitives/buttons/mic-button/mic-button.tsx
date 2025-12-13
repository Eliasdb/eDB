// apps/mobile/src/lib/ui/primitives/VoiceButton.tsx
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { useThemeOverride } from '../../../../widgets/theme-picker/uset';

type Props = {
  connected: boolean;
  speaking: boolean;
  loading: boolean;
  level: number; // 0..1 mic intensity
  onPress: () => void;
  size?: number; // visual diameter (default 128 for light)
  subtle?: boolean; // force the calmer look even on light
};

export function MicButton({
  connected,
  speaking,
  loading,
  level,
  onPress,
  size = 128,
  subtle = false,
}: Props) {
  const { effective } = useThemeOverride({ restore: true });
  const isDark = effective === 'dark';

  // --- Palette & sizing ------------------------------------------------------
  // Dark: smaller & neutral; Light: brandy.
  const baseSize = isDark ? Math.round(size * 0.88) : size;
  const radius = Math.round(baseSize / 2);
  const iconSize = Math.round(baseSize * (isDark ? 0.5 : 0.56));

  const PALETTE = isDark
    ? {
        tintIdle: 'rgba(229,231,235,0.92)', // ~gray-200
        bgIdle: 'rgba(255,255,255,0.04)',
        tintConnected: 'rgba(255,255,255,0.98)',
        bgConnected: 'rgba(255,255,255,0.08)',
        tintLoading: 'rgba(209,213,219,0.85)',
        bgLoading: 'rgba(255,255,255,0.05)',
        ripple: 'rgba(255,255,255,0.08)',
      }
    : {
        tintIdle: '#6C63FF',
        bgIdle: 'rgba(108,99,255,0.12)',
        tintConnected: '#ef4444',
        bgConnected: 'rgba(239,68,68,0.15)',
        tintLoading: '#6C63FF',
        bgLoading: 'rgba(108,99,255,0.12)',
        ripple: 'rgba(0,0,0,0.06)',
      };

  // Optional super-calm mode (works both themes)
  const quiet = subtle || isDark;
  const bgIdle = quiet
    ? isDark
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)'
    : PALETTE.bgIdle;
  const bgConnected = quiet
    ? isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(239,68,68,0.12)'
    : PALETTE.bgConnected;
  const bgLoading = quiet
    ? isDark
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)'
    : PALETTE.bgLoading;

  const icon: ComponentProps<typeof Ionicons>['name'] = loading
    ? 'ellipsis-horizontal'
    : connected
      ? 'stop'
      : 'mic';
  const tint = loading
    ? PALETTE.tintLoading
    : connected
      ? PALETTE.tintConnected
      : PALETTE.tintIdle;
  const bg = loading ? bgLoading : connected ? bgConnected : bgIdle;

  // --- Motion ---------------------------------------------------------------
  const idlePulseAmp = isDark ? 0.0 : 0.06; // no idle pulse in dark
  const speakingPulse = isDark ? 0.03 : 0.06; // max extra scale when speaking
  const reactMax = isDark ? 0.03 : 0.08; // level reactivity clamp

  const pulse = useRef(new Animated.Value(1)).current;
  const react = useRef(new Animated.Value(1)).current;

  // Idle/connected breathing: only on light OR when actually speaking
  useEffect(() => {
    const shouldBreathe =
      (connected && !loading && !isDark) || (connected && speaking && !loading);
    if (!shouldBreathe) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const targetUp = 1 + (speaking ? speakingPulse : idlePulseAmp);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: targetUp,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [connected, idlePulseAmp, isDark, loading, pulse, speaking, speakingPulse]);

  // React to input level (very subtle in dark)
  useEffect(() => {
    if (!connected || loading) return;
    const extra = Math.min(reactMax, (level || 0) * reactMax * 1.2);
    Animated.spring(react, {
      toValue: 1 + extra,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [connected, level, loading, react, reactMax]);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: Animated.multiply(pulse, react) }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Microphone"
        hitSlop={12}
        android_ripple={{ color: PALETTE.ripple, radius }}
        style={({ pressed }) => [
          styles.button,
          {
            width: baseSize,
            height: baseSize,
            borderRadius: radius,
            backgroundColor: bg,
            transform: [{ scale: pressed ? 0.96 : 1 }],
            // Keep it flat/minimal; no shadows. Looks great over dark & light.
          },
        ]}
      >
        <Ionicons name={icon} size={iconSize} color={tint} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  button: { alignItems: 'center', justifyContent: 'center' },
});
