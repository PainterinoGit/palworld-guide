# Konsolidierung von Teams und Basen

## Ziel

Die Navigation und Darstellung der Team- und Base-Inhalte wird reduziert. Nutzer sollen auf ein dauerhaftes Team hinarbeiten können, statt sechs Levelbereiche mit jeweils Kampf-, Roaming- und Base-Teams parallel zu lesen. Der bisherige Base-Planer wird in denselben Top-Level-Reiter integriert, weil er die Base-Worker bereits vollständig abdeckt.

## Neue Informationsarchitektur

Der bisherige Reiter „Teams & Base-Worker“ wird zu **„Teams & Basen“**. Der separate Top-Level-Reiter „Base-Planer“ entfällt.

Der gemeinsame Reiter besteht aus zwei klar getrennten Abschnitten:

1. **Team-Fortschritt**: eine zusammenhängende Linie vom Startteam über den Midgame-Kern zum Endgame-Team.
2. **Base-Planer**: die bestehende Planung nach Basenanzahl, Basiszweck und Worker-Rollen.

Der Footer verlinkt nur noch auf „Teams & Basen“ und nicht zusätzlich auf einen entfernten Base-Planer-Reiter.

## Team-Fortschritt

### Sichtbare Phasen

Es werden drei Phasen dargestellt:

- **Start**: leicht erreichbarer Kampf- und Erkundungskern
- **Midgame**: stabiler Kern mit den ersten gezielten Upgrades
- **Endgame**: finales Team mit Boss-/Raid-Swaps

Jede Phase zeigt:

- ein Kampfteam mit fünf Slots
- höchstens zwei optionale Austausch-Pals
- eine kurze Zeile „Wann wechseln?“
- eine knappe Begründung für den Kern

Roaming- und Spezialteams werden nicht mehr als vollständige parallele Teamkarten dargestellt. Ihre relevanten Pals erscheinen als situative Wechsel beim passenden Kernteam, zum Beispiel Flug-Mount, Element-Counter oder Raid-Support.

### Leitregel

Die Einleitung wird auf eine klare Handlungsanweisung reduziert: **„Baue einen stabilen Kern und tausche nur einzelne Slots aus.“** Lange Erklärungen wandern in aufklappbare Details oder ins Handbuch.

## Integrierter Base-Planer

Unter dem Team-Fortschritt wird der bestehende Base-Planer unverändert in seiner Funktion eingebunden:

- Auswahl der Basenanzahl
- Rollenverteilung und Layout pro Basisanzahl
- Produktionsbase
- Ressourcenbase
- Breeding-/Ranchbase
- Worker- und Reserve-Hinweise

Die Base-Planer-Daten bleiben im eigenen Modul. Nur der Host und die Initialisierung werden in den gemeinsamen Reiter verschoben. Base-Worker werden nicht zusätzlich in den Teamkarten dupliziert.

## Datenmigration

Die bestehenden sechs Levelbands bleiben als Rohdaten erhalten, damit vorhandene Pal-Empfehlungen, Quellen und Übergänge nicht verloren gehen. Ein neues Präsentationsmodell gruppiert sie ausschließlich für die UI in drei Phasen:

- Start: bisherige Bänder 1–10 und 10–20
- Midgame: bisherige Bänder 20–30 und 30–40
- Endgame: bisherige Bänder 40–50 und 50+

Die Gruppierung verändert nicht die vorhandenen Datenobjekte, sondern nur die Auswahl und Zusammenfassung im Renderer. Bestehende Spezialteam-Daten bleiben verfügbar, werden aber als optionale Wechsel referenziert.

## Technische Umsetzung

- Navigation, Footer und Tab-IDs werden auf den gemeinsamen Reiter ausgerichtet.
- Der bisherige `base-planner`-Container wird in den `teams`-Container verschoben oder dort als eindeutig benannter Abschnitt integriert.
- `guide-ui.mjs` rendert den kompakten Team-Fortschritt mit drei Phasen.
- `base-planner.mjs` behält seine Daten- und Renderlogik; seine Initialisierung erhält den neuen Host im Teams-&-Basen-Reiter.
- Nicht mehr benötigte doppelte Base-Team-Karten werden aus dem sichtbaren Team-Renderer entfernt, nicht aus den Daten gelöscht.
- Der Wechsel zwischen den Top-Level-Tabs bleibt über `switchTab` möglich; direkte Deep-Links auf den alten Base-Planer werden auf den gemeinsamen Reiter weitergeleitet.

## Darstellung und Textumfang

- Pro Phase steht der Teamkern im Vordergrund.
- Begründungen werden auf ein bis zwei Sätze begrenzt.
- Detailinformationen werden über bestehende aufklappbare oder sekundäre Bereiche zugänglich.
- Keine sechsfach wiederholten Levelbeschreibungen und keine parallelen Vollkarten für Kampf, Roaming und Base.
- Auf Mobilgeräten bleiben Team- und Base-Sektionen vertikal lesbar; breite Tabellen oder Karten werden nicht zusätzlich verschachtelt.

## Akzeptanzkriterien

- Die Navigation enthält „Teams & Basen“ und keinen separaten „Base-Planer“-Top-Level-Button.
- Der Reiter zeigt genau drei sichtbare Teamphasen.
- Nutzer sehen pro Phase ein Kernteam, höchstens zwei Wechseloptionen und eine kurze Wechselregel.
- Der vollständige Base-Planer ist im Reiter „Teams & Basen“ weiterhin bedienbar.
- Base-Worker werden nicht gleichzeitig als eigenständige Teamkarten und als Base-Planer-Kernbesetzung dupliziert.
- Bestehende Team- und Base-Daten, Pal-Verknüpfungen und Quellen bleiben gültig.
- Alte Links auf `base-planner` führen zur gemeinsamen Ansicht.
- Regressionstests prüfen Navigation, Phasenanzahl, Base-Planer-Host und Erreichbarkeit der Auswahl.

## Nicht Bestandteil dieser Änderung

- neue Kampfteam-Empfehlungen oder eine Neubewertung einzelner Pals
- Änderung der Base-Planer-Daten und Worker-Zusammensetzung
- Löschung der bestehenden sechs Levelband-Daten
- neue Filter, Rechner oder Nutzerprofile

