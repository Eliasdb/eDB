// domain/utils/initials.ts
export function initialsFromName(name?: string | null) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
