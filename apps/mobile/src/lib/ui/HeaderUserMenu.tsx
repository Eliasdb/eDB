// apps/mobile/src/lib/ui/HeaderUserMenu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
        <Avatar size={avatarSize} />
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
        {/* Wrap in a Themed View */}
        <View className="bg-surface dark:bg-surface-dark rounded-xl shadow-md">
          <MenuOption onSelect={() => router.push('/profile')}>
            <Row icon="person-outline" label="Profile" />
          </MenuOption>
          <MenuOption onSelect={() => router.push('/help')}>
            <Row icon="help-circle-outline" label="Help" />
          </MenuOption>
          <MenuOption onSelect={() => router.replace('/(tabs)/index')}>
            <Row icon="log-out-outline" label="Log out" danger />
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
  icon: any;
  label: string;
  danger?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3 px-3 py-2.5">
      <Ionicons
        name={icon}
        size={18}
        color={danger ? '#d00' : 'currentColor'}
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
