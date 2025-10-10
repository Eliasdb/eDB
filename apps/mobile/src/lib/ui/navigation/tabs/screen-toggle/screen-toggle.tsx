import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, View, ViewStyle, useColorScheme } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type ScreenToggleOption<T extends string> = {
  value: T;
  icon: IconName;
  /** Optional accessibility label */
  ariaLabel?: string;
};

export type ScreenToggleProps<T extends string> = {
  value: T;
  options: ScreenToggleOption<T>[];
  onChange: (v: T) => void;
  /** sm = 30, md = 34, lg = 36 (default) */
  size?: 'sm' | 'md' | 'lg';
  /** Horizontal spacing between chips (default 8) */
  gap?: number;
  /** Optional container style override */
  style?: ViewStyle;
  /** Override active color (fallbacks to platform dark/light defaults) */
  activeColor?: string;
};

const szMap = { sm: 30, md: 34, lg: 36 } as const;

function withAlpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * ScreenToggle — a tiny icon-only toggle row.
 * - Not opinionated about layout; just pass it a place to live.
 * - External state: caller controls `value` + `onChange`.
 */
export function ScreenToggle<T extends string>({
  value,
  options,
  onChange,
  size = 'lg',
  gap = 8,
  style,
  activeColor,
}: ScreenToggleProps<T>) {
  const isDark = useColorScheme() === 'dark';
  const box = szMap[size];
  const active = activeColor ?? (isDark ? '#A5B4FC' : '#6366F1');
  const idle = isDark ? '#9AA3B2' : '#6B7280';
  const idleBorder = isDark
    ? 'rgba(148,163,184,0.28)'
    : 'rgba(148,163,184,0.25)';

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
            style={({ pressed }) => ({
              width: box,
              height: box,
              borderRadius: Math.round(box * 0.28),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: selected
                ? withAlpha(active, isDark ? 0.45 : 0.35)
                : idleBorder,
              backgroundColor: pressed
                ? isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)'
                : 'transparent',
            })}
          >
            <Ionicons
              name={o.icon}
              size={Math.round(box * 0.5)}
              color={selected ? active : idle}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default ScreenToggle;
