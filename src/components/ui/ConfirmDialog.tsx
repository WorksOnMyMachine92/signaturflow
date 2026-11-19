import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog(props: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!props.open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    const background = Array.from(
      document.querySelectorAll<HTMLElement>('.shell > :not(.dialog-backdrop)'),
    );
    background.forEach((element) => {
      element.inert = true;
    });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') props.onCancel();
      if (event.key !== 'Tab') return;
      const controls = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (controls.length === 0) return;
      const first = controls[0]!;
      const last = controls.at(-1)!;
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      background.forEach((element) => {
        element.inert = false;
      });
      previousFocus.current?.focus();
    };
  }, [props.open, props.onCancel]);
  if (!props.open) return null;
  return (
    <div className="dialog-backdrop">
      <section
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">{props.title}</h2>
        <div>{props.children}</div>
        <div className="dialog__actions">
          <Button variant="secondary" onClick={props.onCancel}>
            Abbrechen
          </Button>
          <Button ref={confirmRef} onClick={props.onConfirm}>
            {props.confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
