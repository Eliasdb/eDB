import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ViewStyle } from 'react-native';

type Tint = 'primary' | 'danger' | 'success' | 'neutral';
type Size = 'xs' | 'sm' | 'md';

export type CheckboxProps = {
  checked?: boolean; // ← make optional
  onChange?: (next: boolean) => void;
  size?: Size; // default 'sm'
  tintChecked?: Tint; // default 'success'
  tintUnchecked?: Tint; // default 'primary'
  hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
};

const sizePx: Record<Size, number> = { xs: 16, sm: 20, md: 24 };
const tintColor: Record<Tint, string> = {
  primary: '#6C63FF',
  success: '#27ae60',
  danger: '#ef4444',
  neutral: '#6B7280',
};

export function Checkbox({
  checked,
  onChange,
  size = 'sm',
  tintChecked = 'success',
  tintUnchecked = 'primary',
  hitSlop = 8,
  style,
  accessibilityLabel,
}: CheckboxProps) {
  const isChecked = !!checked; // ← coerce
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isChecked, scale]);

  const iconSize = sizePx[size];
  const color = tintColor[isChecked ? tintChecked : tintUnchecked];

  return (
    <Pressable
      onPress={() => onChange?.(!isChecked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop as any}
      style={({ pressed }) => (pressed ? [{ opacity: 0.85 }, style] : style)}
      className="items-center justify-center"
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isChecked ? 'checkbox' : 'square-outline'}
          size={iconSize}
          color={color}
        />
      </Animated.View>
    </Pressable>
  );
}
