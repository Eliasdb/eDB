import type { CompanyOverview } from '@edb-clara/client-crm';

/* --- tiny time label --- */
export const relFuture = (iso?: string | null) => {
  if (!iso) return undefined;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return undefined;

  const diff = t - Date.now();
  const abs = Math.abs(diff);

  const min = 60_000,
    hr = 60 * min,
    day = 24 * hr,
    wk = 7 * day;
  const label =
    abs < hr
      ? `${Math.max(1, Math.round(abs / min))}m`
      : abs < day
        ? `${Math.round(abs / hr)}h`
        : abs < wk
          ? `${Math.round(abs / day)}d`
          : `${Math.round(abs / wk)}w`;

  return diff < 0 ? `${label} overdue` : `in ${label}`;
};

/* --- badge from real fields --- */
export type StatusView = { label: string; tint: string };

const statusFromTask = (
  t: CompanyOverview['tasks'][number] | undefined,
): StatusView => {
  if (t?.done === true) return { tint: '#16a34a', label: 'Done' };
  const s = String(t?.status ?? t?.state ?? '').toLowerCase();
  if (s === 'blocked') return { tint: '#ef4444', label: 'Blocked' };
  return { tint: '#6B7280', label: 'Open' };
};

/* --- glance (trust stats; minimal fallback) --- */
export type StatItem = { label: string; value: string | number | null };

export function getTasksGlanceItems(ov?: CompanyOverview): StatItem[] {
  const tasks = ov?.tasks ?? [];
  const open =
    typeof ov?.stats?.openTasks === 'number'
      ? ov.stats.openTasks
      : tasks.reduce(
          (n, t: CompanyOverview['tasks'][number]) => n + (t?.done ? 0 : 1),
          0,
        );

  const nextDueIso = ov?.stats?.nextTaskDue ?? null; // no local compute
  const nextDue = nextDueIso ? (relFuture(nextDueIso) ?? nextDueIso) : '—';

  return [
    { label: 'Open', value: open },
    { label: 'Total', value: tasks.length },
    { label: 'Next due', value: nextDue },
  ];
}

/* --- simple row view --- */
export type TaskView = {
  id: string;
  title: string;
  secondary?: string; // just the due label
  status: StatusView;
};

export function mapTaskToView(
  task: CompanyOverview['tasks'][number] | undefined,
): TaskView {
  const id = task?.id ?? '';
  const title = task?.title ?? 'Untitled task';

  const due = task?.due ?? task?.dueAt ?? task?.dueDate ?? null;
  const secondary = due ? (relFuture(due) ?? String(due)) : 'No due date';

  return {
    id,
    title,
    secondary,
    status: statusFromTask(task),
  };
}
