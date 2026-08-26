const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const GUIDE_PAL_NAMES = ['Cattiva', 'Foxparks', 'Daedream', 'Vixy', 'Anubis', 'Lyleen', 'Rushoar', 'Eikthyrdeer'];
const renderPalMentions = value => GUIDE_PAL_NAMES.reduce((html, name) => html.replace(new RegExp(`\\b${name}\\b`, 'g'), `<span class="pal-inline-name"><img class="pal-inline-icon" src="https://palworld.wiki.gg/images/thumb/${name}_icon.png/20px-${name}_icon.png" alt="" aria-hidden="true" onerror="this.style.display='none'"><span>${name}</span></span>`), escapeHtml(value));

const list = values => values.map(value => `<li>${renderPalMentions(value)}</li>`).join('');
const locationList = values => values.map(value => `<li><button class="guide-location-link" type="button" data-target-location="${escapeHtml(value)}" onclick="switchTab('locations'); selectLocation('${escapeHtml(value)}')">${escapeHtml(value)}</button></li>`).join('');

export function renderGuideStep(step) {
  return `<article class="guide-step-card" data-guide-step="${escapeHtml(step.id)}">
    <div class="guide-step-kicker">Level ${escapeHtml(step.levelBandId)}</div>
    <h2>${renderPalMentions(step.goal)}</h2>
    <div class="guide-step-columns">
      <section><h3>Vorbereitung</h3><ul>${list(step.preparation)}</ul></section>
      <section><h3>Items</h3><ul>${list(step.items)}</ul></section>
      <section><h3>Orte</h3><ul>${locationList(step.locationIds)}</ul></section>
    </div>
    <div class="guide-step-completion"><strong>Erfolgskriterium:</strong> ${renderPalMentions(step.completion)}</div>
  </article>`;
}
