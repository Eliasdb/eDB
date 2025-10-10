// libs/ui/composites/activity/activity-composer.tsx
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@ui/primitives';
import * as React from 'react';
import { Pressable, Text, TextInput, useColorScheme, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'status' | 'system';

const TYPE_ICON: Record<ActivityType, IconName> = {
  note: 'document-text-outline',
  call: 'call-outline',
  email: 'mail-outline',
  meeting: 'people-outline',
  status: 'flag-outline',
  system: 'chatbubble-ellipses-outline',
};

const LABEL: Record<ActivityType, string> = {
  note: 'Note',
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  status: 'Status',
  system: 'System',
};

export function ActivityComposer({
  defaultType = 'note',
  initialSummary = '',
  contactId,
  companyId,
  submitting,
  onSubmit,
  onCancel,
  /** Show tiny captions under each chip (recommended on mobile) */
  showChipLabels = true,
  /** Show a transient hint banner on long-pressing a chip */
  enableLongPressHint = true,
}: {
  defaultType?: ActivityType;
  initialSummary?: string;
  contactId?: string;
  companyId?: string;
  submitting?: boolean;
  onSubmit: (payload: {
    type: ActivityType;
    summary: string;
    at: string;
    contactId?: string;
    companyId?: string;
  }) => void;
  onCancel?: () => void;
  showChipLabels?: boolean;
  enableLongPressHint?: boolean;
}) {
  const [type, setType] = React.useState<ActivityType>(defaultType);
  const [summary, setSummary] = React.useState(initialSummary);
  const [hint, setHint] = React.useState<string | null>(null);

  const isDark = useColorScheme() === 'dark';
  const tintIdle = isDark ? '#9AA3B2' : '#6B7280';
  const tintActive = isDark ? '#A5B4FC' : '#6366F1';
  const borderIdle = isDark
    ? 'rgba(148,163,184,0.26)'
    : 'rgba(148,163,184,0.25)';
  const borderActive = isDark
    ? 'rgba(99,102,241,0.45)'
    : 'rgba(99,102,241,0.35)';
  const fieldBorder = isDark ? '#2A2F3A' : '#E5E7EB';

  const onLongPressChip = (t: ActivityType) => {
    if (!enableLongPressHint) return;
    setHint(LABEL[t]);
    setTimeout(() => setHint(null), 1000);
  };

  return (
    <Card inset={false} bodyClassName="p-0 overflow-hidden">
      <View
        style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 }}
      >
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark mb-3 uppercase tracking-wide">
          Add activity
        </Text>

        {/* Type selector */}
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
          {(Object.keys(TYPE_ICON) as ActivityType[]).map((t) => {
            const active = t === type;
            return (
              <View key={t} style={{ alignItems: 'center', minWidth: 48 }}>
                <Pressable
                  onPress={() => setType(t)}
                  onLongPress={() => onLongPressChip(t)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: active ? borderActive : borderIdle,
                    backgroundColor: 'transparent',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${LABEL[t]}`}
                >
                  <Ionicons
                    name={TYPE_ICON[t]}
                    size={20}
                    color={active ? tintActive : tintIdle}
                  />
                </Pressable>
                {showChipLabels ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: active ? tintActive : tintIdle,
                      fontWeight: active ? ('600' as const) : ('500' as const),
                    }}
                  >
                    {LABEL[t]}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Optional long-press hint banner */}
        {hint ? (
          <View
            style={{
              alignSelf: 'flex-start',
              marginBottom: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.05)',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: isDark ? '#E5E7EB' : '#111827',
              }}
            >
              {hint}
            </Text>
          </View>
        ) : null}

        {/* Summary input */}
        <View
          style={{
            borderWidth: 1,
            borderColor: fieldBorder,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
          }}
        >
          <TextInput
            multiline
            placeholder="What happened?"
            placeholderTextColor={isDark ? '#667085' : '#9CA3AF'}
            value={summary}
            onChangeText={setSummary}
            style={{
              minHeight: 96, // more breathing room
              fontSize: 16,
              lineHeight: 22,
              color: isDark ? '#E5E7EB' : '#111827',
              paddingVertical: 4,
            }}
          />
        </View>

        {/* Actions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          {onCancel ? (
            <Pressable
              onPress={onCancel}
              disabled={submitting}
              style={{ paddingVertical: 10, paddingHorizontal: 8 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: isDark ? '#9AA3B2' : '#6B7280',
                  fontWeight: '700',
                }}
              >
                Cancel
              </Text>
            </Pressable>
          ) : (
            <View />
          )}

          <Button
            label="Save"
            size="md"
            tint="primary"
            onPress={() =>
              onSubmit({
                type,
                summary: summary.trim(),
                at: new Date().toISOString(),
                contactId,
                companyId,
              })
            }
            disabled={!summary.trim() || submitting}
          />
        </View>
      </View>
    </Card>
  );
}
