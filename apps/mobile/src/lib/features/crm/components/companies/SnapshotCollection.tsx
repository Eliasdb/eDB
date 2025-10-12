import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, View } from 'react-native';

import type { CompanyOverview } from '@data-access/crm/companies/types';
import CompanyQuickStats from '@features/crm/components/companies/company-quick-stats/company-quick-stats'; // ← reuse the accurate stats
import { KeyValueRow } from '@ui/composites';
import { Section, TwoCol } from '@ui/layout';
import { Card, List } from '@ui/primitives';

export type SnapshotCollectionProps = {
  data?: CompanyOverview;
  loading?: boolean;
};

/* clickable row wrapper (for website/email/phone) */
function RowLink({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string | number | null;
  href?: string | null;
}) {
  const body = (
    <KeyValueRow
      icon={icon}
      label={label}
      value={value != null && value !== '' ? String(value) : '—'}
    />
  );

  if (!href) return body;

  return (
    <Pressable
      onPress={() => Linking.openURL(href)}
      accessibilityRole="link"
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={{ borderRadius: 10 }}
    >
      {body}
    </Pressable>
  );
}

export default function SnapshotCollection({
  data,
  loading,
}: SnapshotCollectionProps) {
  const c = data?.company;

  // formatters
  const formatHq = (hq?: any | null) => {
    if (!hq) return '—';
    const parts = [
      hq.line1,
      hq.line2,
      hq.postalCode,
      hq.city,
      hq.region,
      hq.country,
    ]
      .filter(Boolean)
      .map(String);
    return parts.length ? parts.join(', ') : '—';
  };

  const websiteLabel =
    c?.domain ??
    (c?.website
      ? (() => {
          try {
            return new URL(c.website).hostname;
          } catch {
            return c.website;
          }
        })()
      : null);

  const websiteHref =
    c?.website ?? (websiteLabel ? `https://${websiteLabel}` : null);

  return (
    <TwoCol
      columns={2}
      gap={16}
      stackGap={16}
      breakpoint={1024}
      widths={[0.44, 0.56]}
    >
      <CompanyQuickStats data={data} loading={loading} className="mt-0" />

      <Section title="Company" titleGap={14}>
        <Card inset={false} bodyClassName="p-0 overflow-hidden">
          {/* BASICS */}
          <View style={{ padding: 14, paddingBottom: 8 }}>
            <KeyValueRow
              icon="information-circle-outline"
              label="Basics"
              value=""
            />
          </View>
          <List>
            <List.Item first>
              <KeyValueRow
                icon="business-outline"
                label="HQ"
                value={loading ? null : formatHq(c?.hq)}
              />
            </List.Item>
            <List.Item>
              <KeyValueRow
                icon="people-outline"
                label="Employees"
                value={
                  loading ? null : (c?.employees ?? c?.employeesRange ?? '—')
                }
              />
            </List.Item>
            <List.Item>
              <KeyValueRow
                icon="person-circle-outline"
                label="Owner"
                value={loading ? null : (c?.ownerContactId ?? '—')}
              />
            </List.Item>
          </List>

          {/* CONTACTS */}
          <View style={{ padding: 14, paddingTop: 16 }}>
            <KeyValueRow icon="call-outline" label="Contacts" value="" />
          </View>
          <List>
            <List.Item first>
              <RowLink
                icon="link-outline"
                label="Website"
                value={loading ? null : (websiteLabel ?? '—')}
                href={websiteHref}
              />
            </List.Item>
            <List.Item>
              <RowLink
                icon="mail-outline"
                label="Primary email"
                value={loading ? null : (c?.primaryEmail ?? '—')}
                href={c?.primaryEmail ? `mailto:${c.primaryEmail}` : null}
              />
            </List.Item>
            <List.Item>
              <RowLink
                icon="call-outline"
                label="Phone"
                value={loading ? null : (c?.phone ?? '—')}
                href={c?.phone ? `tel:${c.phone}` : null}
              />
            </List.Item>
          </List>
        </Card>
      </Section>
    </TwoCol>
  );
}
