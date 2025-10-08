// --- ActivityTimeline.tsx (you can inline this in ContactDetail.tsx too) ---
import type { Activity } from '@api/core/types';
import { useContactActivities } from '@api/hooks/hub';
import { Ionicons } from '@expo/vector-icons';
import { Card, List } from '@ui/primitives';
import { Pressable, Text, View } from 'react-native';

export function ActivityTimeline({ contactId }: { contactId: string }) {
  const { data: activities, isLoading } = useContactActivities(contactId);

  return (
    <Card
      tone="flat"
      inset={false}
      bodyClassName="p-0 overflow-hidden"
      className="shadow-card bg-surface-2 dark:bg-surface-2-dark"
    >
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-text dark:text-text-dark text-base font-semibold">
          Activity
        </Text>
        <Pressable
          onPress={() => {}}
          hitSlop={10}
          className="flex-row items-center gap-1.5 px-2 py-1 rounded-lg
                     bg-primary/10 border border-primary/20"
        >
          <Ionicons name="add-outline" size={16} color="#6C63FF" />
          <Text style={{ color: '#6C63FF', fontWeight: '600', fontSize: 13 }}>
            Add note
          </Text>
        </Pressable>
      </View>

      {/* List */}
      <List>
        {isLoading ? (
          <List.Placeholder rows={3} renderRow={() => <ActivitySkeleton />} />
        ) : !activities || activities.length === 0 ? (
          <List.Item first>
            <View className="px-4 py-4">
              <Text className="text-text-dim dark:text-text-dimDark">
                No activity yet.
              </Text>
              <Text className="text-text-dim dark:text-text-dimDark mt-1 text-[12px]">
                When you add calls, notes, and emails, they’ll show up here.
              </Text>
            </View>
          </List.Item>
        ) : (
          activities.map((a, i) => (
            <List.Item key={a.id} first={i === 0}>
              <ActivityRow a={a} />
            </List.Item>
          ))
        )}
      </List>
    </Card>
  );
}

function ActivityRow({ a }: { a: Activity }) {
  const icon =
    a.type === 'note'
      ? 'document-text-outline'
      : a.type === 'call'
        ? 'call-outline'
        : a.type === 'email'
          ? 'mail-outline'
          : a.type === 'meeting'
            ? 'people-outline'
            : a.type === 'task'
              ? 'checkmark-done-outline'
              : a.type === 'status'
                ? 'flag-outline'
                : 'sparkles-outline';

  const toneColor =
    a.type === 'note'
      ? '#64748B'
      : a.type === 'call'
        ? '#10B981'
        : a.type === 'email'
          ? '#0EA5E9'
          : a.type === 'meeting'
            ? '#F59E0B'
            : a.type === 'task'
              ? '#8B5CF6'
              : a.type === 'status'
                ? '#E11D48'
                : '#6C63FF';

  return (
    <View className="px-4 py-3">
      {/* Top row */}
      <View className="flex-row items-start gap-3">
        {/* Icon bubble with vertical rail */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(148,163,184,0.14)',
              borderWidth: 1,
              borderColor: 'rgba(148,163,184,0.22)',
            }}
          >
            <Ionicons name={icon as any} size={16} color={toneColor} />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-text dark:text-text-dark text-[15px] font-medium">
            {a.summary}
          </Text>

          {/* Meta */}
          <View className="flex-row items-center gap-6 mt-2">
            <Pill
              text={capitalize(a.type)}
              color={toneColor}
              bg="rgba(108,99,255,0.08)"
              border="rgba(108,99,255,0.18)"
            />
            <Text className="text-text-dim dark:text-text-dimDark text-[12px]">
              {fmtWhen(a.at)}
              {a.by ? ` • ${a.by}` : ''}
            </Text>
          </View>

          {/* Optional payload chips */}
          <View className="flex-row flex-wrap gap-2 mt-2">
            {a.payload?.outcome ? (
              <MiniChip left="checkmark-outline" label={a.payload.outcome} />
            ) : null}
            {a.payload?.durationMin ? (
              <MiniChip
                left="time-outline"
                label={`${a.payload.durationMin} min`}
              />
            ) : null}
            {a.payload?.followUpAt ? (
              <MiniChip
                left="calendar-outline"
                label={`Follow-up ${fmtShort(a.payload.followUpAt)}`}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

function ActivitySkeleton() {
  return (
    <View className="px-4 py-3 flex-row items-start gap-3">
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(148,163,184,0.18)',
        }}
      />
      <View className="flex-1 gap-2">
        <View
          style={{
            height: 12,
            borderRadius: 4,
            backgroundColor: 'rgba(148,163,184,0.2)',
          }}
        />
        <View
          style={{
            height: 10,
            width: '45%',
            borderRadius: 4,
            backgroundColor: 'rgba(148,163,184,0.18)',
          }}
        />
      </View>
    </View>
  );
}

function Pill({
  text,
  color = '#6C63FF',
  bg = 'rgba(108,99,255,0.12)',
  border = 'rgba(108,99,255,0.26)',
}: {
  text: string;
  color?: string;
  bg?: string;
  border?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Text
        style={{ color, fontSize: 12, fontWeight: '700', letterSpacing: 0.2 }}
      >
        {text}
      </Text>
    </View>
  );
}

function MiniChip({
  left,
  label,
}: {
  left: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View
      className="flex-row items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{
        backgroundColor: 'rgba(148,163,184,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(148,163,184,0.22)',
      }}
    >
      <Ionicons name={left} size={12} color="#94A3B8" />
      <Text
        className="text-[12px]"
        style={{ color: '#64748B', fontWeight: '600' }}
      >
        {label}
      </Text>
    </View>
  );
}

function fmtWhen(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
}
function fmtShort(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString() +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
