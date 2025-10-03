// apps/mobile/src/lib/ui/admin/components/InstructionsCard.tsx
import { Card } from '@ui/primitives';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export function InstructionsCard({
  loading,
  error,
  instructions,
}: {
  loading: boolean;
  error?: string | null;
  instructions?: string;
}) {
  return (
    <Card className="mb-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl">
      {loading ? (
        <View className="py-1">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text className="text-danger font-semibold">{error}</Text>
      ) : (
        <View>
          <Text className="text-[14px] font-extrabold text-text dark:text-text-dark mb-2">
            Instructions
          </Text>
          <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
            {instructions ??
              'You are Clara. When the user asks to create, update, list, or delete tasks, contacts, or companies, call the correct tool immediately, then give a short confirmation. Keep replies concise.'}
          </Text>

          <View className="mt-2 flex-row flex-wrap -m-1">
            <HintChip text="Calls tools automatically" />
            <HintChip text="Short confirmations" />
            <HintChip text="Concise replies" />
          </View>
        </View>
      )}
    </Card>
  );
}

function HintChip({ text }: { text: string }) {
  return (
    <View className="m-1 px-2 py-1 rounded-md bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
      <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
        {text}
      </Text>
    </View>
  );
}
