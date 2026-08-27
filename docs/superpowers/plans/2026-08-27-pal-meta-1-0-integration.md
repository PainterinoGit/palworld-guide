# Palworld-Meta 1.0+ in Guide und Datenbank integrieren – Implementierungsplan

> **Für agentische Entwickler:** REQUIRED SUB-SKILL: Nutze `superpowers:subagent-driven-development` (empfohlen) oder `superpowers:executing-plans`, um diesen Plan Schritt für Schritt umzusetzen. Die Schritte werden mit Checkboxen (`- [ ]`) verfolgt.

**Ziel:** Die Website soll ausschließlich aktuelle, recherchierte Patch-1.0+-Informationen für Kampf, Base und Progression präsentieren. Nicht erneut bestätigte ältere Empfehlungen werden aus der aktiven UI entfernt, statt parallel weiter angezeigt zu werden.

**Architektur:** Eine versionierte Meta-Datenschicht wird zur einzigen Quelle für aktive Empfehlungen. Der vollständige Pal-Roster bleibt als neutrale Referenz bestehen, darf aber keine veralteten Empfehlungen in Guide, Teams oder Datenbank zurückspeisen. Guide, Teams und Datenbank greifen auf dieselben Pal- und Quellen-IDs zu.

**Tech Stack:** Vanilla HTML, CSS und ES-Module; Daten in `data/*.mjs` beziehungsweise `data/pals-roster.js`; Node-basierte Tests ohne neues Framework; GitHub Pages als Deployment-Ziel.

**Spezifikation:**

- Meta-Scope: `Patch 1.0+`, geprüft am `2026-08-27`. Patch-spezifische Aussagen müssen zusätzlich die konkrete Patch-Quelle nennen.
- Jede aktive Top-/Best-/Empfehlungs-Aussage braucht Quelle, Prüfdatum, Geltungsbereich und Vertrauensstufe.
- Ein Pal kann gleichzeitig unterschiedliche Rollen haben: Kampf, Roaming, Base und Spezialaufgabe. Diese Rollen werden getrennt erklärt.
- Teams werden immer vollständig gebildet. Nicht benötigte Slots werden als `?` mit Begründung für den variablen Slot dargestellt.
- Die Levelbereiche bleiben eine Roadmap/Timeline. Sie dürfen nicht wieder als Dropdown die zentrale Navigation übernehmen.
- Bei Hover/Fokus auf einen Pal erscheinen großes Bild, Fundort, Einsatzgrund und beste Nutzung.
- Die Datenbank erhält eine klar benannte Begründungsspalte: „Warum / beste Nutzung“.
- Veraltete aktuelle Empfehlungen werden gelöscht oder ersetzt. Sie bleiben nicht als zweite, konkurrierende Meta-Ebene sichtbar.

## Globale Constraints

- Keine Transkripte oder längeren Videoinhalte in das Repository übernehmen; nur eigene Kurzfassungen, strukturierte Fakten und Links speichern.
- Keine Empfehlung als „aktuell“ aus dem alten HTML-Roster oder alten statischen HTML-Blöcken übernehmen, wenn sie nicht in der neuen Meta-Datenschicht belegt ist.
- Neutrale Spielmechanik darf bleiben, muss aber auf Versionsempfindlichkeit geprüft werden. Versionsempfindliche Zahlen, Tierlisten und „beste Pals“-Claims werden ersetzt oder entfernt.
- Vor dem Löschen alter Inhalte zuerst per `rg` inventarisieren und jede Fundstelle als behalten, ersetzen oder entfernen entscheiden.
- Keine automatischen Fallbacks, die bei fehlender Meta-Quelle wieder alte Empfehlungen anzeigen.
- Nach jedem größeren Arbeitsschritt Tests ausführen; vor Abschluss zusätzlich Browser-, Responsive- und Accessibility-Prüfung durchführen.

---

## Task 1: Quellen- und Versionsvertrag festschreiben

**Dateien:** `data/meta-sources.mjs` (neu), `docs/pal-meta-1.0-research.md`, `tests/source-integrity.test.mjs` (neu)

