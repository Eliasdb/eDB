// apps/mobile/src/app/(features)/profile/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../../lib/ui/Avatar';
import { LanguagePicker } from '../../../lib/ui/LanguagePicker';
import {
  Card,
  Item,
  ItemSwitch,
  PrimaryButton,
} from '../../../lib/ui/primitives';
import { ThemePicker } from '../../../lib/ui/ThemePicker';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isWide = width >= 920; // desktop-ish breakpoint
  const contentPaddingH = isWide ? 24 : 16;
  const maxWidth = 1100;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: contentPaddingH,
          alignItems: 'center', // centers the max-width container on web/large screens
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth }} className="w-full">
          {/* Page header */}
          <View className="mb-4 px-1">
            <Text className="text-[20px] font-extrabold text-text dark:text-text-dark">
              {t('profile.title', { defaultValue: 'Profile' })}
            </Text>
            <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
              {t('profile.subtitle', {
                defaultValue:
                  'Manage your account details, preferences, and connected apps.',
              })}
            </Text>
          </View>

          {/* Responsive grid: left column profile card / right column panels */}
          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 16 : 12,
            }}
          >
            {/* Left column — Profile card */}
            <View style={{ width: isWide ? 340 : '100%' }}>
              <ProfileCard
                name={t('profile.name')}
                email={t('profile.email')}
                onChangePhoto={() => {}}
                onManageVoice={() => router.push('/profile/voice-mode')}
              />
            </View>

            {/* Right column — Panels */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <SettingsPanel
                title={t('profile.account')}
                items={[
                  {
                    label: t('profile.personalDetails'),
                    icon: 'person-outline',
                    onPress: () => router.push('/profile/personal-details'),
                  },
                  {
                    label: t('profile.security'),
                    icon: 'shield-checkmark-outline',
                    onPress: () => router.push('/profile/security'),
                  },
                  {
                    label: t('profile.connectedApps'),
                    icon: 'link-outline',
                    onPress: () => router.push('/profile/integrations'),
                  },
                ]}
              />

              <PreferencesPanel
                title={t('profile.preferences')}
                notificationItemLabel={t('settings.notifications')}
                voiceItemLabel={t('settings.voiceMode')}
                onPressVoice={() => router.push('/profile/voice-mode')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------- Pieces ------------------- */

function ProfileCard({
  name,
  email,
  onChangePhoto,
  onManageVoice,
}: {
  name: string;
  email: string;
  onChangePhoto: () => void;
  onManageVoice: () => void;
}) {
  return (
    <Card inset className="px-4 py-5 rounded-2xl">
      {/* Avatar with edit overlay */}
      <View className="items-center">
        <View className="relative">
          <Avatar size={104} />
          <Pressable
            onPress={onChangePhoto}
            hitSlop={8}
            className="
              absolute right-0 bottom-0 w-9 h-9 rounded-full items-center justify-center
              bg-muted dark:bg-muted-dark border border-border dark:border-border-dark
              active:opacity-90
            "
          >
            <Ionicons name="camera-outline" size={16} color="#6C63FF" />
          </Pressable>
        </View>

        <Text className="text-[20px] font-bold text-text dark:text-text-dark mt-3">
          {name}
        </Text>
        <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
          {email}
        </Text>

        <View className="flex-row gap-3 mt-4">
          <PrimaryButton
            label="Change photo"
            icon="image-outline"
            onPress={onChangePhoto}
          />
          <PrimaryButton
            label="Manage voice"
            icon="mic-outline"
            onPress={onManageVoice}
          />
        </View>
      </View>
    </Card>
  );
}

function SettingsPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress?: () => void;
  }>;
}) {
  return (
    <Card className="rounded-2xl border border-border dark:border-border-dark overflow-hidden">
      <PanelHeader title={title} />

      {/* Grouped list */}
      <View className="px-2 pb-3">
        <View className="rounded-xl overflow-hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          {items.map((it, i) => (
            <View
              key={it.label}
              className={
                i > 0 ? 'border-t border-border dark:border-border-dark' : ''
              }
            >
              <Item label={it.label} icon={it.icon} onPress={it.onPress} />
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

function PreferencesPanel({
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
    <Card className="mt-3 rounded-2xl border border-border dark:border-border-dark overflow-hidden">
      <PanelHeader title={title} />

      <View className="px-2 pb-4">
        <View className="rounded-xl overflow-hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          {/* Notifications toggle */}
          <ItemSwitch
            label={notificationItemLabel}
            icon="notifications-outline"
            value={notificationsOn}
            onValueChange={setNotificationsOn}
          />

          {/* Voice mode link */}
          <View className="border-t border-border dark:border-border-dark">
            <Item
              label={voiceItemLabel}
              icon="volume-high-outline"
              onPress={onPressVoice}
            />
          </View>

          {/* Accordion: Appearance */}
          <View className="border-t border-border dark:border-border-dark">
            <AccordionSection title="Appearance" icon="color-palette-outline">
              <View className="pt-2">
                <ThemePicker />
              </View>
            </AccordionSection>
          </View>

          {/* Accordion: Language */}
          <View className="border-t border-border dark:border-border-dark">
            <AccordionSection title="Language" icon="language-outline">
              <View className="pt-2">
                <LanguagePicker />
              </View>
            </AccordionSection>
          </View>
        </View>
      </View>
    </Card>
  );
}

function PanelHeader({ title }: { title: string }) {
  return (
    <View className="px-4 pt-4 pb-3">
      <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
        {title}
      </Text>
      <Text className="text-[12px] mt-1 text-text-dim dark:text-text-dimDark">
        Manage and configure related options.
      </Text>
    </View>
  );
}

/* ------------------- Accordion ------------------- */

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="px-3 py-3 flex-row items-center justify-between active:opacity-95"
      >
        <View className="flex-row items-center gap-2">
          <Ionicons
            name={icon}
            size={16}
            className="text-text-dim dark:text-text-dimDark"
          />
          <Text className="text-[14px] font-semibold text-text dark:text-text-dark">
            {title}
          </Text>
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          className="text-text-dim dark:text-text-dimDark"
        />
      </Pressable>

      {open ? <View className="px-3 pb-3">{children}</View> : null}
    </View>
  );
}
