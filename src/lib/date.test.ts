import { getDeadlineState } from './date';

describe('getDeadlineState', () => {
  const today = new Date(2026, 2, 27, 12);

  it.each([
    ['2026-03-27', 'due-soon'],
    ['2026-04-03', 'due-soon'],
    ['2026-04-04', 'normal'],
    ['2026-03-26', 'overdue'],
  ] as const)('classifies %s as %s', (dueDate, expected) => {
    expect(getDeadlineState(dueDate, today)).toBe(expected);
  });

  it('uses local calendar dates across a daylight-saving boundary', () => {
    expect(getDeadlineState('2026-03-29', today)).toBe('due-soon');
  });
});
