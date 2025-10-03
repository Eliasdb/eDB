import { Ionicons } from '@expo/vector-icons';
import { Switch } from '@ui/primitives/forms';
import { ListRow } from '@ui/primitives/lists';
import React from 'react';
import { Text, View } from 'react-native';

export type ToggleRowProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value?: boolean;
  onValueChange?: (v: boolean) => void;

  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
  compact?: boolean;
  showDividerTop?: boolean;
};

export function ToggleRow({
  label,
  icon,
  value,
  onValueChange,
  border = false,
  borderPosition = 'bottom',
  compact,
  showDividerTop,
}: ToggleRowProps) {
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

  const right = <Switch value={!!value} onValueChange={onValueChange} />;

  return (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
      className={borderCN}
      leftInline // 🔹 match PanelAccordionSection spacing
      leftGap={12} // 🔹 equals Tailwind gap-3 (~12px)
    />
  );
}

export default ToggleRow;
