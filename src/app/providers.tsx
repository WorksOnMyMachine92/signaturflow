import type { PropsWithChildren } from 'react';
import { ThemeProvider } from '../hooks/useTheme';

export function AppProviders({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
