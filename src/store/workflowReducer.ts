import { seedWorkflows } from '../data/seedWorkflows';
import type {
  AuditEntry,
  Workflow,
  WorkflowAction,
  WorkflowState,
  WorkflowStatus,
} from '../types/workflow';

export const initialWorkflowState: WorkflowState = {
  workflows: [],
  lastError: null,
};

const nextStatus: Partial<Record<WorkflowStatus, WorkflowStatus>> = {
  draft: 'awaiting_signature',
  awaiting_signature: 'awaiting_verification',
  awaiting_verification: 'completed',
};

const auditCopy: Record<WorkflowStatus, { title: string; description: string }> = {
  draft: {
    title: 'Vorgang erstellt',
    description: 'Der Vorgang wurde lokal als Entwurf angelegt.',
  },
  awaiting_signature: {
    title: 'Anfrage vorbereitet',
    description: 'Der Status wurde auf „Signatur ausstehend“ gesetzt.',
  },
  awaiting_verification: {
    title: 'Signatur simuliert',
    description: 'Das Dokument wartet auf die lokale Hash-Prüfung.',
  },
  completed: {
    title: 'Prüfung abgeschlossen',
    description: 'Der Demonstrationsablauf wurde erfolgreich abgeschlossen.',
  },
};

function createAudit(status: WorkflowStatus, timestamp: string): AuditEntry {
  return { id: crypto.randomUUID(), timestamp, ...auditCopy[status] };
}

export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  if (action.type === 'hydrate') return { workflows: action.payload, lastError: null };
  if (action.type === 'clear-error') return { ...state, lastError: null };
  if (action.type === 'reset')
    return { workflows: structuredClone(seedWorkflows), lastError: null };

  if (action.type === 'create') {
    const now = new Date().toISOString();
    const id = action.id ?? crypto.randomUUID();
    const workflow: Workflow = {
      id,
      reference: `SF-${new Date().getFullYear()}-${id.slice(0, 4).toUpperCase()}`,
      ...action.payload,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      audit: [createAudit('draft', now)],
    };
    return { workflows: [workflow, ...state.workflows], lastError: null };
  }

  const current = state.workflows.find((workflow) => workflow.id === action.id);
  const targetStatus = current ? nextStatus[current.status] : undefined;
  if (!current || !targetStatus) {
    return { ...state, lastError: 'Dieser Statuswechsel ist nicht möglich.' };
  }

  const now = new Date().toISOString();
  return {
    lastError: null,
    workflows: state.workflows.map((workflow) =>
      workflow.id === action.id
        ? {
            ...workflow,
            status: targetStatus,
            updatedAt: now,
            audit: [...workflow.audit, createAudit(targetStatus, now)],
          }
        : workflow,
    ),
  };
}
