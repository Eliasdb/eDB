// apps/mobile/src/lib/ui/themePreference.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type SchemeOverride = 'system' | 'light' | 'dark';
type Ctx = {
  override: SchemeOverride;
  setOverride: (v: SchemeOverride) => void;
  system: ColorSchemeName; // 'light' | 'dark' | null
  effective: 'light' | 'dark'; // what the app actually uses
};

const ThemePrefCtx = createContext<Ctx | null>(null);
const KEY = 'theme:override';

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [override, setOverride] = useState<SchemeOverride>('system');
  const [system, setSystem] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  // load saved override once
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') setOverride(v);
    });
  }, []);

  // keep system in sync
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystem(colorScheme),
    );
    return () => sub.remove();
  }, []);

  // persist override
  useEffect(() => {
    AsyncStorage.setItem(KEY, override).catch(() => undefined);
  }, [override]);

  const effective: 'light' | 'dark' =
    override === 'system' ? (system === 'dark' ? 'dark' : 'light') : override;

  const value = useMemo<Ctx>(
    () => ({ override, setOverride, system, effective }),
    [override, system, effective],
  );

  return (
    <ThemePrefCtx.Provider value={value}>{children}</ThemePrefCtx.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePrefCtx);
  if (!ctx)
    throw new Error(
      'useThemePreference must be used within ThemePreferenceProvider',
    );
  return ctx;
}
