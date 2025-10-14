// libs/ui/layout/intro-header.tsx
import * as React from 'react';
import { Text, useColorScheme, View, ViewStyle } from 'react-native';

export type IntroHeaderProps = {
  text: string;
  /** optional actions slot (kept for Activity screen parity) */
  right?: React.ReactNode;
  style?: ViewStyle;
  /** border emphasis */
  variant?: 'primary' | 'secondary';
  /** vertical scale for the fixed-height row */
  size?: 'sm' | 'md';
};

export function IntroHeader({
  text,
  right,
  style,
  variant = 'secondary',
  size = 'md',
}: IntroHeaderProps) {
  const isDark = useColorScheme() === 'dark';

  // borders aligned with Segmented
  const borderPrimary = isDark ? '#2A2F3A' : '#E5E7EB';
  const borderSecondary = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)';
  const border = variant === 'primary' ? borderPrimary : borderSecondary;

  // fixed height → perfect parity, actions or not
  const H = size === 'sm' ? 44 : 52;

  return (
    <View
      style={[
        {
          height: H,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: border,
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: isDark ? '#9AA3B2' : '#6B7280',
            marginLeft: 2,
          }}
        >
          {text}
        </Text>
        {right ? <View pointerEvents="box-none">{right}</View> : null}
      </View>
    </View>
  );
}

export default IntroHeader;
