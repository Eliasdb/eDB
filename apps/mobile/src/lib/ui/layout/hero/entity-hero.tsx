// libs/ui/composites/hero/entity-hero.tsx
import { Badge, Card } from '@ui/primitives';
import React from 'react';
import { Image, Text, View } from 'react-native';

export type EntityHeroProps = {
  title: string;
  subtitle?: React.ReactNode; // e.g. email, "Title · Company"
  avatarUrl?: string | null;
  initials?: string; // used if no avatarUrl
  badges?: { label: string; tint: string }[];
  actions?: React.ReactNode; // right-side actions (IconButtons)
  avatarSize?: number; // default 56
  avatarRadius?: number; // default 12
  className?: string;
  bodyClassName?: string;
};

export function EntityHero({
  title,
  subtitle,
  avatarUrl,
  initials,
  badges = [],
  actions,
  avatarSize = 56,
  avatarRadius = 12,
  className,
  bodyClassName,
}: EntityHeroProps) {
  return (
    <Card
      inset={false}
      tone="flat"
      bordered={false}
      className={[
        'shadow-card bg-surface-2 dark:bg-surface-2-dark',
        className ?? '',
      ].join(' ')}
      bodyClassName={['p-4', bodyClassName ?? ''].join(' ')}
    >
      <View className="flex-row items-center gap-3 pl-1.5 py-1.5">
        {/* Avatar / initials */}
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarRadius,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(148,163,184,0.18)',
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarRadius,
              }}
            />
          ) : (
            <Text className="text-text dark:text-text-dark text-[15px] font-semibold">
              {initials}
            </Text>
          )}
        </View>

        {/* Title + subtitle + badges */}
        <View className="flex-1">
          <Text
            className="text-text dark:text-text-dark text-lg font-semibold"
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle ? (
            typeof subtitle === 'string' ? (
              <Text
                className="text-text-dim dark:text-text-dimDark text-[13px]"
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : (
              subtitle
            )
          ) : null}

          {!!badges.length && (
            <View className="flex-row flex-wrap gap-2 mt-2">
              {badges.map((b, i) => (
                <Badge key={`${b.label}-${i}`} label={b.label} tint={b.tint} />
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        {actions ? (
          <View className="flex-row items-center gap-2 pr-1.5">{actions}</View>
        ) : null}
      </View>
    </Card>
  );
}
