// libs/ui/navigation/screen-toggle.tsx
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, View, ViewStyle, useColorScheme } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type ScreenToggleOption<T extends string> = {
  value: T;
  icon: IconName;
  ariaLabel?: string;
};

export type ScreenToggleProps<T extends string> = {
  value: T;
  options: ScreenToggleOption<T>[];
  onChange: (v: T) => void;
  size?: 'sm' | 'md' | 'lg';
  gap?: number;
  style?: ViewStyle;
  activeColor?: string;
};

const szMap = { sm: 28, md: 34, lg: 38 } as const;

function withAlpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function ScreenToggle<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  gap = 8,
  style,
  activeColor,
}: ScreenToggleProps<T>) {
  const isDark = useColorScheme() === 'dark';
  const box = szMap[size];
  const active = activeColor ?? (isDark ? '#A5B4FC' : '#6366F1');

  const idleIcon = isDark ? '#9AA3B2' : '#6B7280';
  // Use a stronger border color on native so it actually shows
  const idleBorder = isDark
    ? 'rgba(148,163,184,0.50)'
    : 'rgba(148,163,184,0.42)';
  const selectedBorder = withAlpha(active, isDark ? 0.65 : 0.55);
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <View style={[{ flexDirection: 'row', gap }, style]}>
      {options.map((o) => {
        const selected = o.value === value;

        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityLabel={o.ariaLabel}
            accessibilityState={{ selected }}
            hitSlop={8}
            style={({ pressed }) => ({
              width: box,
              height: box,
              borderRadius: Math.round(box * 0.45),
              alignItems: 'center',
              justifyContent: 'center',
              // keep Pressable bg for pressed effect only
              backgroundColor: pressed ? hoverBg : 'transparent',
            })}
          >
            {/* Draw the visible border on an inner View (chip) */}
            <View
              style={{
                width: box,
                height: box,
                borderRadius: Math.round(box * 0.45),
                alignItems: 'center',
                justifyContent: 'center',
                // ✅ solid, visible border on iOS/Android
                borderStyle: 'solid',
                borderWidth: 1, // 1dp so it renders reliably
                borderColor: selected ? selectedBorder : idleBorder,
                backgroundColor: selected
                  ? withAlpha(active, isDark ? 0.18 : 0.16)
                  : 'transparent',
              }}
            >
              <Ionicons
                name={o.icon}
                size={Math.round(box * 0.5)}
                color={selected ? active : idleIcon}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default ScreenToggle;
