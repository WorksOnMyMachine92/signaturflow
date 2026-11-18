import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { useWorkflows } from '../../store/WorkflowProvider';
import { formatFingerprint, sha256File } from '../verification/hash';
import { createWorkflowSchema, type CreateWorkflowFields } from './schema';

export function CreateWorkflowPage() {
  const navigate = useNavigate();
  const { create } = useWorkflows();
  const [hash, setHash] = useState('');
  const [fileError, setFileError] = useState('');
  const form = useForm<CreateWorkflowFields>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: { title: '', signerName: '', signerEmail: '', dueDate: '', note: '' },
  });
  const errors = form.formState.errors;

  async function chooseFile(file?: File) {
    setHash('');
    setFileError('');
    if (!file) return;
    form.setValue('file', file, { shouldValidate: true });
    try {
      setHash(await sha256File(file));
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : 'Die Datei konnte nicht gelesen werden.',
      );
    }
  }

  const submit = form.handleSubmit((values) => {
    if (!hash) return;
    const id = create({
      title: values.title,
      signerName: values.signerName,
      signerEmail: values.signerEmail,
      dueDate: values.dueDate,
      note: values.note,
      document: {
        name: values.file.name,
        size: values.file.size,
        mimeType: values.file.type || 'application/pdf',
        hash,
      },
    });
    navigate(`/vorgaenge/${id}`);
  });

  const errorEntries = Object.entries(errors).filter(([, error]) => error?.message);

  return (
    <section className="form-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Neuer Vorgang</span>
          <h1>Signatur vorbereiten</h1>
          <p>
            Alle Angaben und Dokumentinhalte werden ausschließlich lokal in diesem Browser
            verarbeitet.
          </p>
        </div>
      </header>

      {errorEntries.length > 0 && (
        <div className="error-summary" role="alert" aria-label="Bitte Eingaben prüfen">
          <h2>Bitte Eingaben prüfen</h2>
          <ul>
            {errorEntries.map(([name, error]) => (
              <li key={name}>
                <a href={`#${name}`}>{String(error?.message)}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={submit} noValidate className="workflow-form">
        <section className="form-card" aria-labelledby="document-section">
          <h2 id="document-section">Dokument</h2>
          <Field id="title" label="Dokumenttitel" error={errors.title?.message}>
            <input
              id="title"
              {...form.register('title')}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
          </Field>
          <Field
            id="file"
            label="PDF-Dokument"
            hint="Maximal 10 MB. Die Datei wird nicht hochgeladen."
            error={errors.file?.message ?? fileError}
          >
            <input
              id="file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => void chooseFile(event.target.files?.[0])}
              aria-invalid={!!errors.file || !!fileError}
              aria-describedby={`file-hint${errors.file || fileError ? ' file-error' : ''}`}
            />
          </Field>
          {hash && (
            <div className="fingerprint">
              <span>Lokaler SHA-256-Fingerabdruck</span>
              <code>{formatFingerprint(hash)}</code>
            </div>
          )}
        </section>

        <section className="form-card" aria-labelledby="signer-section">
          <h2 id="signer-section">Unterzeichnende Person</h2>
          <div className="form-grid">
            <Field id="signerName" label="Name" error={errors.signerName?.message}>
              <input
                id="signerName"
                {...form.register('signerName')}
                aria-invalid={!!errors.signerName}
                aria-describedby={errors.signerName ? 'signerName-error' : undefined}
              />
            </Field>
            <Field id="signerEmail" label="Demo-E-Mail-Adresse" error={errors.signerEmail?.message}>
              <input
                id="signerEmail"
                type="email"
                {...form.register('signerEmail')}
                aria-invalid={!!errors.signerEmail}
                aria-describedby={errors.signerEmail ? 'signerEmail-error' : undefined}
              />
            </Field>
          </div>
          <Field id="dueDate" label="Frist" error={errors.dueDate?.message}>
            <input
              id="dueDate"
              type="date"
              {...form.register('dueDate')}
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
            />
          </Field>
          <Field
            id="note"
            label="Notiz (optional)"
            hint="Höchstens 500 Zeichen"
            error={errors.note?.message}
          >
            <textarea
              id="note"
              rows={4}
              {...form.register('note')}
              aria-describedby={`note-hint${errors.note ? ' note-error' : ''}`}
            />
          </Field>
        </section>
        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Abbrechen
          </Button>
          <Button type="submit">Vorgang lokal speichern</Button>
        </div>
      </form>
    </section>
  );
}
