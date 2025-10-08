import { Ionicons } from '@expo/vector-icons';
import { ListRow } from '@ui/primitives/lists';
import { ComponentProps } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type AccordionRowProps = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  open?: boolean;
  onToggle?: () => void;

  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
  compact?: boolean;
  showDividerTop?: boolean;
};

export function AccordionRow({
  label,
  icon,
  open = false,
  onToggle,
  border = false,
  borderPosition = 'bottom',
  compact,
  showDividerTop,
}: AccordionRowProps) {
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
      <Ionicons name={icon} size={20} color="#6B7280" />
    </View>
  );

  const body = (
    <Text className="text-[16px] text-text dark:text-text-dark">{label}</Text>
  );

  const right = (
    <Ionicons
      name={open ? 'chevron-up' : 'chevron-down'}
      size={18}
      color="#6B7280"
    />
  );

  const row = (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
      className={borderCN}
      leftInline // match spacing used in panel/accordion headers
      leftGap={12} // same as gap-3
    />
  );

  return onToggle ? (
    <TouchableOpacity activeOpacity={0.85} onPress={onToggle}>
      {row}
    </TouchableOpacity>
  ) : (
    row
  );
}

export default AccordionRow;
