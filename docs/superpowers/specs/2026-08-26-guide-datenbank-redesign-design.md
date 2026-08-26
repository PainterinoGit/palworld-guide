# Guide- und Datenbank-Redesign

## Ziel

Die Palworld-Seite soll Spieler verständlich durch ihren Fortschritt führen und gleichzeitig als verlässliche Pal- und Standortdatenbank funktionieren. Der primäre Nutzungspfad ist künftig: Levelbereich erkennen → konkretes Standardteam auswählen → Vorbereitung erledigen → bei Bedarf auf ein Spezialteam wechseln → nächstes Upgrade verfolgen.

Die Seite soll nicht mehr hauptsächlich viele Listen nebeneinander anbieten. Jede Empfehlung muss beantworten: Wann ist sie sinnvoll, wofür wird sie eingesetzt, wie ist sie erreichbar und wann wird sie ersetzt?

## Produktprinzipien

- Der geführte Playthrough ist der Haupteinstieg.
- Levelbereiche sind die primäre Ordnung; Türme und Bosse sind Sonderfälle.
- Kampf, Roaming/Erkundung und Base werden als getrennte, vollständige Teams dargestellt.
- Spezialteams werden nur für konkrete Situationen empfohlen.
- Ein Pal wird zentral gepflegt und überall wiederverwendet.
- Empfehlungen werden nach realistischer Verfügbarkeit statt nur nach Endgame-Stärke sortiert.
- Ein variabler Teamplatz wird als `?` angezeigt; nicht benötigte Plätze als `—`.
- Desktop-Hover und Mobile-Tap zeigen denselben kontextbezogenen Pal-Detailstand.

## Informationsarchitektur

### Wegweiser

Der Wegweiser ist der primäre Einstieg. Er zeigt den aktuellen Levelbereich und genau ein nächstes Hauptziel. Pro Abschnitt erscheinen:

1. aktuelles Ziel
2. konkrete Vorbereitung
3. Standard-Kampfteam
4. Roaming-/Erkundungsteam
5. Base-Team
6. passende Spezialteams
7. benötigte Items und Orte
8. Erfolgskriterium und nächstes Upgrade

Die Fortschrittsauswahl darf nicht standardmäßig mitten im Spiel starten. Ein neuer Nutzer beginnt bei Level 1 beziehungsweise im ersten Abschnitt. Der Fortschritt bleibt lokal speicherbar.

### Teams

Teams werden nach sechs flexiblen Levelbereichen organisiert: 1–10, 10–20, 20–30, 30–40, 40–50 und 50+. Die Bereiche sind Orientierung, keine harten Voraussetzungen.

Jeder Levelbereich enthält:

- ein vollständiges Standard-Kampfteam
- ein vollständiges Roaming-/Erkundungsteam
- ein vollständiges Base-Team
- Spezialteams für Boss, Fangen, Dungeon, Ressourcen, Mount oder Raid, sofern relevant

Jede Teamkarte enthält Einsatz, verfügbare Slot-Anzahl, konkrete Slots, Rollen, Alternativen, Voraussetzungen, Ersatzbeziehungen und den nächsten Wechsel. Nur tatsächlich benötigte Slots werden befüllt. Variable Slots werden mit `?` erklärt und nicht als fehlende Daten behandelt.

Kampfteams beantworten „Was nehme ich für normale Kämpfe mit?“. Roamingteams priorisieren Mobilität, Überleben, Inventar und Ressourcen. Base-Teams zeigen Worker-Aufgaben und sinnvolle Parallelität und sind unabhängig vom Spielerteam.

### Pal-Datenbank

Die Datenbank ist über Suche, Levelbereich, Einsatz, Rolle, Element, Arbeitsfähigkeit, Verfügbarkeit und Guide-Relevanz filterbar. Zusätzlich gibt es zielorientierte Einstiege: Kampf-Pal, Worker, Mount, Fanghilfe, Team-Upgrade und Boss-Kontermöglichkeit.

