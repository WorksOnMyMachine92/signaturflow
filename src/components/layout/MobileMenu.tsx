import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { ThemeMode } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export const navItems = [
  ['/', 'Übersicht'],
  ['/vorgaenge/neu', 'Neuer Vorgang'],
  ['/pruefen', 'Dokument prüfen'],
  ['/barrierefreiheit', 'Barrierefreiheit'],
] as const;

type MobileMenuProps = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  onReset: () => void;
};

export function MobileMenu({ mode, setMode, onReset }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusTimerRef = useRef<number | undefined>(undefined);
  const cueTimerRef = useRef<number | undefined>(undefined);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(
    () => () => {
      if (focusTimerRef.current !== undefined) window.clearTimeout(focusTimerRef.current);
      if (cueTimerRef.current !== undefined) window.clearTimeout(cueTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <header className="mobile-header">
      <div className="mobile-header__bar">
        <NavLink className="brand" to="/">
          <span className="brand__mark" aria-hidden="true">
            S
          </span>
          <span>SignaturFlow</span>
        </NavLink>
        <Button
          ref={triggerRef}
          className="mobile-menu__trigger"
          variant="secondary"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="mobile-menu__icon" aria-hidden="true">
            {open ? '×' : '☰'}
          </span>
          {open ? 'Schließen' : 'Menü'}
        </Button>
      </div>
      {open && (
        <div id="mobile-menu-panel" className="mobile-menu">
          <nav aria-label="Mobile Navigation">
            {navItems.map(([to, label]) => {
              const isCurrentPage = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => {
                    setOpen(false);
                    if (!isCurrentPage) return;
                    focusTimerRef.current = window.setTimeout(() => {
                      const heading = document.querySelector<HTMLElement>('#main-content h1');
                      if (!heading) return;
                      heading.tabIndex = -1;
                      heading.classList.add('route-heading-focus');
                      heading.focus();
                      cueTimerRef.current = window.setTimeout(
                        () => heading.classList.remove('route-heading-focus'),
                        3000,
                      );
                    });
                  }}
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>
          <label className="mobile-menu__theme">
            <span>Farbschema</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}>
              <option value="system">System</option>
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
            </select>
          </label>
          <div className="mobile-menu__footer">
            <p>Lokale Demo – keine rechtsgültige Signatur</p>
            <Button
              variant="quiet"
              onClick={() => {
                triggerRef.current?.focus();
                setOpen(false);
                onReset();
              }}
            >
              Demodaten zurücksetzen
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
