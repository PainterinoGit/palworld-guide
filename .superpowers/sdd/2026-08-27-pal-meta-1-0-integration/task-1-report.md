# Task-1-Bericht: Quellen- und Versionsvertrag

## Status

Abgeschlossen. Der zentrale Quellen- und Versionsvertrag für Palworld-Meta-Informationen ist angelegt.

## Geänderte Dateien

- `data/meta-sources.mjs`
  - Exportiert `META_VERSION` mit `Patch 1.0+` und Prüfdatum `2026-08-27`.
  - Enthält 21 aktive Quellen: 7 Schriftquellen und alle 14 Videos aus der Research-Datei.
  - Jeder Eintrag enthält stabile ID, Titel, URL, Typ, Prüfdatum, Scope, Confidence und eigene Kurzfassung.
  - Exportiert `ACTIVE_SOURCE_IDS` und `isActiveSourceId()` für spätere Tests und Datenmodelle.
- `tests/source-integrity.test.mjs`
  - Ausführbarer Node-Test ohne neue Abhängigkeit.
  - Prüft Version, URLs, erlaubte Typen, Prüfdatum, Scope, Confidence, Kurzfassungen sowie eindeutige IDs und URLs.
- `docs/pal-meta-1.0-research.md`
  - Ergänzt um den zentralen Quellen-/Versionsvertrag, die Vertrauensstufen und die Abgrenzung von `Patch 1.0+` zu konkreten Patchständen.
- `.superpowers/sdd/2026-08-27-pal-meta-1-0-integration/task-1-report.md`
  - Dieser Bericht.

## Testergebnis

- Initialer TDD-Lauf vor dem Produktionsmodul: erwarteter Fehlschlag wegen fehlendem `data/meta-sources.mjs`.
- `node tests/source-integrity.test.mjs`: erfolgreich, Ausgabe `source integrity: ok`.
- `node --check data/meta-sources.mjs`: erfolgreich.
- `git diff --check`: erfolgreich; lediglich Git meldete eine erwartete LF/CRLF-Konvertierungswarnung für die Research-Datei.

## Offene Bedenken

- Der offizielle Changelog ist gemäß Research-Datei als SteamDB-Spiegel verlinkt; die offizielle Dokumentation ist als allgemeiner Dokumentationsstand verlinkt und nicht als Beleg für jede einzelne Empfehlung.
- Die Quellen sind für Task 1 registriert, aber noch nicht an Pal-, Team- oder UI-Daten angeschlossen. Das ist für diesen Task ausdrücklich offen und wird in den Folgetasks umgesetzt.
