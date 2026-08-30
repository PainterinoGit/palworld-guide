# Breeding-Rechner und Zuchtbeziehungen

## Ziel

Die Website erhält einen eigenen, lokalen Breeding-Reiter. Nutzer können ein Ziel-Pal suchen und passende Elternpaare mit Icons finden oder zwei Eltern auswählen und das mögliche Ergebnis anzeigen. Die bestehende Pal-Tabelle zeigt für jedes Pal passende Eltern-Icons als direkten Einstieg in den neuen Reiter.

## Abgrenzung

- Keine externe Weiterleitung als primärer Rechner.
- Keine Server- oder Account-Funktion; Berechnung und Filterung laufen im Browser.
- Die Datenbasis enthält alle bekannten Kombinationen, die für den aktuellen Roster vorliegen.
- Unvollständige oder besondere Beziehungen werden sichtbar als Status markiert, nicht als garantiertes Ergebnis ausgegeben.

## Informationsarchitektur

Die Hauptnavigation erhält einen Tab `Breeding`. Der bestehende Breeding-Abschnitt im Handbuch bleibt als erklärender Kontext und enthält einen Link zum interaktiven Rechner. Der externe Calculator bleibt höchstens als Quelle verlinkt, nicht als Hauptaktion.

### Ziel-Pal-Ansicht

Standardansicht des Tabs:

1. Suche oder Auswahl eines Ziel-Pals.
2. Ergebnisliste mit allen bekannten Elternpaaren.
3. Jede Kombination zeigt Eltern-Icons, Elternnamen, Pfeil, Ergebnis-Icon/-Name, Status, kurze Notiz und Quelle.
4. Bei artgleichen oder nicht eindeutig ableitbaren Zielen erscheint ein verständlicher Sonderfall-Hinweis.

### Eltern-Ansicht

Zwei Pal-Picker ermöglichen die Gegenrichtung. Nach Auswahl von Elternteil A und B zeigt der Rechner:

- das mögliche Kind beziehungsweise mehrere bekannte Ergebnisse,
- Kind-Icon, Name und Element,
- Status und Datenhinweis,
- eine Aktion, um das Kind als neues Ziel zu öffnen.

Leere, gleiche oder noch nicht unterstützte Auswahl wird ohne Fehlermeldung als erklärter Zustand dargestellt.

### Filter und Verlinkung

Die Ergebnisliste kann nach Element, Spielphase und Status gefiltert werden. Ein Klick auf die Zucht-Icons in der Pal-Tabelle öffnet den Breeding-Tab und setzt das Ziel-Pal. Die bestehende Tabellenfilterung und Sortierung bleiben erhalten.

## Datenmodell

Eine neue Datenquelle exportiert normalisierte Beziehungen, unabhängig von der Darstellung:

```js
{
  id: 'anubis-parent-a-parent-b',
  child: 'Anubis',
  parents: ['Parent A', 'Parent B'],
  status: 'verified' | 'special-case' | 'same-species' | 'incomplete',
  phase: 'early' | 'mid' | 'late',
  note: 'Kurzer Hinweis zur Paarung oder Einschränkung.',
  sources: ['palworld-gg-breeding-calculator']
}
```

Die Elternreihenfolge ist für die Paarung semantisch egal; die Datenlogik normalisiert sie für Suche und Duplikatvermeidung. Pal-Namen werden gegen den bestehenden Roster aufgelöst. Fehlt ein Icon oder ein Pal im Roster, bleibt der Name sichtbar und die Beziehung wird als unvollständig markiert.

Zusätzlich erzeugt die Datenlogik Indizes für:

- `child -> relationships`
- normalisiertes `parent pair -> relationships`
- Pal-Namen für Picker und Zielsuche

## Komponenten und Verhalten

- `data/breeding-combinations.mjs`: normalisierte Beziehungen und Quellenmetadaten.
- `js/breeding-calculator.mjs`: reine Filter-/Indexlogik sowie Renderer für Ziel- und Elternansicht.
- `js/guide-ui.mjs` oder ein bestehender Bootstrap-Pfad: Initialisierung, Tab-Deep-Link und Auswahlzustand.
- `index.html`: neuer Haupttab, Rechner-Host und Zuchtspalte in der Pal-Tabelle.
- `css/style.css`: kompakte Karten-/Icon-Darstellung, responsive Picker und Ergebnisliste.

Die Rechnerlogik darf nicht von DOM-Details abhängen. Rendering erhält Daten und Hosts als Parameter, damit Kombinationen und Such-/Filterverhalten unabhängig testbar bleiben.

## Pal-Tabelle

Die neue Spalte „Zucht“ bleibt kompakt. Pro Ziel-Pal werden maximal die wichtigsten beziehungsweise ersten passenden Paare direkt als Icon-Gruppe gezeigt; bei weiteren Beziehungen erscheint eine Anzahl oder „mehr“. Ein Tooltip beziehungsweise `title` enthält die vollständigen Elternnamen. Die Icons sind tastaturbedienbare Buttons/Links und setzen beim Öffnen das Ziel-Pal im Rechner.

Damit die Tabelle nicht zu breit wird, ist die Spalte auf Icons und kurze Statusinformationen begrenzt. Die vollständige Liste bleibt im Breeding-Reiter.

## Fehler- und Randfälle

- Kein Ziel ausgewählt: erklärter Leerzustand mit Suchhinweis.
- Ziel ohne Beziehung: Hinweis zu artgleicher Vermehrung oder fehlenden Daten.
- Eltern ohne bekanntes Ergebnis: „Keine bekannte Kombination im aktuellen Datenstand“.
- Fehlendes Icon: Fallback auf Initialen/neutralen Platzhalter.
- Doppelte Elternreihenfolge: nur eine normalisierte Beziehung anzeigen.
- Nicht vertrauenswürdige oder unvollständige Daten: Status sichtbar und nicht als garantiert formulieren.

## Tests und Abnahme

Vor Implementierung werden Tests für die gewünschte API geschrieben und rot ausgeführt. Abzudecken sind:

- Indexbildung und Normalisierung von Elternpaaren.
- Zielsuche liefert alle passenden Beziehungen.
- Elternsuche behandelt vertauschte Reihenfolge identisch.
- Status- und Elementfilter kombinieren sich korrekt.
- Renderer zeigt Eltern-Icons, Ergebnis und Sonderfall-Hinweise.
- Pal-Tabellen-Links setzen das gewünschte Ziel im Breeding-Reiter.
- Bestehende Roster-, Tabellen- und Navigationstests bleiben grün.

Abnahme erfolgt mit der vollständigen Node-Test-Suite sowie einer manuellen Browserprüfung auf Desktop und schmalem Viewport.
