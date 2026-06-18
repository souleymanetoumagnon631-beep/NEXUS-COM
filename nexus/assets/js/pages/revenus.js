// ══════════════════════════════════════════
//   PAGE : REVENUS
// ══════════════════════════════════════════
Pages.revenus = {

  _tab: 'week',

  render() {
    const stats = Engine.getRevenusStats();

    $('rev-kpis').innerHTML = `
      <div class="stat-card c-blue anim">
        <div class="stat-icon-wrap" style="background:rgba(96,165,250,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-label">Cette Semaine</div>
        <div class="stat-val" style="color:var(--blue)">${fF(stats.wCA)}</div>
        <div class="stat-sub">${stats.wCount} vente(s)</div>
      </div>
      <div class="stat-card c-purple anim" style="animation-delay:.05s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-label">Ce Mois</div>
        <div class="stat-val" style="color:var(--accent2)">${fF(stats.mCA)}</div>
        <div class="stat-sub">${stats.mCount} vente(s)</div>
      </div>
      <div class="stat-card c-green anim" style="animation-delay:.1s">
        <div class="stat-icon-wrap" style="background:rgba(52,211,153,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-label">Cette Année</div>
        <div class="stat-val" style="color:var(--green)">${fF(stats.yCA)}</div>
        <div class="stat-sub">${stats.yCount} vente(s)</div>
      </div>
      <div class="stat-card c-yellow anim" style="animation-delay:.15s">
        <div class="stat-icon-wrap" style="background:rgba(251,191,36,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-label">Moyenne / Mois</div>
        <div class="stat-val" style="color:var(--yellow)">${fF(stats.avgCA)}</div>
        <div class="stat-sub">${stats.avgSub}</div>
      </div>`;

    Charts.buildRevenusCharts();
    this._renderTable();
  },

  switchTab(el, tab) {
    this._tab = tab;
    $$('#page-revenus .task-filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this._renderTable();
  },

  _renderTable() {
    const titles = {
      week:  'Ventes de la semaine',
      month: 'Ventes du mois',
      year:  'Ventes de l\'année',
      all:   'Toutes les ventes',
    };

    $('rev-table-title').textContent = titles[this._tab] || '';

    const list = Engine.filterSalesByPeriod(this._tab)
      .sort((a, b) => (b.sale_date || '').localeCompare(a.sale_date || ''));

    $('rev-table-count').textContent = `${list.length} vente(s)`;

    const tbody = $('rev-tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="8">${EmptyState.html('Aucune vente sur cette période.')}</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((v, i) => {
      const p       = State.getProduct(v.product_id);
      const cl      = State.getClient(v.client_id);
      const s       = p ? Engine.getProductStats(p.id) : null;
      const ca      = (v.price || 0) * (v.qty || 0);
      const profit  = s ? (v.price - s.unit) * (v.qty || 0) - (v.shipping || 0) : 0;
      const col     = avColor(p?.name || '');

      return `
        <tr class="anim" style="animation-delay:${i * .02}s">
          <td>
            <div class="td-prod">
              <div class="td-av" style="background:${col}22;color:${col}">
                ${(p?.name || '?')[0].toUpperCase()}
              </div>
              <div class="td-name">${esc(p?.name || 'Supprimé')}</div>
            </div>
          </td>
          <td style="color:var(--text2);font-size:.78rem">${cl ? esc(cl.name) : 'Anonyme'}</td>
          <td>${fF(v.price)}</td>
          <td>${v.qty || 0}</td>
          <td style="color:var(--blue);font-weight:600">${fF(ca)}</td>
          <td>
            <span class="badge ${profit >= 0 ? 'bg' : 'br'}">
              ${fF(Math.abs(profit))}
            </span>
          </td>
          <td><span class="badge bp">${esc(v.channel || '—')}</span></td>
          <td style="color:var(--text3)">${fmtDate(v.sale_date)}</td>
        </tr>`;
    }).join('');
  },
};
