// libs/ui/composites/activity/activities-overview.tsx
import type { Activity } from '@api/core/types';
import { Card, EmptyLine, List } from '@ui/primitives';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TwoLineRow } from '../list-rows/crm/info-row/info-row';

type IconName = React.ComponentProps<
  typeof import('@expo/vector-icons').Ionicons
>['name'];

export type ActivitiesOverviewProps = {
  title?: string;
  activities?: Activity[];
  /** Optional UI on the right side of the header (e.g., "Add note" button) */
  headerActions?: React.ReactNode;
  /** Override the secondary line (defaults to `${type} • ${at}`) */
  renderSecondary?: (a: Activity) => React.ReactNode;
  /** Optional press handler per activity (e.g., open details) */
  onPressItem?: (a: Activity) => void;
  /** Provide custom icon per activity type */
  iconForType?: (t: Activity['type']) => IconName;
  /** Text when there are no activities */
  emptyText?: string;
};

const defaultIconForType = (t: Activity['type']): IconName => {
  switch (t) {
    case 'note':
      return 'document-text-outline';
    case 'call':
      return 'call-outline';
    case 'email':
      return 'mail-outline';
    case 'meeting':
      return 'people-outline';
    case 'status':
      return 'flag-outline';
    case 'system':
    default:
      return 'chatbubble-ellipses-outline';
  }
};

export function ActivitiesOverview({
  title = 'Timeline',
  activities = [],
  headerActions,
  renderSecondary,
  onPressItem,
  iconForType = defaultIconForType,
  emptyText = 'No activity yet',
}: ActivitiesOverviewProps) {
  return (
    <View className="px-4">
      {/* Header with optional actions (keeps your tags/hero separate) */}
      <View className="mt-8 mb-2 flex-row items-center justify-between">
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark ml-[4px] uppercase tracking-wide">
          {title}
        </Text>
        {headerActions ?? null}
      </View>

      <Card inset={false} bodyClassName="p-0 overflow-hidden">
        {activities.length ? (
          <List>
            {activities.map((a, idx) => {
              const content = (
                <TwoLineRow
                  icon={iconForType(a.type)}
                  primary={a.summary}
                  secondary={
                    renderSecondary ? renderSecondary(a) : `${a.type} • ${a.at}`
                  }
                />
              );
              return (
                <List.Item key={a.id} first={idx === 0}>
                  {onPressItem ? (
                    <Pressable onPress={() => onPressItem(a)}>
                      {content}
                    </Pressable>
                  ) : (
                    content
                  )}
                </List.Item>
              );
            })}
          </List>
        ) : (
          <EmptyLine text={emptyText} />
        )}
      </Card>
    </View>
  );
}
