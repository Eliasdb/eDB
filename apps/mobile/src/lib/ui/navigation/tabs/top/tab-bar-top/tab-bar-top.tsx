// ui/navigation/tab-bar-top.tsx
import React from 'react';
import { View } from 'react-native';
import TabItem from '../../tab-item/tab-item';
import type { TabDef, TabKey } from '../../tab.types';

export function TabBarTop<K extends TabKey>({
  tabs,
  value,
  onChange,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <View
      className="w-full border-b border-border dark:border-border-dark px-4 py-4"
      style={{ flexShrink: 0 }}
    >
      <View className="flex-row items-center bg-muted/70 dark:bg-muted-dark/70 rounded-xl p-1">
        {tabs.map((t) => (
          <TabItem
            key={t.key}
            label={t.label}
            active={t.key === value}
            onPress={() => onChange(t.key)}
            variant="top"
          />
        ))}
      </View>
    </View>
  );
}
