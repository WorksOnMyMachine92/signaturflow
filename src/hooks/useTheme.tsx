import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useMediaQuery } from './useMediaQuery';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = Exclude<ThemeMode, 'system'>;

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = 'signaturflow.theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(loadTheme);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolvedMode: ResolvedTheme =
    mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedMode;
    root.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // The preference remains active for this session if storage is unavailable.
    }
  };

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme muss innerhalb des ThemeProvider verwendet werden.');
  }
  return context;
}
