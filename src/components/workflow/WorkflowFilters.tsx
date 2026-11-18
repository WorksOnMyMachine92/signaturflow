import type { WorkflowFilter, WorkflowSort } from '../../features/dashboard/dashboard';

type WorkflowFiltersProps = {
  query: string;
  status: WorkflowFilter;
  sort: WorkflowSort;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: WorkflowFilter) => void;
  onSortChange: (value: WorkflowSort) => void;
};

export function WorkflowFilters(props: WorkflowFiltersProps) {
  return (
    <div className="filters">
      <label className="search-field">
        <span>Vorgänge durchsuchen</span>
        <input
          type="search"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder="Titel, Person oder Referenz"
        />
      </label>
      <label>
        <span>Status filtern</span>
        <select
          value={props.status}
          onChange={(event) => props.onStatusChange(event.target.value as WorkflowFilter)}
        >
          <option value="all">Alle Status</option>
          <option value="draft">Entwurf</option>
          <option value="awaiting_signature">Signatur ausstehend</option>
          <option value="awaiting_verification">Prüfung ausstehend</option>
          <option value="completed">Abgeschlossen</option>
        </select>
      </label>
      <label>
        <span>Sortieren</span>
        <select
          value={props.sort}
          onChange={(event) => props.onSortChange(event.target.value as WorkflowSort)}
        >
          <option value="updated">Zuletzt geändert</option>
          <option value="dueDate">Frist</option>
          <option value="title">Titel</option>
        </select>
      </label>
    </div>
  );
}
