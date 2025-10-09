import { Badge, Card, IconButton } from '@ui/primitives';
import * as React from 'react';
import { Image, Text, View } from 'react-native';

type IonName = React.ComponentProps<
  typeof import('@expo/vector-icons').Ionicons
>['name'];

type HeroAction = {
  name: IonName;
  onPress: () => void;
  tint?: 'primary' | 'danger' | 'success' | 'neutral';
  variant?: 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  radius?: number;
  a11yLabel?: string;
};

export type EntityHeroProps = {
  title: string;
  subtitle?: React.ReactNode;
  avatarUrl?: string | null;
  initials?: string;
  badges?: { label: string; tint: string }[];
  actions?: HeroAction[]; // legacy prop, ignored if slot present
  avatarSize?: number;
  avatarRadius?: number;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode; // for slots
};

/* ---------- Slot types & helpers ---------- */

type ActionsSlotProps = { children?: React.ReactNode };
const ActionsSlot: React.FC<ActionsSlotProps> = ({ children }) => (
  <>{children}</>
);

// Narrow a ReactNode to our ActionsSlot element
function isActionsSlot(
  node: React.ReactNode,
): node is React.ReactElement<ActionsSlotProps> {
  return React.isValidElement(node) && node.type === ActionsSlot;
}

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
  children,
}: EntityHeroProps) {
  const slots = React.Children.toArray(children);
  const actionsEl = slots.find(isActionsSlot); // typed as ReactElement<ActionsSlotProps> | undefined

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
        {/* Avatar */}
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

        {/* Texts */}
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
        <View className="flex-row items-center gap-1 pr-1.5">
          {actionsEl
            ? actionsEl.props.children
            : (actions ?? []).map((a, idx) => (
                <IconButton
                  key={`${a.name}-${idx}`}
                  name={a.name}
                  tint={a.tint ?? 'neutral'}
                  variant={a.variant ?? 'ghost'}
                  size={a.size ?? 'xs'}
                  shape={a.rounded ? 'rounded' : 'circle'}
                  cornerRadius={a.rounded ? (a.radius ?? 10) : undefined}
                  accessibilityLabel={a.a11yLabel}
                  onPress={a.onPress}
                />
              ))}
        </View>
      </View>
    </Card>
  );
}

// Attach slot for ergonomic API
EntityHero.Actions = ActionsSlot;
export type { HeroAction as EntityHeroAction };
