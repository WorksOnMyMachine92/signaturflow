import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WorkflowProvider } from '../../store/WorkflowProvider';
import { getAccessibilityResults } from '../../test/axe';
import { CreateWorkflowPage } from './CreateWorkflowPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <WorkflowProvider>
        <CreateWorkflowPage />
      </WorkflowProvider>
    </MemoryRouter>,
  );
}

describe('CreateWorkflowPage', () => {
  it('shows linked field errors and explains local processing', async () => {
    const user = userEvent.setup();
    const { container } = renderPage();

    expect(screen.getByText(/ausschließlich lokal/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Vorgang lokal speichern' }));

    expect(screen.getByRole('alert', { name: 'Bitte Eingaben prüfen' })).toBeVisible();
    expect(screen.getByRole('link', { name: /Dokumenttitel/ })).toHaveAttribute('href', '#title');
    expect((await getAccessibilityResults(container)).violations).toEqual([]);
  });

  it('hashes an uploaded PDF and displays its fingerprint', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.upload(
      screen.getByLabelText('PDF-Dokument'),
      new File(['hello'], 'demo.pdf', { type: 'application/pdf' }),
    );

    expect(await screen.findByText(/2CF2 4DBA 5FB0 A30E/)).toBeVisible();
  });
});
