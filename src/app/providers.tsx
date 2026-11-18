import type { PropsWithChildren } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import { WorkflowProvider } from '../store/WorkflowProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <WorkflowProvider>{children}</WorkflowProvider>
    </ThemeProvider>
  );
}
