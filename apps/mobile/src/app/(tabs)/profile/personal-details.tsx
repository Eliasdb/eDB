// apps/mobile/src/app/(features)/profile/personal-details.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // demo state (replace with real user data)
  const [firstName, setFirstName] = useState('Elias');
  const [lastName, setLastName] = useState('De Bock');
  const [email, setEmail] = useState('elias@example.com');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('Clara Labs');
  const [role, setRole] = useState('Founder');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    // TODO: Persist to backend
    router.back();
  };

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Header */}
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
            Personal details
          </Text>

          <TouchableOpacity
            onPress={onSave}
            className="h-11 min-w-11 items-center justify-center"
          >
            <Text className="text-[16px] font-semibold text-primary">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Identity */}
          <Card title="Identity">
            <Field label="First name">
              <Input
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
            </Field>
            <Field label="Last name">
              <Input
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </Field>
            <Field label="Email">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="+32 ..."
                keyboardType="phone-pad"
              />
            </Field>
          </Card>
          {/* Work */}
          <Card title="Work">
            <Field label="Company">
              <Input
                value={company}
                onChangeText={setCompany}
                placeholder="Company"
              />
            </Field>
            <Field label="Role / Title">
              <Input value={role} onChangeText={setRole} placeholder="Role" />
            </Field>
          </Card>
          {/* Notes */}
          <Card title="Notes">
            <View className="gap-1.5">
              <Text className="text-[14px] font-semibold text-text-dim dark:text-text-dimDark">
                Private notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Anything Clara should know…"
                multiline
                className="bg-muted dark:bg-muted-dark rounded-lg px-3 py-3 text-[16px] text-text dark:text-text-dark border border-border dark:border-border-dark h-[120px] text-top"
              />
            </View>
          </Card>
          <View className="h-16" /> {/* spacer */}
        </ScrollView>

        {/* Save bar */}
        <View
          className="absolute left-0 right-0 bottom-0 bg-surface/95 dark:bg-surface-dark/95 border-t border-border dark:border-border-dark px-4 pt-2"
          style={{ paddingBottom: Math.max(10, insets.bottom) }}
        >
          <TouchableOpacity
            className="h-11 rounded-lg bg-primary flex-row items-center justify-center gap-2"
            onPress={onSave}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text className="text-white font-bold text-[16px]">
              Save changes
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- Building blocks ---------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-surface dark:bg-surface-dark rounded-lg p-3 mb-4 shadow-sm">
      <Text className="text-[16px] font-bold text-text dark:text-text-dark mb-2.5">
        {title}
      </Text>
      <View className="gap-3.5">{children}</View>
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-[14px] font-semibold text-text-dim dark:text-text-dimDark">
        {label}
      </Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      className={`
        bg-muted dark:bg-muted-dark
        rounded-lg px-3 py-3 text-[16px]
        text-text dark:text-text-dark
        border border-border dark:border-border-dark
      `}
    />
  );
}
