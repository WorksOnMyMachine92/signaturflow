import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const mobileHeader = document.querySelector<HTMLElement>('.mobile-header')!;
    expect(within(mobileHeader).getByText('Barrierefreiheit')).toBeInTheDocument();
    expect(
      within(mobileHeader).getByRole('button', { name: 'Demodaten zurücksetzen' }),
    ).toBeInTheDocument();
    expect(within(mobileHeader).getByText(/keine rechtsgültige Signatur/i)).toBeInTheDocument();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderApp();

    const results = await getAccessibilityResults(container);

    expect(results.violations).toEqual([]);
  });

  it('requires confirmation before resetting local demo data', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getAllByRole('button', { name: 'Demodaten zurücksetzen' })[0]!);
    expect(screen.getByRole('dialog', { name: 'Demodaten zurücksetzen?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Abbrechen' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    localStorage.setItem('signaturflow.workflows.v1', '{"temporary":true}');
    await user.click(screen.getAllByRole('button', { name: 'Demodaten zurücksetzen' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Zurücksetzen' }));
    await waitFor(() =>
      expect(localStorage.getItem('signaturflow.workflows.v1')).toContain('demo-vertrag-2026'),
    );
  });

  it('moves focus to the page heading after client-side navigation', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getAllByRole('link', { name: 'Neuer Vorgang' })[0]!);
    const heading = await screen.findByRole('heading', { name: 'Signatur vorbereiten' });
    await waitFor(() => expect(heading).toHaveFocus());
  });
});
