import type { CompanyOverview } from '@edb-clara/client-crm';

export function relTime(iso?: string | null) {
  if (!iso) return undefined;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return undefined;
  const diff = Math.max(0, Date.now() - t);
  const m = 60_000,
    h = 60 * m,
    d = 24 * h,
    w = 7 * d,
    mo = 30 * d,
    y = 365 * d;
  if (diff < h) return `${Math.floor(diff / m)}m`;
  if (diff < d) return `${Math.floor(diff / h)}h`;
  if (diff < w) return `${Math.floor(diff / d)}d`;
  if (diff < mo) return `${Math.floor(diff / w)}w`;
  if (diff < y) return `${Math.floor(diff / mo)}mo`;
  return `${Math.floor(diff / y)}y`;
}

export type ContactRowView = {
  id?: string;
  title: string; // primary line
  secondary?: string; // “role • email • phone”
  rightText?: string; // e.g. "• 2d"
};

export function mapContactToView(c: any): ContactRowView {
  const name = c?.name ?? c?.fullName ?? c?.displayName ?? 'Unnamed';

  const role = c?.title ?? c?.role ?? c?.position ?? undefined;

  const email = c?.email ?? c?.primaryEmail ?? undefined;

  const phone = c?.phone ?? c?.mobile ?? c?.phoneNumber ?? undefined;

  const lastTouchIso =
    c?.lastActivityAt ?? c?.updatedAt ?? c?.createdAt ?? undefined;

  const rightText = relTime(lastTouchIso);
  const bits = [role, email, phone].filter(Boolean);
  const secondary = bits.length ? bits.join(' • ') : undefined;

  return { id: c?.id, title: name, secondary, rightText };
}

export function getContactsGlanceItems(ov?: CompanyOverview) {
  const contacts = ov?.contacts ?? [];
  const count = ov?.stats?.contactsCount ?? contacts.length;
  const last = ov?.stats?.lastContactActivityAt ?? null;
  return [
    { label: 'Contacts', value: count },
    { label: 'Last activity', value: relTime(last) ?? '—' },
  ] as const;
}
