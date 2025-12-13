// datetime.ts
import * as chrono from 'chrono-node';
import { DateTime } from 'luxon';

/**
 * Normalize user input into ISO 8601 WITH offset.
 * - Accepts natural language ("next thursday 4pm")
 * - Accepts ISO with/without offset
 * - Uses provided tz (fallback: process.env.TZ or 'Europe/Brussels')
 * - Uses `now` anchor to resolve relative phrases
 */
export function toISOWithOffset(
  input: unknown,
  opts?: { tz?: string; now?: Date },
): string {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('Invalid datetime');
  }

  const tz = opts?.tz || process.env.TZ || 'Europe/Brussels';
  const now = opts?.now || new Date();

  const s = input.trim();

  // 1) Try ISO parse (with or without offset)
  let dt = DateTime.fromISO(s, { setZone: false });
  if (dt.isValid) {
    // If string already has an offset or Z, respect it; otherwise assume tz
    const hasOffset = /[Zz]|[-+]\d{2}:\d{2}$/.test(s);
    dt = hasOffset
      ? dt.toUTC().setZone(dt.offsetNameShort || 'UTC')
      : dt.setZone(tz);
    const iso = dt.toISO();
    if (iso) return iso;
  }

  // 2) Try Date.parse (RFC2822/ISO-ish)
  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) {
    const iso = DateTime.fromJSDate(new Date(parsed), { zone: tz }).toISO();
    if (iso) return iso!;
  }

  // 3) Try natural language with chrono (relative to `now`)
  const chronoDate = chrono.parseDate(s, now);
  if (chronoDate) {
    const iso = DateTime.fromJSDate(chronoDate, { zone: tz }).toISO();
    if (iso) return iso!;
  }

  throw new Error('Invalid datetime');
}
