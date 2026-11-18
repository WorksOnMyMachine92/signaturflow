import { render, screen } from '@testing-library/react';
import { App } from './App';
import { AppProviders } from './providers';
import { getAccessibilityResults } from '../test/axe';

function renderApp() {
  return render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
}

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }),
    });
  });

  it('offers one main landmark and a visible legal demo disclosure', () => {
    renderApp();

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByText('Demo – keine rechtsgültige Signatur')).toBeVisible();
  });

  it('gives every theme control an accessible name', () => {
    renderApp();

    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Hell' })).toBeEnabled();
    expect(screen.getByRole('radio', { name: 'Dunkel' })).toBeEnabled();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderApp();

    const results = await getAccessibilityResults(container);

    expect(results.violations).toEqual([]);
  });
});
