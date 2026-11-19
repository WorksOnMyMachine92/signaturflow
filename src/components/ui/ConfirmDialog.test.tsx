import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('traps keyboard focus, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup();
    const cancel = vi.fn();
    const { rerender } = render(
      <>
        <button>Auslöser</button>
        <ConfirmDialog
          open={false}
          title="Bestätigen?"
          confirmLabel="Bestätigen"
          onCancel={cancel}
          onConfirm={vi.fn()}
        >
          <p>Text</p>
        </ConfirmDialog>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Auslöser' });
    trigger.focus();

    rerender(
      <>
        <button>Auslöser</button>
        <ConfirmDialog
          open
          title="Bestätigen?"
          confirmLabel="Bestätigen"
          onCancel={cancel}
          onConfirm={vi.fn()}
        >
          <p>Text</p>
        </ConfirmDialog>
      </>,
    );

    const confirm = screen.getByRole('button', { name: 'Bestätigen' });
    const abort = screen.getByRole('button', { name: 'Abbrechen' });
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(abort).toHaveFocus();
    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(cancel).toHaveBeenCalledOnce();

    rerender(
      <>
        <button>Auslöser</button>
        <ConfirmDialog
          open={false}
          title="Bestätigen?"
          confirmLabel="Bestätigen"
          onCancel={cancel}
          onConfirm={vi.fn()}
        >
          <p>Text</p>
        </ConfirmDialog>
      </>,
    );
    expect(trigger).toHaveFocus();
  });
});
