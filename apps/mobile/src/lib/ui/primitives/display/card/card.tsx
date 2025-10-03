// @ui/primitives/Card.tsx
import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type Tone = 'raised' | 'flat' | 'muted';
type Radius = 'all' | 'top-none' | 'bottom-none' | 'none';

type CardProps = ViewProps & {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  inset?: boolean;
  tone?: Tone;
  bordered?: boolean;
  shadowOnDark?: boolean;
  radius?: Radius;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
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
  const toneClasses =
    tone === 'raised'
      ? 'bg-surface-2 dark:bg-surface-dark'
      : tone === 'flat'
        ? 'bg-surface dark:bg-surface-dark'
        : 'bg-muted/60 dark:bg-muted-dark/60';

  const borderClasses = bordered
    ? 'border border-border dark:border-border-dark'
    : 'border-0';

  const shadowClasses =
    tone === 'raised'
      ? shadowOnDark
        ? 'shadow-none dark:shadow-card'
        : 'shadow-none'
      : 'shadow-none';

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

  // ✅ Normalize top-level children: wrap any string/number in <Text>
  const normalizedChildren = React.Children.toArray(children).map((ch, i) => {
    if (typeof ch === 'string' || typeof ch === 'number') {
      return <Text key={`card_txt_${i}`}>{ch}</Text>;
    }
    return ch as React.ReactNode;
  });

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
        {normalizedChildren}
      </View>
    </View>
  );
}