Jeder Pal zeigt mindestens Bild, Elemente, Rollen, Partner-Skill, Arbeitsfähigkeiten, Fundort, frühesten realistischen Einsatz, Verfügbarkeit, kurze Begründung, Alternativen, vorherigen Pal und späteres Upgrade. Die Datenbank verweist zurück auf die Teamkarten, in denen der Pal verwendet wird.

### Karte und Handbuch

Die Karte wird nach Zweck gruppiert: nächstes Ziel, Base, Ressourcen, Pal-Fundort, Dungeon, Boss und Zucht-/Farmziel. Das Handbuch bleibt als Referenz bestehen, wird aber aus Wegweiser, Teamkarten und Pal-Details kontextbezogen verlinkt.

## Zentrales Datenmodell

Pals, Teams, Levelbereiche und Orte werden als strukturierte Daten gepflegt. HTML dient nicht mehr als primäre Datenquelle. Ein Pal-Eintrag enthält unter anderem:

```js
{
  name, image, types, location, availability,
  roles, workSuitability, partnerSkill,
  whyGood, alternatives, upgradeFrom, upgradeTo
}
```

Ein Team-Slot enthält Pal, Rolle, Begründung, Fundort, Alternative und Upgrade-Beziehung. Die gleichen Daten werden in Wegweiser, Teamkarten, Tooltips und Datenbank verwendet. So entstehen keine abweichenden Namen, Bilder, Fundorte oder Empfehlungen.

## Pal-Interaktion

Hover auf Desktop und Tap auf Mobile öffnen ein Detailfenster mit großem Bild, Name, Element, aktueller Rolle, Fundort, Verfügbarkeit, Begründung, Alternative und Upgrade. Der Inhalt ist kontextabhängig: Im Base-Team steht die Arbeitsaufgabe im Vordergrund, im Kampfteam die Kampffunktion, im Roamingteam die Reise- oder Mount-Funktion. Ein Link führt zur vollständigen Datenbankansicht.

Das Detailfenster muss außerhalb des Elements schließbar sein, darf keine wichtigen Bedienelemente verdecken und muss auch ohne Hover per Tastatur erreichbar sein.

## Migrationsumfang

- Bestehende Early/Mid/Late-Inhalte in die sechs Levelbereiche überführen.
- Reise-, Kampf- und Base-Empfehlungen aus den verstreuten Tabellen in Team-Daten überführen.
- Boss-/Raid-/Fang-/Dungeon-Teams als Spezialteams markieren.
- Alle wiederverwendeten Pals in eine zentrale Datenquelle verschieben.
- Wegweiser auf den ersten Abschnitt zurücksetzen, wenn kein gespeicherter Fortschritt vorhanden ist.
- Veraltete oder doppelte Datenquellen identifizieren; insbesondere `palworld-guide.html` gegenüber `index.html` klären und nur eine aktive Quelle behalten.
- Interne Widersprüche bei Level, Verfügbarkeit oder Rollen vor Veröffentlichung markieren und korrigieren.

## Erfolgskriterien

- Ein neuer Nutzer versteht innerhalb weniger Sekunden, wo er starten soll.
- Für jeden Levelbereich ist klar, welches Kampf-, Roaming- und Base-Team aktuell gemeint ist.
- Spezialteams sind sichtbar, aber nicht mit dem Standardteam gleichrangig vermischt.
- Kein Team empfiehlt einen Pal ohne sichtbare Verfügbarkeits- oder Alternativinformation.
- Ein Pal-Tooltip erklärt Bild, Fundort und Nutzen ohne Seitenwechsel.
- Änderungen an einem Pal erscheinen konsistent in Teamkarten, Tooltips und Datenbank.
- Die Darstellung funktioniert auf Desktop und Mobile mit Tastatur- und Tap-Bedienung.
- Fortschritt und Team-Auswahl bleiben nach einem Seitenneuladen erhalten.

## Nicht Bestandteil der ersten Umsetzung

- Vollständige serverseitige Benutzerkonten oder Synchronisierung.
- Automatische Spielstand- oder Savegame-Analyse.
- Ein komplexer Team-Builder mit freiem Optimierungsalgorithmus.
- Eine Bewertung aller möglichen Meta-Kombinationen. Der erste Fokus liegt auf klaren, erreichbaren Empfehlungen.
