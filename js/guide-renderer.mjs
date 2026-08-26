const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const list = values => values.map(value => `<li>${escapeHtml(value)}</li>`).join('');

export function renderGuideStep(step) {
  return `<article class="guide-step-card" data-guide-step="${escapeHtml(step.id)}">
    <div class="guide-step-kicker">Level ${escapeHtml(step.levelBandId)}</div>
    <h2>${escapeHtml(step.goal)}</h2>
    <div class="guide-step-columns">
      <section><h3>Vorbereitung</h3><ul>${list(step.preparation)}</ul></section>
      <section><h3>Items</h3><ul>${list(step.items)}</ul></section>
      <section><h3>Orte</h3><ul>${list(step.locationIds)}</ul></section>
    </div>
    <div class="guide-step-completion"><strong>Erfolgskriterium:</strong> ${escapeHtml(step.completion)}</div>
  </article>`;
}
