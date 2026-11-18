import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { loadWorkflowDocument, saveWorkflowDocument } from '../lib/storage';
import type { NewWorkflowInput, Workflow } from '../types/workflow';
import { initialWorkflowState, workflowReducer } from './workflowReducer';

type WorkflowContextValue = {
  workflows: Workflow[];
  lastError: string | null;
  create: (input: NewWorkflowInput) => string;
  transition: (id: string) => void;
  reset: () => void;
  getById: (id: string) => Workflow | undefined;
  clearError: () => void;
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState, () => ({
    workflows: loadWorkflowDocument().workflows,
    lastError: null,
  }));

  useEffect(() => {
    saveWorkflowDocument({ version: 1, workflows: state.workflows });
  }, [state.workflows]);

  const value = useMemo<WorkflowContextValue>(
    () => ({
      ...state,
      create(input) {
        const id = crypto.randomUUID();
        dispatch({ type: 'create', payload: input, id });
        return id;
      },
      transition: (id) => dispatch({ type: 'transition', id }),
      reset: () => dispatch({ type: 'reset' }),
      getById: (id) => state.workflows.find((workflow) => workflow.id === id),
      clearError: () => dispatch({ type: 'clear-error' }),
    }),
    [state],
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflows(): WorkflowContextValue {
  const context = useContext(WorkflowContext);
  if (!context)
    throw new Error('useWorkflows muss innerhalb des WorkflowProvider verwendet werden.');
  return context;
}
