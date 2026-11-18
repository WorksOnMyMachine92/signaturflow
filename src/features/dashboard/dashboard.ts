import { getDeadlineState } from '../../lib/date';
import type { Workflow, WorkflowStatus } from '../../types/workflow';

export type WorkflowFilter = WorkflowStatus | 'all';
export type WorkflowSort = 'updated' | 'dueDate' | 'title';

export function getDashboardSummary(workflows: Workflow[], today = new Date()) {
  return {
    inProgress: workflows.filter(
      (item) => item.status === 'draft' || item.status === 'awaiting_verification',
    ).length,
    awaitingSignature: workflows.filter((item) => item.status === 'awaiting_signature').length,
    completed: workflows.filter((item) => item.status === 'completed').length,
    critical: workflows.filter(
      (item) => item.status !== 'completed' && getDeadlineState(item.dueDate, today) !== 'normal',
    ).length,
  };
}

export function filterAndSortWorkflows(
  workflows: Workflow[],
  query: string,
  status: WorkflowFilter,
  sort: WorkflowSort,
): Workflow[] {
  const needle = query.trim().toLocaleLowerCase('de');
  return workflows
    .filter((workflow) => status === 'all' || workflow.status === status)
    .filter((workflow) =>
      [workflow.title, workflow.signerName, workflow.reference].some((value) =>
        value.toLocaleLowerCase('de').includes(needle),
      ),
    )
    .toSorted((a, b) => {
      if (sort === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
      if (sort === 'title') return a.title.localeCompare(b.title, 'de');
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}
