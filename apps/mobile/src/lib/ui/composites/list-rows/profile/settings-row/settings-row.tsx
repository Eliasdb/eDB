// @ui/composites/settings-row.tsx
import { Ionicons } from '@expo/vector-icons';
import { Switch } from '@ui/primitives/forms';
import { ListRow } from '@ui/primitives/lists';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type SharedProps = {
  label: string;
  icon: IconName;

  // borders / layout
  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
  compact?: boolean;
  showDividerTop?: boolean;

  // spacing tweak for left slot (kept from your ListRow usage)
  leftGap?: number;
  leftInline?: boolean;
};

type ToggleKind = SharedProps & {
  kind: 'toggle';
  value: boolean;
  onValueChange: (v: boolean) => void;
};

type ItemKind = SharedProps & {
  kind: 'item';
  value?: string;
  onPress?: () => void;
};

type AccordionKind = SharedProps & {
  kind: 'accordion';
  open?: boolean;
  onToggle?: () => void;
};

export type SettingsRowProps = ToggleKind | ItemKind | AccordionKind;

function borderClass(
  border?: boolean,
  pos: SharedProps['borderPosition'] = 'bottom',
) {
  if (!border) return '';
  switch (pos) {
    case 'all':
      return 'border border-border dark:border-border-dark';
    case 'y':
      return 'border-y border-border dark:border-border-dark';
    case 'top':
      return 'border-t border-border dark:border-border-dark';
    default:
      return 'border-b border-border dark:border-border-dark';
  }
}

export function SettingsRow(props: SettingsRowProps) {
  const {
    label,
    icon,
    border,
    borderPosition = 'bottom',
    compact,
    showDividerTop,
    leftGap = 12,
    leftInline = true,
  } = props;

  const left = (
    <View className="items-center">
      <Ionicons name={icon} size={18} color="#6B7280" />
    </View>
  );

  const body = (
    <Text className="text-[16px] text-text dark:text-text-dark">{label}</Text>
  );

  let right: React.ReactNode = null;

  if (props.kind === 'toggle') {
    right = (
      <Switch value={!!props.value} onValueChange={props.onValueChange} />
    );
  } else if (props.kind === 'item') {
    right = (
      <View className="flex-row items-center gap-2">
        {props.value ? (
          <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
            {props.value}
          </Text>
        ) : null}
        {props.onPress ? (
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        ) : null}
      </View>
    );
  } else {
    // accordion
    right = (
      <Ionicons
        name={props.open ? 'chevron-up' : 'chevron-down'}
        size={18}
        color="#6B7280"
      />
    );
  }

  const row = (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
      className={borderClass(border, borderPosition)}
      leftInline={leftInline}
      leftGap={leftGap}
      accessibilityRole={
        (props.kind === 'item' && props.onPress) ||
        (props.kind === 'accordion' && props.onToggle)
          ? 'button'
          : 'none'
      }
    />
  );

  // Clickable wrappers
  if (props.kind === 'item' && props.onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
        {row}
      </TouchableOpacity>
    );
  }
  if (props.kind === 'accordion' && props.onToggle) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={props.onToggle}>
        {row}
      </TouchableOpacity>
    );
  }

  return row;
}

export default SettingsRow;
