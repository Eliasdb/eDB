// apps/mobile/src/lib/components/CompanyRow.tsx
import { Pill } from '@ui';
import { Image, Text, View } from 'react-native';

export default function CompanyRow({
  co,
}: {
  co: {
    id: string;
    name: string;
    industry?: string;
    domain?: string;
    logoUrl?: string;
    source?: string;
  };
}) {
  return (
    <View className="flex-row items-center py-2.5 gap-2">
      <View className="w-[46px] items-center">
        {co.logoUrl ? (
          <Image source={{ uri: co.logoUrl }} className="w-7 h-7 rounded-md" />
        ) : (
          <View className="w-7 h-7 rounded-md bg-muted dark:bg-muted-dark items-center justify-center">
            <Text className="font-bold text-[12px] text-text dark:text-text-dark">
              {initials(co.name)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-[16px] text-text dark:text-text-dark">
          {co.name}
        </Text>

        <View className="flex-row flex-wrap gap-2 mt-1">
          {co.industry && <Pill icon="briefcase-outline" text={co.industry} />}
          {co.domain && <Pill icon="globe-outline" text={co.domain} />}
          {co.source && (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${co.source}`}
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
