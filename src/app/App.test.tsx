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

  it('provides labelled navigation and theme controls', () => {
    renderApp();

    expect(screen.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Farbschema' })).toHaveValue('system');
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderApp();

    const results = await getAccessibilityResults(container);

    expect(results.violations).toEqual([]);
  });
});
