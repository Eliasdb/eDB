import { useHub } from '@api';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@ui/layout';
import { Card, List } from '@ui/primitives';
import { Link, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function CompanyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useHub();
  const company = data?.companies.find((c) => c.id === id);

  if (!company && !isLoading) {
    return (
      <Screen center padding={16}>
        <Card inset bodyClassName="items-center py-10">
          <Text className="text-text dark:text-text-dark text-base font-semibold">
            Company not found
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen center={false} padding={0} showsVerticalScrollIndicator={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Top bar: Back to overview */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <Link href="/(tabs)/crm/(features)/companies" asChild>
              <Pressable
                accessibilityLabel="Back to companies"
                className="items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(100,116,139,0.14)',
                  borderWidth: 1,
                  borderColor: 'rgba(100,116,139,0.22)',
                }}
              >
                <Ionicons name="chevron-back" size={18} color="#94A3B8" />
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Hero */}
        <View className="px-4">
          <Card
            inset={false}
            tone="flat"
            bordered={false}
            className="shadow-card bg-surface-2 dark:bg-surface-2-dark"
            bodyClassName="p-4"
          >
            <View className="flex-row items-center gap-3">
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(148,163,184,0.18)',
                  overflow: 'hidden',
                }}
              >
                {company?.logoUrl ? (
                  <Image
                    source={{ uri: company.logoUrl }}
                    style={{ width: 56, height: 56, borderRadius: 12 }}
                  />
                ) : (
                  <Text className="text-text dark:text-text-dark text-[15px] font-semibold">
                    {company?.name?.slice(0, 2)?.toUpperCase()}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text
                  className="text-text dark:text-text-dark text-lg font-semibold"
                  numberOfLines={1}
                >
                  {company?.name ?? ' '}
                </Text>
                {!!company?.industry && (
                  <Text
                    className="text-text-dim dark:text-text-dimDark text-[13px]"
                    numberOfLines={1}
                  >
                    {company.industry}
                  </Text>
                )}
              </View>

              {/* Actions (with extra right padding so they don't touch the edge) */}
              <View className="flex-row items-center gap-2 pr-1.5">
                {!!company?.domain && (
                  <IconButtonLike
                    icon="globe-outline"
                    a11y="Open website"
                    onPress={() => Linking.openURL(`https://${company.domain}`)}
                  />
                )}
                <IconButtonLike
                  icon="create-outline"
                  a11y="Edit company"
                  onPress={() => {}}
                />
              </View>
            </View>

            {!!company?.source && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                <Tag
                  tone="primary"
                  icon="sparkles-outline"
                  text={`Added by Clara • ${company.source}`}
                />
              </View>
            )}
          </Card>
        </View>

        {/* Info */}
        <View className="px-4 mt-3">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            <List>
              {!!company?.domain && (
                <List.Item first>
                  <Row
                    icon="globe-outline"
                    label="Domain"
                    value={company.domain}
                  />
                </List.Item>
              )}
              {!!company?.industry && (
                <List.Item>
                  <Row
                    icon="briefcase-outline"
                    label="Industry"
                    value={company.industry}
                  />
                </List.Item>
              )}
              {!!company?.source && (
                <List.Item>
                  <Row
                    icon="sparkles-outline"
                    label="Source"
                    value={company.source}
                  />
                </List.Item>
              )}
            </List>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function IconButtonLike({
  icon,
  a11y,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  a11y: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={a11y}
      onPress={onPress}
      className="items-center justify-center"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(100,116,139,0.14)',
        borderWidth: 1,
        borderColor: 'rgba(100,116,139,0.22)',
      }}
    >
      <Ionicons name={icon} size={16} color="#94A3B8" />
    </Pressable>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
}) {
  return (
    <View className="flex-row items-center gap-10 px-4 py-3">
      <View className="w-5 items-center">
        <Ionicons name={icon} size={16} color="#94A3B8" />
      </View>
      <View className="flex-1">
        <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
          {label}
        </Text>
        <Text className="text-text dark:text-text-dark text-[15px] font-medium">
          {value ?? '—'}
        </Text>
      </View>
    </View>
  );
}

function Tag({
  tone = 'primary',
  icon,
  text,
}: {
  tone?: 'primary' | 'neutral';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) {
  const bg =
    tone === 'primary' ? 'rgba(108,99,255,0.12)' : 'rgba(148,163,184,0.15)';
  const border =
    tone === 'primary' ? 'rgba(108,99,255,0.26)' : 'rgba(148,163,184,0.25)';
  const color = tone === 'primary' ? '#6C63FF' : '#94A3B8';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      {icon ? <Ionicons name={icon} size={14} color={color} /> : null}
      <Text style={{ color, fontSize: 12, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}
