import { Link } from 'react-router-dom';
import { formatGermanDate, getDeadlineState } from '../../lib/date';
import type { Workflow } from '../../types/workflow';
import { StatusBadge } from '../ui/StatusBadge';

export function DocumentTable({ workflows }: { workflows: Workflow[] }) {
  return (
    <div className="workflow-list">
      <div className="workflow-table">
        <div className="workflow-row workflow-row--head" aria-hidden="true">
          <span>Dokument</span>
          <span>Unterzeichnende Person</span>
          <span>Status</span>
          <span>Frist</span>
        </div>
        <ul className="workflow-items" aria-label="Signaturvorgänge">
          {workflows.map((workflow) => {
            const deadline = getDeadlineState(workflow.dueDate);
            return (
              <li key={workflow.id}>
                <Link className="workflow-row" to={`/vorgaenge/${workflow.id}`}>
                  <span data-label="Dokument">
                    <strong>{workflow.title}</strong>
                    <small>{workflow.reference}</small>
                  </span>
                  <span data-label="Unterzeichnende Person">{workflow.signerName}</span>
                  <span data-label="Status">
                    <StatusBadge status={workflow.status} />
                  </span>
                  <span data-label="Frist" className={`deadline deadline--${deadline}`}>
                    {deadline === 'overdue' && <b>Überfällig · </b>}
                    {formatGermanDate(workflow.dueDate)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
