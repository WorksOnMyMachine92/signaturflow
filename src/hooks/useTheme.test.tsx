import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from './useTheme';

type MatchMediaController = {
  setDark: (matches: boolean) => void;
};

function installMatchMedia(initialMatches: boolean): MatchMediaController {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
          if (typeof listener === 'function') {
            listeners.add(listener as (event: MediaQueryListEvent) => void);
          }
        },
        removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
          if (typeof listener === 'function') {
            listeners.delete(listener as (event: MediaQueryListEvent) => void);
          }
        },
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  });

  return {
    setDark(nextMatches) {
      matches = nextMatches;
      const event = { matches: nextMatches, media: '(prefers-color-scheme: dark)' };
      listeners.forEach((listener) => listener(event as MediaQueryListEvent));
    },
  };
}

function ThemeProbe() {
  const theme = useTheme();

  return (
    <div>
      <output aria-label="Modus">{theme.mode}</output>
      <output aria-label="Aufgelöster Modus">{theme.resolvedMode}</output>
      <button type="button" onClick={() => theme.setMode('light')}>
        Hell wählen
      </button>
    </div>
  );
}

function Wrapper({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('ThemeProvider', () => {
  it('defaults to system and follows matchMedia', () => {
    installMatchMedia(true);

    render(<ThemeProbe />, { wrapper: Wrapper });

    expect(screen.getByLabelText('Modus')).toHaveTextContent('system');
    expect(screen.getByLabelText('Aufgelöster Modus')).toHaveTextContent('dark');
  });

  it('persists an explicit theme', async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<ThemeProbe />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: 'Hell wählen' }));

    expect(localStorage.getItem('signaturflow.theme')).toBe('light');
    expect(screen.getByLabelText('Aufgelöster Modus')).toHaveTextContent('light');
  });

  it('reacts to a system theme change only in system mode', async () => {
    const media = installMatchMedia(false);
    const user = userEvent.setup();
    render(<ThemeProbe />, { wrapper: Wrapper });

    act(() => media.setDark(true));
    expect(screen.getByLabelText('Aufgelöster Modus')).toHaveTextContent('dark');

    await user.click(screen.getByRole('button', { name: 'Hell wählen' }));
    act(() => media.setDark(false));
    act(() => media.setDark(true));

    expect(screen.getByLabelText('Aufgelöster Modus')).toHaveTextContent('light');
  });

  it('sets data-theme and color-scheme on the document root', () => {
    installMatchMedia(true);

    render(<ThemeProbe />, { wrapper: Wrapper });

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
