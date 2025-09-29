import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type CardProps = ViewProps & {
  /** Title shown in a header row (optional) */
  title?: string;
  /** Small line under the title (optional) */
  subtitle?: string;
  /** Right side of the header row (optional) */
  headerRight?: React.ReactNode;
  /** Add inner padding. Defaults to true. */
  inset?: boolean;
  /** Extra classNames for the outer and inner wrappers */
  className?: string;
  bodyClassName?: string;
};

export function Card({
  title,
  subtitle,
  headerRight,
  inset = true,
  className,
  bodyClassName,
  style,
  children,
  ...rest
}: CardProps) {
  const outer = [
    'rounded-2xl',
    'bg-surface-2 dark:bg-surface-dark',
    'border border-border dark:border-border-dark',
    'shadow-none dark:shadow-card',
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
