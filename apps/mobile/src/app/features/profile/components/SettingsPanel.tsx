import { View } from 'react-native';

import { Group, Panel, SectionHeader } from '@ui/primitives/Panels';
import { Item } from '@ui/primitives/primitives';

export function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: React.ComponentProps<typeof Item> extends any ? any : never; // keep type looser across versions
    onPress?: () => void;
  }>;
}) {
  return (
    <Panel>
      <SectionHeader title={title} />
      <View className="px-2 pb-3">
        <Group>
          {items.map((it, i) => (
            <View
              key={it.label}
              className={
                i > 0 ? 'border-t border-border/60 dark:border-border-dark' : ''
              }
            >
              <Item
                label={it.label}
                icon={it.icon as any}
                onPress={it.onPress}
              />
            </View>
          ))}
        </Group>
      </View>
    </Panel>
  );
}
