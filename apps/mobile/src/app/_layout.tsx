// app/_layout.tsx
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import '../../global.css';
import { getQueryClient } from '../lib/api/queryClient';
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '../lib/ui/themePreference';

const queryClient = getQueryClient();

focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener('change', (s) =>
    handleFocus(s === 'active'),
  );
  return () => sub.remove();
});

function RootInner() {
  const { effective } = useThemePreference(); // "light" | "dark"
  const isDark = effective === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View
        className={
          (isDark ? 'dark ' : '') + 'flex-1 bg-surface dark:bg-surface-dark'
        }
      >
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <MenuProvider
      customStyles={{ backdrop: { backgroundColor: 'rgba(0,0,0,0.08)' } }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemePreferenceProvider>
          <RootInner />
        </ThemePreferenceProvider>
      </QueryClientProvider>
    </MenuProvider>
  );
}
