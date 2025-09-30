// apps/mobile/src/app/(features)/profile/personal-details.tsx
import { Ionicons } from '@expo/vector-icons';
import { PageContainer, TwoCol } from '@ui/layout/ResponsivePage';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Subheader, TextAction } from '@ui/navigation/Subheader';
import { Card, Field, Input } from '@ui/primitives';

import { makeLeftCards } from '@features/profile/config';

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

  // Build left-column cards from shared config
  const leftCards = useMemo(
    () =>
      makeLeftCards({
        t,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        phone,
        setPhone,
        company,
        setCompany,
        role,
        setRole,
      }),
    [t, firstName, lastName, email, phone, company, role],
  );

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Header */}
      <Subheader
        title={t('personal.title')}
        onBack={() => router.back()}
        right={<TextAction label={t('personal.save')} onPress={onSave} />}
      />

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
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageContainer>
            <TwoCol gap={16} breakpoint={1024}>
              {/* LEFT COLUMN */}
              <View className="gap-4">
                {leftCards.map((card) => (
                  <Card key={card.key} title={card.title}>
                    <View>
                      {card.fields.map((f) => (
                        <Field key={f.key} label={f.label}>
                          <Input
                            value={f.value}
                            onChangeText={f.onChangeText}
                            placeholder={f.placeholder}
                            {...f.inputProps}
                          />
                        </Field>
                      ))}
                    </View>
                  </Card>
                ))}
              </View>

              {/* RIGHT COLUMN */}
              <View className="gap-4">
                <Card title={t('personal.sections.notes')}>
                  <View className="gap-1.5">
                    <Field label={t('personal.fields.privateNotes')}>
                      <Input
                        value={notes}
                        onChangeText={setNotes}
                        placeholder={t('personal.placeholders.notes')}
                        multiline
                        className="h-[220px] text-top"
                      />
                    </Field>
                  </View>
                </Card>
              </View>
            </TwoCol>
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
