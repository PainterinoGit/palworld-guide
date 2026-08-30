// Palworld Guide — application logic (rendering, tabs, interactions)

        const PAL_STAGE_LABEL = { early: 'Early', mid: 'Mid', late: 'Late' };
        const PAL_STAGE_BADGE_COLOR = { early: '#3B82F6', mid: '#F97316', late: '#8B5CF6' };

        function buildPalDB() {
            const guideData = window.GuideData;
            const roster = typeof FULL_PAL_ROSTER !== 'undefined' ? FULL_PAL_ROSTER : [];
            if (guideData?.buildPalDatabase) {
                const database = guideData.buildPalDatabase(roster, guideData.PALS || [], guideData.META_SOURCES || []);
                if (Object.keys(database).length) return database;
            }
            return buildFallbackPalDB(roster);
        }

        function buildFallbackPalDB(roster) {
            return Object.fromEntries((Array.isArray(roster) ? roster : []).filter(pal => pal?.name).map(pal => [pal.name, {
                id: pal.id || pal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: pal.name,
                aliases: [], image: pal.name,
                types: Array.isArray(pal.types) ? pal.types : [],
                tier: pal.tier || null, stages: pal.stage ? [pal.stage] : [],
                partnerSkill: pal.partnerSkill || null,
                workSuitability: pal.workSuitability || {}, location: pal.location || null,
                roles: [], contexts: {}, alternatives: [], upgradeFromIds: [], upgradeToIds: [],
                active: false, featured: false, sourceStatus: null,
            }]));
        }

        function palRoleSummary(entry) {
            if (entry.roles.length) return entry.roles.join(', ');
            const skillEntries = Object.entries(entry.workSuitability || {}).sort((a, b) => b[1] - a[1]);
            if (skillEntries.length) return skillEntries.slice(0, 2).map(([sk, lvl]) => `${sk} ${lvl}`).join(', ');
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

        // Labels für die Arbeits-Eignungs-Chips stammen aus der normalisierten Datenbank.
        const WORK_SUIT_EMOJI = {
            'Handiwork': '🔨', 'Mining': '⛏️', 'Gathering': '🌿', 'Transporting': '📦',
            'Kindling': '🔥', 'Watering': '💧', 'Cooling': '❄️', 'Electricity Generation': '⚡',
            'Lumbering': '🪵', 'Planting': '🌱', 'Medicine Production': '💊', 'Farming / Ranch': '🥚',
            'Oil Extraction': '🛢️',
        };

        function escapeHtml(value) {
            return String(value ?? '').replace(/[&<>'"]/g, character => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
            }[character]));
        }

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
            Object.values(PAL_DB).forEach(e => Object.keys(e.workSuitability || {}).forEach(s => skillNames.add(s)));
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

        let palsGoalFilter = 'all';
        function setPalGoalFilter(goal, btnEl) {
            palsGoalFilter = goal;
            document.querySelectorAll('#pals [data-goal]').forEach(button => button.classList.toggle('active', button === btnEl));
            filterPalsTable();
        }

        function palMatchesGoal(entry, goal) {
            return window.GuideData?.matchesPalGoal?.(entry, goal) ?? goal === 'all';
        }

        function filterPalsTable() {
            renderPalsTable();
        }

        const TIER_SORT_ORDER = { s: 0, a: 1, b: 2, c: 3 };

        function palUsageReason(entry, goal = palsGoalFilter) {
            const details = window.GuideData?.getPalDetails?.(entry, goal);
            if (!details?.reason) return 'Neutrale Referenz – keine aktuelle Meta-Empfehlung hinterlegt.';
            return `<strong>Warum:</strong> ${escapeHtml(details.reason)}<br><strong>Beste Nutzung:</strong> ${escapeHtml(details.bestFor)}`;
        }

        function palSourceStatusHtml(entry) {
            if (!entry.active || !entry.sourceStatus) {
                return '<span class="pal-source-status pal-source-neutral">Neutrale Referenz</span>';
            }
            const links = entry.sourceStatus.sources
                .filter(source => source.url)
                .map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(source.title || source.id)}">Quelle</a>`)
                .join(' · ');
            return `<div class="pal-source-status"><strong>${escapeHtml(entry.sourceStatus.label || 'Aktuelle Meta')}</strong>${links ? `<span class="pal-source-links">${links}</span>` : ''}</div>`;
        }

        function palDetailsHtml(entry, goal) {
            return '';
        }

        function captureMapPreview(location = '') {
            const text = String(location).toLowerCase();
            const zones = [
                [/windswept|plateau|starting|grass|rayne/, 55, 53],
                [/desert|dunes|sand/, 69, 39],
                [/volcan|obsidian/, 31, 67],
                [/snow|frost|astral|glacial/, 51, 20],
                [/sakurajima|island|coast|sea/, 75, 67],
                [/feybreak|world tree|sky island/, 84, 30],
            ];
            const match = zones.find(([pattern]) => pattern.test(text));
            if (match) return { left: match[1], top: match[2], approximate: true };
            let hash = 0;
            for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 997;
            return { left: 25 + hash % 55, top: 22 + (hash * 7) % 52, approximate: true };
        }

        function positionPalCaptureTooltip(trigger) {
            const tooltip = document.getElementById('palCaptureTooltip');
            if (!tooltip?.classList.contains('visible')) return;
            const rect = tooltip.getBoundingClientRect();
            const triggerRect = trigger?.getBoundingClientRect();
            const offset = 14;
            let x = triggerRect ? triggerRect.right + offset : 24;
            let y = triggerRect ? triggerRect.top : 24;
            if (x + rect.width > window.innerWidth - 8) x = (triggerRect?.left || window.innerWidth) - rect.width - offset;
            if (y + rect.height > window.innerHeight - 8) y = window.innerHeight - rect.height - 8;
            tooltip.style.left = `${Math.max(8, x)}px`;
            tooltip.style.top = `${Math.max(8, y)}px`;
        }

        function showPalCaptureTooltip(entry, trigger) {
            const tooltip = document.getElementById('palCaptureTooltip');
            const details = window.GuideData?.getPalDetails?.(entry, palsGoalFilter) || {};
            const location = details.location || entry.location || 'Fundort nicht dokumentiert';
            const point = captureMapPreview(location);
            const workSkills = Object.entries(entry.workSuitability || {})
                .sort(([, levelA], [, levelB]) => levelB - levelA)
                .map(([skill, level]) => `<span class="pal-work-skill">${WORK_SUIT_EMOJI[skill] || '🔧'} ${escapeHtml(skill)} ${escapeHtml(level)}</span>`)
                .join('');
            tooltip.innerHTML = `<div class="pal-capture-map" role="img" aria-label="Ungefähre Fangregion für ${escapeHtml(entry.name)}"><span class="pal-capture-dot" style="left:${point.left}%;top:${point.top}%"></span></div><div class="pal-capture-copy"><strong>${escapeHtml(entry.name)}</strong><span>🧬 ${escapeHtml(entry.types?.join(' / ') || 'Typ unbekannt')} · Tier ${escapeHtml(entry.tier?.toUpperCase() || '—')}</span><span>📍 ${escapeHtml(location)}</span><div class="pal-work-skills"><b>Arbeitseignungen</b>${workSkills || '<span class="pal-work-skill">Keine Angaben</span>'}</div><div class="pal-partner-skill"><b>Partnerfähigkeit</b><span>${escapeHtml(entry.partnerSkill || 'Keine Angabe')}</span></div><small>Ungefähre Fangregion – für exakte Spawns die Fundortdaten öffnen.</small></div>`;
            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');
            positionPalCaptureTooltip(trigger);
        }

        function findBaseWorkerPal(name) {
            const entry = Object.values(PAL_DB).find(item => item.name === name);
            if (entry) return entry;
            const pal = window.GuideData?.PALS?.find(item => item.name === name);
            if (!pal) return null;
            return { ...pal, stages: pal.stage ? [pal.stage] : [], tier: pal.tier || null, types: pal.types || [], workSuitability: pal.workSuitability || {} };
        }

        function enableBaseWorkerTooltips() {
            const host = document.getElementById('basePlanHost');
            if (!host || host.dataset.workerTooltipsEnabled) return;
            host.dataset.workerTooltipsEnabled = 'true';
            host.addEventListener('mouseover', event => {
                const trigger = event.target.closest('.base-worker-pal[data-pal-name]');
                if (!trigger || trigger.contains(event.relatedTarget)) return;
                const entry = findBaseWorkerPal(trigger.dataset.palName);
                if (entry) showPalCaptureTooltip(entry, trigger);
            });
            host.addEventListener('mouseout', event => {
                const trigger = event.target.closest('.base-worker-pal[data-pal-name]');
                if (trigger && !trigger.contains(event.relatedTarget)) hidePalCaptureTooltip();
            });
            host.addEventListener('focusin', event => {
                const trigger = event.target.closest('.base-worker-pal[data-pal-name]');
                const entry = trigger && findBaseWorkerPal(trigger.dataset.palName);
                if (entry) showPalCaptureTooltip(entry, trigger);
            });
            host.addEventListener('focusout', () => hidePalCaptureTooltip());
        }

        function hidePalCaptureTooltip() {
            const tooltip = document.getElementById('palCaptureTooltip');
            if (!tooltip) return;
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
        }

        function renderPalsTable() {
            populatePalFilterOptions();
            const search = (document.getElementById('palSearchInput')?.value || '').toLowerCase().trim();
            const typeFilter = document.getElementById('palTypeFilter')?.value || 'all';
            const sortKey = document.getElementById('palSortSelect')?.value || 'name';

            let entries = Object.values(PAL_DB);
            if (search) entries = entries.filter(e => [e.name, ...(e.aliases || [])].some(name => name.toLowerCase().includes(search)));
            if (typeFilter !== 'all') entries = entries.filter(e => e.types.some(t => t.split('/').map(x => x.trim()).includes(typeFilter)));
            if (palsStageFilter !== 'all') entries = entries.filter(e => e.stages.includes(palsStageFilter));
            if (palsFeaturedOnly) entries = entries.filter(e => e.featured);
            entries = entries.filter(e => palMatchesGoal(e, palsGoalFilter));

            if (sortKey === 'tier') {
                entries.sort((a, b) => (TIER_SORT_ORDER[a.tier] ?? 9) - (TIER_SORT_ORDER[b.tier] ?? 9) || a.name.localeCompare(b.name));
            } else if (sortKey.startsWith('skill:')) {
                const sk = sortKey.slice(6);
                entries.sort((a, b) => (b.workSuitability?.[sk] || 0) - (a.workSuitability?.[sk] || 0) || a.name.localeCompare(b.name));
            } else {
                entries.sort((a, b) => a.name.localeCompare(b.name));
            }

            const body = document.getElementById('palsTableBody');
            const countEl = document.getElementById('palsCount');
            if (countEl) countEl.textContent = `${entries.length} von ${Object.keys(PAL_DB).length} Pals`;
            if (!body) return;

            body.innerHTML = entries.map(e => {
                const tierHtml = e.tier ? `<span class="pal-tier ${e.tier}">${e.tier.toUpperCase()}</span>` : '—';
                const featuredMark = e.featured ? '<span class="pal-featured-star" title="Aktuelle Meta-Empfehlung">⭐</span> ' : '';
                const suitEntries = Object.entries(e.workSuitability || {}).sort((a, b) => b[1] - a[1]);
                const suitHtml = suitEntries.length
                    ? suitEntries.map(([sk, lvl]) => `<span class="suit-chip${sortKey === 'skill:' + sk ? ' suit-current' : ''}">${WORK_SUIT_EMOJI[sk] || '⭐'} ${lvl}</span>`).join('')
                    : '—';
                const partnerHtml = e.partnerSkill ? escapeHtml(e.partnerSkill) : '—';
                const roleNote = e.roles.length ? `<div class="pal-role-note">${escapeHtml(palRoleSummary(e))}</div>` : '';
                const usageReason = palUsageReason(e);
                const imageName = window.GuideData?.resolvePalImageName?.(PAL_DB, e.name) || e.image || e.name;
                const detailId = `pal-detail-${e.id}`;
                return `
                <tr>
                    <td class="hb-name pal-name-cell" data-pal="${escapeHtml(e.name)}" data-pal-id="${escapeHtml(e.id)}">
                        <button class="pal-detail-trigger" type="button" aria-expanded="false" aria-controls="${escapeHtml(detailId)}">
                            <img class="pal-db-thumb" src="${escapeHtml(palIconUrl(imageName, 32))}" alt="" loading="lazy" onerror="this.style.display='none'">
                            <span>${featuredMark}${escapeHtml(e.name)}</span>
                        </button>
                        ${palDetailsHtml(e, palsGoalFilter)}
                    </td>
                    <td>${escapeHtml(e.types.join(' / ') || '—')}</td>
                    <td>${tierHtml}</td>
                    <td>${palStageBadges(e)}</td>
                    <td class="pal-partner-skill">${partnerHtml}</td>
                    <td><div class="suit-chips">${suitHtml}</div>${roleNote}</td>
                    <td class="pal-usage-reason">${usageReason}</td>
                    <td>${escapeHtml(e.location || '—')}</td>
                </tr>`;
            }).join('');
            applyPalThumbs();
        }

        function switchPalPanel(panelId, btnEl) {
            document.querySelectorAll('[data-pal-panel]').forEach(button => button.classList.toggle('active', button === btnEl));
            document.querySelectorAll('.pal-panel').forEach(panel => panel.classList.toggle('active', panel.id === panelId));
            if (panelId === 'jobTierlistPanel') renderJobTierlist();
        }

        function renderJobTierlist() {
            const select = document.getElementById('jobTierSelect');
            const body = document.getElementById('jobTierlistBody');
            const summary = document.getElementById('jobTierlistSummary');
            const list = window.JOB_TIERLIST || [];
            if (!select || !body || !list.length) return;
            if (!select.options.length) {
                select.innerHTML = list.map(item => `<option value="${item.job}">${item.icon} ${item.job}</option>`).join('');
            }
            const job = list.find(item => item.job === select.value) || list[0];
            select.value = job.job;
            if (summary) summary.textContent = `${job.icon} ${job.job}: Meta-Score kombiniert Arbeitslevel mit Tempo, Platzbedarf und Community-Praxis.`;
            const rankedEntries = [...job.entries].sort((a, b) => b.metaScore - a.metaScore || a.pal.localeCompare(b.pal, 'de'));
            body.innerHTML = rankedEntries.map((entry, index) => `
                <tr>
                    <td class="job-rank">${index + 1}</td>
                    <th scope="row"><strong>${entry.pal}</strong><small>${entry.tier}-Tier</small></th>
                    <td><span class="job-tier-badge tier-${entry.tier.toLowerCase()}">${entry.tier}</span></td>
                    <td><strong>${entry.metaScore}</strong><small>/ 100 Meta-Score</small></td>
                    <td>${entry.workLevel}</td>
                    <td>${entry.speed}/5</td>
                    <td>${entry.size}/5</td>
                    <td>${entry.community}/5</td>
                    <td class="job-why">${entry.why}</td>
                </tr>`).join('');
        }

        function enablePalDetailInteractions() {
            const body = document.getElementById('palsTableBody');
            if (!body || body.dataset.detailsEnabled) return;
            body.dataset.detailsEnabled = 'true';
            body.addEventListener('click', event => {
                const trigger = event.target.closest('.pal-detail-trigger');
                if (!trigger) return;
                const cell = trigger.closest('.pal-name-cell');
                const isOpen = cell.classList.toggle('is-open');
                const entry = Object.values(PAL_DB).find(item => item.id === cell.dataset.palId);
                trigger.setAttribute('aria-expanded', String(isOpen));
                if (entry && isOpen) showPalCaptureTooltip(entry, trigger); else hidePalCaptureTooltip();
            });
            body.addEventListener('mouseover', event => {
                const trigger = event.target.closest('.pal-detail-trigger');
                if (!trigger || trigger.contains(event.relatedTarget)) return;
                const cell = trigger.closest('.pal-name-cell');
                const entry = Object.values(PAL_DB).find(item => item.id === cell?.dataset.palId);
                if (entry) showPalCaptureTooltip(entry, trigger);
            });
            body.addEventListener('mouseout', event => {
                const trigger = event.target.closest('.pal-detail-trigger');
                if (trigger && !trigger.contains(event.relatedTarget) && !trigger.closest('.pal-name-cell')?.classList.contains('is-open')) hidePalCaptureTooltip();
            });
            body.addEventListener('focusin', event => {
                const trigger = event.target.closest('.pal-detail-trigger');
                const cell = trigger?.closest('.pal-name-cell');
                const entry = Object.values(PAL_DB).find(item => item.id === cell?.dataset.palId);
                if (entry) showPalCaptureTooltip(entry, trigger);
            });
            body.addEventListener('focusout', () => { if (!body.querySelector('.pal-name-cell.is-open')) hidePalCaptureTooltip(); });
            body.addEventListener('keydown', event => {
                if (event.key !== 'Escape') return;
                const cell = event.target.closest('.pal-name-cell');
                const trigger = cell?.querySelector('.pal-detail-trigger');
                if (!trigger) return;
                cell.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
                hidePalCaptureTooltip();
                trigger.focus();
            });
        }

        function setTeamsTheme(theme, btnEl) {
            document.querySelectorAll('#teamsThemeTable .theme-cell').forEach(c => c.classList.remove('active'));
            if (btnEl) btnEl.classList.add('active');
            document.querySelectorAll('#teams .theme-panel').forEach(p => p.style.display = 'none');
            const panel = document.getElementById('theme-' + theme);
            if (panel) panel.style.display = 'block';
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
                    <div class="base-card-stage">${PAL_STAGE_LABEL[item.stage] || item.stage}</div>
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

        const RESOURCE_RARITY_CLASS = {
            'Häufig': 'common',
            'Wichtig': 'important',
            'Selten': 'rare',
            'Sehr selten': 'very-rare',
        };

        function resourcePinId(item) {
            return ({ Öl: 'crude-oil', Kohle: 'coal', Erz: 'ore', Schwefel: 'sulfur', Hartholz: 'hardwood' })[item.resource] || '';
        }

        function positionResourceTooltip(event) {
            const tooltip = document.getElementById('resourceDetailTooltip');
            if (!tooltip.classList.contains('visible')) return;
            const offset = 16;
            const rect = tooltip.getBoundingClientRect();
            let x = event ? event.clientX + offset : 24;
            let y = event ? event.clientY + offset : 24;
            if (x + rect.width > window.innerWidth - 8) x = (event?.clientX || window.innerWidth) - rect.width - offset;
            if (y + rect.height > window.innerHeight - 8) y = (event?.clientY || window.innerHeight) - rect.height - offset;
            tooltip.style.left = `${Math.max(8, x)}px`;
            tooltip.style.top = `${Math.max(8, y)}px`;
        }

        function showResourceTooltip(resource, event) {
            const tooltip = document.getElementById('resourceDetailTooltip');
            const image = resource.image && window.RESOURCE_IMAGES?.[resource.image]
                ? `<img src="${window.RESOURCE_IMAGES[resource.image]}" alt="${resource.name} Fundort" class="resource-tooltip-image">`
                : '';
            tooltip.innerHTML = `
                ${image}
                <div class="resource-tooltip-kicker">${resource.category} · ${resource.rarity}</div>
                <div class="resource-tooltip-name">${resource.name}</div>
                <p>${resource.note}</p>
                <div class="resource-tooltip-loc"><strong>Fundorte:</strong> ${resource.locations}<br><strong>Koordinaten:</strong> ${resource.coords}</div>`;
            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');
            positionResourceTooltip(event);
        }

        function hideResourceTooltip() {
            const tooltip = document.getElementById('resourceDetailTooltip');
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
        }

        function bindResourceDetails() {
            document.querySelectorAll('[data-resource-id]').forEach(element => {
                const resource = window.RESOURCE_CATALOG?.find(item => item.id === element.dataset.resourceId);
                if (!resource || element.dataset.resourceBound) return;
                element.dataset.resourceBound = 'true';
                element.addEventListener('mouseenter', event => showResourceTooltip(resource, event));
                element.addEventListener('mousemove', positionResourceTooltip);
                element.addEventListener('mouseleave', hideResourceTooltip);
                element.addEventListener('focus', () => showResourceTooltip(resource));
                element.addEventListener('blur', hideResourceTooltip);
            });
        }

        function renderResourceCatalog() {
            const body = document.getElementById('resourceCatalog');
            if (!body) return;
            body.innerHTML = (window.RESOURCE_CATALOG || []).map(resource => `
                <tr data-resource-id="${resource.id}" tabindex="0">
                    <th scope="row"><strong>${resource.name}</strong><small>${resource.category}</small></th>
                    <td>${resource.category}</td>
                    <td>${resource.early}</td>
                    <td>${resource.durable}</td>
                    <td><span class="resource-location-text">${resource.locations}</span><small class="resource-coords">${resource.coords}</small></td>
                    <td><span class="resource-rarity ${RESOURCE_RARITY_CLASS[resource.rarity] || ''}">${resource.rarity}</span></td>
                </tr>`).join('');
            bindResourceDetails();
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
            bindResourceDetails();
        }

        // Original, non-infringing per-pal visuals: a colored initial-badge (by element type)
        // plus a link out to the real wiki page. No copyrighted game art is fetched or embedded.
        const TYPE_COLOR = {
            Normal: '#9CA3AF', Fire: '#F97316', Water: '#0EA5E9', Grass: '#22C55E',
            Electric: '#EAB308', Ice: '#67E8F9', Ground: '#A16207', Dark: '#6B21A8',
            Dragon: '#7C3AED', Neutral: '#94A3B8', Bug: '#84CC16',
        };

        // Small icon (wiki "_icon.png" thumbnail) for avatars/table rows.
        // MediaWiki file names use underscores instead of spaces — encodeURIComponent
        // alone produces %20, which 404s on the raw /images/ file path (unlike
        // Special:FilePath below, which normalizes it server-side).
        function palIconUrl(name, size) {
            name = window.GuideData?.resolvePalImageName?.(PAL_DB, name) || name;
            const file = `${name.replace(/ /g, '_')}_icon.png`;
            return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
        }

        // Full-resolution artwork, shown only on hover (inside the tooltip).
        function palImageUrl(name) {
            name = window.GuideData?.resolvePalImageName?.(PAL_DB, name) || name;
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
                if (td.querySelector('.pal-db-thumb')) {
                    td.dataset.thumbApplied = 'true';
                    return;
                }
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

        function renderPatchNotes() {
            const host = document.getElementById('patchnotesHost');
            const notes = window.GuideData?.PATCH_NOTES || [];
            if (!host) return;
            host.innerHTML = notes.map(note => `
                <article class="patchnote-entry">
                    <div class="patchnote-entry-head">
                        <div><span class="patchnote-version">v${escapeHtml(note.version)}</span><span class="patchnote-date">${escapeHtml(note.date)}</span></div>
                        <h3>${escapeHtml(note.title)}</h3>
                    </div>
                    <p class="patchnote-summary">${escapeHtml(note.summary)}</p>
                    <ul>${note.changes.map(change => `<li><strong>${escapeHtml(change.label)}:</strong> ${escapeHtml(change.text)}</li>`).join('')}</ul>
                    <div class="patchnote-sources">Praxisabgleich: ${note.sourceIds.map(id => `<a href="${escapeHtml((window.GuideData.META_SOURCES || []).find(source => source.id === id)?.url || '#')}" target="_blank" rel="noopener noreferrer">Quelle ↗</a>`).join(' · ')}</div>
                </article>
            `).join('');
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
                    const entry = window.GuideData?.resolvePalEntry?.(PAL_DB, name);
                    const metaParts = [];
                    if (entry && entry.types.length) metaParts.push(entry.types.join(' / '));
                    if (entry && entry.tier) metaParts.push('Tier ' + entry.tier.toUpperCase());
                    const stagesHtml = entry ? palStageBadges(entry) : '';
                    const loc = entry ? entry.location : null;
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
        renderResourceCatalog();
        renderPatchNotes();
        bindResourceDetails();
        applyPalVisuals();
        applyPalThumbs();
        applySynergyChipIcons();
        PAL_DB = buildPalDB();
        renderPalsTable();
        renderJobTierlist();
        enablePalDetailInteractions();
        enableChipTooltips();
        enableBaseWorkerTooltips();

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
                return `<div class="photo-pin" data-id="${item.id}" data-tier="${item.tier}" data-resource-id="${resourcePinId(item)}" tabindex="0" onclick="selectLocation('${item.id}')" style="left:${leftPct}%; top:${topPct}%; background:${color};" data-label="${item.name}"></div>`;
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
