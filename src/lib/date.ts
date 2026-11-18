export type DeadlineState = 'normal' | 'due-soon' | 'overdue';

function toLocalDateNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseCalendarDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date(Number.NaN);
  return new Date(year, month - 1, day, 12);
}

export function getDeadlineState(dueDate: string, today = new Date()): DeadlineState {
  const due = parseCalendarDate(dueDate);
  if (Number.isNaN(due.getTime())) return 'normal';

  const days = (toLocalDateNumber(due) - toLocalDateNumber(today)) / 86_400_000;
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due-soon';
  return 'normal';
}

export function formatGermanDate(value: string): string {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(parseCalendarDate(value));
}
