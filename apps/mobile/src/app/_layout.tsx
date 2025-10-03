import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { AppState, Platform, View } from 'react-native';

// Tanstack
import { getQueryClient } from '@api';
import { QueryClientProvider, focusManager } from '@tanstack/react-query';

// Expo
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Providers
import { I18nextProvider } from 'react-i18next';
import { MenuProvider } from 'react-native-popup-menu';

// Styling
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '@ui/providers/themePreference';
import { colorScheme } from 'nativewind';
import '../../global.css';

// i18n
import { initI18n } from '../lib/i18n';

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

  // Override NativeWind's color scheme
  useEffect(() => {
    colorScheme.set(isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 bg-surface dark:bg-surface-dark">
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

    if (Platform.OS === 'web') {
      import('@shopify/react-native-skia/lib/module/web').then(
        ({ LoadSkiaWeb }) => {
          LoadSkiaWeb({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}`,
          });
        },
      );
    }

    return () => {
      mounted = false;
    };
  }, []);

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
