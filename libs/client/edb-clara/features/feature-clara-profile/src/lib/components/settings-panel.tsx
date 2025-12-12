// SettingsPanel.tsx
import {
  Panel,
  PanelGroup,
  PanelGroupItemRow,
  PanelSectionHeader,
} from '@edb/shared-ui-rn';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: IconName;
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
