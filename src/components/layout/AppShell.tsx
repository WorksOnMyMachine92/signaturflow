import { NavLink, Outlet } from 'react-router-dom';
import { useTheme, type ThemeMode } from '../../hooks/useTheme';
import { SkipLink } from './SkipLink';

const navItems = [
  ['/', 'Übersicht'],
  ['/vorgaenge/neu', 'Neuer Vorgang'],
  ['/pruefen', 'Dokument prüfen'],
  ['/barrierefreiheit', 'Barrierefreiheit'],
] as const;

export function AppShell() {
  const { mode, setMode } = useTheme();
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
    </div>
  );
}
