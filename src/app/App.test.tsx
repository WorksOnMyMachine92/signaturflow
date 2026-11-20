import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
  afterEach(() => vi.useRealTimers());

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

  it('provides labelled navigation and theme controls', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Farbschema' })).toHaveValue('system');
    const mobileHeader = document.querySelector<HTMLElement>('.mobile-header')!;
    await user.click(within(mobileHeader).getByRole('button', { name: 'Menü öffnen' }));
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

  it('moves focus to the page heading and removes its cue after three seconds', async () => {
    vi.useFakeTimers();
    renderApp();

    fireEvent.click(screen.getAllByRole('link', { name: 'Neuer Vorgang' })[0]!);
    const heading = screen.getByRole('heading', { name: 'Signatur vorbereiten' });
    await vi.advanceTimersByTimeAsync(0);

    expect(heading).toHaveFocus();
    expect(heading).toHaveClass('route-heading-focus');
    await vi.advanceTimersByTimeAsync(2999);
    expect(heading).toHaveClass('route-heading-focus');
    await vi.advanceTimersByTimeAsync(1);
    expect(heading).not.toHaveClass('route-heading-focus');
    expect(heading).toHaveFocus();
  });

  it('closes mobile navigation and focuses the heading when the current page is selected', async () => {
    const user = userEvent.setup();
    renderApp();
    const mobileHeader = document.querySelector<HTMLElement>('.mobile-header')!;

    await user.click(within(mobileHeader).getByRole('button', { name: 'Menü öffnen' }));
    await user.click(within(mobileHeader).getByRole('link', { name: 'Übersicht' }));

    expect(within(mobileHeader).queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Signaturvorgänge' })).toHaveFocus();
  });

  it('returns focus to the mobile menu trigger after cancelling reset', async () => {
    const user = userEvent.setup();
    renderApp();
    const mobileHeader = document.querySelector<HTMLElement>('.mobile-header')!;

    await user.click(within(mobileHeader).getByRole('button', { name: 'Menü öffnen' }));
    await user.click(within(mobileHeader).getByRole('button', { name: 'Demodaten zurücksetzen' }));
    await user.click(screen.getByRole('button', { name: 'Abbrechen' }));

    expect(within(mobileHeader).getByRole('button', { name: 'Menü öffnen' })).toHaveFocus();
  });
});
