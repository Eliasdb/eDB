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
import { colors, radius } from './theme';

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
            borderRadius: radius.md,
            paddingVertical: 6,
            minWidth: 200,
            backgroundColor: colors.white,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 4,
          },
          optionWrapper: { paddingVertical: 12, paddingHorizontal: 14 },
          optionText: { fontSize: 16 },
        }}
      >
        <MenuOption onSelect={() => router.push('/profile')}>
          <Row icon="person-outline" label="Profile" />
        </MenuOption>
        <MenuOption onSelect={() => router.push('/help')}>
          <Row icon="help-circle-outline" label="Help" />
        </MenuOption>
        <MenuOption onSelect={() => router.replace('/(tabs)/index')}>
          <Row icon="log-out-outline" label="Log out" danger />
        </MenuOption>
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Ionicons name={icon} size={18} color={danger ? '#d00' : '#333'} />
      <Text
        style={{
          fontSize: 16,
          color: danger ? '#d00' : '#111',
          fontWeight: danger ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
