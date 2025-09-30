import { Group, Panel, SectionHeader } from '@ui/primitives/Panels';
import { Item } from '@ui/primitives/primitives';
import { ComponentProps } from 'react';
import { View } from 'react-native';

export function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: ComponentProps<typeof Item> extends any ? any : never;
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
