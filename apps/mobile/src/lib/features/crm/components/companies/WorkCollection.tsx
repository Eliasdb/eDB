import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import { Card, EmptyLine, List } from '@ui/primitives';
import * as React from 'react';
import { Text, View } from 'react-native';

import type { CompanyOverview } from '@data-access/crm/companies/types';

/* ----------------------------- tiny helpers ----------------------------- */

function relTime(iso?: string) {
  if (!iso) return undefined;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return undefined;
  const now = Date.now();
  const diff = Math.max(0, now - then);

  const min = 60_000,
    hr = 60 * min,
    day = 24 * hr,
    wk = 7 * day,
    mo = 30 * day,
    yr = 365 * day;
  if (diff < hr) return `${Math.floor(diff / min)}m`;
  if (diff < day) return `${Math.floor(diff / hr)}h`;
  if (diff < wk) return `${Math.floor(diff / day)}d`;
  if (diff < mo) return `${Math.floor(diff / wk)}w`;
  if (diff < yr) return `${Math.floor(diff / mo)}mo`;
  return `${Math.floor(diff / yr)}y`;
}

function AtAGlance({
  contactsCount,
  lastActivityAt,
}: {
  contactsCount: number;
  lastActivityAt?: string;
}) {
  const last = relTime(lastActivityAt);
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
      <Card inset={false} bodyClassName="p-0 overflow-hidden">
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 12,
            gap: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              Contacts
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {contactsCount}
            </Text>
          </View>

          <View
            style={{ width: 1, backgroundColor: 'rgba(148,163,184,0.28)' }}
          />

          <View style={{ flex: 1 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              Last activity
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {last ?? '—'}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

/* ------------------------- small panel scaffolding ------------------------ */

function Panel({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
          paddingHorizontal: 2,
        }}
      >
        <Text
          className="text-text-dim dark:text-text-dimDark"
          style={{ fontSize: 12, letterSpacing: 0.6 }}
        >
          {title.toUpperCase()}
        </Text>
        {typeof count === 'number' ? (
          <Text
            className="text-text-dim dark:text-text-dimDark"
            style={{ fontSize: 12 }}
          >
            {count}
          </Text>
        ) : null}
      </View>

      <Card inset={false} bodyClassName="p-0 overflow-hidden">
        {children}
      </Card>
    </View>
  );
}

/* ------------------------------- component ------------------------------- */

export type WorkCollectionProps = {
  data?: CompanyOverview;
  loading?: boolean;
};

/**
 * Detached Work view (contacts-first). No tasks, no shared Section usage.
 * Shows a compact roll-up and rich contact rows.
 */
export default function WorkCollection({ data, loading }: WorkCollectionProps) {
  const contacts = data?.contacts ?? [];

  // best effort last activity from overview activities
  const lastActivityAt = data?.activities?.length
    ? data.activities
        .map((a) => new Date(a.at).getTime())
        .filter((t) => !Number.isNaN(t))
        .sort((a, b) => b - a)[0]
    : undefined;

  return (
    <View>
      <IntroHeader
        text="People connected to this account."
        variant="secondary"
      />

      {/* quick roll-up */}
      <AtAGlance
        contactsCount={contacts.length}
        lastActivityAt={
          lastActivityAt ? new Date(lastActivityAt).toISOString() : undefined
        }
      />

      {/* contacts list */}
      <Panel title="Related contacts" count={contacts.length}>
        {contacts.length ? (
          <List>
            {contacts.map((c: any, idx: number) => {
              // very defensive: pull common fields if present
              const name =
                c?.name ?? c?.fullName ?? c?.displayName ?? 'Unnamed';
              const role = c?.title ?? c?.role ?? c?.position ?? null;
              const email = c?.email ?? c?.primaryEmail ?? null;
              const phone = c?.phone ?? c?.mobile ?? c?.phoneNumber ?? null;
              const touched = relTime(c?.lastActivityAt ?? c?.updatedAt);

              const secondaryParts = [role, email, phone].filter(Boolean);
              const secondary = secondaryParts.join(' • ');

              return (
                <List.Item key={c?.id ?? `contact-${idx}`} first={idx === 0}>
                  <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-text dark:text-text-dark"
                          style={{ fontSize: 15, fontWeight: '700' }}
                        >
                          {name}
                        </Text>
                        {secondary ? (
                          <Text
                            className="text-text-dim dark:text-text-dimDark"
                            style={{ fontSize: 12, marginTop: 4 }}
                          >
                            {secondary}
                          </Text>
                        ) : null}
                      </View>

                      {/* right meta */}
                      <View style={{ alignItems: 'flex-end', minWidth: 60 }}>
                        <Text
                          className="text-text-dim dark:text-text-dimDark"
                          style={{ fontSize: 11 }}
                        >
                          {touched ? `• ${touched}` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </List.Item>
              );
            })}
          </List>
        ) : (
          <EmptyLine text={loading ? 'Loading…' : 'No contacts yet'} />
        )}
      </Panel>
    </View>
  );
}
