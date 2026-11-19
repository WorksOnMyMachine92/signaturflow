import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Die Anwendung konnte diese Ansicht nicht laden.';

  return (
    <main id="main-content" className="page error-page">
      <span className="eyebrow">Sicherer Rückfall</span>
      <h1>Etwas ist schiefgelaufen</h1>
      <p>{message} Ihre lokal gespeicherten Daten wurden nicht verändert.</p>
      <Link className="button button--primary" to="/">
        Zur Übersicht
      </Link>
    </main>
  );
}
