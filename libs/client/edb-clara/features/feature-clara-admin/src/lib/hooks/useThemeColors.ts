// apps/mobile/src/lib/ui/admin/hooks/useThemeColors.ts
import { useColorScheme } from 'nativewind';

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return {
    dark,
    text: dark ? '#E5E7EB' : '#111827',
    dim: dark ? '#9CA3AF' : '#6B7280',
    icon: dark ? '#E5E7EB' : '#111827',
    iconDim: dark ? '#9CA3AF' : '#6B7280',
    border: dark ? '#374151' : '#E5E7EB',
  };
}
