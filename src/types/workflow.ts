export type WorkflowStatus = 'draft' | 'awaiting_signature' | 'awaiting_verification' | 'completed';

export type DocumentMetadata = {
  name: string;
  size: number;
  mimeType: string;
  hash: string;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
};

export type Workflow = {
  id: string;
  reference: string;
  title: string;
  signerName: string;
  signerEmail: string;
  dueDate: string;
  note: string;
  signatureMethod?: 'typed_demo' | 'drawn_demo';
  document: DocumentMetadata;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  audit: AuditEntry[];
};

export type NewWorkflowInput = Pick<
  Workflow,
  'title' | 'signerName' | 'signerEmail' | 'dueDate' | 'note' | 'signatureMethod' | 'document'
>;

export type PersistedWorkflowDocumentV1 = {
  version: 1;
  workflows: Workflow[];
};

export type WorkflowState = {
  workflows: Workflow[];
  lastError: string | null;
};

export type WorkflowAction =
  | { type: 'hydrate'; payload: Workflow[] }
  | { type: 'create'; payload: NewWorkflowInput; id?: string }
  | { type: 'transition'; id: string }
  | { type: 'reset' }
  | { type: 'clear-error' };
