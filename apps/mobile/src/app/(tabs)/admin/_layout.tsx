// apps/mobile/src/app/(tabs)/admin/_layout.tsx
import { Stack } from 'expo-router';

export default function AdminRootLayout() {
  // This mounts a single navigator for everything under /admin/**
  return <Stack screenOptions={{ headerShown: false }} />;
}
