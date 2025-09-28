// apps/mobile/src/lib/ui/HeaderUserMenu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { useThemePreference } from './themePreference';

const { Popover } = renderers;

export function HeaderUserMenu({ toolbarHeight }: { toolbarHeight: number }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { effective } = useThemePreference();
  const dark = effective === 'dark';
  const GAP = 6;

  // Sleek "sliders" icon instead of avatar/kebab
  const iconName: React.ComponentProps<typeof Ionicons>['name'] =
    'options-outline';

  // Colors to match your tokens
  const iconColor = dark ? '#E5E7EB' : '#111827'; // text-dark / text
  const bg = dark ? '#111827' : '#F3F4F6'; // surface-dark-ish / muted
  const border = dark ? '#374151' : '#E5E7EB'; // border-dark / border

  return (
    <Menu
      renderer={Popover}
      rendererProps={{
        placement: 'bottom',
        preferredPlacement: 'bottom',
        showArrow: false as any,
        anchorStyle: { marginTop: GAP },
      }}
    >
      {/* IMPORTANT: Don't nest a Pressable here.
         MenuTrigger itself handles taps on its child area. */}
      <MenuTrigger
        customStyles={{
          triggerWrapper: {
            width: toolbarHeight,
            height: toolbarHeight,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {/* Accessible, styled trigger */}
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('menu.open', 'Open menu')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
            borderWidth: 1,
            borderColor: border,
            ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : null),
          }}
        >
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            paddingVertical: 0,
            minWidth: 220,
            // shadow handled by native; looks good on both themes
          },
        }}
      >
        {/* Themed container */}
        <View className="bg-surface dark:bg-surface-dark rounded-xl overflow-hidden">
          <MenuOption onSelect={() => router.push('/profile')}>
            <Row icon="person-outline" label={t('menu.profile', 'Profile')} />
          </MenuOption>
          <MenuOption onSelect={() => router.push('/help')}>
            <Row icon="help-circle-outline" label={t('menu.help', 'Help')} />
          </MenuOption>
          <MenuOption onSelect={() => router.replace('/(tabs)/index')}>
            <Row
              icon="log-out-outline"
              label={t('menu.logout', 'Log out')}
              danger
            />
          </MenuOption>
        </View>
      </MenuOptions>
    </Menu>
  );
}

function Row({
  icon,
  label,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  danger?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3 px-3 py-2.5 border-t border-border/60 dark:border-border-dark/60 first:border-t-0">
      <Ionicons name={icon} size={18} color={danger ? '#d00' : undefined} />
      <Text
        className={`text-[16px] ${
          danger
            ? 'text-danger font-semibold'
            : 'text-text dark:text-text-dark font-normal'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
