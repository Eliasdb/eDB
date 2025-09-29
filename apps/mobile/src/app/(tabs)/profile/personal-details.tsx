// apps/mobile/src/app/(features)/profile/personal-details.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { PageContainer, TwoCol } from '../../../lib/ui/ResponsivePage';

export default function PersonalDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  // demo state
  const [firstName, setFirstName] = useState('Elias');
  const [lastName, setLastName] = useState('De Bock');
  const [email, setEmail] = useState('elias@example.com');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('Clara Labs');
  const [role, setRole] = useState('Founder');
  const [notes, setNotes] = useState('');

  const onSave = () => router.back();

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
            {t('personal.title')}
          </Text>

          <TouchableOpacity
            onPress={onSave}
            className="h-11 min-w-11 items-center justify-center"
          >
            <Text className="text-[16px] font-semibold text-primary">
              {t('personal.save')}
            </Text>
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
            paddingTop: 16,
            paddingBottom: 24 + insets.bottom,
            alignItems: 'center', // center the PageContainer on wide screens
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageContainer>
            {/* Two-column on desktop, stacked on mobile */}
            <TwoCol
              gap={16}
              breakpoint={1024}
              left={
                <View>
                  {/* Identity */}
                  <Card title={t('personal.sections.identity')}>
                    <Field label={t('personal.fields.firstName')}>
                      <Input
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder={t('personal.placeholders.firstName')}
                      />
                    </Field>
                    <Field label={t('personal.fields.lastName')}>
                      <Input
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder={t('personal.placeholders.lastName')}
                      />
                    </Field>
                    <Field label={t('personal.fields.email')}>
                      <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('personal.placeholders.email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </Field>
                    <Field label={t('personal.fields.phone')}>
                      <Input
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={t('personal.placeholders.phone')}
                        keyboardType="phone-pad"
                      />
                    </Field>
                  </Card>

                  {/* Work */}
                  <Card title={t('personal.sections.work')}>
                    <Field label={t('personal.fields.company')}>
                      <Input
                        value={company}
                        onChangeText={setCompany}
                        placeholder={t('personal.placeholders.company')}
                      />
                    </Field>
                    <Field label={t('personal.fields.role')}>
                      <Input
                        value={role}
                        onChangeText={setRole}
                        placeholder={t('personal.placeholders.role')}
                      />
                    </Field>
                  </Card>
                </View>
              }
              right={
                <View>
                  {/* Notes */}
                  <Card title={t('personal.sections.notes')}>
                    <View className="gap-1.5">
                      <Text className="text-[14px] font-semibold text-text-dim dark:text-text-dimDark">
                        {t('personal.fields.privateNotes')}
                      </Text>
                      <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder={t('personal.placeholders.notes')}
                        multiline
                        className="
                          bg-muted dark:bg-muted-dark rounded-xl px-3 py-3 text-[16px]
                          text-text dark:text-text-dark border border-border dark:border-border-dark
                          h-[220px] text-top
                        "
                        placeholderTextColor="#98a2b3"
                      />
                    </View>
                  </Card>
                </View>
              }
            />
          </PageContainer>

          <View className="h-16" />
        </ScrollView>

        {/* Save bar */}
        <View
          className="absolute left-0 right-0 bottom-0 bg-surface/95 dark:bg-surface-dark/95 border-t border-border dark:border-border-dark px-4 pt-2"
          style={{ paddingBottom: Math.max(10, insets.bottom) }}
        >
          <TouchableOpacity
            className="h-11 rounded-pill bg-primary flex-row items-center justify-center gap-2 active:opacity-95"
            onPress={onSave}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text className="text-white font-bold text-[16px]">
              {t('personal.saveChanges')}
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
    <View
      className="
        rounded-2xl mb-4
        bg-surface-2 dark:bg-surface-dark
        border border-border dark:border-border-dark
        shadow-none dark:shadow-card
        px-4 py-4
      "
    >
      <Text className="text-[16px] font-extrabold text-text dark:text-text-dark mb-3">
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
      className="
        bg-muted dark:bg-muted-dark
        rounded-xl px-3 py-3 text-[16px]
        text-text dark:text-text-dark
        border border-border dark:border-border-dark
      "
      placeholderTextColor="#98a2b3"
    />
  );
}
