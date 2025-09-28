import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Item, ItemSwitch, Section } from '../../../lib/ui/primitives';

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Mock state (wire these to backend later)
  const [twoFA, setTwoFA] = useState(false);
  const [passkeys, setPasskeys] = useState(false);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Header with back arrow */}
      <View style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center justify-between px-3 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 min-w-11 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Security
          </Text>

          {/* right spacer */}
          <View className="h-11 min-w-11" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Card inset>
          <Text className="text-[16px] font-bold text-text dark:text-text-dark">
            Keep your account safe
          </Text>
          <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
            Manage sign-in options, enable two-factor authentication, and review
            active sessions. You can connect passkeys for a faster,
            phishing-resistant login.
          </Text>
        </Card>

        {/* Authentication */}
        <Section title="Authentication">
          <Item
            label="Change password"
            icon="key-outline"
            onPress={() => router.push('/profile/security/change-password')}
          />
          <ItemSwitch
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

        {/* Sessions */}
        <Section title="Active sessions">
          <Card
            inset
            className="bg-muted/60 dark:bg-muted-dark/60 border border-border dark:border-border-dark"
          >
            <SessionRow
              device="MacBook Pro • Safari"
              location="Ghent, BE"
              current
            />
            <Divider />
            <SessionRow
              device="iPhone 15 • Clara App"
              location="Ghent, BE"
              lastActive="2h ago"
            />
            <Divider />
            <SessionRow
              device="Windows • Chrome"
              location="London, UK"
              lastActive="3d ago"
            />
            <View className="mt-3">
              <DangerButton
                label="Sign out of all other sessions"
                onPress={() => {}}
              />
            </View>
          </Card>
        </Section>

        {/* Privacy & Data */}
        <Section title="Privacy & data">
          <Item
            label="Export my data"
            icon="download-outline"
            onPress={() => {}}
          />
          <Item
            label="Delete account"
            icon="trash-outline"
            onPress={() => router.push('/profile/security/delete-account')}
          />
        </Section>
      </ScrollView>
    </View>
  );
}

/* ---------- Small building blocks ---------- */

function Divider() {
  return <View className="h-px bg-border dark:bg-border-dark my-2" />;
}

function SessionRow({
  device,
  location,
  current,
  lastActive,
}: {
  device: string;
  location: string;
  current?: boolean;
  lastActive?: string;
}) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-[14px] font-semibold text-text dark:text-text-dark">
          {device}
        </Text>
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark mt-0.5">
          {location}
          {lastActive ? ` • Last active ${lastActive}` : ''}
        </Text>
        {current ? (
          <Text className="text-[11px] font-semibold text-success mt-1">
            Current session
          </Text>
        ) : null}
      </View>
      {!current ? (
        <TouchableOpacity
          className="h-9 px-3 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark items-center justify-center"
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Text className="text-[13px] font-semibold text-text dark:text-text-dark">
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
      activeOpacity={0.85}
      className="h-11 rounded-lg bg-danger/90 items-center justify-center"
    >
      <Text className="text-white font-bold text-[15px]">{label}</Text>
    </TouchableOpacity>
  );
}
