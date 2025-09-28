// apps/mobile/src/features/crm/components/ContactRow.tsx
import { Pill } from '@ui';
import { Image, Text, View } from 'react-native';

export default function ContactRow({
  c,
  onEdit,
}: {
  c: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    source?: string;
  };
  onEdit?: () => void;
}) {
  return (
    <View className="flex-row items-center px-2 py-2.5">
      {/* avatar – align top */}
      <View className="w-10 items-center pt-0.5">
        {c.avatarUrl ? (
          <Image
            source={{ uri: c.avatarUrl }}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-muted dark:bg-muted-dark items-center justify-center">
            <Text className="font-bold text-[12px] text-text dark:text-text-dark">
              {initials(c.name)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 pr-2">
        <Text className="text-[16px] text-text dark:text-text-dark">
          {c.name}
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-1">
          {c.email ? <Pill icon="mail-outline" text={c.email} /> : null}
          {c.phone ? <Pill icon="call-outline" text={c.phone} /> : null}
          {c.source ? (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${c.source}`}
              muted
            />
          ) : null}
        </View>
      </View>

      {/* optional edit button space reserved by TaskRow’s actions; omit for now */}
      <View className="w-0" />
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
