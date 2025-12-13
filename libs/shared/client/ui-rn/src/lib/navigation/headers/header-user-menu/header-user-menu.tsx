// apps/mobile/src/lib/ui/headers/header-user-menu/header-user-menu.tsx
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, useColorScheme } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const { Popover } = renderers;

type Props = {
  toolbarHeight: number;
  onNavigate?: (path: string, opts?: { replace?: boolean }) => void;
};

export function HeaderUserMenu({ toolbarHeight, onNavigate }: Props) {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';
  const GAP = 8;

  const triggerBg = isDark ? '#131b2f' : '#F3F4F6';
  const triggerBorder = isDark ? '#334155' : '#E5E7EB';
  const triggerIcon = isDark ? '#E5E7EB' : '#111827';
  const menuBg = isDark ? '#030405' : '#FFFFFF';

  const goto = (path: string, opts?: { replace?: boolean }) =>
    onNavigate?.(path, opts);

  return (
    <View style={{ position: 'relative' }}>
      {/* Fallback mask to cover stubborn caret */}

      <Menu
        renderer={Popover}
        rendererProps={{
          placement: 'bottom',
          preferredPlacement: 'bottom',
          // Try all knobs; different versions honor different ones
          arrow: false,
          showArrow: false,
          arrowColor: menuBg,
          arrowStyle: { opacity: 0 },
          arrowSize: { width: 0, height: 0 },
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
          // accessibilityLabel={t('menu.open', 'Open menu')}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10, // squircle
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: triggerBg,
              borderWidth: 1,
              borderColor: triggerBorder,
              ...(Platform.OS === 'web'
                ? { cursor: 'pointer' as const }
                : null),
            }}
          >
            <Ionicons name="options-outline" size={18} color={triggerIcon} />
          </View>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 12,
              paddingVertical: 0,
              minWidth: 220,
              backgroundColor: menuBg,
              overflow: 'hidden',
              borderWidth: Platform.OS === 'web' ? 1 : 0.5,
              borderColor: isDark ? '#334155' : '#E5E7EB',
            },
          }}
        >
          <MenuOption
            onSelect={() => goto('/profile')}
            customStyles={{
              optionWrapper: { paddingHorizontal: 12, paddingVertical: 10 },
            }}
          >
            <Row icon="person-outline" label={t('menu.profile', 'Profile')} />
          </MenuOption>

          <Divider isDark={isDark} />

          <MenuOption
            onSelect={() => goto('/(support)/help')}
            customStyles={{
              optionWrapper: { paddingHorizontal: 12, paddingVertical: 10 },
            }}
          >
            <Row icon="help-circle-outline" label={t('menu.help', 'Help')} />
          </MenuOption>

          <Divider isDark={isDark} />

          <MenuOption
            onSelect={() => goto('/(tabs)/index', { replace: true })}
            customStyles={{
              optionWrapper: { paddingHorizontal: 12, paddingVertical: 10 },
            }}
          >
            <Row
              icon="log-out-outline"
              label={t('menu.logout', 'Log out')}
              danger
            />
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}

function Divider({ isDark }: { isDark: boolean }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: isDark
          ? 'rgba(51,65,85,0.6)'
          : 'rgba(229,231,235,0.85)',
        marginHorizontal: 12,
      }}
    />
  );
}

function Row({
  icon,
  label,
  danger,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  danger?: boolean;
}) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = danger ? '#EF4444' : isDark ? '#A3A3A3' : '#111827';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text
        style={{
          fontSize: 16,
          color: danger ? '#EF4444' : isDark ? '#E5E7EB' : '#111827',
          fontWeight: danger ? ('600' as const) : ('400' as const),
        }}
      >
        {label}
      </Text>
    </View>
  );
}
