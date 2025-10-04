import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PORT = 9101;

/**
 * Best-effort base URL for dev:
 * - Android emulator -> 10.0.2.2
 * - iOS simulator -> 127.0.0.1
 * - Expo Go / physical device -> dev machine LAN IP derived from debuggerHost
 * Fallback to localhost.
 */
export function getApiBase() {
  // Expo dev: debuggerHost is like "192.168.1.42:19000"
  const hostFromExpo =
    (Constants as any)?.expoGoConfig?.debuggerHost?.split(':')?.[0] ??
    (Constants as any)?.manifest2?.extra?.apiHost ??
    (Constants as any)?.manifest?.extra?.apiHost;

  if (Platform.OS === 'android') {
    // Android emulator special alias
    return `http://10.0.2.2:${PORT}`;
  }

  if (Platform.OS === 'ios') {
    // iOS simulator can hit host via loopback
    return `http://127.0.0.1:${PORT}`;
  }

  if (hostFromExpo) {
    return `http://${hostFromExpo}:${PORT}`;
  }

  return `http://localhost:${PORT}`;
}
