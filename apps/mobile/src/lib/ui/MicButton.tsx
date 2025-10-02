// apps/mobile/src/app/components/MicButton.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  onPress?: () => void;
  loading?: boolean;
  active?: boolean; // when true -> danger color
  disabled?: boolean;
  size?: Size;
  diameter?: number; // override circle size (px)
  label?: string; // default: "Talk"
  helperText?: string; // default: based on active/loading
  testID?: string;
  accessibilityLabel?: string;
};

const SIZING: Record<Size, { d: number; icon: number; label: number }> = {
  sm: { d: 56, icon: 24, label: 13 },
  md: { d: 72, icon: 32, label: 15 },
  lg: { d: 88, icon: 40, label: 16 },
};

// native gets a touch more “breathing room” so it matches web
const NATIVE_INSET = 6;

export default function MicButton({
  onPress,
  loading,
  active,
  disabled,
  size = 'md',
  diameter,
  label,
  helperText,
  testID,
  accessibilityLabel,
}: Props) {
  const S = SIZING[size];

  // final circle diameter
  const baseD = diameter ?? S.d;
  const D = Platform.OS === 'web' ? baseD : baseD + NATIVE_INSET * 2; // add room on native

  const bg = active ? '#ef4444' : '#6C63FF'; // danger / primary
  const shadow =
    Platform.OS === 'android'
      ? { elevation: 4 }
      : {
          shadowColor: active ? '#ef4444' : '#6C63FF',
          shadowOpacity: active ? 0.5 : 0.35,
          shadowRadius: active ? 14 : 10,
          shadowOffset: { width: 0, height: 6 },
        };

  const isDisabled = disabled || loading;

  const computedHelper =
    helperText ?? (loading ? 'Connecting…' : active ? 'Stop' : 'Tap to talk');

  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? 'Talk'}
        testID={testID}
        hitSlop={10}
        style={({ pressed }) => [
          {
            width: D,
            height: D,
            borderRadius: Math.round(D / 2),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            opacity: isDisabled ? 0.6 : 1,
          },
          shadow,
        ]}
      >
        <MaterialIcons name="mic" size={S.icon} color="#fff" />
      </Pressable>

      <Text
        style={{
          marginTop: 10,
          fontWeight: '600',
          fontSize: S.label,
          color: '#E5E7EB', // text-gray-200
        }}
      >
        {label ?? 'Talk'}
      </Text>
    </View>
  );
}
