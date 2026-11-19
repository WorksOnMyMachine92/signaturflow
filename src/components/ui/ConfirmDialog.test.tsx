import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('keeps the dialog outside an inert application background', () => {
    render(
      <div className="shell">
        <div className="shell__body">
          <ConfirmDialog
            open
            title="Status wirklich ändern?"
            confirmLabel="Status ändern"
            onCancel={vi.fn()}
            onConfirm={vi.fn()}
          >
            <p>Text</p>
          </ConfirmDialog>
        </div>
      </div>,
    );

    const background = document.querySelector<HTMLElement>('.shell__body')!;
    const confirm = screen.getByRole('button', { name: 'Status ändern' });

    expect(background.inert).toBe(true);
    expect(background.contains(confirm)).toBe(false);
  });

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
