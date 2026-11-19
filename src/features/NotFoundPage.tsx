import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="content-panel not-found-inline">
      <span className="error-code">404</span>
      <h1>Seite nicht gefunden</h1>
      <p>Die angeforderte Seite gibt es in dieser lokalen Demonstration nicht.</p>
      <Link className="button button--primary" to="/">
        Zur Übersicht
      </Link>
    </section>
  );
}
