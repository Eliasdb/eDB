// apps/mobile/src/app/storybook.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import StorybookUIRoot from '../../../.rnstorybook';

const ENABLED = __DEV__ && process.env.EXPO_PUBLIC_STORYBOOK === '1';

export default function StorybookScreen() {
  const router = useRouter();

  React.useEffect(() => {
    if (!ENABLED) router.replace('/'); // bounce if flag not set....
  }, [router]);

  return ENABLED ? <StorybookUIRoot /> : null;
}
