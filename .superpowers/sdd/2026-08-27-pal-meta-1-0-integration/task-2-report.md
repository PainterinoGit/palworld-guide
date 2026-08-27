# Task-2-Bericht: Aktuelle Pal-Meta als normalisierte Daten

## Status

Abgeschlossen. Die aktive Pal-Meta ist in einer versionierten, rollengetrennten Datenstruktur modelliert.

## Geänderte Dateien

- `data/pals.mjs`
  - Ergänzt `combat`, `base`, `roaming`, `progression`, `sources`, `patchScope`, `checkedAt` und `confidence` für aktive Empfehlungen.
  - Beantwortet pro aktivem Pal Fähigkeit/Partner-Skill, Einsatzgrund, beste Nutzung, Fundort und Wechselhinweis.
  - Enthält die recherchierten Schlüsselrollen für Orserk, Shaolong, Panthalus, Frostallion Noct, Bellanoir, Bellanoir Libero, Jetragon, Jormuntide Ignis, Anubis, Lyleen, Renjishi, Dandilord, Solenne, Silvance, Bastigor, Knocklem, Knocklem Ignis, Wumpo und Aegidron.
  - Behält bestätigte Früh-/Midgame-Übergangspals aktiv; ältere Referenzdaten sind ausdrücklich `isActiveRecommendation: false`.
  - Trennt `aliases`, `variantOf` und technische IDs; `lily` bleibt als bestehende Renderer-ID erhalten, `lyleen` ist als separates `canonicalId` auflösbar.
  - Exportiert `ACTIVE_META_PALS`, `ACTIVE_META_PAL_IDS`, den Patch-/Datumsvertrag und gültige Meta-Rollen.
- `data/index.mjs`
  - Re-exportiert die bestehenden Daten sowie die neuen Meta-Exporte.
- `tests/meta-data.test.mjs`
  - Prüft eindeutige IDs/Namen, Bildreferenzen, Rollen, aktive Source-IDs, Scope, Datum, Confidence und vollständige Nutzungsbegründungen.

## TDD- und Testergebnis

- Initialer TDD-Lauf: erwarteter Fehlschlag, weil die aktiven Schlüssel-Pals und Meta-Felder noch fehlten.
- `node tests/meta-data.test.mjs`: erfolgreich (`meta data: ok`)
- `node tests/source-integrity.test.mjs`: erfolgreich (`source integrity: ok`)
- Bestehende Node-Tests (`guide-data`, `guide-renderer`, `pal-data-adapter`, `team-renderer`): erfolgreich.
- `node --check data/pals.mjs`: erfolgreich.
- `node --check data/index.mjs`: erfolgreich.
- `git diff --check`: erfolgreich; Git meldet nur die erwartete LF/CRLF-Konvertierungswarnung.

## Bedenken

- Die aktiven Quellen belegen den vereinbarten Mischstand `Patch 1.0+`; konkrete 1.0.3-Behauptungen werden nicht aus den Meta-Daten abgeleitet.
- Die UI-/Datenbank-Fallbacks und alten statischen Empfehlungen werden erst in den nachfolgenden SDD-Tasks umgestellt; dieser Task liefert dafür die neue Datenquelle.

## Review-Fixes

- Die Partner-Skills von Orserk, Renjishi, Solenne und Aegidron wurden gegen die lokale Roster-Recherche korrigiert. Aegidron führt außerdem wieder beide belegten Typen `Dragon` und `Ground`.
- `getPalById` löst neben IDs auch Anzeigenamen, kanonische IDs, Legacy-IDs und Aliase auf. Damit funktionieren insbesondere `Lily`, `Black Frostallion` und `Fire Knocklem`.
- Die belegten Alternativen `dynamoff` und `neptilius` wurden als Referenz-Pals ergänzt; der nicht vorhandene Tippfehler `dynamoss` wurde ersetzt. Nicht belegte, zuvor nicht auflösbare Alt- und Upgrade-Verweise wurden entfernt.
- `tests/meta-data.test.mjs` prüft nun echte Auflösung für Bilder, Aliase, Varianten sowie Alternativ- und Upgrade-Referenzen und prüft die Re-Exporte aus `data/index.mjs`.

## Review-Verifikation

- `node tests/meta-data.test.mjs`
- `node tests/source-integrity.test.mjs`
- `node tests/guide-data.test.mjs`
- `node tests/guide-renderer.test.mjs`
- `node tests/pal-data-adapter.test.mjs`
- `node tests/team-renderer.test.mjs`
- `node --check data/pals.mjs`
- `node --check data/index.mjs`
- `git diff --check`
