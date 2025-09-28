// apps/mobile/src/lib/ui/cn.ts
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}
