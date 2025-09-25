import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

// (Optional) network awareness on RN:
let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true, // App foreground on RN
      gcTime: 5 * 60 * 1000,
    },
  },
});

// Tie focus to AppState (RN)
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener('change', (state) => {
    handleFocus(state === 'active');
  });
  return () => sub.remove();
});

// If you installed @react-native-community/netinfo, uncomment:
// import NetInfo from '@react-native-community/netinfo';
// onlineManager.setEventListener((setOnline) => NetInfo.addEventListener((s) => setOnline(!!s.isConnected)));

export default function RootLayout() {
  return (
    <MenuProvider
      customStyles={{ backdrop: { backgroundColor: 'rgba(0,0,0,0.08)' } }}
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </MenuProvider>
  );
}
