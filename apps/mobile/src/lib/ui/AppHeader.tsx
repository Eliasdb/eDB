// apps/mobile/src/lib/ui/AppHeader.tsx
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderUserMenu } from './HeaderUserMenu';
import { colors } from './theme';

export function AppHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const TOOLBAR_H = 56;
  const H_PAD = 16;

  return (
    <View
      style={{
        backgroundColor: colors.white,
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
