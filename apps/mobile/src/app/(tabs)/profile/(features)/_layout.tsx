// apps/mobile/src/app/(tabs)/profile/(features)/_layout.tsx
import { SubHeader } from '@ui/navigation';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function FeaturesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        header: ({ navigation, options }) => (
          <SubHeader
            title={(options.title as string) ?? t('profile.title', 'Profile')}
            onBack={() => navigation.goBack()}
            translucent // keeps your subtle blur / 95% bg
            bordered // or false if you don’t want the hairline
          />
        ),
        headerShown: true,
        headerTransparent: false, // <-- key: do NOT overlay content
        headerShadowVisible: false, // hide native shadow line
        headerStyle: { backgroundColor: 'transparent' }, // maintain your styling
      }}
    >
      <Stack.Screen
        name="integrations"
        options={{ title: t('profile.integrations', 'External integrations') }}
      />
      <Stack.Screen
        name="personal-details"
        options={{ title: t('profile.personalDetails', 'Personal details') }}
      />
      <Stack.Screen
        name="security"
        options={{ title: t('profile.security', 'Security') }}
      />
      <Stack.Screen
        name="voice-mode"
        options={{ title: t('profile.voiceMode', 'Voice mode') }}
      />
    </Stack>
  );
}
