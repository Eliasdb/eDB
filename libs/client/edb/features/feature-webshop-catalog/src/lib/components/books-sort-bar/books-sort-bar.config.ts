export const SORT_BY_MAP: Record<string, { label: string; key: string }> = {
  ['title-asc']: {
    label: 'title (a-z)',
    key: 'title,asc',
  },
  ['title-desc']: {
    label: 'title (z-a)',
    key: 'title,desc',
  },
  ['author-asc']: {
    label: 'author (a-z)',
    key: 'author,asc',
  },
  ['auth-desc']: {
    label: 'author (z-a)',
    key: 'author,desc',
  },
  ['published-desc']: {
    label: 'year (newest)',
    key: 'published_date,desc',
  },
  ['published-asc']: {
    label: 'year (oldest)',
    key: 'published_date,asc',
  },
};

export const SORT_BY_ORDER = [
  'title-asc',
  'title-desc',
  'author-asc',
  'auth-desc',
  'published-desc',
  'published-asc',
];
