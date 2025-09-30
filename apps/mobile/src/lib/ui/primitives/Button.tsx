// apps/mobile/src/lib/ui/primitives/Button.tsx
import { ReactNode } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type Tint = 'primary' | 'danger' | 'success' | 'neutral';
type Variant = 'solid' | 'outline' | 'ghost';
type Shape = 'pill' | 'rounded' | 'circle';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  onPress?: () => void;
  label?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  icon?: ReactNode;
  variant?: Variant; // default 'solid'
  tint?: Tint; // default 'primary'
  shape?: Shape; // default 'pill'
  size?: Size; // default 'md'
  diameter?: number; // exact circle diameter on native
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: any;
  accessibilityLabel?: string;
  testID?: string;
};

// ---- Numeric sizes (native)
const sizeMap: Record<
  Size,
  {
    height: number;
    px: number;
    radius: number;
    diameter: number;
    icon: number;
    text: number;
  }
> = {
  xs: { height: 28, px: 10, radius: 9999, diameter: 32, icon: 16, text: 12 },
  sm: { height: 36, px: 12, radius: 18, diameter: 44, icon: 16, text: 13 },
  md: { height: 44, px: 16, radius: 9999, diameter: 64, icon: 24, text: 15 }, // = w-16/h-16 on web
  lg: { height: 52, px: 20, radius: 9999, diameter: 80, icon: 32, text: 16 }, // ≈ w-20/h-20
  xl: { height: 60, px: 24, radius: 9999, diameter: 96, icon: 40, text: 17 }, // ≈ w-24/h-24
};

// ---- REM-based classes (web)
const webCircleSizeClass: Record<Size, string> = {
  xs: 'w-8 h-8',
  sm: 'w-11 h-11',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
};

const webPillSizeClass: Record<Size, string> = {
  xs: 'h-7 px-2.5',
  sm: 'h-9 px-3',
  md: 'h-11 px-4',
  lg: 'h-12 px-5',
  xl: 'h-14 px-6',
};

function classesFor(variant: Variant, tint: Tint, shape: Shape) {
  const baseText =
    tint === 'neutral' ? 'text-text dark:text-text-dark' : 'text-white';

  if (variant === 'solid') {
    const bg =
      tint === 'primary'
        ? 'bg-primary'
        : tint === 'danger'
          ? 'bg-danger'
          : tint === 'success'
            ? 'bg-success'
            : 'bg-surface-2 dark:bg-surface-dark';
    const border =
      tint === 'neutral' ? 'border border-border dark:border-border-dark' : '';
    return { container: `${bg} ${border}`, text: baseText };
  }

  if (variant === 'outline') {
    const bc = 'border border-border dark:border-border-dark';
    const text =
      tint === 'primary'
        ? 'text-primary'
        : tint === 'danger'
          ? 'text-danger'
          : tint === 'success'
            ? 'text-success'
            : 'text-text dark:text-text-dark';
    const bg =
      shape === 'circle' ? 'bg-surface dark:bg-surface-dark' : 'bg-transparent';
    return { container: `${bc} ${bg}`, text };
  }

  // GHOST: don't force bg-transparent, so consumers (e.g., IconButton) can supply bg classes.
  const text =
    tint === 'primary'
      ? 'text-primary'
      : tint === 'danger'
        ? 'text-danger'
        : tint === 'success'
          ? 'text-success'
          : 'text-text dark:text-text-dark';
  return { container: '', text };
}

export function Button(props: ButtonProps) {
  const {
    onPress,
    label,
    helperText,
    iconLeft,
    iconRight,
    icon,
    variant = 'solid',
    tint = 'primary',
    shape = 'pill',
    size = 'md',
    diameter,
    fullWidth,
    disabled,
    loading,
    className,
    style,
    accessibilityLabel,
    testID,
  } = props;

  const S = sizeMap[size];
  const { container, text } = classesFor(variant, tint, shape);
  const isCircle = shape === 'circle';
  const isGhost = variant === 'ghost';

  // Web uses Tailwind classes for sizing
  const webSizeClass =
    Platform.OS === 'web'
      ? isCircle
        ? webCircleSizeClass[size]
        : webPillSizeClass[size]
      : '';

  const pressableBaseClass = isCircle
    ? [
        'items-center justify-center rounded-full',
        container,
        webSizeClass,
        // only add Tailwind shadow class for SOLID; ghost stays flat
        variant === 'solid' ? 'shadow-lg' : '',
      ]
        .filter(Boolean)
        .join(' ')
    : [
        'flex-row items-center',
        container,
        webSizeClass,
        fullWidth ? 'w-full justify-center' : 'justify-center',
        shape === 'pill' ? 'rounded-pill' : 'rounded-xl',
      ]
        .filter(Boolean)
        .join(' ');

  // Tint-based shadow color (for solid)
  const shadowColor =
    tint === 'danger' ? '#ef4444' : tint === 'primary' ? '#6C63FF' : '#000';

  // Numeric sizing for native (web uses classes)
  const nativeSizeStyle =
    Platform.OS !== 'web'
      ? isCircle
        ? {
            width: diameter ?? S.diameter,
            height: diameter ?? S.diameter,
            borderRadius: Math.round((diameter ?? S.diameter) / 2),
          }
        : { height: S.height, paddingHorizontal: S.px }
      : null;

  return (
    <View className={isCircle ? 'items-center' : undefined}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        testID={testID}
        className={[pressableBaseClass, className].filter(Boolean).join(' ')}
        style={({ pressed }) => [
          nativeSizeStyle,
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            opacity: disabled ? 0.6 : 1,

            // Android elevation: none for ghost
            ...(Platform.OS === 'android'
              ? isGhost
                ? { elevation: 0 }
                : { elevation: 3 }
              : {}),

            // iOS/web shadow: only for solid
            ...(Platform.OS !== 'android' && !isGhost && variant === 'solid'
              ? {
                  shadowColor,
                  shadowOpacity: tint === 'danger' ? 0.5 : 0.35,
                  shadowRadius: tint === 'danger' ? 14 : 10,
                  shadowOffset: { width: 0, height: 6 },
                }
              : {}),
          },
          style,
        ]}
      >
        {isCircle ? (
          (icon ?? (
            <Text className="text-white" style={{ fontSize: S.icon }}>
              ●
            </Text>
          ))
        ) : (
          <>
            {iconLeft ? (
              <View style={{ marginRight: 8 }}>{iconLeft}</View>
            ) : null}
            <Text className="font-semibold" style={{ fontSize: S.text }}>
              <Text className={text}>{loading ? '…' : label}</Text>
            </Text>
            {iconRight ? (
              <View style={{ marginLeft: 8 }}>{iconRight}</View>
            ) : null}
          </>
        )}
      </Pressable>

      {helperText ? (
        <Text className="mt-2 text-[14px] font-semibold text-text dark:text-text-dark">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
