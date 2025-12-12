// apps/mobile/src/lib/i18n/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

// Storage key
const STORAGE_KEY = 'app.locale';

// Minimal resources
import enCommon from './locales/en/common.json';
import nlCommon from './locales/nl/common.json';

const resources = {
  en: { common: enCommon },
  nl: { common: nlCommon },
} satisfies Resource; // <- typed Resource so init picks the options overload

export type AppLocale = keyof typeof resources; // 'en' | 'nl' | ...

export async function getInitialLocale(): Promise<AppLocale> {
  const saved = (await AsyncStorage.getItem(STORAGE_KEY)) as AppLocale | null;
  if (saved && resources[saved]) return saved;

  const sys = RNLocalize.getLocales()?.[0]?.languageTag?.split('-')?.[0];
  if (sys && resources[sys as AppLocale]) return sys as AppLocale;

  return 'en';
}

export async function setLocale(lang: AppLocale) {
  await AsyncStorage.setItem(STORAGE_KEY, lang);
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(lang);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }
  await i18n.changeLanguage(lang);
}

export async function initI18n() {
  if (i18n.isInitialized) return i18n;

  const lng = await getInitialLocale();

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    // compatibilityJSON: 'v3', // ❌ remove or set to 'v4'
    compatibilityJSON: 'v4',
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  return i18n;
}

export default i18n;
