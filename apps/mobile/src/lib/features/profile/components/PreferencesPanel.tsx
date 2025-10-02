import { useState } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import {
  AccordionSection,
  Group,
  Panel,
  SectionHeader,
} from '@ui/primitives/Panels';
import { Item, ItemSwitch } from '@ui/primitives/primitives';
import { LanguagePicker, ThemePicker } from '@ui/widgets';

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
  const { t } = useTranslation();

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
            <AccordionSection
              title={t('theme.title')}
              icon="color-palette-outline"
            >
              <View>
                <ThemePicker />
              </View>
            </AccordionSection>
          </View>

          <View className="border-t border-border/60 dark:border-border-dark">
            <AccordionSection
              title={t('profile.language')}
              icon="language-outline"
            >
              <View>
                <LanguagePicker />
              </View>
            </AccordionSection>
          </View>
        </Group>
      </View>
    </Panel>
  );
}
