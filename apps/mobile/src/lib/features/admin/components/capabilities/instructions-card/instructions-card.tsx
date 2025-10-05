// apps/mobile/src/lib/ui/admin/components/InstructionsCard.tsx
import { Card, Pill } from '@ui/primitives';
import { Text, View } from 'react-native';

export function InstructionsCard({
  instructions,
  hints = [
    'Calls tools automatically',
    'Short confirmations',
    'Concise replies',
  ],
}: {
  instructions: string;
  hints?: readonly string[];
}) {
  return (
    <Card className="mb-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl">
      <View>
        <Text className="text-[16px] font-extrabold text-text dark:text-text-dark mb-2">
          Instructions
        </Text>

        <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
          {instructions}
        </Text>

        <View className="mt-2 flex-row flex-wrap -m-1">
          {hints.map((h) => (
            <View key={h} className="m-1">
              <Pill preset="tag" text={h} />
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
