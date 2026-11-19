import { seedWorkflows } from '../data/seedWorkflows';
import type { PersistedWorkflowDocumentV1, Workflow } from '../types/workflow';

export const STORAGE_KEY = 'signaturflow.workflows.v1';

function freshDocument(): PersistedWorkflowDocumentV1 {
  return { version: 1, workflows: structuredClone(seedWorkflows) };
}

function isWorkflow(value: unknown): value is Workflow {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Workflow>;
  const document = candidate.document;
  const statuses = ['draft', 'awaiting_signature', 'awaiting_verification', 'completed'];
  const isString = (entry: unknown): entry is string => typeof entry === 'string';
  const isTimestamp = (entry: unknown) => isString(entry) && !Number.isNaN(Date.parse(entry));
  const isCalendarDate = (entry: unknown) =>
    isString(entry) && /^\d{4}-\d{2}-\d{2}$/.test(entry) && !Number.isNaN(Date.parse(entry));
  const validAudit =
    Array.isArray(candidate.audit) &&
    candidate.audit.every(
      (entry) =>
        !!entry &&
        isString(entry.id) &&
        isTimestamp(entry.timestamp) &&
        isString(entry.title) &&
        isString(entry.description),
    );
  return (
    isString(candidate.id) &&
    isString(candidate.reference) &&
    isString(candidate.title) &&
    isString(candidate.signerName) &&
    isString(candidate.signerEmail) &&
    isCalendarDate(candidate.dueDate) &&
    isString(candidate.note) &&
    isString(candidate.status) &&
    statuses.includes(candidate.status) &&
    isTimestamp(candidate.createdAt) &&
    isTimestamp(candidate.updatedAt) &&
    !!document &&
    isString(document.name) &&
    typeof document.size === 'number' &&
    Number.isFinite(document.size) &&
    document.size >= 0 &&
    isString(document.mimeType) &&
    isString(document.hash) &&
    /^[A-F0-9]{64}$/i.test(document.hash) &&
    validAudit
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
