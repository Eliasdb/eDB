/* -----------------------------------------------------------------------------
 * Panel (outer container)
 * ---------------------------------------------------------------------------*/
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';

// ⬇️ Your row primitives (the new ones you posted)
import {
  ItemRow,
  type ItemRowProps,
} from '../../composites/list-rows/item-row';

import AccordionRow from '../../composites/list-rows/accordion-row/accordion-row';
import {
  ToggleRow,
  type ToggleRowProps,
} from '../../composites/list-rows/toggle-row';

/** Outer panel container */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={[
        'rounded-2xl overflow-hidden',
        'bg-surface-2/90 dark:bg-surface-dark/95',
        'border border-border/60 dark:border-border-dark',
        Platform.OS !== 'android'
          ? 'shadow-[0_1px_8px_rgba(0,0,0,0.05)] dark:shadow-none'
          : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </View>
  );
}

/** Title + helper text for a panel section */
export function PanelSectionHeader({
  title,
  subtitle = 'Manage and configure related options.',
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="px-4 pt-4 pb-3">
      <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
        {title}
      </Text>
      <Text className="text-[12px] mt-1 text-text-dim dark:text-text-dimDark">
        {subtitle}
      </Text>
    </View>
  );
}

/** Groups rows and applies rounding/overflow. */
export function PanelGroup({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-xl overflow-hidden bg-surface-2/60 dark:bg-transparent border border-border/60 dark:border-border-dark">
      {children}
    </View>
  );
}

/** Adds the standard divider between items (unless `first`) */
export function PanelGroupItem({
  children,
  first,
  className,
}: {
  children: React.ReactNode;
  first?: boolean;
  className?: string;
}) {
  return (
    <View
      className={[
        first ? '' : 'border-t border-border/60 dark:border-border-dark',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </View>
  );
}

/** Convenience wrapper for ItemRow with built-in divider handling */
export function PanelGroupItemRow(props: ItemRowProps & { first?: boolean }) {
  const { first, ...rest } = props;
  return (
    <PanelGroupItem first={first}>
      <ItemRow {...rest} />
    </PanelGroupItem>
  );
}

/** Convenience wrapper for ToggleRow with built-in divider handling */
export function PanelGroupItemSwitch(
  props: ToggleRowProps & { first?: boolean },
) {
  const { first, ...rest } = props;
  return (
    <PanelGroupItem first={first}>
      <ToggleRow {...rest} />
    </PanelGroupItem>
  );
}

export function PanelGroupItemAccordionRow({
  label,
  icon,
  children,
  defaultOpen = false,
  first,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  children: React.ReactNode;
  defaultOpen?: boolean;
  first?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <PanelGroupItem first={first}>
      <AccordionRow
        label={label}
        icon={icon}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
      {open ? <View className="px-3 pb-3">{children}</View> : null}
    </PanelGroupItem>
  );
}

export default Panel;
