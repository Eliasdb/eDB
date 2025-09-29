// apps/mobile/src/lib/ui/AppHeader.tsx
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderUserMenu } from '../navigation/HeaderUserMenu';

export function AppHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const TOOLBAR_H = 56;
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        paddingTop: insets.top,

        // Native: whisper-light shadow only in light mode
        ...(Platform.OS !== 'web'
          ? {
              shadowColor: '#000',
              shadowOpacity: 0.03, // softer than before
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }
          : {}),

        // Android elevation—keep tiny
        ...(Platform.OS === 'android' ? { elevation: 1 } : {}),
      }}
      className={[
        // LIGHT: slightly brighter than page + blur
        'bg-white/85',
        // DARK: keep matte
        'dark:bg-surface-dark/95',
        'backdrop-blur-sm',

        // Hairline divider (lighter in light mode)
        isWeb
          ? 'border-b border-border/40 dark:border-border-dark/60'
          : 'border-b-[0.5px] border-border/40 dark:border-border-dark/60',

        // Very subtle custom shadow on web (lighter than shadow-sm)
        isWeb ? 'shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] dark:shadow-none' : '',

        // Optional: keep fixed
        isWeb ? 'sticky top-0 z-10' : '',
      ].join(' ')}
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
