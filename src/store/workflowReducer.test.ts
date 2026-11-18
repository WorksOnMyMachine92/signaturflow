import { seedWorkflows } from '../data/seedWorkflows';
import type { NewWorkflowInput, WorkflowAction, WorkflowState } from '../types/workflow';
import { initialWorkflowState, workflowReducer } from './workflowReducer';

const input: NewWorkflowInput = {
  title: 'Freigabe Projekt Alpha',
  signerName: 'Mara Beispiel',
  signerEmail: 'mara@example.test',
  dueDate: '2026-12-01',
  note: 'Nur Demodaten',
  document: { name: 'projekt-alpha.pdf', size: 1280, mimeType: 'application/pdf', hash: 'abc123' },
};

describe('workflowReducer', () => {
  it('creates every new workflow as a draft with an audit entry', () => {
    const state = workflowReducer(initialWorkflowState, { type: 'create', payload: input });

    expect(state.workflows[0]).toMatchObject({ title: input.title, status: 'draft' });
    expect(state.workflows[0]?.audit).toHaveLength(1);
  });

  it('uses a caller-supplied id so navigation can target the created workflow', () => {
    const action = { type: 'create', payload: input, id: 'workflow-fixed' } as WorkflowAction;

    const state = workflowReducer(initialWorkflowState, action);

    expect(state.workflows[0]?.id).toBe('workflow-fixed');
  });

  it('allows only the linear workflow transitions and appends audit entries', () => {
    let state = workflowReducer(initialWorkflowState, { type: 'create', payload: input });
    const id = state.workflows[0]?.id ?? '';

    for (const status of ['awaiting_signature', 'awaiting_verification', 'completed'] as const) {
      state = workflowReducer(state, { type: 'transition', id });
      expect(state.workflows[0]?.status).toBe(status);
    }
    expect(state.workflows[0]?.audit).toHaveLength(4);
  });

  it('leaves a completed workflow unchanged and records an error', () => {
    const completed = { ...seedWorkflows[0]!, status: 'completed' as const };
    const state: WorkflowState = { workflows: [completed], lastError: null };

    const next = workflowReducer(state, { type: 'transition', id: completed.id });

    expect(next.workflows).toEqual(state.workflows);
    expect(next.lastError).toMatch(/Statuswechsel/);
  });

  it('restores seed data', () => {
    const changed: WorkflowState = { workflows: [], lastError: 'Fehler' };

    expect(workflowReducer(changed, { type: 'reset' })).toEqual({
      workflows: seedWorkflows,
      lastError: null,
    });
  });
});
