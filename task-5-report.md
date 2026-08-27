# Task 5 – Datenbank als aktuelle Entscheidungsoberfläche

## Status

Implementiert. Die Pal-Datenbank baut sich jetzt aus dem vollständigen neutralen Roster und einem priorisierten Overlay aus `data/pals.mjs` auf. Alte HTML-Karten, Tierlisten und Notiztexte können keine aktiven Meta-Felder mehr in die Datenbank zurückschreiben.

## Änderungen

- `js/pal-data-adapter.mjs`: neuer testbarer Adapter für Roster-Reihenfolge, aktuelle Meta-Priorität, Alias-/Bildauflösung, kontextbezogene Rollen/Details und Quellenstatus.
- `js/app.js`: Datenbankaufbau ohne HTML-Scanning, Rollenfilter für Kampf/Worker/Mount/Fangen/Upgrade, kontextabhängige Begründungen sowie zugängliche Detailansicht per Hover, Fokus und Klick.
- `index.html`: neun Entscheidungsspalten inklusive „Quellenstatus“ und sichtbarer Patch-/Prüfzeile.
- `css/style.css`: responsive Tabellenbreite, Detailpanel, Statusdarstellung und sichtbarer Tastaturfokus.
- `js/bootstrap.mjs`: Adapter, Quellenkatalog und UI-Helfer werden für die klassische App verfügbar gemacht.
- `tests/pal-data-adapter.test.mjs`: Adapter-Reihenfolge, Pflichtbegründungen, Bilder, Rollenfilter, Quellenstatus, Alias-/Detaildaten und fehlende Legacy-Fallbacks.

## Verifikation

- Alle Node-Tests: 7/7 erfolgreich.
- Syntaxchecks für `app.js`, `bootstrap.mjs`, `pal-data-adapter.mjs`, `guide-ui.mjs`, `team-renderer.mjs` und `guide-renderer.mjs`: erfolgreich.
- `git diff --check`: erfolgreich; Git meldet nur die erwartete LF/CRLF-Hinweiszeile.
- Headless-Chrome mit MIME-korrektem lokalem Server: 288 von 288 Pals, 288 Icons und 288 Detailbereiche gerendert; keine App-Console-Fehler.
- DOM-Vertrag geprüft: `aria-expanded`, `aria-controls`, Quellenstatus und Patch-/Prüfhinweis sind vorhanden.

## Bedenken

`python -m http.server` liefert `.mjs` als `text/plain` und blockiert Module bei strikter MIME-Prüfung. Die Laufzeitprüfung wurde deshalb mit einem temporären MIME-korrekten Node-Server wiederholt. Die Browser-Automation über CDP konnte in dieser Umgebung wegen eines CDP/Chrome-for-Testing-Starts nicht verwendet werden; der direkte Headless-Chrome-Test war erfolgreich.

## Task-5-Review-Follow-up

- `index.html`: Die Pal-Suche sowie Typ- und Sortier-Select besitzen jetzt eindeutige `aria-label`s. Der Viewport erlaubt weiterhin Mobile-Zoom; `maximum-scale=1` und `user-scalable=no` sind nicht gesetzt.
- `js/pal-data-adapter.mjs`: Der Fangen-Filter nutzt die vorhandene Combat-Semantik (`capture`/`fang`/`catch` sowie `support`, `damage`, `utility`) und ist nicht auf eine nicht vorhandene `counter`-Rolle verengt.
- Der Upgrade-Filter berücksichtigt ausschließlich auflösbare `upgradeFrom`-/`upgradeTo`-Beziehungen. Ein bloßes Progressionsobjekt oder eine unbekannte Ziel-ID reicht nicht mehr.
- `tests/pal-data-adapter.test.mjs` und `tests/task-5-review.test.mjs` decken die vier Review-Punkte ab.
- Nach der Korrektur: 8/8 Node-Tests, alle aufgeführten Syntaxchecks und `git diff --check` erfolgreich.
