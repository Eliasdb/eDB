// libs/ui/navigation/icon-segmented.tsx
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
  Platform,
  Pressable,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';

export type IconTab<T extends string> = {
  value: T;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  /**
   * VoiceOver / TalkBack label. (Shown visually on web if showLabels)
   */
  label?: string;
};

type Props<T extends string> = {
  value: T;
  options: IconTab<T>[];
  onChange: (v: T) => void;
  style?: ViewStyle;
  size?: 'md' | 'lg'; // icon + pill size
  accentColor?: string; // primary tint
  showLabels?: boolean; // optional tiny caption under each icon (web)
};

export function IconSegmented<T extends string>({
  value,
  options,
  onChange,
  style,
  size = 'lg',
  accentColor,
  showLabels = false,
}: Props<T>) {
  const isDark = useColorScheme() === 'dark';
  const primary = accentColor ?? (isDark ? '#8B9DFF' : '#6C63FF');
  const idle = isDark ? '#9AA3B2' : '#6B7280';
  const pillIdleBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const pillActiveBg = isDark
    ? 'rgba(139,157,255,0.16)'
    : 'rgba(108,99,255,0.12)';
  const pillActiveBorder = isDark
    ? 'rgba(139,157,255,0.32)'
    : 'rgba(108,99,255,0.26)';

  const iconPx = size === 'lg' ? 20 : 18;
  const pillPx = size === 'lg' ? 44 : 40;
  const gap = 10;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap,
          alignSelf: 'flex-start',
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {options.map((o) => {
        const selected = o.value === value;
        const tint = selected ? primary : idle;

        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              width: pillPx,
              height: pillPx,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: selected ? pillActiveBorder : pillIdleBorder,
              backgroundColor: selected ? pillActiveBg : 'transparent',
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Ionicons name={o.iconName} size={iconPx} color={tint} />
            {showLabels && Platform.OS === 'web' && o.label ? (
              <Text
                style={{
                  fontSize: 10,
                  color: tint,
                  marginTop: 4,
                  fontWeight: selected ? '700' : '600',
                }}
              >
                {o.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export default IconSegmented;
