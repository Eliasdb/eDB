import React from 'react';
import { Text, View, type ViewProps } from 'react-native';

/**
 * Tiny helper: add alpha to a hex color.
 * Accepts #RGB or #RRGGBB. Falls back to transparent on bad input.
 */
export function withAlpha(hex: string, a = 0.12) {
  const m = /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex);
  if (!m) return hex;
  const [_, r, g, b] = m;
  return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${a})`;
}

export type BadgeProps = ViewProps & {
  label: string;
  /** Hex color like `#6C63FF` */
  tint: string;
};

export function Badge({ label, tint, className, style, ...rest }: BadgeProps) {
  return (
    <View
      className={['px-2 py-1 rounded-md', className ?? ''].join(' ')}
      style={[{ backgroundColor: withAlpha(tint, 0.12) }, style]}
      {...rest}
    >
      <Text
        className="text-[10px] font-extrabold tracking-[0.4px]"
        style={{ color: tint }}
      >
        {label}
      </Text>
    </View>
  );
}

export default Badge;
