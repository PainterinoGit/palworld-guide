# Breeding-Reiter und vollständige Zuchtdatenbank

## Ziel

Die Website erhält einen eigenen Top-Level-Reiter für Breeding. Er verbindet die verständlichen Zuchtgrundlagen aus dem Handbuch mit einem lokalen, durchsuchbaren Rechner und einer vollständigen Tabelle aller unterstützten Eltern-Kind-Kombinationen. Die Pal-Datenbasis wird dabei von 288 auf 297 Pals erweitert.

Die Funktion soll sich an der Bedienlogik der Referenzseite orientieren, aber vollständig in den bestehenden Guide integriert bleiben: gleiche Datenbasis, deutsche Erklärungen und direkte Verknüpfungen zu Pal-Details und Guide-Routen.

## Nutzerfluss

1. Der Nutzer öffnet den Reiter „Breeding“.
2. Im Rechner wählt er zwei Eltern-Pals aus oder sucht direkt nach einem Ziel-Pal.
3. Die Oberfläche zeigt das deterministische Ergebnis beziehungsweise alle möglichen Ergebnisse für das Elternpaar.
4. Die Tabelle darunter listet alle gültigen Varianten und kann ohne Seitenwechsel durchsucht und gefiltert werden.
5. Eine optionale Ansicht „Empfohlene Guide-Routen“ reduziert die vollständige Datenbank auf die für Progression, Base, Mounts und Endgame relevanten Wege.
6. Sonderfälle und unsichere Community-/Mutationspfade werden sichtbar gekennzeichnet und nicht als normale garantierte Kombination ausgegeben.

## Informationsarchitektur

### Neuer Top-Level-Reiter

Der neue Reiter „🥚 Breeding“ wird neben „Pals“ und „Handbuch“ eingefügt. Er enthält:

- Intro mit Datenstand, Regelhinweis und kurzer Erklärung der deterministischen Artvererbung.
- Zwei Eltern-Auswahlen mit Suche, Pal-Bild, Typ und Seltenheit.
- Ergebnisbereich für ein Elternpaar.
- Such- und Filterleiste für die vollständige Tabelle.
- Tabelle mit Ziel-Pal, Eltern A, Eltern B, Phase, Sonderregel und Quellenstatus.
- Umschaltung zwischen „Alle Kombinationen“ und „Empfohlene Routen“.
- Kleine Sektion „So züchtest du effizient“ mit Carrier-Linien, Passiv-Auswahl, Kuchen, Inkubation und Condensing.

### Handbuch-Migration

Der aktuelle Breeding-Unterbereich im Handbuch bleibt nicht als zweiter vollständiger Rechner bestehen. Seine Inhalte werden in drei kurze, verlinkte Grundlagenblöcke umstrukturiert:

- Zuchtregeln und deterministische Artvererbung
- Passiv-/Talent-Vererbung und Carrier-Linien
- Effiziente Reihenfolge: Progression, Base, Mounts und Endgame

Jeder Block verweist auf den neuen Breeding-Reiter. Die konkreten Tabellen- und Rechnerdaten liegen ausschließlich dort, damit keine widersprüchlichen Listen entstehen.

## Datenmodell

### Pal-Daten

Die bestehende vollständige Pal-Liste wird auf 297 eindeutig identifizierte Arten erweitert. Jeder Eintrag erhält beziehungsweise behält mindestens:

- stabile ID und Anzeigename
- Typen, Seltenheit, Tier und Progressionsphase
- Partner-Skill und Arbeitseignungen
- Fundort-/Zugangsangabe
- Bildreferenz, sofern vorhanden
- Breeding-Metadaten: Zuchtwert, Self-only-Status und Sonderfallmarker

Die bestehende Pal-Datenbank bleibt die gemeinsame Quelle für Pal-Karten, Tabellen, Teamansichten und den neuen Breeding-Reiter. Doppelte, nur unterschiedlich geschriebene Namen werden über stabile IDs zusammengeführt.

### Breeding-Datensatz

Der neue versionierte Datensatz wird von der UI getrennt und enthält kanonische Datensätze pro gültigem Elternpaar:

```js
{
  parentA: 'pal-id',
  parentB: 'pal-id',
  result: 'pal-id',
  genderRule: null | 'female-parentA' | 'female-parentB',
  kind: 'standard' | 'same-species' | 'special' | 'mutation',
  phase: 'early' | 'mid' | 'late' | 'endgame',
  confidence: 'verified' | 'community' | 'experimental',
  sources: ['source-id']
}
```

Elternreihenfolge wird bei normalen Paaren kanonisiert, damit A+B und B+A nicht doppelt erscheinen. Geschlechtsabhängige Kombinationen behalten dagegen eine explizite Rollenregel. Self-only-Pals werden als eigene, klar markierte Einträge geführt.

