// apps/mobile/src/app/components/SettingsPanel.tsx
import type { ItemRowProps } from '@ui/composites/list-rows/item-row';
import {
  Panel,
  PanelGroup,
  PanelGroupItemRow,
  PanelSectionHeader,
} from '@ui/layout/panel';
import React from 'react';
import { View } from 'react-native';

export function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: ItemRowProps['icon']; // Ionicons name
    onPress?: () => void;
    value?: string; // optional trailing value
  }>;
}) {
  return (
    <Panel>
      <PanelSectionHeader title={title} />
      <View className="px-2 pb-3">
        <PanelGroup>
          {items.map((it, i) => (
            <PanelGroupItemRow
              key={it.label}
              first={i === 0}
              label={it.label}
              icon={it.icon}
              value={it.value}
              onPress={it.onPress}
            />
          ))}
        </PanelGroup>
      </View>
    </Panel>
  );
}
