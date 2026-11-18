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
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (props.open && !dialog.open) dialog.showModal();
    if (!props.open && dialog.open) dialog.close();
  }, [props.open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      onCancel={props.onCancel}
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title">{props.title}</h2>
      <div>{props.children}</div>
      <div className="dialog__actions">
        <Button variant="secondary" onClick={props.onCancel}>
          Abbrechen
        </Button>
        <Button onClick={props.onConfirm}>{props.confirmLabel}</Button>
      </div>
    </dialog>
  );
}
