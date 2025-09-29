import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useThemePreference } from '../providers/themePreference';

type IonName = React.ComponentProps<typeof Ionicons>['name'];

export function DimIcon({
  name,
  size = 14,
  color,
}: {
  name: IonName;
  size?: number;
  color?: string;
}) {
  const { effective } = useThemePreference();
  const fallback = effective === 'dark' ? '#9CA3AF' : '#6B7280';
  return <Ionicons name={name} size={size} color={color ?? fallback} />;
}

// optional re-export if you want a plain Icon for convenience
export { Ionicons as Icon };
