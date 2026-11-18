import type { AuditEntry } from '../../types/workflow';

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  return (
    <ol className="timeline">
      {entries.toReversed().map((entry) => (
        <li key={entry.id}>
          <span className="timeline__dot" aria-hidden="true" />
          <div>
            <strong>{entry.title}</strong>
            <p>{entry.description}</p>
            <time dateTime={entry.timestamp}>
              {new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(
                new Date(entry.timestamp),
              )}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
