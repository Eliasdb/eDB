import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ItemSwitch, Section } from '../../../lib/ui/primitives';

export default function VoiceModeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Custom header with back arrow */}
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
            Voice mode
          </Text>

          <View className="h-11 min-w-11" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card inset>
          <Text className="text-[16px] font-bold text-text dark:text-text-dark">
            Choose a voice
          </Text>
          <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
            Pick a voice that Clara will use when speaking to you. These are
            mock options for now — switching them won’t change audio yet, but
            they show how selection will work.
          </Text>
        </Card>

        <Section title="Available voices">
          <ItemSwitch label="Sofia (female, calm)" icon="mic-outline" />
          <ItemSwitch label="Daniel (male, clear)" icon="mic-outline" />
          <ItemSwitch label="Ava (female, energetic)" icon="mic-outline" />
          <ItemSwitch label="Liam (male, warm)" icon="mic-outline" />
        </Section>
      </ScrollView>
    </View>
  );
}
