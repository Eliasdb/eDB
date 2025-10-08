import { Redirect } from 'expo-router';

export default function CRMIndex() {
  // Send the bare /crm path to the first tab
  return <Redirect href="/(tabs)/crm/(features)/dashboard" />;
}
