// apps/mobile/src/lib/ui/primitives/BottomNav.tsx
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomNavItem = {
  key: string;
  label: string;
  icon?:
    | React.ReactNode
    | ((p: {
        color: string;
        size: number;
        focused: boolean;
      }) => React.ReactNode);
  badge?: number | string | boolean; // falsey to hide; true => dot
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  activeTint?: string;
  inactiveTint?: string;
  safe?: boolean;
  elevate?: boolean;
  roundedActive?: boolean;
  height?: number; // px baseline for native (web will use rem classes)
  iconSize?: number;
};

export default function BottomNav({
  items,
  activeKey,
  onChange,
  activeTint = '#6C63FF',
  inactiveTint = '#6B7280',
  safe = true,
  elevate = true,
  roundedActive = true,
  height = 56, // ~ h-14
  iconSize = 24,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const padBottom = safe ? Math.max(insets.bottom, 6) : 6;
  const isWeb = Platform.OS === 'web';

  return (
    // in BottomNav.tsx, container <View>
    <View
      className={`bg-white dark:bg-surface-dark border-t border-border dark:border-border-dark ${
        isWeb ? 'px-3 py-3' : ''
      }`}
      style={{
        paddingHorizontal: isWeb ? undefined : 8,
        paddingTop: isWeb ? undefined : 6,
        // ⬇️ was: paddingBottom: padBottom,
        paddingBottom: isWeb ? undefined : padBottom, // keep web symmetric (py-3), add inset only on native
        ...(Platform.OS === 'android' && elevate ? { elevation: 10 } : null),
        ...(Platform.OS !== 'android' && elevate
          ? {
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: -2 },
            }
          : null),
      }}
    >
      <View className="flex-row">
        {items.map((it) => {
          const focused = it.key === activeKey;
          const color = focused ? activeTint : inactiveTint;

          return (
            <Pressable
              key={it.key}
              onPress={() => {
                it.onPress?.();
                onChange?.(it.key);
              }}
              onLongPress={it.onLongPress}
              testID={it.testID}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              className={[
                'flex-1 items-center justify-center',
                isWeb ? 'mx-1 px-3 py-3' : '',
                roundedActive && focused ? 'rounded-2xl bg-primary/10' : '',
                isWeb ? 'min-h-14' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={({ pressed }) => ({
                // native spacing (web uses rem classes above)
                ...(isWeb
                  ? null
                  : {
                      marginHorizontal: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 10,
                      minHeight: height,
                    }),
                opacity: pressed ? 0.95 : 1,
              })}
            >
              <View style={{ position: 'relative', alignItems: 'center' }}>
                {/* icon */}
                <View>
                  {typeof it.icon === 'function'
                    ? it.icon({ color, size: iconSize, focused })
                    : it.icon}
                </View>

                {/* badge */}
                {it.badge ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -10,
                      minWidth: typeof it.badge === 'boolean' ? 8 : 18,
                      height: typeof it.badge === 'boolean' ? 8 : 18,
                      borderRadius: 9,
                      paddingHorizontal: typeof it.badge === 'boolean' ? 0 : 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ef4444',
                    }}
                  >
                    {typeof it.badge === 'boolean' ? null : (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 11,
                          fontWeight: '700',
                        }}
                      >
                        {it.badge}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>

              {/* label */}
              <Text
                className={
                  focused
                    ? 'text-primary'
                    : 'text-text-dim dark:text-text-dimDark'
                }
                numberOfLines={1}
                style={{
                  marginTop: isWeb ? 4 : 4,
                  fontSize: 12,
                  fontWeight: '600',
                  color,
                }}
              >
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
