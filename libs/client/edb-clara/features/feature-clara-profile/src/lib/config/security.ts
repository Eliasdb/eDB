export type Session = {
  id: string;
  device: string;
  client: string;
  location: string;
  current?: boolean;
  lastActive?: string;
};

export function getMockSessions(): Session[] {
  return [
    {
      id: 'cur',
      device: 'MacBook Pro',
      client: 'Safari',
      location: 'Ghent, BE',
      current: true,
    },
    {
      id: 'ios',
      device: 'iPhone 15',
      client: 'Clara App',
      location: 'Ghent, BE',
      lastActive: '2h ago',
    },
    {
      id: 'win',
      device: 'Windows',
      client: 'Chrome',
      location: 'London, UK',
      lastActive: '3d ago',
    },
  ];
}

// Optional: a future-friendly hook you can swap to real API later
export function useSessions() {
  // replace with react-query / SWR later
  const data = getMockSessions();
  const isLoading = false;
  const refetch = () => {
    // placeholder for future data fetch
    return data;
  };
  return { data, isLoading, refetch };
}
