// apps/mobile/src/lib/ui/widgets/theme-picker/uset.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

const KEY = 'theme:override';
type ThemeOverride = 'light' | 'dark' | 'system';

export function useThemeOverride(opts?: { restore?: boolean }) {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const override: ThemeOverride =
    colorScheme === undefined ? 'system' : colorScheme;

  const system = Appearance.getColorScheme();
  const effective: 'light' | 'dark' =
    override === 'system' ? (system === 'dark' ? 'dark' : 'light') : override;

  // Allow disabling the restore side-effect in Storybook
  const shouldRestore = opts?.restore !== false;

  useEffect(() => {
    if (!shouldRestore) return;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setColorScheme(saved as ThemeOverride);
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRestore]);

  async function setOverride(v: ThemeOverride) {
    try {
      await AsyncStorage.setItem(KEY, v);
    } catch {}
    setColorScheme(v);
  }

  return { override, setOverride, effective, toggleColorScheme };
}
