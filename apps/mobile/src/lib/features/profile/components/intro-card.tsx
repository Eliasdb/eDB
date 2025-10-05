import { Card } from '@ui/primitives';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  children: ReactNode; // description/content
  iconLeft?: ReactNode; // optional leading icon/avatar
  inset?: boolean; // pass-through to Card (default true)
  className?: string; // extra tailwind
  footer?: ReactNode; // optional footer (tips/links)
};

export function IntroCard({
  title,
  children,
  iconLeft,
  inset = true,
  className,
  footer,
}: Props) {
  return (
    <Card
      inset={inset}
      className={[
        // default look used across profile pages
        'rounded-2xl bg-surface-2 dark:bg-surface-dark',
        'border border-border dark:border-border-dark',
        'shadow-none dark:shadow-card',
        className ?? '',
      ].join(' ')}
    >
      <View className="flex-row items-start gap-3">
        {iconLeft ? <View className="mt-0.5">{iconLeft}</View> : null}
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
            {title}
          </Text>
          <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
            {children}
          </Text>
          {footer ? <View className="mt-3">{footer}</View> : null}
        </View>
      </View>
    </Card>
  );
}
