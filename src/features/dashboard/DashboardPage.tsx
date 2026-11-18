import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentTable } from '../../components/workflow/DocumentTable';
import { SummaryCard } from '../../components/workflow/SummaryCard';
import { WorkflowFilters } from '../../components/workflow/WorkflowFilters';
import { EmptyState } from '../../components/ui/EmptyState';
import { useWorkflows } from '../../store/WorkflowProvider';
import {
  filterAndSortWorkflows,
  getDashboardSummary,
  type WorkflowFilter,
  type WorkflowSort,
} from './dashboard';

export function DashboardPage() {
  const { workflows } = useWorkflows();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<WorkflowFilter>('all');
  const [sort, setSort] = useState<WorkflowSort>('updated');
  const summary = useMemo(() => getDashboardSummary(workflows), [workflows]);
  const visibleWorkflows = useMemo(
    () => filterAndSortWorkflows(workflows, query, status, sort),
    [query, sort, status, workflows],
  );

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Übersicht</span>
          <h1>Signaturvorgänge</h1>
          <p>Dokumente lokal vorbereiten, verfolgen und nachvollziehbar prüfen.</p>
        </div>
        <Link className="button button--primary" to="/vorgaenge/neu">
          Neuen Vorgang anlegen
        </Link>
      </section>
      <section className="summary-grid" aria-label="Zusammenfassung">
        <SummaryCard label="In Bearbeitung" value={summary.inProgress} />
        <SummaryCard label="Signatur ausstehend" value={summary.awaitingSignature} />
        <SummaryCard label="Abgeschlossen" value={summary.completed} tone="success" />
        <SummaryCard label="Fristkritisch" value={summary.critical} tone="warning" />
      </section>
      <section className="content-panel" aria-labelledby="workflow-list-title">
        <div className="section-heading">
          <div>
            <h2 id="workflow-list-title">Alle Vorgänge</h2>
            <p>
              {visibleWorkflows.length} von {workflows.length} sichtbar
            </p>
          </div>
        </div>
        <WorkflowFilters
          query={query}
          status={status}
          sort={sort}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
        {visibleWorkflows.length > 0 ? (
          <DocumentTable workflows={visibleWorkflows} />
        ) : (
          <EmptyState title="Keine passenden Vorgänge">
            Ändern Sie Suche oder Filter, um wieder Ergebnisse anzuzeigen.
          </EmptyState>
        )}
      </section>
    </>
  );
}
