import { Ionicons } from '@expo/vector-icons';
import { Card } from '@ui/primitives';
import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Session } from '../../config/security'; // <-- shared type

type Props = {
  sessions: Session[];
  onSignOutOne: (id: string) => void;
  onSignOutOthers: () => void;
};

export function SessionsCard({
  sessions,
  onSignOutOne,
  onSignOutOthers,
}: Props) {
  return (
    <Card
      inset
      className="rounded-2xl bg-muted/60 dark:bg-muted-dark/60 border border-border dark:border-border-dark"
    >
      {sessions.map((s, i) => (
        <View key={s.id}>
          <SessionRow session={s} onSignOut={() => onSignOutOne(s.id)} />
          {i < sessions.length - 1 && (
            <View className="h-px bg-border dark:bg-border-dark my-2" />
          )}
        </View>
      ))}
      <View className="mt-3">
        <DangerButton
          label="Sign out of all other sessions"
          onPress={onSignOutOthers}
        />
      </View>
    </Card>
  );
}

function SessionRow({
  session,
  onSignOut,
}: {
  session: Session;
  onSignOut: () => void;
}) {
  const icon = useMemo<React.ComponentProps<typeof Ionicons>['name']>(() => {
    const d = session.device.toLowerCase();
    if (d.includes('iphone') || d.includes('ipad'))
      return 'phone-portrait-outline';
    if (d.includes('mac') || d.includes('macbook')) return 'laptop-outline';
    if (d.includes('windows') || d.includes('pc')) return 'desktop-outline';
    return 'tablet-landscape-outline';
  }, [session.device]);

  return (
    <View className="flex-row items-center justify-between gap-3 py-2">
      <View className="flex-row items-start gap-3 flex-1">
        <View className="w-8 h-8 rounded-full items-center justify-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <Ionicons
            name={icon}
            size={16}
            className="text-text dark:text-text-dark"
          />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-text dark:text-text-dark">
            {session.device} • {session.client}
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark mt-0.5">
            {session.location}
            {session.lastActive ? ` • Last active ${session.lastActive}` : ''}
          </Text>
          {session.current && (
            <View className="mt-1 px-2 py-0.5 self-start rounded-full bg-success/10 border border-success/20">
              <Text className="text-[11px] font-semibold text-success">
                Current session
              </Text>
            </View>
          )}
        </View>
      </View>

      {!session.current && (
        <TouchableOpacity
          className="h-8 px-3 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark items-center justify-center"
          onPress={onSignOut}
          activeOpacity={0.9}
        >
          <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
            Sign out
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function DangerButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="h-11 rounded-xl bg-danger/90 items-center justify-center"
    >
      <Text className="text-white font-bold text-[15px]">{label}</Text>
    </TouchableOpacity>
  );
}
