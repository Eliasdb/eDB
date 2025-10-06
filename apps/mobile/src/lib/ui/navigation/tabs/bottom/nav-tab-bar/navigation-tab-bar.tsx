// apps/mobile/src/lib/ui/navigation/NavigationTabBar.tsx
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import BottomNav from '../bottom-nav/bottom-nav';

export function NavigationTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label =
      (options.tabBarLabel as string) ?? options.title ?? route.name;
    const focused = state.index === index;

    const iconRenderer = options.tabBarIcon
      ? ({
          color,
          size,
          focused: f,
        }: {
          color: string;
          size: number;
          focused: boolean;
        }) => options.tabBarIcon!({ color, size, focused: f })
      : ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="ellipse" size={size} color={color} />
        );

    const anyOpts = options as any;
    const badge = anyOpts.tabBarBadge;
    const testID: string | undefined =
      anyOpts.tabBarTestID ?? anyOpts.tabBarAccessibilityLabel ?? undefined;
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
      roundedActive
    />
  );
}
