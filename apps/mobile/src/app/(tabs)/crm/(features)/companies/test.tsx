// apps/mobile/src/app/(tabs)/crm/(features)/companies/components/test.tsx
import { Ionicons } from '@expo/vector-icons';
import { Section } from '@ui/layout';
import { Button } from '@ui/primitives';
import React from 'react';
import {
  Linking,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

export type CompanyIntroSectionProps = {
  name?: string;
  industry?: string;
  description?: string;
  domain?: string;
  email?: string;
  phone?: string;
  hq?: string;
  owner?: string;
  employees?: number | string;
};

function InfoRow({
  icon,
  label,
  value,
  link,
  compact = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  link?: string;
  compact?: boolean;
}) {
  const row = (
    <View
      className={`flex-row items-center gap-3 ${compact ? 'py-1.5' : 'py-2'}`}
    >
      <Ionicons name={icon} size={18} color="#6B7280" />
      <View className="flex-1">
        <Text className="text-[13px] font-semibold text-text-dim dark:text-text-dimDark">
          {label}
        </Text>
        <Text className="text-[15px] font-medium text-text dark:text-text-dark mt-0.5">
          {value}
        </Text>
      </View>
    </View>
  );

  if (!link) return row;
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(link)}>
      {row}
    </Pressable>
  );
}

export function CompanyIntroSection({
  name = 'This company',
  industry,
  description,
  domain,
  email,
  phone,
  hq,
  owner,
  employees,
}: CompanyIntroSectionProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  return (
    <Section title="Company" flushTop titleGap={20}>
      <View className="p-4 pt-2">
        {/* Tagline / description line (optional) */}
        {description ? (
          <Text className="text-[14px] text-text dark:text-text-dark mb-3">
            {description}
          </Text>
        ) : (
          <Text className="text-[14px] text-text-dim dark:text-text-dimDark mb-3">
            {name} — {industry ?? 'No industry'}.
          </Text>
        )}

        {/* Two blocks: Basics | Contacts */}
        {isWide ? (
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text className="text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark mb-2">
                Basics
              </Text>
              <InfoRow
                compact
                icon="business-outline"
                label="HQ"
                value={hq ?? '—'}
              />
              <InfoRow
                compact
                icon="people-outline"
                label="Employees"
                value={employees != null ? String(employees) : '—'}
              />
              <InfoRow
                compact
                icon="person-circle-outline"
                label="Owner"
                value={owner ?? '—'}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text className="text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark mb-2">
                Contacts
              </Text>
              <InfoRow
                compact
                icon="link-outline"
                label="Website"
                value={domain ?? '—'}
                link={domain ? `https://${domain}` : undefined}
              />
              <InfoRow
                compact
                icon="mail-outline"
                label="Primary email"
                value={email ?? '—'}
                link={email ? `mailto:${email}` : undefined}
              />
              <InfoRow
                compact
                icon="call-outline"
                label="Phone"
                value={phone ?? '—'}
                link={phone ? `tel:${phone}` : undefined}
              />
            </View>
          </View>
        ) : (
          <>
            <Text className="text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark mb-2">
              Basics
            </Text>
            <InfoRow icon="business-outline" label="HQ" value={hq ?? '—'} />
            <InfoRow
              icon="people-outline"
              label="Employees"
              value={employees != null ? String(employees) : '—'}
            />
            <InfoRow
              icon="person-circle-outline"
              label="Owner"
              value={owner ?? '—'}
            />

            <View className="mt-3" />

            <Text className="text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark mb-2">
              Contacts
            </Text>
            <InfoRow
              icon="link-outline"
              label="Website"
              value={domain ?? '—'}
              link={domain ? `https://${domain}` : undefined}
            />
            <InfoRow
              icon="mail-outline"
              label="Primary email"
              value={email ?? '—'}
              link={email ? `mailto:${email}` : undefined}
            />
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={phone ?? '—'}
              link={phone ? `tel:${phone}` : undefined}
            />
          </>
        )}

        {/* Quick actions (only render when we have the datum) */}
        {domain || email || phone ? (
          <>
            <View className="mt-4 border-t border-border dark:border-border-dark" />
            <View className="mt-3 flex-row flex-wrap gap-8">
              {domain ? (
                <Button
                  variant="outline"
                  tint="primary"
                  size="sm"
                  iconLeft="globe-outline"
                  label="Open site"
                  onPress={() => Linking.openURL(`https://${domain}`)}
                />
              ) : null}
              {email ? (
                <Button
                  variant="outline"
                  tint="primary"
                  size="sm"
                  iconLeft="mail-outline"
                  label="Email"
                  onPress={() => Linking.openURL(`mailto:${email}`)}
                />
              ) : null}
              {phone ? (
                <Button
                  variant="outline"
                  tint="primary"
                  size="sm"
                  iconLeft="call-outline"
                  label="Call"
                  onPress={() => Linking.openURL(`tel:${phone}`)}
                />
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    </Section>
  );
}

export default CompanyIntroSection;