- [ ] Einen zentralen Quellenkatalog anlegen mit stabiler ID, Titel, URL, Quellentyp (`official`, `data`, `editorial`, `video`), Prüfdatum, Scope und kurzer Aussage, die daraus verwendet werden darf.
- [ ] Die recherchierten Quellen eintragen: offizieller Changelog-/Dokumentationsstand, PalWorld Calc, PalMods, PC Gamer, Pal Compass, PinDrop sowie die 14 vom Nutzer gelieferten Videos.
- [ ] Den Unterschied zwischen `Patch 1.0+` und einem konkret belegten Patch wie `1.0.3` im Datenmodell abbilden. Die Seite darf nicht behaupten, jede Aussage sei exklusiv aus 1.0.3, wenn die Quelle nur den allgemeinen 1.0+-Stand belegt.
- [ ] Vertrauensstufen definieren: offizielle Quelle für Patch-/Mechanikfakten, strukturierte Datenquelle für Werte, mehrere unabhängige Quellen oder Videos für Meta-Empfehlungen, Einzelquelle als vorsichtige Empfehlung.
- [ ] Tests schreiben, die jede aktive Quelle auf gültige URL, Prüfdatum, Scope und erlaubten Quellentyp prüfen.
- [ ] Tests schreiben, die für jede aktive Empfehlung mindestens eine Quelle und einen `checkedAt`-Wert verlangen.
- [ ] `node tests/source-integrity.test.mjs` ausführen und den erwarteten initialen Fehlschlag dokumentieren, bevor die neuen Daten angeschlossen werden.

## Task 2: Aktuelle Pal-Meta als normalisierte Daten modellieren

**Dateien:** `data/pals.mjs`, `data/index.mjs`, `tests/meta-data.test.mjs` (neu)

- [ ] Die bestehenden normalisierten Pal-Einträge um getrennte Felder für `combat`, `base`, `roaming`, `progression`, `sources`, `patchScope`, `checkedAt` und `confidence` erweitern.
- [ ] Pro Pal die vier Nutzungsfragen direkt beantworten: Was kann er? Warum würde man ihn einsetzen? Wofür ist er am besten? Wann wird er ersetzt?
- [ ] Die aktuell belegten Schlüsselrollen einpflegen, unter anderem Orserk, Shaolong/Panthalus, Frostallion Noct, Bellanoir/Bellanoir Libero, Jetragon, Jormuntide Ignis, Anubis, Lyleen, Renjishi, Dandilord, Solenne, Silvance, Bastigor, Knocklem/Knocklem Ignis, Wumpo und Aegidron.
- [ ] Früh- und Midgame-Pals nur dann als aktive Empfehlung behalten, wenn die Recherche ihren praktischen Übergangswert bestätigt; reine alte Platzhalter-Tierlisten werden nicht übernommen.
- [ ] Für natürliche Work-Suitability-Spitzen die recherchierten Rollen sauber trennen, beispielsweise Orserk für Electricity, Bastigor für Cooling, Solenne für Handiwork, Silvance für Medicine, Dandilord für Planting, Knocklem für Transporting und Aegidron für Mining.
- [ ] Fundort-, Partner-Skill- und Build-Hinweise in nutzerlesbare Kurztexte überführen. Unklare oder nicht recherchierte Details nicht mit alten Roster-Texten auffüllen.
- [ ] Aliasnamen und Varianten getrennt modellieren, damit Suche, Iconbild und Quellen korrekt aufgelöst werden.
- [ ] Tests schreiben für: eindeutige IDs, vorhandene Bilder, gültige Rollen, Quellenpflicht für aktive Empfehlungen, `?`-Slot-Kompatibilität und keine veralteten Empfehlungsfelder als Fallback.
- [ ] `node tests/meta-data.test.mjs` ausführen.

## Task 3: Kampfteams, Roaming und Spezialteams neu aufbauen

**Dateien:** `data/teams.mjs`, `js/team-renderer.mjs`, `tests/team-data.test.mjs` (neu), `tests/team-renderer.test.mjs` (neu)

- [ ] Die bisherigen generierten Teamempfehlungen in getrennte aktuelle Sammlungen überführen: `COMBAT_TEAMS`, `ROAMING_TEAMS`, `BASE_TEAMS` und `SPECIAL_TEAMS`.
- [ ] Für jeden Levelbereich ein vollständiges Standardteam mit Rollen, Zweck, Ersatzzeitpunkt, Zugangshinweis und Quellen-IDs definieren.
- [ ] Den aktuellen Progressionspfad aus der Recherche abbilden: frühes Team mit Foxparks/Daedream/Cattiva/Vixy plus Flex; Midgame mit Anubis/Jormuntide Ignis/Lyleen/Eikthyrdeer plus Element-Counter; Endgame mit Shaolong oder Panthalus, Orserk, Support und zwei situativen Countern.
- [ ] Base-Kombinationen nach Produktionsziel statt nach pauschalem Tier-Rang definieren: Produktionskern, Erz/Materialien sowie Kühlung/Logistik. Die recherchierten Spezialisten werden mit ihrer konkreten Aufgabe erklärt.
- [ ] Spezialteams für Element-Counter, Raid-/Endgame-Kämpfe und Ressourcenläufe separat ausweisen, damit sie nicht als Standardteam missverstanden werden.
- [ ] Variable Slots mit `?` rendern, inklusive Kontexttext wie „Element-Counter nach Gegner“ oder „Transporter nach Basislayout“.
- [ ] Pro Team eine kurze „Warum diese Kombination?“ und „Wann wechseln?“ Erklärung ausgeben.
- [ ] Renderer um Quellen-/Aktualitätsbadge und die Trennung von Kampf-, Roaming- und Base-Rolle erweitern.
- [ ] Tests prüfen Teamgröße, Rollenabdeckung, gültige Pal-IDs, variable Slots, Quellenpflicht und die Abwesenheit nicht mehr belegter alter Teamnamen.

