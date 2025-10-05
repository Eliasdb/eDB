import {
  Panel,
  PanelGroup,
  PanelGroupItemRow,
  PanelSectionHeader,
} from '@ui/layout/panel';
import { View } from 'react-native';

import type { ItemRowProps } from '@ui/composites/list-rows/item-row';

export function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: ItemRowProps['icon'];
    onPress?: () => void;
    value?: string;
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
