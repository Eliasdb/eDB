// domain/utils/company-initials.ts
const STOPWORDS = new Set(['the', 'and', '&']);
const LEGAL_SUFFIXES = [
  'inc',
  'inc.',
  'llc',
  'l.l.c.',
  'ltd',
  'ltd.',
  'gmbh',
  'ag',
  'sa',
  'bv',
  'sarl',
  'oy',
  'oyj',
  'pte',
  'plc',
  'srl',
  'spa',
  'kk',
  'pty',
  'pty.',
];

export function companyInitials(name?: string | null): string {
  if (!name) return '';
  const raw = name
    .replace(/[.,]/g, ' ') // normalize punctuation to spaces
    .replace(/\s+/g, ' ') // collapse spaces
    .trim()
    .toLowerCase();

  const tokens = raw
    .split(' ')
    .filter(Boolean)
    .filter((w) => !STOPWORDS.has(w))
    .filter((w) => !LEGAL_SUFFIXES.includes(w));

  if (!tokens.length) return '';

  // take first letter of first two significant words
  const letters = tokens.slice(0, 2).map((w) => w[0]!.toUpperCase());
  return letters.join('');
}
