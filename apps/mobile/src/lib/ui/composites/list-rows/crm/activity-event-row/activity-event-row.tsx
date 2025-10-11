import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

export type ActivityKind =
  | 'note'
  | 'call'
  | 'email'
  | 'meeting'
  | 'status'
  | 'system';

const DEFAULT_TINT: Record<ActivityKind | 'default', string> = {
  meeting: '#EAB308',
  call: '#10B981',
  note: '#8B5CF6',
  email: '#60A5FA',
  status: '#F59E0B',
  system: '#94A3B8',
  default: '#94A3B8',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export type ActivityEventRowProps = {
  /** Main line, e.g. “Call with Peter …” */
  summary: string;
  /** Activity type (controls dot color if `tint` not provided) */
  type?: ActivityKind | string;
  /** ISO time for the secondary line */
  at?: string;

  /** Optional override for the colored dot */
  tint?: string;

  /** Optional press handler */
  onPress?: () => void;
};

export function ActivityEventRow({
  summary,
  type = 'system',
  at,
  tint,
  onPress,
}: ActivityEventRowProps) {
  const color =
    tint ??
    DEFAULT_TINT[
      (type as ActivityKind) in DEFAULT_TINT
        ? (type as ActivityKind)
        : 'default'
    ];

  const content = (
    <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* dot */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            marginTop: 2,
          }}
        />
        {/* text */}
        <View style={{ flex: 1 }}>
          <Text
            className="text-text dark:text-text-dark"
            style={{ fontSize: 15, fontWeight: '600' }}
          >
            {summary}
          </Text>
          {(type || at) && (
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginTop: 2 }}
            >
              {[type, at ? formatTime(at) : null].filter(Boolean).join(' • ')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

export default ActivityEventRow;
