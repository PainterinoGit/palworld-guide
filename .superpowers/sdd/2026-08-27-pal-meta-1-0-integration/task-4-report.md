# Task-4-Bericht: Level-Roadmap auf die neue Meta ausrichten

## Status

Implementiert. Die sechs Levelabschnitte bilden eine lineare, abhakkbare Roadmap mit aktuellen Kampf-, Roaming- und Base-Teams aus den geprüften Team-IDs.

## Geänderte Dateien

- `data/guide.mjs`
  - Definiert exakt sechs Abschnitte in der bestehenden Reihenfolge `1-10` bis `50-plus`.
  - Verknüpft jeden Abschnitt mit `combat`, `roaming` und `base` über `teamIds`.
  - Verwendet ausschließlich Pal-IDs aus `data/pals.mjs` für benötigte Pals, „Sofort holen“ und „Später ersetzen“.
  - Enthält Fundort-IDs, Wechselkriterium, eindeutige Checklisten-IDs und lineare `nextStepId`-Verknüpfungen.
  - Verweist Spezialteams nur als `specialTeamIds` für Element-Counter, Ressourcenlauf oder Raid/Endgame.
- `js/guide-renderer.mjs`
  - Löst Team- und Pal-Namen zentral über die bestehenden Daten auf.
  - Rendert in der Reihenfolge Ziel → vollständige Teams → benötigte Pals → Fundorte → Upgrade/Wechsel → Checkliste.
  - Rendert Sofort-holen-/Später-ersetzen-Listen mit Fundorten und Spezialkontext sichtbar getrennt.
- `js/guide-ui.mjs`
  - Speichert Checklisteneinträge unter stabilen Abschnitts-/Item-Schlüsseln lokal.
  - Migriert bestehende gespeicherte Abschnitts-IDs zu vollständig abgehakten Checklisten.
  - Zeigt pro Roadmap-Abschnitt erledigte Checklistenpunkte und setzt deren Zustand beim Rendern.
  - Behält `initLevelTeams`, `initGuideSteps` und `renderGuideStep` kompatibel; Empfehlungen werden nicht mutiert.
- `tests/guide-data.test.mjs`
  - Prüft Reihenfolge, sechs Abschnitte, eindeutige IDs, Team-/Pal-Referenzen, Spezialkontexte und Checklisten-Zustand.
- `tests/guide-renderer.test.mjs`
  - Prüft die geforderte Ausgabe-Reihenfolge, vollständige Team-IDs, zentrale Pal-/Fundort-Auflösung, Checklisten-Attribute und Raid-Spezialkontext.

## TDD- und Testergebnis

- RED: Neue Daten-/Renderer-Verträge schlugen zunächst an den fehlenden Team-/Pal-/Checklisten-Verknüpfungen und der alten Ausgabe fehl.
- GREEN: Die beiden Guide-Tests bestehen nach der minimalen Daten-, Renderer- und UI-Implementierung.
- Alle sieben Node-Tests: erfolgreich.
- Syntaxchecks für Guide-Daten, Guide-UI, Guide-Renderer und beide Guide-Tests: erfolgreich.
- `git diff --check`: erfolgreich.

## Bedenken

- Die Roadmap rendert die drei vollständigen Teamkarten je Abschnitt direkt im Wegweiser; dadurch wird die Ansicht deutlich länger, bleibt aber ohne zusätzliche Level-Dropdown-Navigation vollständig nachvollziehbar.
- Die vorhandenen Legacy-Blöcke im statischen `index.html` gehören zu Task 6 und wurden hier bewusst nicht entfernt.
- Die vorhandene CSS-Regel für `.level-band-picker select` bleibt als ungenutzte Legacy-Regel bestehen; in der aktiven Guide-/Team-Navigation wird bereits die Timeline verwendet.
