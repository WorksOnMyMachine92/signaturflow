import { seedWorkflows } from '../data/seedWorkflows';
import type { PersistedWorkflowDocumentV1 } from '../types/workflow';
import { loadWorkflowDocument, saveWorkflowDocument, STORAGE_KEY } from './storage';

describe('workflow storage', () => {
  it('loads fresh seeded data when storage is empty', () => {
    expect(loadWorkflowDocument().workflows).toEqual(seedWorkflows);
  });

  it('round-trips a valid version-one document', () => {
    const document: PersistedWorkflowDocumentV1 = {
      version: 1,
      workflows: seedWorkflows.slice(0, 1),
    };

    saveWorkflowDocument(document);

    expect(loadWorkflowDocument()).toEqual(document);
  });

  it.each(['{broken', JSON.stringify({ version: 99, workflows: [] })])(
    'recovers safely from invalid persisted data',
    (stored) => {
      localStorage.setItem(STORAGE_KEY, stored);
      expect(loadWorkflowDocument().workflows).toEqual(seedWorkflows);
    },
  );

  it('never serializes local file bytes', () => {
    saveWorkflowDocument({ version: 1, workflows: seedWorkflows });
    const serialized = localStorage.getItem(STORAGE_KEY) ?? '';

    expect(serialized).not.toContain('arrayBuffer');
    expect(serialized).not.toContain('documentBytes');
  });
});