## Task 4: Level-Roadmap auf die neue Meta ausrichten

**Dateien:** `data/guide.mjs`, `js/guide-renderer.mjs`, `js/guide-ui.mjs`, `tests/guide-data.test.mjs` (neu), `tests/guide-renderer.test.mjs` (neu)

- [ ] Die sechs Levelabschnitte als lineare, abhakkbare Roadmap mit aktuellem Ziel, empfohlenem Kampfteam, Roamingteam, Base-Team und Wechselkriterium definieren.
- [ ] Jeden Abschnitt direkt mit Team-IDs und Pal-IDs verknüpfen, statt Namen erneut in HTML oder Guide-Text zu duplizieren.
- [ ] Pro Abschnitt die Reihenfolge „Ziel → vollständige Teams → benötigte Pals → Fundorte → Upgrade/Wechsel → Checkliste“ verwenden.
- [ ] „Sofort holen“ und „später ersetzen“ sichtbar unterscheiden, damit Spieler nicht versuchen, Endgame-Pals zu früh zu farmen.
- [ ] Frühere turmzentrierte Führung in allgemeine Level-/Fortschrittsführung umwandeln; Turm- und Raid-Teams bleiben nur als spezielle Kampfkontexte.
- [ ] Roadmap-Zustand lokal speicherbar machen, ohne die Empfehlung selbst als erledigt zu markieren oder Daten zu verändern.
- [ ] Tests prüfen Reihenfolge, eindeutige Abschnitts-IDs, vollständige Teamverknüpfungen und funktionierende Checklisten-Zustände.

## Task 5: Datenbank als aktuelle Entscheidungsoberfläche umbauen

**Dateien:** `js/app.js`, `index.html`, `css/style.css`, `tests/pal-data-adapter.test.mjs` (neu)

- [ ] Die Spalten auf die Nutzerentscheidung ausrichten: Pal, Typ, Tier/Einordnung, Phase, Partner-Skill, Arbeits-Eignung, „Warum / beste Nutzung“, Fundort und Quellenstatus.
- [ ] Die neue Begründung nicht nur als Zusatztext anhängen, sondern je nach Filter kontextbezogen anzeigen: Kampfgrund, Base-Grund oder Roaming-Grund.
- [ ] Beim Hover und per Tastaturfokus ein großes Pal-Bild, Fundort, Einsatzgrund, beste Nutzung, Alternativen und Wechselhinweis anzeigen.
- [ ] Aktive Datenbankempfehlungen ausschließlich aus `data/pals.mjs` lesen. Das HTML-Scanning in `buildPalDB()` darf keine alten Empfehlungstexte mehr als aktive Meta-Felder injizieren.
- [ ] Den vollständigen Roster weiterhin für Suche und neutrale Referenzdaten verwenden, aber nicht belegte „Top“-Aussagen aus `data/pals-roster.js` als aktuelle Empfehlung darstellen.
- [ ] Filter für Kampf, Worker, Mount, Fangen, Team-Upgrade sowie Early/Mid/Late beibehalten und mit den neuen Rollenwerten synchronisieren.
- [ ] Einen klaren Hinweis „Patch 1.0+ · geprüft am …“ mit Quellenlink pro aktivem Empfehlungsdatensatz darstellen.
- [ ] Responsive Tabellen-/Kartenansicht sicherstellen, damit Begründung und Fundort auf kleinen Bildschirmen nicht abgeschnitten werden.
- [ ] Tests prüfen Adapter-Reihenfolge, Begründungspflicht, Bildauflösung, Tooltips per Tastatur sowie das Fehlen eines alten Empfehlungs-Fallbacks.

## Task 6: Veraltete aktive Inhalte gezielt entfernen

**Dateien:** `index.html`, `data/pals-roster.js`, `js/app.js`, `docs/pal-meta-1.0-migration.md` (neu)

- [ ] Vor Änderungen alle versionsempfindlichen Claims inventarisieren:
  `rg -n -i "top|best|stärkste|S-Tier|meta|turm|tower|team|Anubis|Jetragon|Lyleen|Orserk|Patch 1\.0" index.html data js`.
