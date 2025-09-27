// apps/mobile/src/lib/ui/AppHeader.tsx
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderUserMenu } from './HeaderUserMenu';

export function AppHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const TOOLBAR_H = 56;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`
        bg-surface dark:bg-surface-dark
        ${Platform.OS === 'web' ? 'border-b border-border dark:border-border-dark' : 'border-b-[0.5px] border-border dark:border-border-dark'}
      `}
    >
      <View className="h-[56px] flex-row items-center justify-between px-4">
        <Text className="text-[22px] font-bold text-text dark:text-text-dark">
          {title}
        </Text>
        <HeaderUserMenu toolbarHeight={TOOLBAR_H} />
      </View>
    </View>
  );
}
