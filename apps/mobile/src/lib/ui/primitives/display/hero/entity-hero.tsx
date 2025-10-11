// libs/ui/primitives/entity-hero/EntityHero.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Badge from '../badge/badge';

export type CompanyStage = 'lead' | 'prospect' | 'customer' | 'inactive';

function stageTint(s: CompanyStage) {
  switch (s) {
    case 'lead':
      return '#6C63FF';
    case 'prospect':
      return '#f59e0b';
    case 'customer':
      return '#16a34a';
    case 'inactive':
    default:
      return '#9ca3af';
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function EntityHero({
  title,
  avatarUrl,
  initials,
  avatarRadius = 12,
  industry,
  stage,
}: {
  title: string;
  avatarUrl?: string | null;
  initials?: string;
  avatarRadius?: number;
  industry?: string;
  stage?: CompanyStage;
}) {
  // Always show a badge (stage)
  const badgeLabel = stage ? cap(stage) : 'No stage';
  const badgeTint = stage ? stageTint(stage) : '#9ca3af';

  // Always show an industry row
  const industryLabel = industry || 'No industry';
  const industryColor = industry ? '#6B7280' : '#9ca3af'; // gray if missing

  return (
    <View className="bg-surface-2 dark:bg-surface-dark rounded-2xl p-3">
      <View className="flex-row gap-3 items-center">
        {/* Avatar */}
        <View
          className="bg-muted dark:bg-muted-dark items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: avatarRadius,
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              {initials ?? '•'}
            </Text>
          )}
        </View>

        {/* Title + industry */}
        <View className="flex-1">
          <Text className="text-base font-extrabold text-text dark:text-text-dark">
            {title}
          </Text>

          <View className="flex-row items-center gap-1.5 mt-1.5">
            <Ionicons
              name="briefcase-outline"
              size={14}
              color={industryColor}
            />
            <Text
              className="text-[12px] font-semibold"
              style={{ color: industryColor }}
            >
              {industryLabel}
            </Text>
          </View>
        </View>

        {/* Right-side badge (stage) */}
        <Badge label={badgeLabel} tint={badgeTint} />
      </View>
    </View>
  );
}
