// apps/mobile/src/app/(profile)/personal-details.tsx
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ui
import { PageContainer, TwoCol } from '@ui/layout';
import { SubHeader, TextAction } from '@ui/navigation';
import { Button, Card, Field, Input } from '@ui/primitives';

// Data
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

  // near top of the component
  const BASE_PAD = 12; // equal padding inside the bar
  const SAFE_CUSHION = 36; // how much of the safe area we *ignore*
  const spacer = Math.max(insets.bottom - SAFE_CUSHION, 0); // only extra beyond cushion

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Header */}
      <SubHeader
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
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          {/* Bar */}
          <View
            className="bg-surface/95 dark:bg-surface-dark/95 border-t border-border dark:border-border-dark px-4"
            style={{ paddingTop: BASE_PAD, paddingBottom: BASE_PAD }} // equal padding
          >
            <Button
              label={t('personal.saveChanges')}
              iconLeft="save-outline"
              variant="solid"
              tint="primary"
              size="md"
              fullWidth
              onPress={onSave}
            />
          </View>

          {/* Only a *small* spacer — lets the bar sit lower */}
          <View style={{ height: spacer }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
