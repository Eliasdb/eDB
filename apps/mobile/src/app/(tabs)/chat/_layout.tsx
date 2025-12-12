import { Stack } from 'expo-router';

export default function ChatRootLayout() {
  // This mounts a single navigator for everything under /admin/**
  return <Stack screenOptions={{ headerShown: false }} />;
}
