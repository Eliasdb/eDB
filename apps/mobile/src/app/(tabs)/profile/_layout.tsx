import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // your personal-details has its own custom header
      }}
    />
  );
}
