import { useState } from 'react';
import { Field } from '../../components/ui/Field';
import { useWorkflows } from '../../store/WorkflowProvider';
import { MAX_FILE_SIZE } from '../workflows/schema';
import { formatFingerprint, sha256File } from './hash';

type Result = { kind: 'match' | 'mismatch'; hash: string } | null;

export function VerificationPage() {
  const { workflows } = useWorkflows();
  const [referenceId, setReferenceId] = useState('');
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState('');
  const reference = workflows.find((workflow) => workflow.id === referenceId);
  function chooseReference(id: string) {
    setReferenceId(id);
    setResult(null);
    setError('');
  }
  async function verify(file?: File) {
    setResult(null);
    setError('');
    if (!file) return;
    if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setError('Wählen Sie eine PDF-Datei.');
      return;
    }
    if (file.size === 0) {
      setError('Die Datei ist leer.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Die Datei darf höchstens 10 MB groß sein.');
      return;
    }
    try {
      const hash = await sha256File(file);
      setResult({ kind: hash === reference?.document.hash ? 'match' : 'mismatch', hash });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Die Datei konnte nicht gelesen werden.');
    }
  }
  return (
    <section className="verification-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Lokale Prüfung</span>
          <h1>Dokument verifizieren</h1>
          <p>
            Vergleichen Sie den SHA-256-Fingerabdruck einer lokalen PDF-Datei mit einem
            gespeicherten Demonstrationsvorgang.
          </p>
        </div>
      </header>
      <div className="verification-grid">
        <section className="form-card">
          <h2>Prüfung starten</h2>
          <Field
            id="reference"
            label="Referenzvorgang"
            hint="Die Auswahl legt fest, mit welchem Fingerabdruck verglichen wird."
          >
            <select
              id="reference"
              value={referenceId}
              onChange={(event) => chooseReference(event.target.value)}
              aria-describedby="reference-hint"
            >
              <option value="">Bitte auswählen</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.reference} · {workflow.title}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id="verify-file"
            label="Lokales PDF-Dokument"
            hint={
              reference
                ? 'Die Datei wird ausschließlich im Browser gelesen.'
                : 'Wählen Sie zuerst einen Vorgang aus.'
            }
            error={error || undefined}
          >
            <input
              id="verify-file"
              type="file"
              accept="application/pdf,.pdf"
              disabled={!reference}
              onChange={(event) => void verify(event.target.files?.[0])}
              aria-describedby={`verify-file-hint${error ? ' verify-file-error' : ''}`}
            />
          </Field>
          {reference && (
            <div className="reference-box">
              <span>Erwarteter Fingerabdruck</span>
              <code>{formatFingerprint(reference.document.hash)}</code>
            </div>
          )}
        </section>
        <section className="verification-result" aria-live="polite">
          {!result && (
            <div className="result-placeholder">
              <span aria-hidden="true">⌁</span>
              <h2>Noch keine Prüfung</h2>
              <p>Nach der Dateiauswahl erscheint das Ergebnis an dieser Stelle.</p>
            </div>
          )}
          {result?.kind === 'match' && (
            <div className="result-card result-card--match">
              <span className="result-icon" aria-hidden="true">
                ✓
              </span>
              <h2>Dokument stimmt überein</h2>
              <p>
                Der berechnete Fingerabdruck stimmt Byte für Byte mit der gewählten Referenz
                überein.
              </p>
              <code>{formatFingerprint(result.hash)}</code>
            </div>
          )}
          {result?.kind === 'mismatch' && (
            <div className="result-card result-card--mismatch">
              <span className="result-icon" aria-hidden="true">
                !
              </span>
              <h2>Dokument weicht ab</h2>
              <p>
                Der Fingerabdruck unterscheidet sich. Die Datei entspricht nicht der gewählten
                Referenz.
              </p>
              <code>{formatFingerprint(result.hash)}</code>
            </div>
          )}
        </section>
      </div>
      <aside className="limits-note">
        <h2>Was diese Prüfung aussagt</h2>
        <p>
          Ein identischer Hash belegt nur, dass die Dateiinhalte mit der gewählten Referenz
          übereinstimmen. Er bestätigt weder die Identität einer Person noch eine rechtsgültige
          elektronische Signatur.
        </p>
      </aside>
    </section>
  );
}
