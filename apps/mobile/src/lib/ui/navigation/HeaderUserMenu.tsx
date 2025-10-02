// apps/mobile/src/lib/ui/HeaderUserMenu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { useThemePreference } from '../providers/themePreference';

const { Popover } = renderers;

type Props = {
  toolbarHeight: number;
  /** Provide this from a routed screen/layout if you want menu items to navigate */
  onNavigate?: (path: string, opts?: { replace?: boolean }) => void;
};

export function HeaderUserMenu({ toolbarHeight, onNavigate }: Props) {
  const { t } = useTranslation();
  const { effective } = useThemePreference();
  const dark = effective === 'dark';
  const GAP = 6;

  const iconName: React.ComponentProps<typeof Ionicons>['name'] =
    'options-outline';

  const iconColor = dark ? '#E5E7EB' : '#111827';
  const bg = dark ? '#111827' : '#F3F4F6';
  const border = dark ? '#374151' : '#E5E7EB';

  const goto = (path: string, opts?: { replace?: boolean }) =>
    onNavigate?.(path, opts);

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
          },
        }}
      >
        <View className="bg-surface dark:bg-surface-dark rounded-xl overflow-hidden">
          <MenuOption onSelect={() => goto('/profile')}>
            <Row icon="person-outline" label={t('menu.profile', 'Profile')} />
          </MenuOption>
          <MenuOption onSelect={() => goto('/(support)/help')}>
            <Row icon="help-circle-outline" label={t('menu.help', 'Help')} />
          </MenuOption>
          <MenuOption onSelect={() => goto('/(tabs)/index', { replace: true })}>
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
