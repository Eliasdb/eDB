// @ui/panels/Panel.tsx
/* -----------------------------------------------------------------------------
 * Panel (outer container)
 * ---------------------------------------------------------------------------*/
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';

// ✅ Use the unified SettingsRow (now includes kind="accordion")
import { SettingsRow, type SettingsRowProps } from '@ui/composites';

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

/** Convenience wrapper for a SettingsRow (kind="item") with built-in divider handling */
export function PanelGroupItemRow(
  props: Omit<SettingsRowProps, 'kind'> & { first?: boolean },
) {
  const { first, ...rest } = props;
  return (
    <PanelGroupItem first={first}>
      <SettingsRow kind="item" {...rest} />
    </PanelGroupItem>
  );
}

/** Convenience wrapper for a SettingsRow (kind="toggle") with built-in divider handling */
export function PanelGroupItemSwitch(
  props: Omit<SettingsRowProps, 'kind'> & {
    first?: boolean;
    value: boolean;
    onValueChange: (v: boolean) => void;
  },
) {
  const { first, ...rest } = props;
  return (
    <PanelGroupItem first={first}>
      <SettingsRow kind="toggle" {...rest} />
    </PanelGroupItem>
  );
}

/** Accordion row using SettingsRow(kind="accordion") */
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
      <SettingsRow
        kind="accordion"
        label={label}
        icon={icon}
        open={open}
        onToggle={() => setOpen((v) => !v)}
        // optional: pass borders/compact if you use them elsewhere
        // border
        // borderPosition="y"
      />
      {open ? <View className="px-3 pb-3">{children}</View> : null}
    </PanelGroupItem>
  );
}

export default Panel;
