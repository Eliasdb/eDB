import { Ionicons } from '@expo/vector-icons';
import { ListRow } from '@ui/primitives/lists';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type ItemRowProps = {
  label: string;
  value?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;

  /** Optional borders for when not using <List.Item> wrapper */
  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
  compact?: boolean;
  showDividerTop?: boolean;
};

export function ItemRow({
  label,
  value,
  icon,
  onPress,
  border = false,
  borderPosition = 'bottom',
  compact,
  showDividerTop,
}: ItemRowProps) {
  const borderCN = border
    ? borderPosition === 'all'
      ? 'border border-border dark:border-border-dark'
      : borderPosition === 'y'
        ? 'border-y border-border dark:border-border-dark'
        : borderPosition === 'top'
          ? 'border-t border-border dark:border-border-dark'
          : 'border-b border-border dark:border-border-dark'
    : '';

  const left = (
    <View className="items-center">
      <Ionicons name={icon} size={18} color="#6B7280" />
    </View>
  );

  const body = (
    <Text className="text-[16px] text-text dark:text-text-dark">{label}</Text>
  );

  const right = (
    <View className="flex-row items-center gap-2">
      {value ? (
        <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
          {value}
        </Text>
      ) : null}
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      ) : null}
    </View>
  );

  const Row = (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
      className={borderCN}
      leftInline
      leftGap={12}
    />
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {Row}
    </TouchableOpacity>
  ) : (
    Row
  );
}

export default ItemRow;
