// CompanyDetail.tsx
import { useCompanyOverview } from '@api';
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
  const { data, isLoading } = useCompanyOverview(id);

  const company = data?.company;

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
        {/* Top bar */}
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
                {!!company?.stage && (
                  <View className="mt-1">
                    <Tag tone="primary" text={company.stage} />
                  </View>
                )}
              </View>

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

            {!!company?.domain && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                <Tag
                  tone="neutral"
                  icon="globe-outline"
                  text={company.domain}
                />
              </View>
            )}
          </Card>
        </View>

        {/* Quick stats */}
        <View className="px-4 mt-3">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            <List>
              <List.Item first>
                <Row
                  icon="time-outline"
                  label="Last activity"
                  value={data?.stats.lastActivityAt ?? '—'}
                />
              </List.Item>
              <List.Item>
                <Row
                  icon="flash-outline"
                  label="Open tasks"
                  value={String(data?.stats.openTasks ?? 0)}
                />
              </List.Item>
              <List.Item>
                <Row
                  icon="calendar-outline"
                  label="Next due task"
                  value={data?.stats.nextTaskDue ?? '—'}
                />
              </List.Item>
            </List>
          </Card>
        </View>

        {/* Contacts */}
        <Section title="Contacts" />
        <View className="px-4 mt-2">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            {data?.contacts?.length ? (
              <List>
                {data.contacts.map((c, idx) => (
                  <List.Item key={c.id} first={idx === 0}>
                    <View className="flex-row items-center gap-3 px-4 py-3">
                      <View className="w-5 items-center">
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color="#94A3B8"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-text dark:text-text-dark text-[15px] font-medium">
                          {c.name}
                        </Text>
                        <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
                          {c.title ?? c.email ?? '—'}
                        </Text>
                      </View>
                    </View>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty hint="No contacts yet" />
            )}
          </Card>
        </View>

        {/* Activities (Timeline) */}
        <Section title="Timeline" />
        <View className="px-4 mt-2">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            {data?.activities?.length ? (
              <List>
                {data.activities.map((a, idx) => (
                  <List.Item key={a.id} first={idx === 0}>
                    <View className="flex-row items-center gap-3 px-4 py-3">
                      <View className="w-5 items-center">
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={16}
                          color="#94A3B8"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-text dark:text-text-dark text-[15px] font-medium">
                          {a.summary}
                        </Text>
                        <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
                          {a.type} • {a.at}
                        </Text>
                      </View>
                    </View>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty hint="No activity yet" />
            )}
          </Card>
        </View>

        {/* Tasks */}
        <Section title="Tasks" />
        <View className="px-4 mt-2">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            {data?.tasks?.length ? (
              <List>
                {data.tasks.map((t, idx) => (
                  <List.Item key={t.id} first={idx === 0}>
                    <View className="flex-row items-center gap-3 px-4 py-3">
                      <View className="w-5 items-center">
                        <Ionicons
                          name={
                            t.done
                              ? 'checkmark-circle-outline'
                              : 'ellipse-outline'
                          }
                          size={16}
                          color="#94A3B8"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-text dark:text-text-dark text-[15px] font-medium">
                          {t.title}
                        </Text>
                        <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
                          {t.due ?? 'No due date'}
                        </Text>
                      </View>
                    </View>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty hint="No tasks yet" />
            )}
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

/* — Small helpers (unchanged style from your snippet) — */
function Section({ title }: { title: string }) {
  return (
    <View className="px-4 mt-5">
      <Text className="text-text dark:text-text-dark text-[13px] font-semibold uppercase tracking-wide opacity-80">
        {title}
      </Text>
    </View>
  );
}

function Empty({ hint }: { hint: string }) {
  return (
    <View className="px-4 py-6 items-center">
      <Text className="text-text-dim dark:text-text-dimDark text-[13px]">
        {hint}
      </Text>
    </View>
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
  value?: string | number | null;
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
