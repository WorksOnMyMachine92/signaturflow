import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { WorkflowProvider } from '../store/WorkflowProvider';
import { sha256File } from './verification/hash';
import { VerificationPage } from './verification/VerificationPage';
import { CreateWorkflowPage } from './workflows/CreateWorkflowPage';

vi.mock('./verification/hash', async (importOriginal) => {
  const original = await importOriginal<typeof import('./verification/hash')>();
  return { ...original, sha256File: vi.fn() };
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const firstHash = 'A'.repeat(64);
const secondHash = 'B'.repeat(64);

describe('hash operation identity', () => {
  beforeEach(() => vi.mocked(sha256File).mockReset());

  it('keeps the hash associated with the latest creation file', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    vi.mocked(sha256File).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WorkflowProvider>
          <CreateWorkflowPage />
        </WorkflowProvider>
      </MemoryRouter>,
    );
    const input = screen.getByLabelText('PDF-Dokument');

    await user.upload(input, new File(['a'], 'a.pdf', { type: 'application/pdf' }));
    await user.upload(input, new File(['b'], 'b.pdf', { type: 'application/pdf' }));
    second.resolve(secondHash);
    expect(await screen.findByText(/BBBB BBBB BBBB BBBB/)).toBeVisible();
    first.resolve(firstHash);

    expect(screen.queryByText(/AAAA AAAA AAAA AAAA/)).not.toBeInTheDocument();
    expect(screen.getByText(/BBBB BBBB BBBB BBBB/)).toBeVisible();
  });

  it('discards a verification result after the reference changes', async () => {
    const pending = deferred<string>();
    vi.mocked(sha256File).mockReturnValueOnce(pending.promise);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WorkflowProvider>
          <VerificationPage />
        </WorkflowProvider>
      </MemoryRouter>,
    );
    const select = screen.getByLabelText('Referenzvorgang');
    await user.selectOptions(select, 'demo-vertrag-2026');
    await user.upload(
      screen.getByLabelText('Lokales PDF-Dokument'),
      new File(['a'], 'a.pdf', { type: 'application/pdf' }),
    );
    await user.selectOptions(select, 'demo-freigabe-2026');
    pending.resolve(firstHash);

    expect(
      screen.queryByRole('heading', { name: /Dokument (stimmt|weicht)/ }),
    ).not.toBeInTheDocument();
  });
});
