// apps/mobile/src/lib/ui/HeaderUserMenu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Avatar from './Avatar';

const { Popover } = renderers;

export function HeaderUserMenu({ toolbarHeight }: { toolbarHeight: number }) {
  const router = useRouter();
  const { t } = useTranslation();
  const avatarSize = Math.min(32, toolbarHeight - 12);
  const GAP = 6;

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
        {/* Put accessibility props on a child view */}
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('menu.open', 'Open user menu')}
          className="items-center justify-center"
        >
          <Avatar size={avatarSize} />
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            paddingVertical: 0,
            minWidth: 200,
          },
        }}
      >
        <View className="bg-surface dark:bg-surface-dark rounded-xl shadow-md">
          <MenuOption onSelect={() => router.push('/profile')}>
            <Row icon="person-outline" label={t('menu.profile')} />
          </MenuOption>
          <MenuOption onSelect={() => router.push('/help')}>
            <Row icon="help-circle-outline" label={t('menu.help')} />
          </MenuOption>
          <MenuOption onSelect={() => router.replace('/(tabs)/index')}>
            <Row icon="log-out-outline" label={t('menu.logout')} danger />
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
    <View className="flex-row items-center gap-3 px-3 py-2.5">
      <Ionicons
        name={icon}
        size={18}
        className={danger ? 'text-danger' : 'text-text dark:text-text-dark'}
      />
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
