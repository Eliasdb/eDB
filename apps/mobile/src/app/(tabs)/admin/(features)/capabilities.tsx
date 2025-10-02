// apps/mobile/src/app/(tabs)/admin/capabilities.tsx
import { ClaraCapabilities } from '@features/admin';
import { ScrollView } from 'react-native';

export default function AdminCapabilitiesScreen() {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ClaraCapabilities />
    </ScrollView>
  );
}
