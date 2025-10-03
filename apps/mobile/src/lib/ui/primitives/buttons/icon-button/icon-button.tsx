import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Button, type ButtonProps } from '../button/button';

type Tint = NonNullable<ButtonProps['tint']>;
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
  className,
  ...rest
}: Omit<ButtonProps, 'label' | 'icon' | 'iconLeft' | 'iconRight' | 'shape'> & {
  name: ComponentProps<typeof Ionicons>['name'];
  subtleBg?: boolean;
}) {
  const color = fgFor(variant, tint);
  const iconSize = iconSizeMap[size];

  const webCircleSizeClass =
    size === 'xs'
      ? 'w-9 h-9'
      : size === 'sm'
        ? 'w-11 h-11'
        : size === 'md'
          ? 'w-16 h-16'
          : size === 'lg'
            ? 'w-20 h-20'
            : 'w-24 h-24';

  // solid soft bg + no shadow for ghost (works now because Button no longer sets bg-transparent)
  const ghostBgClass =
    variant === 'ghost' && subtleBg
      ? 'bg-control dark:bg-control-dark shadow-none'
      : variant === 'ghost'
        ? 'shadow-none'
        : '';

  const focusRingWeb = 'focus:outline-none focus:ring-1 focus:ring-primary/40';

  return (
    <Button
      shape="circle"
      tint={tint}
      variant={variant}
      size={size}
      className={[webCircleSizeClass, ghostBgClass, focusRingWeb, className]
        .filter(Boolean)
        .join(' ')}
      style={
        variant === 'ghost'
          ? { shadowOpacity: 0, shadowRadius: 0, elevation: 0 }
          : undefined
      }
      icon={<Ionicons name={name} size={iconSize} color={color} />}
      {...rest}
    />
  );
}
