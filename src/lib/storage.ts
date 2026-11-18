import { seedWorkflows } from '../data/seedWorkflows';
import type { PersistedWorkflowDocumentV1, Workflow } from '../types/workflow';

export const STORAGE_KEY = 'signaturflow.workflows.v1';

function freshDocument(): PersistedWorkflowDocumentV1 {
  return { version: 1, workflows: structuredClone(seedWorkflows) };
}

function isWorkflow(value: unknown): value is Workflow {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Workflow>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.status === 'string' &&
    Array.isArray(candidate.audit) &&
    !!candidate.document &&
    typeof candidate.document.hash === 'string'
  );
}

export function loadWorkflowDocument(): PersistedWorkflowDocumentV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshDocument();
    const parsed = JSON.parse(raw) as Partial<PersistedWorkflowDocumentV1>;
    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.workflows) ||
      !parsed.workflows.every(isWorkflow)
    ) {
      return freshDocument();
    }
    return { version: 1, workflows: parsed.workflows };
  } catch {
    return freshDocument();
  }
}

export function saveWorkflowDocument(document: PersistedWorkflowDocumentV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
  } catch {
    // The app continues in-memory when storage is unavailable.
  }
}
