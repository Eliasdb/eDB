// apps/mobile/src/lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | null = null;

export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnReconnect: true,
          refetchOnWindowFocus: true,
          gcTime: 5 * 60 * 1000,
        },
      },
    });
  }
  return client;
}
