import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { MobileMenu } from './MobileMenu';

function renderMenu() {
  const setMode = vi.fn();
  const onReset = vi.fn();
  render(
    <MemoryRouter>
      <MobileMenu mode="system" setMode={setMode} onReset={onReset} />
    </MemoryRouter>,
  );
  return { setMode, onReset };
}

describe('MobileMenu', () => {
  it('opens a complete mobile menu with an announced state', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Menü öffnen' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument();
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const navigation = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    expect(within(navigation).getAllByRole('link')).toHaveLength(4);
    expect(within(navigation).getByRole('link', { name: 'Barrierefreiheit' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Farbschema' })).toHaveValue('system');
    expect(screen.getByText('Lokale Demo – keine rechtsgültige Signatur')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Demodaten zurücksetzen' })).toBeVisible();
  });

  it('closes the menu with Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Menü öffnen' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes after navigation', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    await user.click(screen.getByRole('link', { name: 'Neuer Vorgang' }));

    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes when the current page is selected again', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    await user.click(screen.getByRole('link', { name: 'Übersicht' }));

    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
