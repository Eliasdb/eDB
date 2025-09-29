import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ItemSwitch, Section } from '../../../lib/ui/primitives';

export default function IntegrationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Trigger desktop layout at 1024px
  const isWide = width >= 1024;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* In-screen header with back arrow */}
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

          {/* right spacer to balance the back button */}
          <View className="h-11 min-w-11" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
          // center the content on desktop
          alignItems: isWide ? 'center' : undefined,
          // horizontal padding still applied via the inner container
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Constrained, centered page container */}
        <View
          style={{
            width: '100%',
            maxWidth: 1100,
            paddingHorizontal: 16,
          }}
        >
          {/* Intro / explainer */}
          <Card
            className="rounded-2xl px-4 py-4 bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark shadow-none dark:shadow-card"
            inset
          >
            <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
              Connect your tools
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
              Toggle integrations to let Clara read and sync data with your CRM
              and support platforms. This is a preview; toggles don’t perform
              real connections yet.
            </Text>
          </Card>

          {/* Responsive grid for sections */}
          {isWide ? (
            <View className="flex-row -mx-2 mt-2">
              <View className="w-1/2 px-2">
                <Section title="CRM platforms">
                  <ItemSwitch label="HubSpot" icon="briefcase-outline" />
                  <ItemSwitch label="Salesforce" icon="cloud-outline" />
                </Section>

                <Section title="Other">
                  <ItemSwitch label="Notion" icon="layers-outline" />
                  <ItemSwitch label="Slack" icon="logo-slack" />
                </Section>
              </View>

              <View className="w-1/2 px-2">
                <Section title="Support & messaging">
                  <ItemSwitch
                    label="Zendesk"
                    icon="chatbubble-ellipses-outline"
                  />
                  <ItemSwitch
                    label="Intercom"
                    icon="chatbox-ellipses-outline"
                  />
                </Section>
              </View>
            </View>
          ) : (
            // Mobile: single column
            <View className="mt-2">
              <Section title="CRM platforms">
                <ItemSwitch label="HubSpot" icon="briefcase-outline" />
                <ItemSwitch label="Salesforce" icon="cloud-outline" />
              </Section>

              <Section title="Support & messaging">
                <ItemSwitch
                  label="Zendesk"
                  icon="chatbubble-ellipses-outline"
                />
                <ItemSwitch label="Intercom" icon="chatbox-ellipses-outline" />
              </Section>

              <Section title="Other">
                <ItemSwitch label="Notion" icon="layers-outline" />
                <ItemSwitch label="Slack" icon="logo-slack" />
              </Section>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
