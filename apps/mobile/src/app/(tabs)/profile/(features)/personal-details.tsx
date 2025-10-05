// apps/mobile/src/app/(profile)/personal-details.tsx
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { makeLeftCards } from '@features/profile/config';
import { PageContainer, Screen, TwoCol } from '@ui/layout';
import { Button, Card, Field, Input } from '@ui/primitives';

export default function PersonalDetailsScreen() {
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

  const dirty =
    firstName !== 'Elias' ||
    lastName !== 'De Bock' ||
    email !== 'elias@example.com' ||
    phone !== '' ||
    company !== 'Clara Labs' ||
    role !== 'Founder' ||
    notes !== '';

  const onSave = () => router.back();

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

  const BASE_PAD = 12;

  return (
    <>
      <Screen center={false} padding={{ h: 8, top: 16, bottom: 24 }} safeBottom>
        <PageContainer>
          {/* Summary */}
          <Card className="mb-4 rounded-2xl border border-border dark:border-border-dark bg-muted/50 dark:bg-muted-dark/40 overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-primary/12 border border-primary/20 items-center justify-center ">
                  <Text className="text-[16px] font-extrabold text-primary ">
                    {firstName?.[0]}
                    {lastName?.[0]}
                  </Text>
                </View>
                <View>
                  <Text className="text-[18px] font-extrabold text-text dark:text-text-dark leading-6 max-w-[12rem]">
                    {firstName} {lastName}
                  </Text>
                  <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
                    {role || '—'} · {company || '—'}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Main grid */}
          <TwoCol gap={16} breakpoint={1024}>
            <View className="gap-4">
              {leftCards.map((card) => (
                <Card
                  key={card.key}
                  title={card.title}
                  className="bg-transparent"
                  bordered={false}
                >
                  <View className="px-4 pb-4">
                    {card.fields.map((f) => (
                      <Field key={f.key} label={f.label}>
                        <Input
                          value={f.value}
                          onChangeText={f.onChangeText}
                          placeholder={f.placeholder}
                          {...f.inputProps}
                        />
                        {f.key === 'email' ? (
                          <Text className="mt-1 text-[11px] text-text-dim dark:text-text-dimDark">
                            {t(
                              'personal.hints.email',
                              'For security notices only.',
                            )}
                          </Text>
                        ) : f.key === 'phone' ? (
                          <Text className="mt-1 text-[11px] text-text-dim dark:text-text-dimDark">
                            {t(
                              'personal.hints.phone',
                              'Optional for verification.',
                            )}
                          </Text>
                        ) : null}
                      </Field>
                    ))}
                  </View>
                </Card>
              ))}
            </View>

            <View className="gap-4">
              <Card
                title={t('personal.sections.notes')}
                className="bg-transparent"
                bordered={false}
              >
                <View className="gap-1.5 px-4 pb-4">
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

              <Card className="rounded-xl border border-border dark:border-border-dark">
                <View className="px-4 py-3 flex-row items-start gap-2">
                  <Text className="mt-[2px]">
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={16}
                      color="#6C63FF"
                    />
                  </Text>
                  <View className="flex-1">
                    <Text className="text-[14px] font-semibold text-text dark:text-text-dark">
                      {t('personal.privacy.title', 'Your privacy')}
                    </Text>
                    <Text className="text-[12px] mt-1 leading-5 text-text-dim dark:text-text-dimDark">
                      {t(
                        'personal.privacy.body',
                        'Details are stored securely and never shared without consent.',
                      )}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          </TwoCol>
        </PageContainer>
      </Screen>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View
          className="bg-surface/95 dark:bg-surface-dark/95 border-t border-border dark:border-border-dark px-4"
          style={{
            paddingTop: BASE_PAD,
            paddingBottom: BASE_PAD,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -2 },
            elevation: 6,
          }}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
              {dirty
                ? t('personal.unsaved', 'You have unsaved changes')
                : 'Up to date'}
            </Text>
            {!dirty ? (
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            ) : null}
          </View>

          <Button
            label={t('personal.saveChanges')}
            iconLeft="save-outline"
            variant="solid"
            tint="primary"
            size="md"
            fullWidth
            disabled={!dirty}
            onPress={onSave}
          />
        </View>
      </View>
    </>
  );
}
