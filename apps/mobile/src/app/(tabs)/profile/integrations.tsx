import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ItemSwitch, Section } from '../../../lib/ui/primitives';

export default function IntegrationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* In-screen header with back arrow (no Stack.Screen props needed) */}
      <View style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center justify-between px-3 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 min-w-11 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-text dark:text-text-dark">
            External integrations
          </Text>

          {/* right spacer */}
          <View className="h-11 min-w-11" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card inset>
          <Text className="text-[16px] font-bold text-text dark:text-text-dark">
            Connect your tools
          </Text>
          <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
            Toggle integrations to let Clara read and sync data with your CRM
            and support platforms. This is a preview; toggles don’t perform any
            real connections yet.
          </Text>
        </Card>

        <Section title="CRM platforms">
          <ItemSwitch label="HubSpot" icon="briefcase-outline" />
          <ItemSwitch label="Salesforce" icon="cloud-outline" />
        </Section>

        <Section title="Support & messaging">
          <ItemSwitch label="Zendesk" icon="chatbubble-ellipses-outline" />
          <ItemSwitch label="Intercom" icon="chatbox-ellipses-outline" />
        </Section>

        <Section title="Other">
          <ItemSwitch label="Notion" icon="layers-outline" />
          <ItemSwitch label="Slack" icon="logo-slack" />
        </Section>
      </ScrollView>
    </View>
  );
}
