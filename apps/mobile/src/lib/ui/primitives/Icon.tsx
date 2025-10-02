// apps/mobile/src/lib/ui/primitives/Icon.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

type IonName = React.ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IonName;
  size?: number;
} & Omit<TextProps, 'children'>; // so className, style, accessibility props, etc. pass through

export function Icon({ name, size = 20, ...textProps }: IconProps) {
  // Wrap in RN Text so color from className (NativeWind) cascades to the icon
  return (
    <RNText {...textProps}>
      <Ionicons name={name} size={size} />
    </RNText>
  );
}

// Optional: a dimmed variant that auto-picks a fallback color by theme
import { useThemePreference } from '../providers/themePreference';

export function DimIcon({
  name,
  size = 20,
  color,
  ...rest
}: { name: IonName; size?: number; color?: string } & Omit<
  TextProps,
  'children'
>) {
  const { effective } = useThemePreference();
  const fallback = effective === 'dark' ? '#9CA3AF' : '#6B7280';
  return (
    <RNText {...rest}>
      <Ionicons name={name} size={size} color={color ?? fallback} />
    </RNText>
  );
}
