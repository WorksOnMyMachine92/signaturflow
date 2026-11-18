import type { WorkflowStatus } from '../../types/workflow';

export const statusLabels: Record<WorkflowStatus, string> = {
  draft: 'Entwurf',
  awaiting_signature: 'Signatur ausstehend',
  awaiting_verification: 'Prüfung ausstehend',
  completed: 'Abgeschlossen',
};

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  return <span className={`status status--${status}`}>{statusLabels[status]}</span>;
}
