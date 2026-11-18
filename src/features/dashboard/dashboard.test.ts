import { seedWorkflows } from '../../data/seedWorkflows';
import { filterAndSortWorkflows, getDashboardSummary } from './dashboard';

describe('dashboard derivations', () => {
  it('calculates the four summary values including overlapping critical deadlines', () => {
    const summary = getDashboardSummary(seedWorkflows, new Date(2026, 10, 18, 12));

    expect(summary).toEqual({ inProgress: 2, awaitingSignature: 1, completed: 1, critical: 3 });
  });

  it('searches case-insensitively across title, signer and reference', () => {
    expect(filterAndSortWorkflows(seedWorkflows, 'HOFFMANN', 'all', 'updated')).toHaveLength(1);
    expect(
      filterAndSortWorkflows(seedWorkflows, 'sf-2026-1038', 'all', 'updated')[0]?.title,
    ).toMatch(/Barrierefreiheit/);
  });

  it('filters every persisted status', () => {
    for (const status of [
      'draft',
      'awaiting_signature',
      'awaiting_verification',
      'completed',
    ] as const) {
      expect(filterAndSortWorkflows(seedWorkflows, '', status, 'updated')).toHaveLength(1);
    }
  });

  it('sorts by due date without mutating the input', () => {
    const original = seedWorkflows.map((workflow) => workflow.id);
    const sorted = filterAndSortWorkflows(seedWorkflows, '', 'all', 'dueDate');

    expect(sorted[0]?.dueDate).toBe('2026-10-30');
    expect(seedWorkflows.map((workflow) => workflow.id)).toEqual(original);
  });
});
