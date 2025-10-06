import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

const KEY = 'theme:override';
type ThemeOverride = 'light' | 'dark' | 'system';

export function useThemeOverride() {
  // Getter may be: 'light' | 'dark' | undefined  (undefined ≙ system)
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // Normalize getter to our own union that includes 'system'
  const override: ThemeOverride =
    colorScheme === undefined ? 'system' : colorScheme;

  // Compute effective for UI (StatusBar, etc.)
  const system = Appearance.getColorScheme(); // 'light' | 'dark' | null
  const effective: 'light' | 'dark' =
    override === 'system' ? (system === 'dark' ? 'dark' : 'light') : override;

  // Restore saved override on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          // IMPORTANT: never pass undefined; pass 'system' literally
          setColorScheme(saved as ThemeOverride);
        }
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist + apply (NEVER pass undefined)
  async function setOverride(v: ThemeOverride) {
    try {
      await AsyncStorage.setItem(KEY, v);
    } catch {}
    setColorScheme(v); // OK: v is 'light' | 'dark' | 'system'
  }

  return {
    override, // 'light' | 'dark' | 'system' (safe to show in UI)
    setOverride, // setter (persists + applies)
    effective, // 'light' | 'dark'
    toggleColorScheme, // still available from nativewind
  };
}
