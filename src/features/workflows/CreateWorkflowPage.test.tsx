import { render, screen, waitFor } from '@testing-library/react';
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
    await user.click(screen.getByRole('button', { name: 'Angaben prüfen' }));

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

  it('reviews and locally saves a complete demo-document workflow', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText('Dokumenttitel'), 'Testvereinbarung');
    await user.click(screen.getByLabelText('Gebündeltes Demo-Dokument'));
    await screen.findByText('signaturflow-demo.pdf ist ausgewählt.');
    await user.type(screen.getByLabelText('Name'), 'Mara Beispiel');
    await user.type(screen.getByLabelText('Demo-E-Mail-Adresse'), 'mara@example.test');
    await user.type(screen.getByLabelText('Frist'), '2026-11-25');
    await user.click(screen.getByRole('button', { name: 'Angaben prüfen' }));

    expect(await screen.findByRole('heading', { name: 'Angaben prüfen' })).toBeVisible();
    expect(screen.getAllByText('Namen eingeben (Demo)')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Prüfung abschließen und speichern' }));

    await waitFor(() =>
      expect(localStorage.getItem('signaturflow.workflows.v1')).toContain('Testvereinbarung'),
    );
    expect(localStorage.getItem('signaturflow.workflows.v1')).not.toContain('documentBytes');
  });
});
