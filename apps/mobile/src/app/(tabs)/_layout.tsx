// apps/mobile/src/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';

const { Popover } = renderers;

/** Avatar-triggered menu (dropdown) */
function HeaderUserMenu({ toolbarHeight }: { toolbarHeight: number }) {
  const router = useRouter(); // <-- add router
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
            paddingVertical: 6,
            minWidth: 200,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 4,
          },
          optionWrapper: { paddingVertical: 12, paddingHorizontal: 14 },
          optionText: { fontSize: 16 },
        }}
      >
        {/* Wire each option */}
        <MenuOption onSelect={() => router.push('/profile')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="person-outline" size={18} color="#333" />
            <Text style={{ fontSize: 16 }}>Profile</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => router.push('/help')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="help-circle-outline" size={18} color="#333" />
            <Text style={{ fontSize: 16 }}>Help</Text>
          </View>
        </MenuOption>

        <MenuOption
          onSelect={() => router.replace('/(tabs)/index')} // TODO: clear auth/session
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="log-out-outline" size={18} color="#d00" />
            <Text style={{ fontSize: 16, color: '#d00', fontWeight: '600' }}>
              Log out
            </Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

/** Custom header: safe-area aware, title left, avatar menu hard-right */
function AppHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const TOOLBAR_H = 56;
  const H_PAD = 16;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingTop: insets.top,
        borderBottomWidth: Platform.OS === 'web' ? 1 : 0.5,
        borderBottomColor: '#eee',
      }}
    >
      <View
        style={{
          height: TOOLBAR_H,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: H_PAD,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111' }}>
          {title}
        </Text>
        <HeaderUserMenu toolbarHeight={TOOLBAR_H} />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => (
          <AppHeader title={(options.title as string) ?? ''} />
        ),
        tabBarActiveTintColor: '#6C63FF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clara',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="admin-logs"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="terminal-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
