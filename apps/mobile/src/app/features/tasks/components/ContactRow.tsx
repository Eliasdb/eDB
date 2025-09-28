// apps/mobile/src/lib/components/ContactRow.tsx
import { Pill } from '@ui';
import { Image, Text, View } from 'react-native';

export default function ContactRow({
  c,
}: {
  c: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    source?: string;
  };
}) {
  return (
    <View className="flex-row items-center py-2.5 gap-2">
      <View className="w-[46px] items-center">
        {c.avatarUrl ? (
          <Image
            source={{ uri: c.avatarUrl }}
            className="w-[34px] h-[34px] rounded-full"
          />
        ) : (
          <View className="w-[34px] h-[34px] rounded-full bg-muted dark:bg-muted-dark items-center justify-center">
            <Text className="font-bold text-[13px] text-text dark:text-text-dark">
              {initials(c.name)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-[16px] text-text dark:text-text-dark">
          {c.name}
        </Text>

        <View className="flex-row flex-wrap gap-2 mt-1">
          {c.email && <Pill icon="mail-outline" text={c.email} />}
          {c.phone && <Pill icon="call-outline" text={c.phone} />}
          {c.source && (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${c.source}`}
              muted
            />
          )}
        </View>
      </View>
    </View>
  );
}

function initials(name?: string) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
