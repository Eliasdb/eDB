// Hooks
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI
import {
  Panel,
  PanelGroup,
  PanelGroupItemAccordionRow,
  PanelGroupItemRow,
  PanelGroupItemSwitch,
  PanelSectionHeader,
} from '@ui/layout/panel';
import { LanguagePicker, ThemePicker } from '@ui/widgets';
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
  const { t } = useTranslation();

  return (
    <Panel className="mt-3">
      <PanelSectionHeader title={title} />
      <View className="px-2 pb-4">
        <PanelGroup>
          <PanelGroupItemSwitch
            first
            label={notificationItemLabel}
            icon="notifications-outline"
            value={notificationsOn}
            onValueChange={setNotificationsOn}
          />

          <PanelGroupItemRow
            label={voiceItemLabel}
            icon="volume-high-outline"
            onPress={onPressVoice}
          />

          <PanelGroupItemAccordionRow
            label={t('theme.title')}
            icon="color-palette-outline"
          >
            <ThemePicker />
          </PanelGroupItemAccordionRow>

          <PanelGroupItemAccordionRow
            label={t('profile.language')}
            icon="language-outline"
          >
            <LanguagePicker />
          </PanelGroupItemAccordionRow>
        </PanelGroup>
      </View>
    </Panel>
  );
}
