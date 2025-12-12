// app/(tabs)/profile/(features)/_layout.tsx
import { SubHeader } from '@edb/shared-ui-rn';
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
            translucent
            bordered
          />
        ),
        headerShown: true,
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="profile-container/index" />

      {/* normal page */}
      <Stack.Screen
        name="integrations"
        options={{
          title: t('profile.integrations', 'External integrations'),
          presentation: 'formSheet', // only here, not on the parent stack
          animation: 'slide_from_bottom', // optional
          contentStyle: { backgroundColor: 'transparent' }, // keeps your own bg
        }}
      />

      {/* this one opens as a formSheet/sheet on iOS */}
      <Stack.Screen
        name="personal-details"
        options={{
          title: t('profile.personalDetails', 'Personal details'),
          presentation: 'formSheet', // only here, not on the parent stack
          animation: 'slide_from_bottom', // optional
          contentStyle: { backgroundColor: 'transparent' }, // keeps your own bg
        }}
      />

      <Stack.Screen
        name="security"
        options={{
          title: t('profile.security', 'Security'),
          presentation: 'formSheet', // only here, not on the parent stack
          animation: 'slide_from_bottom', // optional
          contentStyle: { backgroundColor: 'transparent' }, // keeps your own bg
        }}
      />
      <Stack.Screen
        name="voice-mode"
        options={{
          title: t('profile.voiceMode', 'Voice mode'),
          presentation: 'formSheet', // only here, not on the parent stack
          animation: 'slide_from_bottom', // optional
          contentStyle: { backgroundColor: 'transparent' }, // keeps your own bg
        }}
      />
    </Stack>
  );
}
