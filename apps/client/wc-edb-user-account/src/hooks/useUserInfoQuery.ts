import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo } from '../services/user-service';

export function useUserInfoQuery(token: string | null) {
  return useQuery({
    queryKey: ['userInfo', token],
    queryFn: () => {
      if (!token) throw new Error('Missing token');
      return fetchUserInfo(token);
    },
    enabled: !!token,
  });
}
