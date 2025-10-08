import { Redirect } from 'expo-router';

export default function ProfileIndex() {
  // Send the bare /crm path to the first tab
  return <Redirect href="/(tabs)/profile/(features)/profile-container" />;
}
