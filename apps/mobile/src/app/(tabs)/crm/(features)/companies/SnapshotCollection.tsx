import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, View } from 'react-native';

import type { CompanyOverview } from '@api/core/types';
import { KeyValueRow } from '@ui/composites';
import { Section } from '@ui/layout';
import { Card, List } from '@ui/primitives';
import CompanyQuickStats from '../../../../../lib/features/crm/components/companies/company-quick-stats/company-quick-stats'; // ← reuse the accurate stats

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
  const basics = {
    hq: (data as any)?.hq ?? null,
    employees: (data as any)?.employees ?? null,
    owner: (data as any)?.owner ?? null,
  };

  const contacts = {
    domain: data?.company?.domain ?? (data as any)?.domain ?? null,
    email: (data as any)?.primaryEmail ?? null,
    phone: (data as any)?.phone ?? null,
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {/* 1) QUICK STATS FIRST (accurate via config getters) */}
      <CompanyQuickStats data={data} loading={loading} className="mt-0" />

      {/* 2) COMPANY DETAILS */}
      <Section title="Company" titleGap={14}>
        <Card inset={false} bodyClassName="p-0 overflow-hidden">
          {/* BASICS */}
          <View style={{ padding: 14, paddingBottom: 8 }}>
            <KeyValueRow
              icon="information-circle-outline"
              label="Basics"
              value="" // just a label row; empty value renders as divider header feel
            />
          </View>
          <List>
            <List.Item first>
              <KeyValueRow
                icon="business-outline"
                label="HQ"
                value={loading ? null : (basics.hq ?? '—')}
              />
            </List.Item>
            <List.Item>
              <KeyValueRow
                icon="people-outline"
                label="Employees"
                value={loading ? null : (basics.employees ?? '—')}
              />
            </List.Item>
            <List.Item>
              <KeyValueRow
                icon="person-circle-outline"
                label="Owner"
                value={loading ? null : (basics.owner ?? '—')}
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
                value={loading ? null : (contacts.domain ?? '—')}
                href={contacts.domain ? `https://${contacts.domain}` : null}
              />
            </List.Item>
            <List.Item>
              <RowLink
                icon="mail-outline"
                label="Primary email"
                value={loading ? null : (contacts.email ?? '—')}
                href={contacts.email ? `mailto:${contacts.email}` : null}
              />
            </List.Item>
            <List.Item>
              <RowLink
                icon="call-outline"
                label="Phone"
                value={loading ? null : (contacts.phone ?? '—')}
                href={contacts.phone ? `tel:${contacts.phone}` : null}
              />
            </List.Item>
          </List>
        </Card>
      </Section>
    </View>
  );
}
