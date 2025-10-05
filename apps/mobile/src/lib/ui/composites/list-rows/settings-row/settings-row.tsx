// @ui/composites/settings-row.tsx
import { Ionicons } from '@expo/vector-icons';
import { Switch } from '@ui/primitives/forms';
import { ListRow } from '@ui/primitives/lists';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SharedProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];

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
  // optional right value text not applicable here
};

type ItemKind = SharedProps & {
  kind: 'item';
  value?: string;
  onPress?: () => void;
};

export type SettingsRowProps = ToggleKind | ItemKind;

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

  const right =
    props.kind === 'toggle' ? (
      <Switch value={!!props.value} onValueChange={props.onValueChange} />
    ) : (
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
        props.kind === 'item' && props.onPress ? 'button' : 'none'
      }
    />
  );

  if (props.kind === 'item' && props.onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
        {row}
      </TouchableOpacity>
    );
  }

  return row;
}

/* ---- Back-compat thin wrappers (optional, keeps existing imports working) ---- */

export type ToggleRowProps = Omit<ToggleKind, 'kind'>;
export function ToggleRow(p: ToggleRowProps) {
  return <SettingsRow kind="toggle" {...p} />;
}

export type ItemRowProps = Omit<ItemKind, 'kind'>;
export function ItemRow(p: ItemRowProps) {
  return <SettingsRow kind="item" {...p} />;
}

export default SettingsRow;
