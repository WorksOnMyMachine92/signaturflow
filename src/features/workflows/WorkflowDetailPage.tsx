import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuditTimeline } from '../../components/workflow/AuditTimeline';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ToastRegion } from '../../components/ui/ToastRegion';
import { formatGermanDate, getDeadlineState } from '../../lib/date';
import { useWorkflows } from '../../store/WorkflowProvider';
import type { WorkflowStatus } from '../../types/workflow';

const actionLabels: Partial<Record<WorkflowStatus, string>> = {
  draft: 'Anfrage senden',
  awaiting_signature: 'Als signiert markieren',
  awaiting_verification: 'Prüfung abschließen',
};

export function WorkflowDetailPage() {
  const { id = '' } = useParams();
  const { getById, transition } = useWorkflows();
  const workflow = getById(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');
  if (!workflow)
    return (
      <section className="content-panel not-found-inline">
        <h1>Vorgang nicht gefunden</h1>
        <p>Der lokale Vorgang existiert nicht oder wurde zurückgesetzt.</p>
        <Link to="/">Zur Übersicht</Link>
      </section>
    );
  const actionLabel = actionLabels[workflow.status];
  const deadline = getDeadlineState(workflow.dueDate);
  async function copyReference() {
    try {
      await navigator.clipboard.writeText(workflow!.reference);
      setMessage('Referenz kopiert.');
    } catch {
      setMessage('Referenz konnte nicht kopiert werden.');
    }
  }
  return (
    <>
      <section className="detail-heading">
        <div>
          <Link to="/">← Zur Übersicht</Link>
          <div className="eyebrow">{workflow.reference}</div>
          <h1>{workflow.title}</h1>
          <StatusBadge status={workflow.status} />
        </div>
        {actionLabel && <Button onClick={() => setConfirmOpen(true)}>{actionLabel}</Button>}
      </section>
      <div className="detail-grid">
        <section className="content-panel detail-card">
          <h2>Dokument und Person</h2>
          <dl>
            <div>
              <dt>Datei</dt>
              <dd>{workflow.document.name}</dd>
            </div>
            <div>
              <dt>Unterzeichnende Person</dt>
              <dd>
                {workflow.signerName}
                <small>{workflow.signerEmail}</small>
              </dd>
            </div>
            <div>
              <dt>Frist</dt>
              <dd className={`deadline deadline--${deadline}`}>
                {deadline === 'overdue' && <b>Überfällig · </b>}
                {formatGermanDate(workflow.dueDate)}
              </dd>
            </div>
            <div>
              <dt>Referenz</dt>
              <dd>
                <code>{workflow.reference}</code>{' '}
                <button className="text-button" onClick={() => void copyReference()}>
                  Kopieren
                </button>
              </dd>
            </div>
          </dl>
          <div className="local-notice">
            <strong>Lokale Demonstration</strong>
            <p>
              Dieser Vorgang simuliert einen Signaturprozess und besitzt keine rechtliche Wirkung.
            </p>
          </div>
        </section>
        <section className="content-panel">
          <h2>Aktivitätsverlauf</h2>
          <AuditTimeline entries={workflow.audit} />
        </section>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Status wirklich ändern?"
        confirmLabel="Status ändern"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          transition(workflow.id);
          setConfirmOpen(false);
          setMessage('Status wurde lokal aktualisiert.');
        }}
      >
        <p>Die Aktion „{actionLabel}“ wird im lokalen Aktivitätsverlauf dokumentiert.</p>
      </ConfirmDialog>
      <ToastRegion message={message} />
    </>
  );
}
