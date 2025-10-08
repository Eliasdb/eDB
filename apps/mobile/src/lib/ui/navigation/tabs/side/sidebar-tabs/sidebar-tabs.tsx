// ui/navigation/SidebarTabs.tsx
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import TabItem from '../../tab-item/tab-item';
import type { TabDef, TabKey } from '../../tab.types';

export function SidebarTabs<K extends TabKey>({
  tabs,
  value,
  onChange,
  title,
  footer,
  idPrefix,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
  title?: string;
  footer?: ReactNode;
  idPrefix?: string; // 👈 ADD
}) {
  return (
    <View className="w-[240px] border-r border-border dark:border-border-dark pt-6">
      {title ? (
        <Text className="px-4 mb-3 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
          {title}
        </Text>
      ) : null}

      {tabs.map((t) => (
        <TabItem
          key={t.key}
          label={t.label}
          active={t.key === value}
          onPress={() => onChange(t.key)}
          variant="sidebar"
          idPrefix={idPrefix}
        />
      ))}

      {footer ? (
        <View className="mt-auto px-4 py-4 opacity-80">{footer}</View>
      ) : null}
    </View>
  );
}
