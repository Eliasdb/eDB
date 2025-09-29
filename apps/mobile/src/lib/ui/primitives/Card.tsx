// @ui/primitives/Card.tsx
import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type Tone = 'raised' | 'flat' | 'muted';
type Radius = 'all' | 'top-none' | 'bottom-none' | 'none';

type CardProps = ViewProps & {
  /** Title shown in a header row (optional) */
  title?: string;
  /** Small line under the title (optional) */
  subtitle?: string;
  /** Right side of the header row (optional) */
  headerRight?: React.ReactNode;

  /** Adds inner padding around the body. Default: true */
  inset?: boolean;

  /** Visual tone of the surface. Default: 'raised' */
  tone?: Tone;

  /** Show a border around the card. Default: true */
  bordered?: boolean;

  /** Keep subtle shadow on dark theme when tone='raised'. Default: true */
  shadowOnDark?: boolean;

  /**
   * Corner radius preset.
   * - 'all'         -> rounded on all corners (default)
   * - 'top-none'    -> sharp top, rounded bottom (great for list panes)
   * - 'bottom-none' -> rounded top, sharp bottom
   * - 'none'        -> no rounding
   */
  radius?: Radius;

  /** Extra classNames for the outer and inner wrappers */
  className?: string;
  bodyClassName?: string;
};

export function Card({
  title,
  subtitle,
  headerRight,
  inset = true,
  tone = 'raised',
  bordered = true,
  shadowOnDark = true,
  radius = 'all',
  className,
  bodyClassName,
  style,
  children,
  ...rest
}: CardProps) {
  // ----- tone -----
  const toneClasses =
    tone === 'raised'
      ? 'bg-surface-2 dark:bg-surface-dark'
      : tone === 'flat'
        ? 'bg-surface dark:bg-surface-dark'
        : 'bg-muted/60 dark:bg-muted-dark/60';

  // ----- border -----
  const borderClasses = bordered
    ? 'border border-border dark:border-border-dark'
    : 'border-0';

  // ----- shadow -----
  const shadowClasses =
    tone === 'raised'
      ? shadowOnDark
        ? 'shadow-none dark:shadow-card'
        : 'shadow-none'
      : 'shadow-none';

  // ----- radius -----
  const radiusClasses =
    radius === 'all'
      ? 'rounded-2xl'
      : radius === 'top-none'
        ? 'rounded-b-2xl rounded-t-none'
        : radius === 'bottom-none'
          ? 'rounded-t-2xl rounded-b-none'
          : 'rounded-none';

  const outer = [
    radiusClasses,
    toneClasses,
    borderClasses,
    shadowClasses,
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const bodyPad = inset ? 'px-4 py-4' : 'px-0 py-0';

  return (
    <View className={outer} style={style} {...rest}>
      {(title || subtitle || headerRight) && (
        <View className={`px-4 pt-4 ${inset ? 'pb-2' : 'pb-3'}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 min-w-0">
              {title ? (
                <Text
                  numberOfLines={1}
                  className="text-[16px] font-extrabold text-text dark:text-text-dark"
                >
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text
                  numberOfLines={1}
                  className="mt-1 text-[12px] text-text-dim dark:text-text-dimDark"
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {headerRight ? <View className="ml-3">{headerRight}</View> : null}
          </View>
        </View>
      )}

      <View className={[bodyPad, bodyClassName].filter(Boolean).join(' ')}>
        {children}
      </View>
    </View>
  );
}

export default Card;
