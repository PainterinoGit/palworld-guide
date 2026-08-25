// Palworld Guide — application logic (rendering, tabs, interactions)

        function buildPalSuitabilityMap() {
            const map = {};
            Object.entries(SKILL_TIERS).forEach(([skillId, data]) => {
                data.rows.forEach(r => {
                    const name = r[0];
                    if (!map[name]) map[name] = {};
                    if (!map[name][skillId] || map[name][skillId] < r[1]) {
                        map[name][skillId] = r[1];
                    }
                });
            });
            return map;
        }
        const PAL_SUITABILITY = buildPalSuitabilityMap();

        const PAL_STAGE_LABEL = { early: 'Early', mid: 'Mid', late: 'Late' };
        const PAL_STAGE_BADGE_COLOR = { early: '#3B82F6', mid: '#F97316', late: '#8B5CF6' };

        function addOrMergeEntry(db, name, patch) {
            if (!name) return;
            name = name.trim();
            if (!db[name]) {
                db[name] = { name, types: [], tier: null, stages: [], roles: [], location: null, note: null, skills: {}, tags: [], partnerSkill: null, featured: false };
            }
            const e = db[name];
            if (patch.type && !e.types.includes(patch.type)) e.types.push(patch.type);
            if (patch.tier && !e.tier) e.tier = patch.tier;
            if (patch.stage && !e.stages.includes(patch.stage)) e.stages.push(patch.stage);
            if (patch.roles) patch.roles.forEach(r => { if (!e.roles.includes(r)) e.roles.push(r); });
            if (patch.location && !e.location) e.location = patch.location;
            if (patch.note && !e.note) e.note = patch.note;
            if (patch.partnerSkill && !e.partnerSkill) e.partnerSkill = patch.partnerSkill;
            if (patch.featured) e.featured = true;
            if (patch.skills) Object.entries(patch.skills).forEach(([sk, lvl]) => {
                if (!e.skills[sk] || e.skills[sk] < lvl) e.skills[sk] = lvl;
            });
            if (patch.tags) patch.tags.forEach(t => { if (!e.tags.includes(t)) e.tags.push(t); });
        }

        // Seeds the master DB from the static complete-roster dataset (288 Pals inkl. Varianten,
        // siehe FULL_PAL_ROSTER weiter oben) — jede Zeile bringt Typ/Tier/Phase/Partner-Skill/
        // Arbeits-Eignung/Fundort mit. Die anschließenden Guide-Scans in buildPalDB() reichern das
        // an (Team-Rollen, kuratierte Fundort-Texte, Kontext-Notizen) und markieren "featured".
        function seedPalDBFromRoster(db) {
            FULL_PAL_ROSTER.forEach(p => {
                addOrMergeEntry(db, p.name, {
                    type: p.types.join('/'),
                    tier: p.tier,
                    stage: p.stage,
                    location: p.location,
                    partnerSkill: p.partnerSkill,
                    skills: p.workSuitability,
                    tags: p.isBoss ? ['Boss'] : [],
                });
            });
        }

        // Builds one master Pal-Datenbank by scanning everything already rendered in this
        // guide (pal-cards, skill tiers, mount tables, endgame/booster tables, aura table) —
        // no separate hand-maintained list, so it can never drift from the rest of the page.
        function buildPalDB() {
            const db = {};

            // 0) Komplettes Roster (288 Pals) als Basis — jeder Pal im Spiel bekommt mindestens
            // Typ/Tier/Phase/Partner-Skill/Arbeits-Eignung/Fundort, unabhängig davon, ob er in
            // diesem Guide als Team-Empfehlung vorkommt.
            seedPalDBFromRoster(db);

            // 1) Full pal-cards (combat + worker) — richest source: type, tier, location, roles/tasks
            document.querySelectorAll('.pal-card').forEach(card => {
                const name = card.querySelector('.pal-name')?.textContent.trim();
                if (!name) return;
                const type = card.querySelector('.pal-type')?.textContent.trim();
                const tierEl = card.querySelector('.pal-tier');
                const tier = tierEl ? tierEl.textContent.trim().toLowerCase() : null;
                const location = card.querySelector('.pal-loc-mini')?.textContent.replace('📍', '').trim();
                const note = card.querySelector('.tooltip-note')?.textContent.trim();
                const roles = Array.from(card.querySelectorAll('.role-tag')).map(r => r.textContent.trim());
                const tasks = Array.from(card.querySelectorAll('.task-tag')).map(t => t.textContent.replace(/\s+/g, ' ').trim());
                const stageSection = card.closest('.stage-early, .stage-mid, .stage-late');
                let stage = null;
                if (stageSection) {
                    if (stageSection.classList.contains('stage-early')) stage = 'early';
                    else if (stageSection.classList.contains('stage-mid')) stage = 'mid';
                    else if (stageSection.classList.contains('stage-late')) stage = 'late';
                }
                const skills = {};
                tasks.forEach(t => {
                    const m = t.match(/^(.+?)\s+(\d+)$/);
                    if (m) skills[m[1]] = parseInt(m[2], 10);
                });
                addOrMergeEntry(db, name, {
                    type, tier, stage, location, note, skills,
                    roles: roles.length ? roles : undefined,
                    tags: [card.querySelector('.role-tag') ? 'Kampf' : 'Worker'],
                    featured: true,
                });
            });

            // 2) Skill-Tier-Listen (Top 15 je Arbeitseignung) — deckt Base-Worker ab, die keine
            // eigene Karte haben. Tag verrät grob die Verfügbarkeit: seed=Grundspiel, boss=Boss/Alpha,
            // dlc=Feybreak-DLC/Postgame.
            Object.entries(SKILL_TIERS).forEach(([skillId, data]) => {
                data.rows.forEach(r => {
                    const [name, level, tag, note] = r;
                    const skillLabel = (data.title || skillId).replace(/^[^\s]+\s/, '');
                    const stage = tag === 'dlc' ? 'late' : (tag === 'seed' ? 'early' : null);
                    addOrMergeEntry(db, name, {
                        stage,
                        skills: { [skillLabel]: level },
                        note: note || null,
                        tags: ['Worker'].concat(tag === 'dlc' ? ['Feybreak-DLC'] : []).concat(tag === 'boss' ? ['Boss/Alpha'] : []),
                        featured: true,
                    });
                });
            });

            // 3) Mount-Tierlisten (Flying/Boden/Wasser) — Tier + grober Mount-Tag
            ['flyingMountsTable', 'groundMountsTable', 'waterMountsTable'].forEach(tableId => {
                const table = document.getElementById(tableId);
                if (!table) return;
                table.querySelectorAll('tbody tr').forEach(tr => {
                    const tierEl = tr.querySelector('.pal-tier');
                    const nameCell = tr.querySelector('td[data-pal]');
                    if (!nameCell) return;
                    const tier = tierEl ? tierEl.textContent.trim().toLowerCase() : null;
                    addOrMergeEntry(db, nameCell.dataset.pal, { tier, tags: ['Mount'], featured: true });
                });
            });

            // 4) Flying-Mount-Progression — hat echte Level-Angaben, liefert die genaueste Stage
            const progTable = document.getElementById('mountProgressionTable');
            if (progTable) {
                progTable.querySelectorAll('tbody tr').forEach(tr => {
                    const cells = tr.querySelectorAll('td');
                    const nameCell = tr.querySelector('td[data-pal]');
                    if (!nameCell || cells.length < 4) return;
                    const levelText = cells[0].textContent.trim();
                    const levelNum = parseInt(levelText, 10);
                    let stage = null;
                    if (!isNaN(levelNum)) stage = levelNum < 25 ? 'early' : (levelNum <= 45 ? 'mid' : 'late');
                    addOrMergeEntry(db, nameCell.dataset.pal, {
                        stage, location: cells[2].textContent.trim(), note: cells[3].textContent.trim(), tags: ['Mount'], featured: true,
                    });
                });
            }

            // 5) Transport-Spezialisten (Basis-intern)
            const transportTable = document.getElementById('transportPalsTable');
            if (transportTable) {
                transportTable.querySelectorAll('tbody tr').forEach(tr => {
                    const nameCell = tr.querySelector('td[data-pal]');
                    if (!nameCell) return;
                    const cells = tr.querySelectorAll('td');
                    addOrMergeEntry(db, nameCell.dataset.pal, {
                        note: cells[2] ? cells[2].textContent.trim() : null,
                        tags: ['Worker', 'Transport-Spezialist'],
                        featured: true,
                    });
                });
            }

            // 6) Endgame-Overpowered + Booster-Pals — Endgame-Meta-Tag, stage=late
            [['endgameOverpoweredTable', 'Endgame-Meta'], ['boosterPalsTable', 'Booster-Pal']].forEach(([tableId, tag]) => {
                const table = document.getElementById(tableId);
                if (!table) return;
                table.querySelectorAll('tbody tr').forEach(tr => {
                    const nameCell = tr.querySelector('td[data-pal]');
                    if (!nameCell) return;
                    const cells = tr.querySelectorAll('td');
                    addOrMergeEntry(db, nameCell.dataset.pal, {
                        stage: 'late', note: cells[1] ? cells[1].textContent.trim() : null, tags: ['Kampf', tag], featured: true,
                    });
                });
            });

            // 7) Aura-Träger (12 Work-Suitability-Aura-Pals)
            const auraTable = document.getElementById('auraTable');
            if (auraTable) {
                auraTable.querySelectorAll('tbody tr').forEach(tr => {
                    const cells = tr.querySelectorAll('td');
                    const nameCell = tr.querySelector('td[data-pal]');
                    if (!nameCell) return;
                    addOrMergeEntry(db, nameCell.dataset.pal, {
                        note: `Aura: ${cells[0].textContent.trim()}`, tags: ['Aura-Träger'], featured: true,
                    });
                });
            }

            return db;
        }

        function palRoleSummary(entry) {
            if (entry.roles.length) return entry.roles.join(', ');
            const skillEntries = Object.entries(entry.skills).sort((a, b) => b[1] - a[1]);
            if (skillEntries.length) return skillEntries.slice(0, 2).map(([sk, lvl]) => `${sk} ${lvl}`).join(', ');
            if (entry.tags.length) return entry.tags.join(', ');
            return '—';
        }

        function palStageBadges(entry) {
            if (!entry.stages.length) return '<span class="pal-stage-badge pal-stage-unknown">—</span>';
            return entry.stages.map(s => `<span class="pal-stage-badge" style="background:${PAL_STAGE_BADGE_COLOR[s]}">${PAL_STAGE_LABEL[s]}</span>`).join(' ');
        }

        let PAL_DB = {};
        let palsStageFilter = 'all';
        let palsFeaturedOnly = false;
        let palFilterOptionsPopulated = false;

        // Label -> Emoji fuer die Arbeits-Eignungs-Chips in der Pals-Tabelle (Labels matchen die
        // Skill-Namen aus SKILL_TIERS/FULL_PAL_ROSTER exakt, damit sort-by-skill konsistent bleibt).
        const WORK_SUIT_EMOJI = {
            'Handiwork': '🔨', 'Mining': '⛏️', 'Gathering': '🌿', 'Transporting': '📦',
            'Kindling': '🔥', 'Watering': '💧', 'Cooling': '❄️', 'Electricity Generation': '⚡',
            'Lumbering': '🪵', 'Planting': '🌱', 'Medicine Production': '💊', 'Farming / Ranch': '🥚',
            'Oil Extraction': '🛢️',
        };

        function togglePalsFeaturedFilter(btnEl) {
            palsFeaturedOnly = !palsFeaturedOnly;
            if (btnEl) btnEl.classList.toggle('active', palsFeaturedOnly);
            filterPalsTable();
        }

        function populatePalFilterOptions() {
            if (palFilterOptionsPopulated) return;
            palFilterOptionsPopulated = true;
            const typeSelect = document.getElementById('palTypeFilter');
            const types = new Set();
            Object.values(PAL_DB).forEach(e => e.types.forEach(t => t.split('/').forEach(tt => types.add(tt.trim()))));
            Array.from(types).sort().forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                typeSelect.appendChild(opt);
            });

            const sortSelect = document.getElementById('palSortSelect');
            const skillNames = new Set();
            Object.values(PAL_DB).forEach(e => Object.keys(e.skills).forEach(s => skillNames.add(s)));
            Array.from(skillNames).sort().forEach(s => {
                const opt = document.createElement('option');
                opt.value = 'skill:' + s;
                opt.textContent = '📊 Fähigkeit: ' + s;
                sortSelect.appendChild(opt);
            });
        }

        function setPalsStageFilter(stage, btnEl) {
            palsStageFilter = stage;
            document.querySelectorAll('#pals .pals-stage-chips .filter-chip').forEach(b => b.classList.remove('active'));
            if (btnEl) btnEl.classList.add('active');
            filterPalsTable();
        }

        function filterPalsTable() {
            renderPalsTable();
        }

        const TIER_SORT_ORDER = { s: 0, a: 1, b: 2, c: 3 };

        function renderPalsTable() {
            populatePalFilterOptions();
            const search = (document.getElementById('palSearchInput')?.value || '').toLowerCase().trim();
            const typeFilter = document.getElementById('palTypeFilter')?.value || 'all';
            const sortKey = document.getElementById('palSortSelect')?.value || 'name';

            let entries = Object.values(PAL_DB);
            if (search) entries = entries.filter(e => e.name.toLowerCase().includes(search));
            if (typeFilter !== 'all') entries = entries.filter(e => e.types.some(t => t.split('/').map(x => x.trim()).includes(typeFilter)));
            if (palsStageFilter !== 'all') entries = entries.filter(e => e.stages.includes(palsStageFilter));
            if (palsFeaturedOnly) entries = entries.filter(e => e.featured);

            if (sortKey === 'tier') {
                entries.sort((a, b) => (TIER_SORT_ORDER[a.tier] ?? 9) - (TIER_SORT_ORDER[b.tier] ?? 9) || a.name.localeCompare(b.name));
            } else if (sortKey.startsWith('skill:')) {
                const sk = sortKey.slice(6);
                entries.sort((a, b) => (b.skills[sk] || 0) - (a.skills[sk] || 0) || a.name.localeCompare(b.name));
            } else {
                entries.sort((a, b) => a.name.localeCompare(b.name));
            }

            const body = document.getElementById('palsTableBody');
            const countEl = document.getElementById('palsCount');
            if (countEl) countEl.textContent = `${entries.length} von ${Object.keys(PAL_DB).length} Pals`;
            if (!body) return;

            body.innerHTML = entries.map(e => {
                const tierHtml = e.tier ? `<span class="pal-tier ${e.tier}">${e.tier.toUpperCase()}</span>` : '—';
                const featuredMark = e.featured ? '<span class="pal-featured-star" title="Wird im Guide als Team-Pick oder Base-Worker empfohlen">⭐</span> ' : '';
                const suitEntries = Object.entries(e.skills).sort((a, b) => b[1] - a[1]);
                const suitHtml = suitEntries.length
                    ? suitEntries.map(([sk, lvl]) => `<span class="suit-chip${sortKey === 'skill:' + sk ? ' suit-current' : ''}">${WORK_SUIT_EMOJI[sk] || '⭐'} ${lvl}</span>`).join('')
                    : '—';
                const partnerHtml = e.partnerSkill ? e.partnerSkill : '—';
                const roleNote = e.roles.length ? `<div class="pal-role-note">${palRoleSummary(e)}</div>` : '';
                return `
                <tr>
                    <td class="hb-name" data-pal="${e.name}">${featuredMark}${e.name}</td>
                    <td>${e.types.join(' / ') || '—'}</td>
                    <td>${tierHtml}</td>
                    <td>${palStageBadges(e)}</td>
                    <td class="pal-partner-skill">${partnerHtml}</td>
                    <td><div class="suit-chips">${suitHtml}</div>${roleNote}</td>
                    <td>${e.location || (e.note ? e.note : '—')}</td>
                </tr>`;
            }).join('');
            applyPalThumbs();
        }

        function renderSkillTable(skillId) {
            const data = SKILL_TIERS[skillId];
            const host = document.getElementById('skillTableHost');
            const rowsHtml = data.rows.map((r, i) => {
                const known = PAL_SUITABILITY[r[0]] || { [skillId]: r[1] };
                const suitHtml = Object.entries(known)
                    .sort((a, b) => b[1] - a[1])
                    .map(([sk, lvl]) => `<span class="suit-chip${sk === skillId ? ' suit-current' : ''}">${SKILL_EMOJI[sk] || '⭐'} ${lvl}</span>`)
                    .join('');
                return `
                <tr>
                    <td class="hb-name">#${i + 1}</td>
                    <td class="hb-name"><div class="hb-name-cell"><img class="pal-thumb" src="${palIconUrl(r[0], 28)}" alt="${r[0]}" onerror="this.style.display='none'">${TAG_ICON[r[2]]} ${r[0]}</div></td>
                    <td><div class="suit-chips">${suitHtml}</div></td>
                    <td>${r[3] || '—'}</td>
                </tr>`;
            }).join('');
            host.innerHTML = `
                <div class="hb-table-wrap">
                    <table class="hb-table">
                        <thead><tr><th>Rang</th><th>Pal</th><th>Eignung (alle bekannten)</th><th>Hinweis</th></tr></thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
                <p class="suit-caveat">ℹ️ Zeigt alle Eignungen, in denen dieses Pal irgendwo in unseren Top-15-Listen auftaucht (aktueller Skill hervorgehoben). Pals können zusätzlich niedrigere Eignungen haben, die hier nicht erfasst sind.</p>`;
        }

        function switchSkillPanel(skillId, btnEl) {
            document.querySelectorAll('#skillSubnav .subnav-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
            renderSkillTable(skillId);
        }

        function setTeamsTheme(theme, btnEl) {
            document.querySelectorAll('#teamsThemeTable .theme-cell').forEach(c => c.classList.remove('active'));
            if (btnEl) btnEl.classList.add('active');
            document.querySelectorAll('#teams .theme-panel').forEach(p => p.style.display = 'none');
            const panel = document.getElementById('theme-' + theme);
            if (panel) panel.style.display = 'block';
        }


        function getNextTower(selected) {
            if (selected.boss) return selected;
            const idx = QUESTS.indexOf(selected);
            return QUESTS.slice(idx + 1).find(q => q.boss) || null;
        }

        function loadWegweiserState() {
            const fallback = { doneIds: ['tutorial', 'turm1', 'turm2'], selectedId: 'turm3' };
            try {
                const raw = localStorage.getItem('palworld-wegweiser-state');
                if (!raw) return fallback;
                const parsed = JSON.parse(raw);
                if (!parsed || !Array.isArray(parsed.doneIds)) return fallback;
                return parsed;
            } catch (e) {
                return fallback;
            }
        }

        function saveWegweiserState(state) {
            try {
                localStorage.setItem('palworld-wegweiser-state', JSON.stringify(state));
            } catch (e) { /* private mode / storage unavailable – state just won't persist */ }
        }

        let wgState = loadWegweiserState();

        function renderWegweiser() {
            const track = document.getElementById('questTrack');
            track.innerHTML = QUESTS.map(q => {
                const isDone = wgState.doneIds.includes(q.id);
                const isSelected = wgState.selectedId === q.id;
                const icon = isDone ? '✓' : (isSelected ? '●' : '○');
                const cls = ['quest-phase', isDone ? 'done' : '', isSelected ? 'selected current' : ''].filter(Boolean).join(' ');
                return `<div class="${cls}" onclick="selectQuest('${q.id}')">
                    <span class="qp-icon" title="Als erledigt markieren" onclick="event.stopPropagation(); toggleQuestDone('${q.id}')">${icon}</span>
                    <span class="qp-body qp-label">${q.title}${q.sub ? `<br><small>${q.sub}</small>` : ''}</span>
                </div>`;
            }).join('');

            const active = QUESTS.find(q => q.id === wgState.selectedId) || QUESTS[0];
            const nextTower = getNextTower(active);
            const chips = arr => arr.map(p => `<span class="synergy-chip">${p}</span>`).join('');

            const towerHtml = nextTower && nextTower.boss
                ? `<div class="wg-boss-name">${nextTower.boss.name}</div>
                   <div class="wg-boss-meta">Lvl ${nextTower.boss.level} · ${nextTower.boss.type}</div>
                   <div class="wg-boss-weak">Schwach gegen: <strong>${nextTower.boss.weak}</strong></div>`
                : `<p class="wg-card-note">Kein weiterer Turm mehr offen – Postgame-Content.</p>`;

            document.getElementById('questDetailHost').innerHTML = `
                <p class="qd-jump-hint">💡 Symbol links = abhaken. Name anklicken = zu dieser Quest springen.</p>
                <div class="wg-dashboard">
                    <div class="wg-card">
                        <div class="wg-card-title">⚔️ Kampf-Team</div>
                        <div class="synergy-pals">${chips(active.combatTeam)}</div>
                        <p class="wg-card-note">${active.combatNote}</p>
                        <button class="wg-jump-btn" onclick="switchTab('teams', 'kampf-synergie')">→ Team-Synergien ansehen</button>
                    </div>
                    <div class="wg-card">
                        <div class="wg-card-title">🏭 Base-Team</div>
                        <div class="synergy-pals">${chips(active.baseTeam)}</div>
                        <p class="wg-card-note">${active.baseNote}</p>
                        <button class="wg-jump-btn" onclick="switchTab('teams', 'base-stage')">→ Base Worker ansehen</button>
                    </div>
                    <div class="wg-card">
                        <div class="wg-card-title">📋 Nächste Schritte</div>
                        <ul class="wg-steps">${active.nextSteps.map(s => `<li>${s}</li>`).join('')}</ul>
                    </div>
                    <div class="wg-card">
                        <div class="wg-card-title">🗼 Nächster Turm</div>
                        ${towerHtml}
                    </div>
                </div>`;
            applySynergyChipIcons();
            enableChipTooltips();
        }

        function selectQuest(id) {
            wgState.selectedId = id;
            saveWegweiserState(wgState);
            renderWegweiser();
        }

        function toggleQuestDone(id) {
            const i = wgState.doneIds.indexOf(id);
            if (i >= 0) {
                wgState.doneIds.splice(i, 1);
            } else {
                wgState.doneIds.push(id);
                const idx = QUESTS.findIndex(q => q.id === id);
                const next = QUESTS[idx + 1];
                if (next) wgState.selectedId = next.id;
            }
            saveWegweiserState(wgState);
            renderWegweiser();
        }

        function resetWegweiser() {
            wgState = { doneIds: [], selectedId: QUESTS[0].id };
            saveWegweiserState(wgState);
            renderWegweiser();
        }

        let currentLocationLayer = 'base';
        let currentFilter = 'all';
        const STAGE_COLOR = { early: '#3B82F6', mid: '#F97316', late: '#8B5CF6', safe: '#10B981' };
        const RESOURCE_TIER_COLOR = { s: '#EF4444', a: '#F97316' };

        function currentLocationData() {
            return currentLocationLayer === 'base' ? BASES : RESOURCES;
        }

        function renderLocationList(filter) {
            const list = document.getElementById('baseList');
            const data = currentLocationData();
            const items = currentLocationLayer === 'base'
                ? (filter === 'all' ? data : data.filter(b => b.stage === filter))
                : (filter === 'all' ? data : data.filter(r => r.tier === filter));

            list.innerHTML = items.map(item => {
                if (currentLocationLayer === 'base') {
                    return `
                <div class="base-card stage-${item.stage}" data-id="${item.id}" onclick="selectLocation('${item.id}')">
                    <div class="base-card-header">
                        <div class="base-card-name">${item.name}</div>
                        <div class="base-card-coords">${item.x}, ${item.y}</div>
                    </div>
                    <div class="base-card-stage">${STAGE_LABEL[item.stage]}</div>
                    <div class="base-card-resources"><strong>Ressourcen:</strong> ${item.resources}</div>
                    <div class="base-card-note">${item.note}</div>
                </div>`;
                }
                const img = item.image ? `<img src="${RESOURCE_IMAGES[item.image]}" alt="${item.name}" class="base-card-image">` : '';
                const tierLabel = item.tier === 's' ? 'S-Tier' : 'A-Tier';
                return `
                <div class="base-card tier-${item.tier}" data-id="${item.id}" onclick="selectLocation('${item.id}')">
                    ${img}
                    <div class="base-card-header">
                        <div class="base-card-name">${item.name}</div>
                        <div class="base-card-coords">${item.x}, ${item.y}</div>
                    </div>
                    <div class="base-card-stage"><span class="pal-tier ${item.tier}">${item.tier.toUpperCase()}</span>&nbsp;${tierLabel} · ${item.resource}</div>
                    <div class="base-card-note">${item.note}</div>
                </div>`;
            }).join('');
        }

        function filterLocations(filter, btnEl) {
            currentFilter = filter;
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            btnEl.classList.add('active');

            document.querySelectorAll('.photo-pin').forEach(pin => {
                const key = currentLocationLayer === 'base' ? pin.dataset.stage : pin.dataset.tier;
                const match = filter === 'all' || key === filter;
                pin.classList.toggle('dimmed', !match);
            });

            renderLocationList(filter);
        }

        function selectLocation(id) {
            document.querySelectorAll('.photo-pin').forEach(p => p.classList.toggle('selected', p.dataset.id === id));
            document.querySelectorAll('.base-card').forEach(c => {
                const active = c.dataset.id === id;
                c.classList.toggle('selected', active);
                if (active) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        function setLocationLayer(layer, btnEl) {
            currentLocationLayer = layer;
            currentFilter = 'all';
            btnEl.parentElement.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');

            const filtersEl = document.getElementById('mapFilters');
            const legendEl = document.getElementById('mapLegend');
            const noteEl = document.getElementById('unplottableNote');

            if (layer === 'base') {
                filtersEl.innerHTML = `
                    <button class="filter-chip active" data-filter="all" onclick="filterLocations('all', this)">Alle (${BASES.length})</button>
                    <button class="filter-chip" data-filter="early" onclick="filterLocations('early', this)">🔵 Early Game</button>
                    <button class="filter-chip" data-filter="mid" onclick="filterLocations('mid', this)">🟠 Mid Game</button>
                    <button class="filter-chip" data-filter="late" onclick="filterLocations('late', this)">🟣 Late Game</button>
                    <button class="filter-chip" data-filter="safe" onclick="filterLocations('safe', this)">🟢 Raid-sicher</button>`;
                legendEl.innerHTML = `
                    <div class="legend-item"><span class="legend-dot stage-early"></span> Early Game</div>
                    <div class="legend-item"><span class="legend-dot stage-mid"></span> Mid Game</div>
                    <div class="legend-item"><span class="legend-dot stage-late"></span> Late Game</div>
                    <div class="legend-item"><span class="legend-dot stage-safe"></span> Raid-sicher</div>`;
                noteEl.style.display = 'none';
            } else {
                filtersEl.innerHTML = `
                    <button class="filter-chip active" data-filter="all" onclick="filterLocations('all', this)">Alle (${RESOURCES.length})</button>
                    <button class="filter-chip" data-filter="s" onclick="filterLocations('s', this)">⭐ S-Tier</button>
                    <button class="filter-chip" data-filter="a" onclick="filterLocations('a', this)">🅰️ A-Tier</button>`;
                legendEl.innerHTML = `
                    <div class="legend-item"><span class="legend-dot" style="background:#EF4444;"></span> S-Tier</div>
                    <div class="legend-item"><span class="legend-dot" style="background:#F97316;"></span> A-Tier</div>`;
                noteEl.style.display = 'block';
            }

            renderPhotoPins();
            renderLocationList('all');
        }

        // Original, non-infringing per-pal visuals: a colored initial-badge (by element type)
        // plus a link out to the real wiki page. No copyrighted game art is fetched or embedded.
        const TYPE_COLOR = {
            Normal: '#9CA3AF', Fire: '#F97316', Water: '#0EA5E9', Grass: '#22C55E',
            Electric: '#EAB308', Ice: '#67E8F9', Ground: '#A16207', Dark: '#6B21A8',
            Dragon: '#7C3AED', Neutral: '#94A3B8', Bug: '#84CC16',
        };

        // Small icon (wiki "_icon.png" thumbnail) for avatars/table rows.
        function palIconUrl(name, size) {
            const file = `${name}_icon.png`;
            return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
        }

        // Full-resolution artwork, shown only on hover (inside the tooltip).
        function palImageUrl(name) {
            return `https://palworld.wiki.gg/wiki/Special:FilePath/${encodeURIComponent(name)}.png`;
        }

        function applyPalVisuals() {
            document.querySelectorAll('.pal-card').forEach(card => {
                if (card.dataset.visualsApplied) return;
                const nameEl = card.querySelector('.pal-name');
                const typeEl = card.querySelector('.pal-type');
                const header = card.querySelector('.pal-header');
                if (!nameEl || !typeEl || !header) return;

                const name = nameEl.textContent.trim();
                const primaryType = typeEl.textContent.split('/')[0].trim();
                const color = TYPE_COLOR[primaryType] || '#94A3B8';
                const letter = name.charAt(0).toUpperCase();

                // Build avatar circle: small pal icon, falls back to colored letter on error
                const nameBlock = nameEl.parentElement;
                if (nameBlock && nameBlock.parentNode === header) {
                    const wrap = document.createElement('div');
                    wrap.className = 'pal-header-main';

                    const avatar = document.createElement('div');
                    avatar.className = 'pal-avatar';
                    avatar.style.background = color;
                    avatar.textContent = letter;

                    const avImg = document.createElement('img');
                    avImg.alt = name;
                    avImg.src = palIconUrl(name, 40);
                    avImg.onerror = function() {
                        // Fall back to letter-only avatar
                        this.remove();
                        avatar.textContent = letter;
                    };
                    avatar.textContent = '';
                    avatar.appendChild(avImg);

                    nameBlock.parentNode.insertBefore(wrap, nameBlock);
                    wrap.appendChild(avatar);
                    wrap.appendChild(nameBlock);
                }

                const tooltip = card.querySelector('.pal-tooltip');
                if (tooltip) {
                    // Big artwork, revealed only when the card (tooltip) is hovered
                    const bigImg = document.createElement('img');
                    bigImg.className = 'pal-image';
                    bigImg.alt = name;
                    bigImg.src = palImageUrl(name);
                    bigImg.onerror = function() { this.style.display = 'none'; };
                    tooltip.insertBefore(bigImg, tooltip.firstChild);

                    const link = document.createElement('a');
                    link.className = 'pal-wiki-link';
                    link.href = 'https://palworld.wiki.gg/wiki/Special:Search?search=' + encodeURIComponent(name);
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = '🔗 Echtes Artwork auf dem Wiki ansehen';
                    tooltip.appendChild(link);
                }
                card.dataset.visualsApplied = 'true';
            });
        }

        function applyPalThumbs() {
            document.querySelectorAll('td[data-pal]').forEach(td => {
                if (td.dataset.thumbApplied) return;
                const name = td.dataset.pal;
                const img = document.createElement('img');
                img.className = 'pal-thumb';
                img.alt = name;
                img.src = palIconUrl(name, 28);
                img.onerror = function() { this.style.display = 'none'; };
                td.insertBefore(img, td.firstChild);
                td.dataset.thumbApplied = 'true';
            });
        }

        // Best-effort: strip trailing annotations like " (Mining)" or gender marks
        // so chips such as "Anubis (Mining)" or "Digtoise ♀" still resolve to a real Pal name.
        function cleanChipName(raw) {
            return raw
                .replace(/\s*\([^)]*\)\s*$/, '')
                .replace(/[♂♀]/g, '')
                .replace(/\s*\+\d+\s*weitere.*$/i, '')
                .trim();
        }

        // .stage-team-chip elements nest the role label in a child <span class="stc-role">
        // (e.g. "Cattiva <span class=\"stc-role\">Allrounder</span>"), so plain textContent
        // would pull in the role text too. Strip known child elements before cleaning.
        function getChipPalName(chip) {
            const clone = chip.cloneNode(true);
            clone.querySelectorAll('.stc-role, .chip-icon').forEach(el => el.remove());
            return cleanChipName(clone.textContent.trim());
        }

        function applySynergyChipIcons() {
            document.querySelectorAll('.synergy-chip, .stage-team-chip').forEach(chip => {
                if (chip.dataset.iconApplied) return;
                chip.dataset.iconApplied = 'true';
                const name = getChipPalName(chip);
                // Skip chips that clearly aren't a single Pal name (combos, passives, "+N weitere")
                if (!name || /[\/×]| und |weitere/i.test(name)) return;
                const img = document.createElement('img');
                img.className = 'chip-icon';
                img.alt = name;
                img.src = palIconUrl(name, 18);
                img.onerror = function() { this.remove(); };
                chip.insertBefore(img, chip.firstChild);
            });
        }

        // Floating hover tooltip (image + type/tier/stage + Fundort) for any chip we can
        // resolve against PAL_DB — reuses the same name-cleaning as the icon injection above.
        function enableChipTooltips() {
            const tooltip = document.getElementById('chipTooltip');
            if (!tooltip) return;
            document.querySelectorAll('.stage-team-chip, .synergy-chip').forEach(chip => {
                if (chip.dataset.tooltipEnabled) return;
                chip.dataset.tooltipEnabled = 'true';

                chip.addEventListener('mouseenter', () => {
                    const name = getChipPalName(chip);
                    if (!name) return;
                    const entry = PAL_DB[name];
                    const metaParts = [];
                    if (entry && entry.types.length) metaParts.push(entry.types.join(' / '));
                    if (entry && entry.tier) metaParts.push('Tier ' + entry.tier.toUpperCase());
                    const stagesHtml = entry ? palStageBadges(entry) : '';
                    const loc = entry ? (entry.location || entry.note) : null;
                    tooltip.innerHTML = `
                        <img class="chip-tooltip-img" src="${palImageUrl(name)}" alt="${name}" onerror="this.style.display='none'">
                        <div class="chip-tooltip-name">${name}</div>
                        <div class="chip-tooltip-meta">${metaParts.length ? metaParts.join(' · ') : 'Keine weiteren Daten hinterlegt'}</div>
                        ${entry && entry.stages.length ? `<div class="chip-tooltip-meta">${stagesHtml}</div>` : ''}
                        ${loc ? `<div class="chip-tooltip-loc">📍 ${loc}</div>` : ''}
                    `;
                    tooltip.classList.add('visible');
                });

                chip.addEventListener('mousemove', (ev) => {
                    const offset = 16;
                    let x = ev.clientX + offset;
                    let y = ev.clientY + offset;
                    const rect = tooltip.getBoundingClientRect();
                    if (x + rect.width > window.innerWidth) x = ev.clientX - rect.width - offset;
                    if (y + rect.height > window.innerHeight) y = ev.clientY - rect.height - offset;
                    tooltip.style.left = x + 'px';
                    tooltip.style.top = y + 'px';
                });

                chip.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
            });
        }

        renderPhotoPins();
        renderLocationList('all');
        renderWegweiser();
        applyPalVisuals();
        applyPalThumbs();
        applySynergyChipIcons();
        PAL_DB = buildPalDB();
        renderPalsTable();
        enableChipTooltips();

        function toggleStageSection(headerEl) {
            const grid = headerEl.parentElement.querySelector('.pals-grid');
            if (!grid) return;
            grid.classList.toggle('collapsed');
            headerEl.classList.toggle('is-collapsed');
            const box = headerEl.parentElement.querySelector('.stage-team-box');
            if (box) box.classList.toggle('collapsed-hide');
        }

        function renderPhotoPins() {
            const layer = document.getElementById('photoPinLayer');
            const data = currentLocationData();
            layer.innerHTML = data.map(item => {
                const leftPct = ((item.x + 1000) / 2000 * 100).toFixed(1);
                const topPct = ((1000 - item.y) / 2000 * 100).toFixed(1);
                if (currentLocationLayer === 'base') {
                    const color = STAGE_COLOR[item.stage];
                    return `<div class="photo-pin" data-id="${item.id}" data-stage="${item.stage}" onclick="selectLocation('${item.id}')" style="left:${leftPct}%; top:${topPct}%; background:${color};" data-label="${item.name}"></div>`;
                }
                const color = RESOURCE_TIER_COLOR[item.tier];
                return `<div class="photo-pin" data-id="${item.id}" data-tier="${item.tier}" onclick="selectLocation('${item.id}')" style="left:${leftPct}%; top:${topPct}%; background:${color};" data-label="${item.name}"></div>`;
            }).join('');
        }

        function switchSubPanel(panelId, btnEl) {
            document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.subnav-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(panelId).classList.add('active');
            btnEl.classList.add('active');
        }

        function switchTab(tabName, theme) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Remove active class from all buttons
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName).classList.add('active');

            // Add active class to the matching nav button (fallback to the clicked element)
            const navBtn = document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}'"]`);
            if (navBtn) {
                navBtn.classList.add('active');
            } else if (typeof event !== 'undefined' && event && event.target) {
                event.target.classList.add('active');
            }

            if (tabName === 'teams' && theme) {
                const cell = document.querySelector(`#teamsThemeTable [data-theme="${theme}"]`);
                setTeamsTheme(theme, cell);
            }
        }
