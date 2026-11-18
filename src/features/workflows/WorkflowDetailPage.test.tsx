import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WorkflowProvider } from '../../store/WorkflowProvider';
import { getAccessibilityResults } from '../../test/axe';
import { WorkflowDetailPage } from './WorkflowDetailPage';

function renderDetail(id = 'demo-vertrag-2026') {
  return render(
    <MemoryRouter initialEntries={[`/vorgaenge/${id}`]}>
      <WorkflowProvider>
        <Routes>
          <Route path="/vorgaenge/:id" element={<WorkflowDetailPage />} />
        </Routes>
      </WorkflowProvider>
    </MemoryRouter>,
  );
}

describe('WorkflowDetailPage', () => {
  it('shows a helpful not-found state', () => {
    renderDetail('missing');
    expect(screen.getByRole('heading', { name: 'Vorgang nicht gefunden' })).toBeVisible();
  });

  it('changes state only after confirmation and appends an audit entry', async () => {
    const user = userEvent.setup();
    renderDetail();

    expect(screen.getByText('Signatur ausstehend')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Als signiert markieren' }));
    expect(screen.getByText('Signatur ausstehend')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Abbrechen' }));
    expect(screen.getByText('Signatur ausstehend')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Als signiert markieren' }));
    await user.click(screen.getByRole('button', { name: 'Status ändern' }));

    expect(screen.getByText('Prüfung ausstehend')).toBeVisible();
    expect(screen.getByText('Signatur simuliert')).toBeVisible();
  });

  it('offers no status action for a completed workflow', () => {
    renderDetail('demo-beschluss-2026');
    expect(
      screen.queryByRole('button', { name: /markieren|senden|abschließen/i }),
    ).not.toBeInTheDocument();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderDetail();
    expect((await getAccessibilityResults(container)).violations).toEqual([]);
  });
});
