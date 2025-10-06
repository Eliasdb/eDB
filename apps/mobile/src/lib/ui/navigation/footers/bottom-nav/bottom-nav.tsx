import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavItem, BottomNavItemModel } from './bottom-nav-item';

export type BottomNavProps = ViewProps & {
  items: BottomNavItemModel[];
  activeKey: string;
  onChange?: (key: string) => void;
  activeTint?: string;
  inactiveTint?: string;
  iconSize?: number;
  elevate?: boolean;
  roundedActive?: boolean;
};

export default function BottomNav({
  items,
  activeKey,
  onChange,
  activeTint = '#6C63FF',
  inactiveTint = '#6B7280',
  iconSize = 24,
  elevate = true,
  roundedActive = true,
  style,
  ...rest
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 6);

  return (
    <View style={[{ alignSelf: 'stretch', width: '100%' }, style]} {...rest}>
      <View
        className="bg-white dark:bg-surface-dark border-t border-border dark:border-border-dark"
        style={{
          paddingHorizontal: 12,
          paddingTop: Platform.OS === 'web' ? 16 : 8,
          paddingBottom:
            Platform.OS === 'ios'
              ? padBottom - 8 // iOS → less padding
              : padBottom + 8, // Android + Web → extra padding          ...(Platform.OS === 'android' && elevate ? { elevation: 10 } : null),
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
        <View
          style={{
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
          }}
        >
          {items.map((it) => (
            <BottomNavItem
              key={it.key}
              item={it}
              active={activeKey === it.key}
              onChange={onChange}
              activeTint={activeTint}
              inactiveTint={inactiveTint}
              iconSize={iconSize}
              roundedActive={roundedActive}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
