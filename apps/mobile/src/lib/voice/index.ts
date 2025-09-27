// Public types
export type {
  RealtimeConnections,
  RealtimeOptions,
  RealtimeToken,
} from './types';

// Platform-specific surface
export { connectRealtime } from './realtimeClient.web'; // default resolution for web
