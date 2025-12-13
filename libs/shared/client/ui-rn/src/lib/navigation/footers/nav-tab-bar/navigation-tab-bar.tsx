// apps/mobile/src/lib/ui/navigation/NavigationTabBar.tsx
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import BottomNav from '../bottom-nav/bottom-nav';

type TabBarOptions = {
  tabBarIcon?: (p: { color: string; size: number; focused: boolean }) => React.ReactNode;
  tabBarBadge?: React.ReactNode;
  tabBarTestID?: string;
  tabBarAccessibilityLabel?: string;
};

export function NavigationTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label =
      (options.tabBarLabel as string) ?? options.title ?? route.name;
    const focused = state.index === index;

    const typedOptions = options as TabBarOptions;
    const iconRenderer = typedOptions.tabBarIcon
      ? ({
          color,
          size,
          focused: f,
        }: {
          color: string;
          size: number;
          focused: boolean;
        }) => typedOptions.tabBarIcon?.({ color, size, focused: f })
      : ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="ellipse" size={size} color={color} />
        );

    const badgeRaw = typedOptions.tabBarBadge;
    const badge =
      typeof badgeRaw === 'string' ||
      typeof badgeRaw === 'number' ||
      typeof badgeRaw === 'boolean'
        ? badgeRaw
        : undefined;
    const testID =
      typedOptions.tabBarTestID ?? typedOptions.tabBarAccessibilityLabel;
    return {
      key: route.key,
      label: String(label),
      icon: ({
        color,
        size,
        focused,
      }: {
        color: string;
        size: number;
        focused: boolean;
      }) => iconRenderer({ color, size, focused }),
      badge,
      testID,
      onPress: () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!focused && !event.defaultPrevented)
          navigation.navigate(route.name);
      },
      onLongPress: () =>
        navigation.emit({ type: 'tabLongPress', target: route.key }),
    };
  });

  // 👇 Forward the style coming from React Navigation so the bar spans full width & anchors to bottom.

  return (
    <BottomNav
      items={items}
      activeKey={state.routes[state.index].key}
      elevate
    />
  );
}
