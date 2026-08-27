# Migration: aktive Pal-Meta auf Patch 1.0+

## Prüfrahmen

Am 27.08.2026 wurde vor der Bereinigung mit folgendem Inventar gearbeitet:

```text
rg -n -i "top|best|stärkste|S-Tier|meta|turm|tower|team|Anubis|Jetragon|Lyleen|Orserk|Patch 1\.0" index.html data js
```

Die Fundstellen wurden nach aktiver Empfehlung, neutraler Mechanik/Referenz und aktueller Meta-Schicht getrennt bewertet. Maßgeblich für aktive Pal- und Teamempfehlungen sind `data/pals.mjs`, `data/teams.mjs`, `data/guide.mjs` und `data/meta-sources.mjs`.

## Retain / replace / remove

| Fundstelle | Entscheidung | Begründung |
|---|---|---|
| `index.html`, alte `legacy-team-library` mit Reise-, Early/Mid/Late-, Kampf- und Base-Karten | remove | Statische Teamkarten hatten keine Quellen-IDs und konkurrierten mit den Renderer-Teams. Die aktive UI nutzt jetzt nur `levelTeamHost`/`levelSpecialHost`. |
| `index.html`, Endgame-„stärkste Einzel-Pals“, Booster-, Meta-Build- und Community-Team-Blöcke | remove | Absolute Kampf- und Build-Claims waren nicht an die aktuelle Meta-Datenschicht gebunden. |
| `index.html`, Mount-Tierlisten, Mount-Progression und „Beste Transport-Pals“ | remove | Alte Tier-/Ranglisten mit statischen Geschwindigkeits- und Bestwerten wurden nicht quellenfähig gerendert. Mount-/Worker-Rollen kommen aus der aktuellen Datenbank und Teamansicht. |
| `index.html`, konkrete Early-/Late-Breeding-Ketten und alte „Bestes“-Ergebnisse | remove | Rezepte, Varianten und Ergebnisnamen waren nicht mit aktuellen Quellen-IDs abgesichert. Allgemeine Zuchtmechanik bleibt separat bestehen. |
| `index.html`, `Rang-Leiter (Patch 1.0 – reduzierte Kosten)` | remove | Patch-spezifische Zahlen ohne direkte Quellen-ID dürfen nicht als aktuelle Mechanikbehauptung aktiv bleiben. |
| `data/skills.js`, `PAL_SUITABILITY` und `renderSkillTable()` | remove | Die Datei war eine alte Top-10/Top-15-Arbeits-Tierlistenquelle und wurde von `app.js` geladen bzw. referenziert. |
| `data/quests.js`, `QUESTS` und `renderWegweiser()` | remove | Der alte Turm-Wegweiser enthielt eigene Team-/Boss-Fallbacks ohne Quellen- und Meta-Vertrag und lief parallel zur neuen Roadmap. |
| `data/pals-roster.js` | retain, replace header | Die 288 Einträge bleiben neutrale Such-/Referenzdaten. Der Header stellt klar, dass daraus keine aktuelle Empfehlung abgeleitet wird; aktive Meta wird ausschließlich aus `data/pals.mjs` gemerged. |
| Pal-Datenbank mit Tier/Phase/Partner-Skill/Fundort und `Warum / beste Nutzung` | retain | Diese Oberfläche wird durch den Adapter aus Roster + validierter aktueller Meta aufgebaut. Nur `isActiveRecommendation === true` erhält Featured-/Meta-Status. |
| Roadmap-, Team-, Base-Worker- und Spezialteam-Hosts | retain | Diese Bereiche werden durch aktuelle Datenmodule und Renderer befüllt; Spezialteams bleiben vom Standardfortschritt getrennt. |
| Allgemeine Talente-, Kondensations-, Zuchtgrundlagen-, Kampf-, Ressourcen- und Inventartexte | retain | Sie sind keine Pal-Rangliste. Nicht neutrale Detail- oder Patch-Claims wurden entfernt; verbleibende Zahlen sind als allgemeine Handbuchinhalte zu behandeln und bei einem separaten Mechanik-Refresh erneut zu prüfen. |
| Map-Ressourcen mit S-/A-Tier-Ortslabels | retain | Das Label beschreibt den Ressourcenstandort innerhalb der Map, nicht eine Pal-Empfehlung oder Team-Tierliste. |

## Aktiver Datenfluss nach der Migration

```text
data/pals-roster.js  ─┐
                      ├─> js/pal-data-adapter.mjs ─> js/app.js ─> Pals-Tabelle/Details
data/pals.mjs        ─┘          (aktive Meta nur mit Quellenvertrag)

data/teams.mjs + data/guide.mjs + data/meta-sources.mjs ─> Renderer ─> Roadmap/Teams
```

Es gibt keinen Fallback mehr auf HTML-Scanning, `data/skills.js` oder `data/quests.js`. Neutrale Roster-Daten dürfen Suche, Icons und Referenzspalten füllen, aber keine Rollen, Featured-Markierung, Begründung oder aktuelle Empfehlung erzeugen.

## Abschlussprüfung

Der Regressionstest `tests/task-6-legacy.test.mjs` prüft die Entfernung der alten DOM-Blöcke, Quellenpfade und Fallback-Symbole. Die verbleibenden Treffer für `Patch 1.0+`, `Tier / Einordnung`, `S-Tier` und „beste Nutzung“ gehören zur aktuellen Datenbank-/Quellenkennzeichnung oder zur neutralen Ressourcenkarte; sie wurden nicht als alte aktive Pal-Meta eingestuft.
