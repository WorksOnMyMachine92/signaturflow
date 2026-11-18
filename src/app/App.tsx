import { Icon } from '../components/ui/Icon';
import { useTheme, type ThemeMode } from '../hooks/useTheme';

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
];

export function App() {
  const { mode, setMode } = useTheme();

  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="SignaturFlow – Startseite">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="shield" />
          </span>
          <span>SignaturFlow</span>
        </a>
        <fieldset className="theme-switcher">
          <legend className="sr-only">Farbschema</legend>
          {themeOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </header>

      <main id="main" className="welcome">
        <div className="eyebrow">Sicher. Lokal. Nachvollziehbar.</div>
        <h1>Digitale Signaturvorgänge klar im Blick</h1>
        <p>
          SignaturFlow ist eine technische Demonstration für zugängliche und sichere
          Dokumentenprozesse. Alle Daten verbleiben in diesem Browser.
        </p>
        <aside className="demo-notice" aria-label="Wichtiger Hinweis">
          <Icon name="shield" />
          <div>
            <strong>Demo – keine rechtsgültige Signatur</strong>
            <span>Die Anwendung simuliert Abläufe und überträgt keine Dokumente.</span>
          </div>
        </aside>
      </main>
    </div>
  );
}
