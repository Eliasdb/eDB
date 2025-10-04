import { ClaraCapabilitiesContainer } from '@features/admin';
import { Screen } from '@ui/layout';

export default function AdminCapabilitiesScreen() {
  return (
    <Screen center={false} padding={16} showsVerticalScrollIndicator={false}>
      <ClaraCapabilitiesContainer />
    </Screen>
  );
}