Zusätzlich werden Quellen- und Datenstand-Metadaten gespeichert. Die vollständige Tabelle darf nur Kombinationen anzeigen, die im versionierten Datensatz enthalten sind; nicht belegte Kombinationen werden nicht aus Namensähnlichkeiten oder alten Early-Access-Listen hergeleitet.

## Rechner- und Tabellenverhalten

- Elternauswahl und Zielsuche verwenden dieselbe 297-Pal-Datenbasis.
- Bei zwei Eltern wird das Ergebnis sofort clientseitig angezeigt.
- Bei einem Ziel-Pal zeigt die Tabelle alle bekannten gültigen Elternpaare für dieses Ziel.
- Die Suche berücksichtigt Pal-Name, Elternnamen und Ergebnisnamen.
- Filter: Ergebnis, Eltern, Typ, Seltenheit, Phase, Art der Kombination und Daten-/Quellenstatus.
- Die Standardansicht sortiert nach Phase, dann Zielname; Nutzer können zusätzlich nach Name und Phase sortieren.
- Leere Zustände erklären, warum keine Kombination gefunden wurde.
- Tabellenzeilen bleiben auf Mobilgeräten horizontal scrollbar; Text wird nicht auf einzelne Buchstaben schmalgezogen.
- Jede Pal-Zelle kann die bestehende Pal-Detailansicht öffnen, ohne den Breeding-Filterzustand unnötig zu verlieren.

## Zuchtstrategie im Guide

Die redaktionellen Empfehlungen werden von den Rohdaten getrennt gepflegt. Empfohlene Routen enthalten nur einen kleinen, begründeten Ausschnitt der vollständigen Tabelle:

- frühe Nutzwert- und Support-Pals
- Base-Spezialisten
- Mount- und Kampfziele
- aktuelle 1.0-/World-Tree-Ziele
- Self-only-, geschlechtsabhängige und experimentelle Sonderfälle

Die UI kennzeichnet Empfehlungen als redaktionelle Auswahl. Eine Kombination wird nicht allein deshalb als „beste“ bezeichnet, weil sie technisch möglich ist.

## Technische Umsetzung

- Die Anwendung bleibt statisch und clientseitig.
- Breeding-Daten werden als versioniertes ES-Modul oder kompakte statische Datendatei geladen.
- Die Filterung erfolgt im Browser; für die erwartete Datengröße ist keine externe Datenbank erforderlich.
- Ein kleiner Adapter normalisiert Pal-IDs, Namen und Quellen, bevor gerendert wird.
- Rendering nutzt bestehende Escape-/Formatierungshelfer und trennt Datenfilterung von HTML-Erzeugung.
- Der neue Tab wird in Navigation, Footer und bestehende Tab-Regressionstests aufgenommen.
- Die Datenimport-/Validierungslogik prüft fehlende Pal-IDs, doppelte kanonische Paare, unbekannte Ergebnis-Pals und ungültige Sonderfallregeln vor dem Build.

## Korrektheit und Quellen

Die Referenzseite dient als UX-Vorbild und als Abgleich für den Umfang von 297 Pals. Die fachlichen Regeln werden gegen aktuelle, versionierte 1.0-Datenquellen geprüft. Alte Early-Access-Gewichte werden nicht als harte Ingame-Fakten übernommen. Besonders zu kennzeichnen sind:

- deterministische Artvererbung
- Self-only-Arten
- geschlechtsabhängige Katress-/Wixen-Varianten
- Spezial-/Mutationspfade ohne normale Treffer-Garantie
- unbekannte oder nicht belastbar serialisierte Passiv-/IV-Gewichte

## Akzeptanzkriterien

- Ein sichtbarer Top-Level-Reiter „Breeding“ ist über Navigation und Footer erreichbar.
- Die 297 Pal-Einträge sind eindeutig und in der bestehenden Pal-Datenbank nutzbar.
- Ein Elternpaar kann gesucht und ausgewählt werden; ein bekanntes Ergebnis wird angezeigt.
- Die Tabelle enthält alle im versionierten Datensatz erfassten gültigen Varianten und verhindert normale Duplikate durch vertauschte Eltern.
- Suche und Filter kombinieren sich ohne Seitenreload.
- Self-only-, geschlechtsabhängige und experimentelle Fälle sind visuell und textlich unterscheidbar.
- Das Handbuch enthält keine konkurrierende, veraltete Volltabelle und verlinkt auf den neuen Reiter.
- Mobile Tabellenansicht und lange Partner-/Breeding-Texte bleiben lesbar.
- Datenvalidierung und automatisierte Regressionstests decken Pal-Anzahl, Kernkombinationen, Sonderfälle, Filterung und Tab-Erreichbarkeit ab.

## Nicht Bestandteil dieser Version

- Nutzerkonten oder serverseitiges Speichern eigener Zuchtziele
- externe Live-Synchronisation mit der Referenzseite
- automatische Behauptung unbekannter Mutations- oder Vererbungswahrscheinlichkeiten
- vollständiger Ersatz der bestehenden Pal-Detailansicht

