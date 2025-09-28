// apps/mobile/src/features/crm/components/CompanyRow.tsx
import { Pill } from '@ui';
import { Image, Text, View } from 'react-native';

export default function CompanyRow({
  co,
  onEdit,
}: {
  co: {
    id: string;
    name: string;
    industry?: string;
    domain?: string;
    logoUrl?: string;
    source?: string;
  };
  onEdit?: () => void;
}) {
  return (
    <View className="flex-row items-center px-2 py-2.5">
      {/* logo / initials – align top; square-ish */}
      <View className="w-10 items-center pt-0.5">
        {co.logoUrl ? (
          <Image source={{ uri: co.logoUrl }} className="w-8 h-8 rounded-md" />
        ) : (
          <View className="w-8 h-8 rounded-md bg-muted dark:bg-muted-dark items-center justify-center">
            <Text className="font-bold text-[12px] text-text dark:text-text-dark">
              {initials(co.name)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 pr-2">
        <Text className="text-[16px] text-text dark:text-text-dark">
          {co.name}
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-1">
          {co.industry ? (
            <Pill icon="briefcase-outline" text={co.industry} />
          ) : null}
          {co.domain ? <Pill icon="globe-outline" text={co.domain} /> : null}
          {co.source ? (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${co.source}`}
              muted
            />
          ) : null}
        </View>
      </View>

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