- [ ] Jede Fundstelle als `retain`, `replace` oder `remove` in einer Migrationsnotiz dokumentieren; allgemeine Mechanik bleibt nur bei fehlender Versionsabhängigkeit bestehen.
- [ ] Alte statische Teamkarten, alte Tierlisten und widersprüchliche Top-Pal-Claims aus `index.html` entfernen oder durch die neuen Daten-Renderer ersetzen.
- [ ] Alte englische beziehungsweise nicht recherchierte Partner-Skill-/Fundorttexte nicht als neue Meta-Begründung verwenden; entweder aus der neutralen Referenz entfernen oder als nicht-rekommandierten Rohdatensatz kennzeichnen.
- [ ] Keine veralteten Teamdaten lediglich per CSS verstecken. Nicht mehr aktive Empfehlungsblöcke aus dem DOM und aus den Datenpfaden entfernen.
- [ ] `docs/pal-meta-1.0-research.md` um die endgültige Retain/Replace/Remove-Entscheidung und Quellenabgrenzung ergänzen.
- [ ] Mit `rg` nach verbliebenen konkurrierenden „aktuell/beste/top“-Aussagen suchen und jede verbleibende Fundstelle auf eine neue Quellen-ID zurückführen.

## Task 7: Visuelle und funktionale Qualitätssicherung

**Dateien:** `css/style.css`, gegebenenfalls `index.html`, `tests/source-integrity.test.mjs`

- [ ] Gemeinsame Gestaltung für Aktualitätsbadges, Vertrauensstufen, Quellenlinks, Rollenlabels und variable `?`-Slots definieren.
- [ ] Sicherstellen, dass neue Erklärtexte in der Datenbank und in Teamkarten visuell priorisiert werden und nicht hinter langen Partner-Skill-Texten verschwinden.
- [ ] Hover-Inhalte zusätzlich per Fokus, Klick beziehungsweise `aria-describedby` zugänglich machen; Hover darf nicht die einzige Informationsquelle sein.
- [ ] Desktop, Tablet und Mobile mit einem lokalen MIME-korrekten Server prüfen; besonders Datenbankbreite, Roadmap-Overflow und Teamkarten testen.
- [ ] Prüfen, dass keine leeren Bilder, ungültigen Quellenlinks, abgeschnittenen Begründungen oder alten Dropdowns für Abschnitt/Levelbereich sichtbar sind.

## Task 8: Vollständige Verifikation und Übergabe

- [ ] Ausführen:
  `node tests/meta-data.test.mjs`

- [ ] Ausführen:
  `node tests/source-integrity.test.mjs`

- [ ] Ausführen:
  `node tests/team-data.test.mjs`

- [ ] Ausführen:
  `node tests/team-renderer.test.mjs`

- [ ] Ausführen:
  `node tests/guide-data.test.mjs`

- [ ] Ausführen:
  `node tests/guide-renderer.test.mjs`

- [ ] Ausführen:
  `node tests/pal-data-adapter.test.mjs`

- [ ] Syntax prüfen:
  `node --check js/app.js; node --check js/bootstrap.mjs; node --check js/guide-ui.mjs; node --check js/team-renderer.mjs; node --check js/guide-renderer.mjs`

- [ ] Diff prüfen:
  `git diff --check`

- [ ] Altlastensuche ausführen:
  `rg -n -i "old meta|veraltet|legacy recommendation" data js index.html docs`

- [ ] Mit `rg` sicherstellen, dass jeder aktive Team-/Pal-Claim eine Quellen-ID, einen Scope und ein Prüfdatum besitzt.
- [ ] Browser-QA auf Guide, Teams/Base-Worker und Datenbank durchführen; anschließend erst committen.
- [ ] Einen Commit mit ausschließlich Meta-1.0+-Integration und der Migrationsdokumentation erstellen.
- [ ] GitHub Pages erst nach sichtbarer Abnahme und separater Freigabe deployen; anschließend die öffentliche URL auf die neuen Roadmap-, Team- und Datenbankansichten prüfen.

## Abschlusskriterien

- [ ] Es gibt keine aktive, unbelegte „beste/top“-Empfehlung aus der alten Datenbasis.
- [ ] Jeder Levelbereich zeigt ein vollständiges Kampf-, Roaming- und Base-Team oder klar markierte `?`-Slots.
- [ ] Spezialteams sind als Spezialteams erkennbar und werden nicht mit dem Standardfortschritt vermischt.
- [ ] Jeder empfohlene Pal erklärt Fähigkeit, Einsatzgrund, beste Nutzung, Fundort und Wechselzeitpunkt.
- [ ] Die Datenbank zeigt die Begründungsspalte und Quellen-/Aktualitätsstatus sowohl in der Tabelle als auch in der Detailansicht.
- [ ] Die Roadmap ist abhackbar, linear verständlich und ohne Dropdown als primäre Levelnavigation nutzbar.
- [ ] Tests, Syntaxprüfung, Diff-Check und Browser-QA sind erfolgreich.
