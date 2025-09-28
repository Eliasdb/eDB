// apps/mobile/src/app/_layout.tsx
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { AppState, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

import '../../global.css';
import { getQueryClient } from '../lib/api/queryClient';
import { initI18n } from '../lib/i18n'; // <- from the i18n setup we created
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '../lib/ui/themePreference';

const queryClient = getQueryClient();

// Keep RN AppState wired to React Query focus
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
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const inst = await initI18n();
      if (mounted) setI18nInstance(inst);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Optional tiny splash while i18n loads (usually very fast)
  if (!i18nInstance) {
    return <View className="flex-1 bg-surface dark:bg-surface-dark" />;
  }

  return (
    <MenuProvider
      customStyles={{ backdrop: { backgroundColor: 'rgba(0,0,0,0.08)' } }}
    >
      <I18nextProvider i18n={i18nInstance}>
        <QueryClientProvider client={queryClient}>
          <ThemePreferenceProvider>
            <RootInner />
          </ThemePreferenceProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </MenuProvider>
  );
}
