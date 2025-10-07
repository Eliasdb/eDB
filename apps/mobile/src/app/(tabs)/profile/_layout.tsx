import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // your personal-details has its own custom header
        presentation: 'modal', // change to 'modal' if you ever want it to slide up
      }}
    />
  );
}
