import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { seedWorkflows } from '../../data/seedWorkflows';
import { saveWorkflowDocument } from '../../lib/storage';
import { WorkflowProvider } from '../../store/WorkflowProvider';
import { getAccessibilityResults } from '../../test/axe';
import { VerificationPage } from './VerificationPage';

const helloHash = '2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824';

function renderPage() {
  return render(
    <MemoryRouter>
      <WorkflowProvider>
        <VerificationPage />
      </WorkflowProvider>
    </MemoryRouter>,
  );
}

describe('VerificationPage', () => {
  it('requires an explicit reference before selecting a file', () => {
    renderPage();
    expect(screen.getByLabelText('Lokales PDF-Dokument')).toBeDisabled();
    expect(screen.getByText(/zuerst einen Vorgang/i)).toBeVisible();
  });

  it('shows a text and icon result for a matching file', async () => {
    const user = userEvent.setup();
    saveWorkflowDocument({
      version: 1,
      workflows: [
        { ...seedWorkflows[0]!, document: { ...seedWorkflows[0]!.document, hash: helloHash } },
      ],
    });
    renderPage();

    await user.selectOptions(screen.getByLabelText('Referenzvorgang'), 'demo-vertrag-2026');
    await user.upload(
      screen.getByLabelText('Lokales PDF-Dokument'),
      new File(['hello'], 'demo.pdf', { type: 'application/pdf' }),
    );

    expect(await screen.findByRole('heading', { name: 'Dokument stimmt überein' })).toBeVisible();
    expect(screen.getByText(/Byte für Byte/)).toBeVisible();
  });

  it('shows an explicit mismatch and clears it when the reference changes', async () => {
    const user = userEvent.setup();
    renderPage();
    const select = screen.getByLabelText('Referenzvorgang');

    await user.selectOptions(select, 'demo-vertrag-2026');
    await user.upload(
      screen.getByLabelText('Lokales PDF-Dokument'),
      new File(['other'], 'demo.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByRole('heading', { name: 'Dokument weicht ab' })).toBeVisible();

    await user.selectOptions(select, 'demo-freigabe-2026');
    expect(screen.queryByRole('heading', { name: 'Dokument weicht ab' })).not.toBeInTheDocument();
  });

  it('has no automatically detectable accessibility violations while idle', async () => {
    const { container } = renderPage();
    expect((await getAccessibilityResults(container)).violations).toEqual([]);
  });
});
