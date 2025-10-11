// libs/ui/primitives/icon-button.tsx
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Platform, View } from 'react-native';
import { Button, type ButtonProps } from '../button/button';

type Variant = NonNullable<ButtonProps['variant']>;
type Size = NonNullable<ButtonProps['size']>;

const iconSizeMap: Record<Size, number> = {
  xs: 18,
  sm: 16,
  md: 24,
  lg: 28,
  xl: 32,
};

const tintHex = {
  primary: '#6C63FF',
  danger: '#ef4444',
  success: '#16a34a',
  neutral: '#6B7280',
} as const;

function fgFor(v: Variant, t: keyof typeof tintHex) {
  return v === 'solid' ? '#fff' : tintHex[t];
}

export function IconButton({
  name,
  tint = 'primary',
  variant = 'ghost',
  size = 'xs',
  subtleBg = true,
  shape = 'circle',
  cornerRadius,
  className,
  style,
  ...rest
}: Omit<ButtonProps, 'label' | 'icon' | 'iconLeft' | 'iconRight'> & {
  name: ComponentProps<typeof Ionicons>['name'];
  subtleBg?: boolean;
  shape?: NonNullable<ButtonProps['shape']>;
  cornerRadius?: number;
}) {
  const color = fgFor(variant, tint);
  const iconSize = iconSizeMap[size];
  const isCircle = shape === 'circle';
  const isWeb = Platform.OS === 'web';

  // Only use fixed box for circles OR on web. Avoid it on native + non-circle.
  const boxSizeClass = isCircle
    ? size === 'xs'
      ? 'w-9 h-9'
      : size === 'sm'
        ? 'w-11 h-11'
        : size === 'md'
          ? 'w-16 h-16'
          : size === 'lg'
            ? 'w-20 h-20'
            : 'w-24 h-24'
    : isWeb
      ? '' // non-circle web sizing handled by base Button classes
      : ''; // native non-circle → no fixed width/height (prevents clipping)

  const ghostBgClass =
    variant === 'ghost' && subtleBg
      ? 'bg-control dark:bg-control-dark shadow-none'
      : variant === 'ghost'
        ? 'shadow-none'
        : '';

  const radiusStyle =
    !isCircle && typeof cornerRadius === 'number'
      ? { borderRadius: cornerRadius }
      : undefined;

  const focusRingWeb = 'focus:outline-none focus:ring-1 focus:ring-primary/40';

  const ion = (
    <Ionicons
      name={name}
      size={iconSize}
      color={color}
      allowFontScaling={false}
      style={{ textAlign: 'center', lineHeight: iconSize }}
    />
  );

  const spacer = <View style={{ width: iconSize, height: iconSize }} />;

  if (isCircle) {
    // Circle path: fixed square is OK everywhere
    return (
      <Button
        shape="circle"
        tint={tint}
        variant={variant}
        size={size}
        className={[
          'relative',
          boxSizeClass,
          ghostBgClass,
          'items-center justify-center',
          focusRingWeb,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          ...(variant === 'ghost'
            ? { shadowOpacity: 0, shadowRadius: 0, elevation: 0 }
            : null),
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        icon={ion}
        {...rest}
      />
    );
  }

  // Non-circle: DO NOT force fixed w/h on native; let Button's padding expand width.
  // Keep padding on native so the inner row isn't wider than the wrapper.
  return (
    <Button
      shape={shape}
      tint={tint}
      variant={variant}
      size={size}
      label=""
      iconLeft={ion}
      iconRight={spacer}
      className={[
        'relative',
        boxSizeClass, // empty on native non-circle
        ghostBgClass,
        'items-center justify-center',
        // On web, you can still cancel px if you want a tight square:
        isWeb ? '!px-0' : '',
        focusRingWeb,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...(variant === 'ghost'
          ? { shadowOpacity: 0, shadowRadius: 0, elevation: 0 }
          : null),
        alignItems: 'center',
        justifyContent: 'center',
        ...radiusStyle,
        ...style,
      }}
      {...rest}
    />
  );
}
