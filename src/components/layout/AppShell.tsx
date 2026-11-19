import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useTheme, type ThemeMode } from '../../hooks/useTheme';
import { useWorkflows } from '../../store/WorkflowProvider';
import { SkipLink } from './SkipLink';

const navItems = [
  ['/', 'Übersicht'],
  ['/vorgaenge/neu', 'Neuer Vorgang'],
  ['/pruefen', 'Dokument prüfen'],
  ['/barrierefreiheit', 'Barrierefreiheit'],
] as const;

export function AppShell() {
  const { mode, setMode } = useTheme();
  const { reset } = useWorkflows();
  const location = useLocation();
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Übersicht',
      '/vorgaenge/neu': 'Neuer Vorgang',
      '/pruefen': 'Dokument prüfen',
      '/barrierefreiheit': 'Barrierefreiheit',
    };
    const page =
      titles[location.pathname] ??
      (location.pathname.startsWith('/vorgaenge/') ? 'Vorgangsdetails' : 'Seite nicht gefunden');
    document.title = `${page} · SignaturFlow`;
  }, [location.pathname]);
  return (
    <div className="shell">
      <SkipLink />
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <span className="brand__mark">S</span>
          <span>
            SignaturFlow<small>Vertrauen im Prozess</small>
          </span>
        </NavLink>
        <nav aria-label="Hauptnavigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <strong>Lokale Demo</strong>
          <span>Keine Datenübertragung</span>
          <Button variant="quiet" onClick={() => setResetOpen(true)}>
            Demodaten zurücksetzen
          </Button>
        </div>
      </aside>
      <div className="shell__body">
        <header className="mobile-header">
          <span className="brand">SignaturFlow</span>
          <nav aria-label="Mobile Navigation">
            {navItems.slice(0, 3).map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="utility-bar">
          <span className="demo-pill">Demo – keine rechtsgültige Signatur</span>
          <label className="theme-select">
            <span>Farbschema</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}>
              <option value="system">System</option>
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
            </select>
          </label>
        </div>
        <main id="main-content" className="page">
          <Outlet />
        </main>
      </div>
      <ConfirmDialog
        open={resetOpen}
        title="Demodaten zurücksetzen?"
        confirmLabel="Zurücksetzen"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          reset();
          setResetOpen(false);
        }}
      >
        <p>
          Eigene lokale Vorgänge und Statusänderungen werden entfernt. Die ursprünglichen
          Beispieldaten werden wiederhergestellt.
        </p>
      </ConfirmDialog>
    </div>
  );
}
