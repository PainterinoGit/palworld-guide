# Task-3-Bericht: Kampfteams, Roaming und Spezialteams

## Status

Abgeschlossen. Die alten generierten Standardempfehlungen sind durch getrennte, quellengebundene Teamexporte ersetzt.

## Geänderte Dateien

- `data/teams.mjs`
  - Exportiert `COMBAT_TEAMS`, `ROAMING_TEAMS`, `BASE_TEAMS` und `SPECIAL_TEAMS` sowie den kompatiblen Aggregat-Export `TEAMS`.
  - Enthält je sechs Levelbereiche mit fünf Slots pro Team; variable Slots bleiben als `palId: null` und mit Kontext erhalten.
  - Modelliert den recherchierten Pfad vom frühen Foxparks-/Daedream-/Cattiva-/Vixy-Kern über Anubis, Jormuntide Ignis, Lyleen und Eikthyrdeer bis zum Shaolong-/Panthalus-, Orserk-, Support- und Counter-Endgame.
  - Trennt in Base-Teams Produktionskern, Erz/Material und Kühlung/Logistik.
  - Kennzeichnet Element-Counter, Ressourcenläufe und Raid/Endgame als eigene Spezialteams.
  - Jedes Team enthält Zweck, Quellen-IDs, Zugangshinweis, Wechselkriterium, Kombinationsbegründung und Slotrollen.
- `js/team-renderer.mjs`
  - Rendert Pal-Namen und Typen über `PALS`/`getPalById` statt duplizierter Pal-Texte.
  - Rendert Meta-Version, Quellen, Prüfdatum, Rolle, Slotbegründung, Teambegründung, Zugang und Wechselkriterium.
  - Zeigt variable Slots mit ihrem Kontext und unbekannte konkrete Pal- oder Quellen-IDs sichtbar an, statt sie zu verschlucken.
- `tests/team-data.test.mjs`
  - Prüft Größen, Levelabdeckung, Rollen, variable Slots, Pal-IDs, Quellenpflicht und Spezialteamtypen.
- `tests/team-renderer.test.mjs`
  - Prüft Quellen-/Aktualitätsbadge, Begründungen, Rollen, variable Slots und sichtbare Fehlerausgabe für unbekannte Pal-IDs.
- `task-3-report.md`
  - Dieser Bericht.

## Kompatibilitätsentscheidung

Das sechste interne Levelband bleibt `50-plus`, weil `data/guide.mjs` diese bestehende ID referenziert und laut Task-Brief nicht geändert werden darf. Die sichtbare Bezeichnung lautet weiterhin korrekt `Level 50+`; es gibt genau sechs Levelbereiche.

## TDD- und Testergebnis

- Initialer TDD-Lauf: erwarteter Fehlschlag, weil `COMBAT_TEAMS`/`BASE_TEAMS` noch nicht exportiert wurden und der alte Renderer den neuen Teamvertrag nicht kennt.
- `node --test tests/*.test.mjs`: erfolgreich, 7/7 Tests bestanden.
- `node --check data/teams.mjs`: erfolgreich.
- `node --check js/team-renderer.mjs`: erfolgreich.
- `node --check tests/team-data.test.mjs`: erfolgreich.
- `node --check tests/team-renderer.test.mjs`: erfolgreich.
- `git diff --check`: erfolgreich; Git meldet nur die erwartete LF/CRLF-Konvertierungswarnung.

## Bedenken

- Die Teamdaten verwenden bestehende Meta-Quellen und den geprüften Stand `Patch 1.0+`; sie behaupten keine darüber hinausgehende Patchpräzision.
- Neue Renderer-Klassen für Quellen und unbekannte IDs haben noch keine eigene CSS-Gestaltung; die Darstellung bleibt funktional und fällt auf vorhandene Karten-/Meta-Stile zurück.
- `TEAMS` bleibt für die bestehende UI verfügbar, aktiviert aber nur die neuen strukturierten Empfehlungen.

## Review-Fixes

- Die pauschale `special`-Quellenliste wurde entfernt. Spezialteams verwenden jetzt getrennte, fachlich begründete Quellenmatrizen:
  - `element-counter`: strukturierte Combat-Daten sowie Combat-/Counter-Builds.
  - `resource-run`: Work-Suitability-, Base-, Mining- und Transport-/Routenquellen.
  - `raid-endgame`: Combat-, Raid-, Endgame- und Party-Composition-Quellen.
- Berechtigte Quellen bleiben im jeweils passenden Spezialteam erhalten; die frühere Vermischung von Combat- und Ressourcen-Quellen ist entfernt.
- `tests/team-data.test.mjs` prüft jetzt `alternativePalIds`, `sourceIds`, deren Synchronität und unbekannte Referenz-IDs sowie die exakte Spezialquellen-Matrix.
- `tests/team-renderer.test.mjs` prüft unbekannte Alternativ-Pal-IDs und unbekannte Quellen-IDs auf sichtbare Fehlerausgabe.

## Verifikation der Review-Fixes

- `node tests/*.test.mjs`-Äquivalent über alle sieben Testdateien: erfolgreich, 7/7 bestanden.
- `node --check data/teams.mjs`: erfolgreich.
- `node --check js/team-renderer.mjs`: erfolgreich.
- `node --check tests/team-data.test.mjs`: erfolgreich.
- `node --check tests/team-renderer.test.mjs`: erfolgreich.
- `git diff --check`: erfolgreich; nur die erwartete LF/CRLF-Konvertierungswarnung.
