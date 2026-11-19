# SignaturFlow

SignaturFlow ist eine barrierebewusst entwickelte React-Demonstration für digitale Signaturvorgänge. Die Anwendung zeigt, wie Dokumente lokal vorbereitet, durch einen nachvollziehbaren Statusprozess geführt und anhand eines SHA-256-Fingerabdrucks geprüft werden können.

> **Wichtig:** SignaturFlow erstellt keine rechtsgültigen elektronischen Signaturen. Alle Personen, Dokumente und Vorgänge sind fiktiv.

## Datenschutzprinzip

- Kein Backend, keine Datenbank und keine Benutzerkonten
- Keine Dateiübertragung und keine externen APIs
- PDF-Dateien werden ausschließlich im Browser eingelesen
- Gespeichert werden nur freigegebene Metadaten, Statusinformationen und Hashwerte im `localStorage`
- Dokumentinhalte werden niemals dauerhaft gespeichert

## Funktionen

- Dashboard mit Kennzahlen, Suche, Filterung und Sortierung
- Lokales Anlegen eines Signaturvorgangs mit eigener PDF oder gebündeltem Demo-Dokument
- Prüfschritt und Auswahl einer ausdrücklich simulierten Signaturmethode vor dem Speichern
- PDF-Validierung und SHA-256-Berechnung über Web Crypto
- Linearer Statusprozess mit bestätigten Änderungen
- Audit-Timeline für jeden Vorgang
- Expliziter Vergleich einer lokalen Datei mit einem Referenz-Hash
- Hell-, Dunkel- und Systemmodus
- Responsive Darstellung für Smartphone, Tablet und Desktop
- Lokaler Reset auf die ursprünglichen Demodaten

## Technik

- React 19 und TypeScript 7
- Vite 8
- React Router 7
- React Hook Form und Zod
- Eigenes CSS-Designsystem mit semantischen Tokens
- Vitest, Testing Library und axe-core
- Oxlint, Prettier und striktes TypeScript
- Docker-Multistage-Build mit internem Nginx-Alpine-Container

## Architektur

Die Anwendung ist nach Fachbereichen aufgebaut:

- `src/features` enthält Dashboard, Vorgänge, Verifikation und Accessibility-Inhalte.
- `src/components` enthält wiederverwendbare UI-, Layout- und Workflow-Komponenten.
- `src/store` verwaltet Vorgänge über Context und Reducer.
- `src/lib` kapselt Datums- und Persistenzlogik.
- `src/styles` enthält globale Design-Tokens und responsive Regeln.

Die Persistenz besitzt ein versioniertes Dokumentformat. Beschädigte oder unbekannte Daten werden sicher verworfen und durch die fiktiven Ausgangsdaten ersetzt.

## Barrierefreiheit

Ziel ist WCAG 2.2 AA. Umgesetzt sind unter anderem:

- semantische Landmarken und Überschriften
- Sprunglink zum Hauptinhalt
- vollständige Tastaturbedienbarkeit und sichtbare Fokusmarkierungen
- programmatisch verknüpfte Labels, Hinweise und Fehlermeldungen
- Fehlerzusammenfassungen mit Sprungzielen
- Statusdarstellung über Text und Form statt ausschließlich über Farbe
- Unterstützung für `prefers-reduced-motion`, Forced Colors und Browserzoom
- Live-Regionen für wichtige Rückmeldungen
- automatisierte axe-Prüfungen auf den zentralen Ansichten

Automatisierte Prüfungen ersetzen keine vollständige manuelle Prüfung mit verschiedenen assistiven Technologien.

## Lokale Entwicklung

Voraussetzung ist Node.js ab Version 22.15.

```bash
npm install
npm run dev
```

Die Entwicklungsadresse wird von Vite ausgegeben, üblicherweise `http://localhost:5173`.

## Qualitätsprüfungen

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test:run
npm run build
```

## Docker

```bash
docker build -t signaturflow .
docker run --rm -p 8080:80 signaturflow
```

Danach ist die Anwendung unter `http://localhost:8080` erreichbar. Nginx läuft ausschließlich im Container; auf dem Host muss kein Nginx installiert sein.

## Coolify

1. Das spätere GitHub-Repository in Coolify als neue Anwendung auswählen.
2. Als Build Pack **Dockerfile** verwenden.
3. Container-Port **80** eintragen.
4. Die gewünschte Domain zuweisen.
5. Der Healthcheck verwendet `/health`.

Coolify übernimmt Reverse Proxy und HTTPS. Es sind keine Umgebungsvariablen und keine persistenten Volumes erforderlich.

### Optionaler URL-Unterpfad

Der empfohlene Betrieb verwendet eine eigene Domain oder Subdomain am Wurzelpfad `/`. Für einen statischen Host unter `/signaturflow/` kann ein alternativer Build erzeugt werden:

```bash
VITE_BASE_PATH=/signaturflow/ npm run build
EXPECT_BASE=/signaturflow/ node scripts/verify-build.mjs
```

Der Webserver muss diesen Unterpfad anschließend auf das erzeugte `dist`-Verzeichnis abbilden. Das mitgelieferte Coolify-Containerprofil ist für den empfohlenen Wurzelpfad konfiguriert.

## Rechtliche und fachliche Grenzen

Ein übereinstimmender SHA-256-Hash zeigt lediglich, dass zwei Dateiinhalte Byte für Byte identisch sind. Er bestätigt weder die Identität einer unterzeichnenden Person noch die Echtheit oder rechtliche Wirksamkeit einer elektronischen Signatur.

## Lizenz

Dieses Projekt wurde als persönliche Portfolio-Demonstration erstellt.
