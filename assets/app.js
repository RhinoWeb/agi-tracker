/* AGI Watch — renders index.html from data/tracker.json. Pure render functions; data is never mutated. */
(function () {
  'use strict';

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- render functions (data in, HTML string out) ---------- */

  const renderTiles = (tiles) =>
    tiles
      .map(
        (t) => `
    <div class="tile">
      <div class="label">${esc(t.label)}</div>
      <div class="value">${esc(t.value)}</div>
      <div class="note">${esc(t.note)}</div>
    </div>`
      )
      .join('');

  const renderYearGrid = (startYear, endYear) => {
    const span = endYear - startYear;
    const cells = [];
    for (let y = startYear; y <= endYear; y++) {
      const left = (((y - startYear) / span) * 100).toFixed(2);
      cells.push(`<div class="yr" style="left:${left}%"><span>${y}</span></div>`);
    }
    return cells.join('');
  };

  const renderMilestone = (m) => `
    <div class="ms${m.pending ? ' pending' : ''}${m.up ? ' up' : ''}" style="left:${m.pos}%" data-tip="${esc(m.tip)}">
      <div class="dot"></div>
      <div class="mlab"><b>${esc(m.label)}</b><br>${esc(m.sub)}</div>
    </div>`;

  const renderTrack = (track) => `
    <div class="tname ${track.id}">${esc(track.name)}</div>
    <div class="track ${track.id}">
      <div class="rail"></div>
      ${track.band ? `<div class="bandbar" style="left:${track.band.left}%; width:${track.band.width}%" data-tip="${esc(track.band.tip)}"><span>${esc(track.band.label)}</span></div>` : ''}
      ${track.milestones.map(renderMilestone).join('')}
    </div>`;

  const renderTimeline = (tl) => `
    <div class="tl-grid">${renderYearGrid(tl.startYear, tl.endYear)}</div>
    ${tl.tracks.map(renderTrack).join('')}
    <div class="today" style="left:${tl.todayPos}%"><em>${esc(tl.todayLabel)}</em></div>`;

  // 1.0x sits at 66.7% of the track; bars scale linearly, capped at 1.45x.
  const barWidth = (mult) => Math.min((mult / 1.5) * 100, 96.7).toFixed(1);

  const renderPaceBars = (metrics) =>
    metrics
      .map(
        (m, i) => `
    <div class="barrow">
      <div class="bl">${esc(m.label)}<small>${esc(m.sub)}</small></div>
      <div class="btrack">
        <div class="ref" style="left:66.7%">${i === 0 ? '<i>1.0× on schedule</i>' : ''}</div>
        <div class="fill ${m.status === 'ahead' ? 'ahead' : m.status === 'behind' ? 'behind' : ''}" data-w="${barWidth(m.mult)}" data-tip="${esc(m.tip)}"></div>
      </div>
      <div class="bv">${esc(m.display)}</div>
    </div>`
      )
      .join('');

  const renderScorecard = (rows) =>
    rows
      .map(
        (r) => `
    <tr>
      <td>${esc(r.prediction)}</td>
      <td>${esc(r.said)}</td>
      <td>${esc(r.reality)}</td>
      <td><span class="pill ${esc(r.verdict)}">${esc(r.verdictLabel)}</span></td>
    </tr>`
      )
      .join('');

  const renderVerdictCards = (cards) =>
    cards
      .map(
        (c) => `
    <div class="vcard">
      <h3><span class="${esc(c.iconClass)}">${esc(c.icon)}</span>${esc(c.title)}</h3>
      <p>${esc(c.body)}</p>
    </div>`
      )
      .join('');

  const renderSources = (sources) =>
    sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(' · ');

  /* ---------- behaviors ---------- */

  function animateBars() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.btrack .fill').forEach((f) => {
      const w = f.getAttribute('data-w') + '%';
      if (reduce) {
        f.style.width = w;
      } else {
        f.style.width = '0%';
        setTimeout(() => { f.style.width = w; }, 80);
      }
    });
  }

  function initTooltips() {
    const tip = document.getElementById('tip');
    if (!tip) return;
    const move = (e) => {
      let x = e.clientX + 14;
      let y = e.clientY + 14;
      const r = tip.getBoundingClientRect();
      if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 10;
      if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 10;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    };
    document.querySelectorAll('[data-tip]').forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        tip.textContent = el.getAttribute('data-tip');
        tip.style.display = 'block';
        move(e);
      });
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  }

  /* ---------- boot ---------- */

  async function boot() {
    let data;
    try {
      const res = await fetch('data/tracker.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    } catch (err) {
      const el = document.getElementById('load-error');
      if (el) {
        el.hidden = false;
        el.textContent = 'Could not load tracker data (' + err.message + '). Refresh to retry.';
      }
      return;
    }

    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText('verdict-headline-pace', '~' + Math.round(((data.meta.paceLow + data.meta.paceHigh) / 2) * 100) / 100 + '×');
    setText('verdict-sub', data.meta.verdictSub);
    setText('asof', 'Data as of ' + data.meta.asOf + ' · last updated ' + data.meta.lastUpdated);
    set('tiles', renderTiles(data.tiles));
    set('timeline', renderTimeline(data.timeline));
    set('bars', renderPaceBars(data.paceMetrics));
    setText('bars-note', data.paceNote);
    set('scorecard-body', renderScorecard(data.scorecard));
    set('verdict-cards', renderVerdictCards(data.verdictCards));
    set('sources', renderSources(data.sources));

    animateBars();
    initTooltips();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
