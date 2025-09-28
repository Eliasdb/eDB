// apps/mobile/src/lib/ui/CustomTabBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-white dark:bg-surface-dark border-t border-border dark:border-border-dark shadow-md px-3 py-3">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused
          ? (options.tabBarActiveTintColor ?? '#6C63FF')
          : (options.tabBarInactiveTintColor ?? '#6B7280');

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className={`
              flex-1 items-center justify-center rounded-2xl
              ${isFocused ? 'bg-primary/10' : ''}
            `}
            style={{
              paddingVertical: 10, // 🔥 more breathing room vertically
              paddingHorizontal: 6, // 🔥 more spacing horizontally
              marginHorizontal: 4, // space between buttons
            }}
          >
            {options.tabBarIcon ? (
              options.tabBarIcon({ color, size: 24, focused: isFocused })
            ) : (
              <Ionicons name="ellipse" size={22} color={color} />
            )}
            <Text
              className={`mt-1 text-xs font-semibold ${
                isFocused
                  ? 'text-primary'
                  : 'text-text-dim dark:text-text-dimDark'
              }`}
              numberOfLines={1}
            >
              {label as string}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
