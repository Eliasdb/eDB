import { Redirect, useLocalSearchParams } from 'expo-router';

export default function CompanyIdIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Redirect
      href={{
        pathname: '/(tabs)/crm/(features)/companies/[id]/snapshot',
        params: { id },
      }}
    />
  );
}
