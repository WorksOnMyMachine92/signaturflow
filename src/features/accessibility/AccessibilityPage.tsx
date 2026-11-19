export function AccessibilityPage() {
  return (
    <section className="accessibility-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Zugänglichkeit</span>
          <h1>Barrierefreiheit</h1>
          <p>
            SignaturFlow wurde als technische Demonstration mit WCAG 2.2 AA als Ziel entwickelt.
          </p>
        </div>
      </header>
      <div className="accessibility-grid">
        <article className="content-panel">
          <h2>Bedienung</h2>
          <ul>
            <li>Vollständige Bedienung mit Tastatur und sichtbaren Fokusmarkierungen</li>
            <li>Sprunglink zum Hauptinhalt und nachvollziehbare Überschriftenstruktur</li>
            <li>Ausreichend große Interaktionsflächen für Touch und Zoom</li>
          </ul>
        </article>
        <article className="content-panel">
          <h2>Wahrnehmung</h2>
          <ul>
            <li>Statusinformationen bestehen aus Text und Form, nicht nur aus Farbe</li>
            <li>Hell-, Dunkel- und Systemmodus mit semantischen Farbwerten</li>
            <li>Berücksichtigung reduzierter Bewegungen und erzwungener Kontrastfarben</li>
          </ul>
        </article>
        <article className="content-panel">
          <h2>Formulare und Rückmeldungen</h2>
          <ul>
            <li>Programmatisch verknüpfte Labels, Hinweise und Fehlermeldungen</li>
            <li>Fehlerzusammenfassung mit direkten Sprungzielen</li>
            <li>Live-Regionen für wichtige Statusmeldungen</li>
          </ul>
        </article>
        <article className="content-panel">
          <h2>Prüfung</h2>
          <ul>
            <li>Automatisierte Tests mit axe und Testing Library</li>
            <li>Semantisches HTML vor ergänzendem ARIA</li>
            <li>Manuelle Prüfung der Tastaturabläufe und responsiven Ansichten</li>
          </ul>
        </article>
      </div>
      <aside className="limits-note">
        <h2>Hinweis zur Demo</h2>
        <p>
          Diese Portfolioanwendung ist keine offizielle Konformitätserklärung. Rückmeldungen zu
          Barrieren sind ausdrücklich willkommen.
        </p>
      </aside>
    </section>
  );
}
