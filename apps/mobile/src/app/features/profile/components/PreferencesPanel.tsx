import {
  AccordionSection,
  Group,
  Panel,
  SectionHeader,
} from '@ui/primitives/Panels';
import { Item, ItemSwitch } from '@ui/primitives/primitives';
import { LanguagePicker } from '@ui/widgets/LanguagePicker';
import { ThemePicker } from '@ui/widgets/ThemePicker';
import React, { useState } from 'react';
import { View } from 'react-native';

export function PreferencesPanel({
  title,
  notificationItemLabel,
  voiceItemLabel,
  onPressVoice,
}: {
  title: string;
  notificationItemLabel: string;
  voiceItemLabel: string;
  onPressVoice: () => void;
}) {
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <Panel className="mt-3">
      <SectionHeader title={title} />
      <View className="px-2 pb-4">
        <Group>
          <ItemSwitch
            label={notificationItemLabel}
            icon="notifications-outline"
            value={notificationsOn}
            onValueChange={setNotificationsOn}
          />

          <View className="border-t border-border/60 dark:border-border-dark">
            <Item
              label={voiceItemLabel}
              icon="volume-high-outline"
              onPress={onPressVoice}
            />
          </View>

          <View className="border-t border-border/60 dark:border-border-dark">
            <AccordionSection title="Appearance" icon="color-palette-outline">
              <View className="pt-2">
                <ThemePicker />
              </View>
            </AccordionSection>
          </View>

          <View className="border-t border-border/60 dark:border-border-dark">
            <AccordionSection title="Language" icon="language-outline">
              <View className="pt-2">
                <LanguagePicker />
              </View>
            </AccordionSection>
          </View>
        </Group>
      </View>
    </Panel>
  );
}
