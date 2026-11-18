import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WorkflowProvider } from '../../store/WorkflowProvider';
import { getAccessibilityResults } from '../../test/axe';
import { DashboardPage } from './DashboardPage';

function renderDashboard() {
  return render(
    <MemoryRouter>
      <WorkflowProvider>
        <DashboardPage />
      </WorkflowProvider>
    </MemoryRouter>,
  );
}

describe('DashboardPage', () => {
  it('provides labelled search and status filters plus visible status text', () => {
    renderDashboard();

    expect(screen.getByRole('searchbox', { name: 'Vorgänge durchsuchen' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Status filtern' })).toBeVisible();
    expect(screen.getAllByText('Signatur ausstehend').length).toBeGreaterThan(0);
  });

  it('shows a useful no-results state', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.type(
      screen.getByRole('searchbox', { name: 'Vorgänge durchsuchen' }),
      'nicht vorhanden',
    );

    expect(screen.getByText('Keine passenden Vorgänge')).toBeVisible();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderDashboard();
    expect((await getAccessibilityResults(container)).violations).toEqual([]);
  });
});
