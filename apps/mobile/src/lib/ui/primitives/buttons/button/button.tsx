// apps/mobile/src/lib/ui/primitives/Button.tsx
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type Tint = 'primary' | 'danger' | 'success' | 'neutral';
type Variant = 'solid' | 'outline' | 'ghost';
type Shape = 'pill' | 'rounded' | 'circle';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type WebDensity = 'compact' | 'comfortable';
type IonName = React.ComponentProps<typeof Ionicons>['name'];

export type ButtonProps = {
  onPress?: () => void;
  label?: string;
  helperText?: string;

  icon?: ReactNode | IonName;
  iconLeft?: ReactNode | IonName;
  iconRight?: ReactNode | IonName;

  variant?: Variant;
  tint?: Tint;
  shape?: Shape;
  size?: Size;
  diameter?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: any;
  accessibilityLabel?: string;
  testID?: string;

  webDensity?: WebDensity;
};

/* ---------------- sizes ---------------- */

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
  md: { height: 44, px: 16, radius: 9999, diameter: 64, icon: 24, text: 15 },
  lg: { height: 52, px: 20, radius: 9999, diameter: 80, icon: 32, text: 16 },
  xl: { height: 60, px: 24, radius: 9999, diameter: 96, icon: 40, text: 17 },
};

const webCircleSizeClass: Record<Size, string> = {
  xs: 'w-8 h-8',
  sm: 'w-11 h-11',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
};
const webPillHeightClass: Record<Size, string> = {
  xs: 'h-7',
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-12',
  xl: 'h-14',
};
const webPillPad: Record<WebDensity, Record<Size, string>> = {
  compact: { xs: 'px-2', sm: 'px-2.5', md: 'px-3', lg: 'px-4', xl: 'px-4' },
  comfortable: { xs: 'px-2.5', sm: 'px-3', md: 'px-4', lg: 'px-5', xl: 'px-6' },
};

/* ---------------- styles ---------------- */

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
    return {
      container: `${bg} ${border}`,
      text: baseText,
      iconColor: undefined as string | undefined,
    };
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
    const iconColor =
      tint === 'primary'
        ? '#6C63FF'
        : tint === 'danger'
          ? '#ef4444'
          : tint === 'success'
            ? '#16a34a'
            : undefined;
    return { container: `${bc} ${bg}`, text, iconColor };
  }

  // ghost
  const text =
    tint === 'primary'
      ? 'text-primary'
      : tint === 'danger'
        ? 'text-danger'
        : tint === 'success'
          ? 'text-success'
          : 'text-text dark:text-text-dark';
  const iconColor =
    tint === 'primary'
      ? '#6C63FF'
      : tint === 'danger'
        ? '#ef4444'
        : tint === 'success'
          ? '#16a34a'
          : undefined;
  return { container: '', text, iconColor };
}

/* Resolve ReactNode | IonName into a node, with size/color */

function resolveIcon(
  node: React.ReactNode | IonName | undefined,
  size: number,
  color?: string,
): React.ReactNode | null {
  if (!node) return null;
  if (typeof node === 'string') {
    return <Ionicons name={node as IonName} size={size} color={color} />;
  }
  return node as React.ReactNode;
}

/* ---------------- component ---------------- */

export function Button(props: ButtonProps) {
  const {
    onPress,
    label,
    helperText,
    icon,
    iconLeft,
    iconRight,
    variant = 'solid',
    tint = 'primary',
    shape = 'pill',
    size = 'sm',
    diameter,
    fullWidth,
    disabled,
    loading,
    className,
    style,
    accessibilityLabel,
    testID,
    webDensity = 'compact',
  } = props;

  const S = sizeMap[size];
  const { container, text, iconColor } = classesFor(variant, tint, shape);
  const isCircle = shape === 'circle';
  const isGhost = variant === 'ghost';

  // Web sizing classes
  const webSizeClass =
    Platform.OS === 'web'
      ? isCircle
        ? webCircleSizeClass[size]
        : [webPillHeightClass[size], webPillPad[webDensity][size]].join(' ')
      : '';

  const pressableBaseClass = isCircle
    ? [
        'items-center justify-center rounded-full',
        container,
        webSizeClass,
        variant === 'solid' ? 'shadow-lg' : '',
      ]
        .filter(Boolean)
        .join(' ')
    : [
        'inline-flex flex-row items-center',
        container,
        webSizeClass,
        fullWidth ? 'w-full justify-center' : 'justify-center',
        shape === 'pill' ? 'rounded-pill' : 'rounded-xl',
      ]
        .filter(Boolean)
        .join(' ');

  const shadowColor =
    tint === 'danger' ? '#ef4444' : tint === 'primary' ? '#6C63FF' : '#000';

  // 🔸 Native frame for Pressable (no padding here). Web uses classes above.
  const nativeFrameStyle =
    Platform.OS !== 'web'
      ? isCircle
        ? {
            width: diameter ?? S.diameter,
            height: diameter ?? S.diameter,
            borderRadius: Math.round((diameter ?? S.diameter) / 2),
          }
        : {
            minHeight: S.height,
            borderRadius: S.radius,
          }
      : null;

  // icon color
  const effectiveIconColor =
    variant === 'solid' && tint !== 'neutral' ? '#fff' : iconColor;

  // For non-circle buttons, treat `icon` as left icon if provided
  const leftIconNode = resolveIcon(
    iconLeft ?? (!isCircle ? icon : undefined),
    S.icon,
    effectiveIconColor,
  );
  const rightIconNode = resolveIcon(iconRight, S.icon, effectiveIconColor);
  const circleIconNode = resolveIcon(
    isCircle ? (iconLeft ?? icon ?? iconRight) : undefined,
    S.icon,
    effectiveIconColor,
  );

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
          nativeFrameStyle,
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            opacity: disabled ? 0.6 : 1,
            ...(Platform.OS === 'android'
              ? isGhost
                ? { elevation: 0 }
                : { elevation: 3 }
              : {}),
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
          (circleIconNode ?? (
            <Text className="text-white" style={{ fontSize: S.icon }}>
              ●
            </Text>
          ))
        ) : (
          // 🔸 Inner row actually gets padding on native (this widens the pill)
          <View
            className="flex-row items-center justify-center"
            style={
              Platform.OS !== 'web'
                ? {
                    paddingHorizontal: S.px + 12, // tweak +12 → +16/+20 for more width
                    height: S.height,
                  }
                : undefined
            }
          >
            {leftIconNode ? (
              <View style={{ marginRight: 8 }}>{leftIconNode}</View>
            ) : null}
            <Text
              className={`font-semibold ${text}`}
              style={{ fontSize: S.text }}
            >
              {loading ? '…' : label}
            </Text>
            {rightIconNode ? (
              <View style={{ marginLeft: 8 }}>{rightIconNode}</View>
            ) : null}
          </View>
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
