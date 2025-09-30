// apps/mobile/src/app/(features)/profile/security.tsx
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@ui/layout/ResponsivePage';
import { Subheader } from '@ui/navigation/Subheader';
import { Card } from '@ui/primitives/Card';
import { Item, ItemSwitch, Section } from '@ui/primitives/primitives';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Mock state (wire to backend later)
  const [twoFA, setTwoFA] = useState(false);
  const [passkeys, setPasskeys] = useState(false);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Reusable subheader */}
      <Subheader title="Security" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
          alignItems: 'center', // center PageContainer on wide screens
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PageContainer>
          {/* Intro */}
          <Card
            inset
            className="rounded-2xl bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark shadow-none dark:shadow-card px-4 py-4"
          >
            <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
              Keep your account safe
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
              Manage sign-in options, enable two-factor authentication, and
              review your active sessions. Passkeys provide a faster,
              phishing-resistant login.
            </Text>
          </Card>

          {/* Two-column content */}
          <View className="mt-4 flex-row -mx-2 max-lg:flex-col max-lg:mx-0">
            {/* Left column */}
            <View className="w-1/2 px-2 max-lg:w-full max-lg:px-0">
              <Section title="Authentication">
                <Item
                  border
                  borderPosition="bottom"
                  label="Change password"
                  icon="key-outline"
                  onPress={() =>
                    router.push('/profile/security/change-password')
                  }
                />
                <ItemSwitch
                  border
                  borderPosition="bottom"
                  label="Two-factor authentication (2FA)"
                  icon="shield-checkmark-outline"
                  value={twoFA}
                  onValueChange={setTwoFA}
                />
                <ItemSwitch
                  label="Passkeys (WebAuthn)"
                  icon="finger-print-outline"
                  value={passkeys}
                  onValueChange={setPasskeys}
                />
              </Section>

              <Section title="Privacy & data">
                <Item
                  border
                  borderPosition="bottom"
                  label="Export my data"
                  icon="download-outline"
                  onPress={() => {}}
                />
                <Item
                  label="Delete account"
                  icon="trash-outline"
                  onPress={() =>
                    router.push('/profile/security/delete-account')
                  }
                />
              </Section>
            </View>

            {/* Right column */}
            <View className="w-1/2 px-2 max-lg:w-full max-lg:px-0">
              <Section title="Active sessions">
                <SessionsCard
                  sessions={[
                    {
                      id: 'cur',
                      device: 'MacBook Pro',
                      client: 'Safari',
                      location: 'Ghent, BE',
                      current: true,
                    },
                    {
                      id: 'ios',
                      device: 'iPhone 15',
                      client: 'Clara App',
                      location: 'Ghent, BE',
                      lastActive: '2h ago',
                    },
                    {
                      id: 'win',
                      device: 'Windows',
                      client: 'Chrome',
                      location: 'London, UK',
                      lastActive: '3d ago',
                    },
                  ]}
                  onSignOutOne={(id) => {
                    // TODO: call backend sign-out for a single session
                    console.log('sign out', id);
                  }}
                  onSignOutOthers={() => {
                    // TODO: call backend sign-out others
                    console.log('sign out others');
                  }}
                />
              </Section>
            </View>
          </View>
        </PageContainer>
      </ScrollView>
    </View>
  );
}

/* ---------------- Sessions block ---------------- */

type Session = {
  id: string;
  device: string;
  client: string;
  location: string;
  current?: boolean;
  lastActive?: string;
};

function SessionsCard({
  sessions,
  onSignOutOne,
  onSignOutOthers,
}: {
  sessions: Session[];
  onSignOutOne: (id: string) => void;
  onSignOutOthers: () => void;
}) {
  return (
    <Card
      inset
      className="rounded-2xl bg-muted/60 dark:bg-muted-dark/60 border border-border dark:border-border-dark"
    >
      {sessions.map((s, i) => (
        <View key={s.id}>
          <SessionRow session={s} onSignOut={() => onSignOutOne(s.id)} />
          {i < sessions.length - 1 ? (
            <View className="h-px bg-border dark:bg-border-dark my-2" />
          ) : null}
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
      {/* Left: icon + text */}
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

          {session.current ? (
            <View className="mt-1 px-2 py-0.5 self-start rounded-full bg-success/10 border border-success/20">
              <Text className="text-[11px] font-semibold text-success">
                Current session
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Right: sign out button (hidden for current) */}
      {!session.current ? (
        <TouchableOpacity
          className="h-8 px-3 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark items-center justify-center"
          onPress={onSignOut}
          activeOpacity={0.9}
        >
          <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
            Sign out
          </Text>
        </TouchableOpacity>
      ) : null}
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
