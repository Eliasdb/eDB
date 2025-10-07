import { useHub } from '@api';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@ui/layout';
import { Card, List } from '@ui/primitives';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function ContactDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useHub();
  const contact = data?.contacts.find((c) => c.id === id);

  if (!contact && !isLoading) {
    return (
      <Screen center padding={16}>
        <Card inset bodyClassName="items-center py-10">
          <Text className="text-text dark:text-text-dark text-base font-semibold">
            Contact not found
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen center={false} padding={0}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Hero */}
        <View className="px-4 pt-4">
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
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(148,163,184,0.18)',
                  overflow: 'hidden',
                }}
              >
                {contact?.avatarUrl ? (
                  <Image
                    source={{ uri: contact.avatarUrl }}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                  />
                ) : (
                  <Text className="text-text dark:text-text-dark text-[15px] font-semibold">
                    {contact?.name
                      ?.split(' ')
                      ?.map((p) => p[0])
                      .join('')}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text
                  className="text-text dark:text-text-dark text-lg font-semibold"
                  numberOfLines={1}
                >
                  {contact?.name ?? ' '}
                </Text>
                {!!contact?.email && (
                  <Text
                    className="text-text-dim dark:text-text-dimDark text-[13px]"
                    numberOfLines={1}
                  >
                    {contact.email}
                  </Text>
                )}
              </View>

              {/* actions */}
              <View className="flex-row items-center gap-1">
                {!!contact?.email && (
                  <IconButtonLike
                    icon="mail-outline"
                    a11y="Send email"
                    onPress={() => Linking.openURL(`mailto:${contact.email}`)}
                  />
                )}
                {!!contact?.phone && (
                  <IconButtonLike
                    icon="call-outline"
                    a11y="Call"
                    onPress={() => Linking.openURL(`tel:${contact.phone}`)}
                  />
                )}
                <IconButtonLike
                  icon="create-outline"
                  a11y="Edit contact"
                  onPress={() => {}}
                />
              </View>
            </View>

            {!!contact?.source && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                <Tag
                  tone="primary"
                  icon="sparkles-outline"
                  text={`Added by Clara • ${contact.source}`}
                />
              </View>
            )}
          </Card>
        </View>

        {/* Info */}
        <View className="px-4 mt-3">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            <List>
              {!!contact?.email && (
                <List.Item first>
                  <Row
                    icon="mail-outline"
                    label="Email"
                    value={contact.email}
                  />
                </List.Item>
              )}
              {!!contact?.phone && (
                <List.Item>
                  <Row
                    icon="call-outline"
                    label="Phone"
                    value={contact.phone}
                  />
                </List.Item>
              )}
              {!!contact?.source && (
                <List.Item>
                  <Row
                    icon="sparkles-outline"
                    label="Source"
                    value={contact.source}
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
