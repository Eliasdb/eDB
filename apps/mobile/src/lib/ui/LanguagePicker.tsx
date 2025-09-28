// apps/mobile/src/lib/ui/LanguagePicker.tsx
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppLocale, setLocale } from '../i18n';

const LANGS: { code: AppLocale }[] = [
  { code: 'en' },
  { code: 'nl' },
  // add more…
];

export function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const current = (i18n.language?.split('-')?.[0] as AppLocale) || 'en';

  return (
    <View className="border-t border-border dark:border-border-dark">
      <Text className="text-[16px] font-semibold text-text dark:text-text-dark px-md pt-md mb-sm">
        {t('profile.language')}
      </Text>

      {LANGS.map(({ code }) => (
        <TouchableOpacity
          key={code}
          onPress={() => setLocale(code)}
          className="flex-row items-center justify-between px-md py-md border-t border-border dark:border-border-dark"
          activeOpacity={0.7}
        >
          <Text className="text-[15px] text-text dark:text-text-dark">
            {t(`languages.${code}`)}
          </Text>
          <View
            className={`w-5 h-5 rounded-full border-2 ${
              current === code
                ? 'border-primary bg-primary'
                : 'border-border dark:border-border-dark'
            }`}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
