import type { CompanyOverview } from '@edb-clara/client-crm';

type IconName = React.ComponentProps<
  typeof import('@expo/vector-icons').Ionicons
>['name'];

export type StatRow = {
  /** Ionicon name */
  icon: IconName;
  /** Left label */
  label: string;
  /**
   * Extract and format the value from overview.
   * Return `null | undefined | ''` to show fallback (“—”).
   */
  getValue: (ov?: CompanyOverview) => string | number | null | undefined;
  /** Optional custom empty fallback (defaults to "—") */
  empty?: string;
};

export const companyStatsConfig: readonly StatRow[] = [
  {
    icon: 'time-outline',
    label: 'Last activity',
    getValue: (ov) => ov?.stats.lastActivityAt ?? null,
  },
  {
    icon: 'flash-outline',
    label: 'Open tasks',
    getValue: (ov) => ov?.stats.openTasks ?? 0,
  },
  {
    icon: 'calendar-outline',
    label: 'Next due task',
    getValue: (ov) => ov?.stats.nextTaskDue ?? null,
  },
] as const;
