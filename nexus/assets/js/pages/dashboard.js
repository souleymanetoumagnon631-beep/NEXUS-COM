// ══════════════════════════════════════════
//   PAGE : DASHBOARD
// ══════════════════════════════════════════
Pages.dashboard = {

  render() {
    const pid = $('dash-product-filter')?.value || '';

    // Mettre à jour le select produits
    Form.fillProducts('dash-product-filter', pid, 'Tous les produits');

    // Badge filtre
    const badge     = $('dash-filter-badge');
    const badgeName = $('dash-filter-name');
    if (pid) {
      const p = State.getProduct(pid);
      if (badge)     badge.style.display    = 'flex';
      if (badgeName) badgeName.textContent   = p?.name || '';
    } else {
      if (badge) badge.style.display = 'none';
    }

    const d  = Engine.getDashboardStats(pid);
    const pp = d.isProfitable;

    // ── KPIs ──
    $('d-stats').innerHTML = `
      <div class="stat-card c-purple anim">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <div class="stat-label">Investissement Total</div>
        <div class="stat-val">${fF(d.totalInvest)}</div>
        <div class="stat-sub">${d.nProducts} produit(s)</div>
      </div>
      <div class="stat-card c-blue anim" style="animation-delay:.05s">
        <div class="stat-icon-wrap" style="background:rgba(96,165,250,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-label">Chiffre d'Affaires</div>
        <div class="stat-val">${fF(d.totalCA)}</div>
        <div class="stat-sub">${d.nSales} vente(s)</div>
      </div>
      <div class="stat-card ${pp ? 'c-green' : 'c-red'} anim" style="animation-delay:.1s">
        <div class="stat-icon-wrap" style="background:rgba(${pp ? '52,211,153' : '248,113,113'},0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${pp ? '#34d399' : '#f87171'}" stroke-width="2">
            <polyline points="${pp ? '22 7 13.5 15.5 8.5 10.5 2 17' : '22 17 13.5 8.5 8.5 13.5 2 7'}"/>
            ${pp ? '<polyline points="16 7 22 7 22 13"/>' : '<polyline points="16 17 22 17 22 11"/>'}
          </svg>
        </div>
        <div class="stat-label">${pp ? 'Profit Net' : 'Perte Nette'}</div>
        <div class="stat-val ${pp ? 'pos' : 'neg'}">${fF(d.netProfit)}</div>
        <div class="stat-sub">Marge: ${fP(d.avgMargin)} · ROI: ${fP(d.globalROI)}</div>
      </div>
      <div class="stat-card c-yellow anim" style="animation-delay:.15s">
        <div class="stat-icon-wrap" style="background:rgba(251,191,36,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-label">CA — 7 jours</div>
        <div class="stat-val" style="color:var(--yellow)">${fF(d.ca7j)}</div>
        <div class="stat-sub">
          Tendance : <span style="color:${d.trend7j >= 0 ? 'var(--green)' : 'var(--red)'}">${fP(d.trend7j)}</span>
        </div>
      </div>
      <div class="stat-card c-purple anim" style="animation-delay:.2s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div class="stat-label">Projets Actifs</div>
        <div class="stat-val" style="color:var(--accent2)">${d.nActiveProjects}</div>
        <div class="stat-sub">${State.getProjects().length} total</div>
      </div>
      <div class="stat-card c-orange anim" style="animation-delay:.25s">
        <div class="stat-icon-wrap" style="background:rgba(251,146,60,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <div class="stat-label">Livraisons Actives</div>
        <div class="stat-val" style="color:var(--orange)">${d.nPending}</div>
        <div class="stat-sub">En attente / confirmées</div>
      </div>
    `;

    // ── Stats produit spécifique ──
    const specificEl = $('dash-specific-stats');
    if (specificEl) {
      specificEl.innerHTML = pid ? this._renderProductDetail(pid) : '';
    }

    // ── Top produits ──
    const sorted  = [...d.allStats].sort((a, b) => b.s.profit - a.s.profit).slice(0, 5);
    const maxAbs  = Math.max(...sorted.map(x => Math.abs(x.s.profit)), 1);
    $('d-top').innerHTML = sorted.length
      ? sorted.map(({ p, s }, i) => {
          const pct = Math.abs(s.profit) / maxAbs * 100;
          const pc  = s.profit >= 0 ? 'var(--green)' : 'var(--red)';
          const bc  = s.profit >= 0 ? 'var(--green-d)' : 'var(--red-d)';
          const col = avColor(p.name);
          return `
            <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--surface2);border-radius:10px;border:1px solid var(--border)" class="anim" style="animation-delay:${i * .04}s">
              <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.74rem;font-weight:700;flex-shrink:0;background:${col}22;color:${col}">${i + 1}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div>
                <div style="font-size:.71rem;color:var(--text3);margin-top:1px">Invest: ${fF(s.invest)} · CA: ${fF(s.ca)}</div>
                <div style="height:4px;background:rgba(124,111,255,0.06);border-radius:99px;overflow:hidden;margin-top:6px">
                  <div style="width:${pct}%;height:100%;background:${bc};border-radius:99px"></div>
                </div>
              </div>
              <div style="font-weight:700;font-size:.875rem;flex-shrink:0;color:${pc}">${fF(s.profit)}</div>
            </div>`;
        }).join('')
      : EmptyState.html('Pas encore de ventes.');

    // ── Alertes ──
    const alertColors = { warning: 'var(--yellow)', error: 'var(--red)', success: 'var(--green)', info: 'var(--blue)' };
    const alertBg     = { warning: 'var(--yellow-bg)', error: 'var(--red-bg)', success: 'var(--green-bg)', info: 'var(--blue-bg)' };
    const alertBorder = { warning: 'var(--yellow-b)', error: 'var(--red-b)', success: 'var(--green-b)', info: 'var(--blue-b)' };

    $('d-alerts').innerHTML = d.alerts.length
      ? d.alerts.map(a => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-radius:10px;font-size:.83rem;margin-bottom:10px;background:${alertBg[a.type]};border:1px solid ${alertBorder[a.type]};color:${alertColors[a.type]}">
            <span style="flex-shrink:0;margin-top:1px">
              ${a.type === 'success' ? '✓' : a.type === 'error' ? '✕' : a.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span>
              <strong>${esc(a.message)}</strong>
              ${a.detail ? `<br><span style="opacity:.8;font-size:.78rem">${esc(a.detail)}</span>` : ''}
            </span>
          </div>`)
        .join('')
      : `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;font-size:.83rem;background:var(--green-bg);border:1px solid var(--green-b);color:var(--green)">✓ <span>Tout est en ordre, aucune alerte.</span></div>`;

    // ── Suivi projets ──
    const activeProjs = State.getActiveProjects().slice(0, 4);
    $('d-proj-track').innerHTML = activeProjs.length
      ? activeProjs.map(pr => {
          const pct      = Engine.getProjectProgress(pr);
          const barColor = pct >= 100 ? 'var(--green)' : pct >= 60 ? 'var(--accent)' : pct >= 30 ? 'var(--yellow)' : 'var(--red)';
          return `
            <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--surface2);border-radius:10px;border:1px solid var(--border)">
              <div style="flex:1;min-width:0">
                <div style="font-size:.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(pr.name)}</div>
                <div style="font-size:.71rem;color:var(--text3);margin-top:1px">${STATUS_LABELS[pr.status] || pr.status}</div>
                <div style="height:5px;background:rgba(124,111,255,0.06);border-radius:99px;overflow:hidden;margin-top:7px">
                  <div style="width:${pct}%;height:100%;background:${barColor};border-radius:99px;transition:width .7s ease"></div>
                </div>
              </div>
              <div style="font-size:.86rem;font-weight:700;flex-shrink:0;color:var(--accent2)">${pct}%</div>
            </div>`;
        }).join('')
      : '<div style="text-align:center;padding:20px;color:var(--text3);font-size:.84rem">Aucun projet actif</div>';

    // ── Résumé global ──
    const doneTasks  = State.getTasks().filter(t => t.status === 'done').length;
    const totalTasks = State.getTasks().length;
    const avgProjPct = State.getProjects().length
      ? Math.round(State.getProjects().reduce((a, pr) => a + Engine.getProjectProgress(pr), 0) / State.getProjects().length)
      : 0;

    $('d-sum').innerHTML = [
      { label: 'Produits',      value: d.nProducts,  color: '' },
      { label: 'Ventes',        value: d.nSales,      color: '' },
      { label: 'Rentables',     value: d.allStats.filter(x => x.s.isProfitable).length, color: 'var(--green)' },
      { label: 'Clients',       value: d.nClients,    color: 'var(--blue)' },
      { label: 'Tâches',        value: `${doneTasks}/${totalTasks}`, color: '' },
      { label: 'Prog. Projets', value: `${avgProjPct}%`, color: 'var(--accent2)' },
    ].map(item => `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">
        <div style="font-size:.66rem;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;font-weight:600">${item.label}</div>
        <div style="font-size:.96rem;font-weight:700${item.color ? ';color:' + item.color : ''}">${item.value}</div>
      </div>`).join('');

    // ── Charts ──
    Charts.buildDashboardCharts(pid);
  },

  _renderProductDetail(pid) {
    const p = State.getProduct(pid);
    const s = Engine.getProductStats(pid);
    if (!p || !s) return '';

    const recentSales = State.getSalesByProduct(pid)
      .sort((a, b) => (b.sale_date || '').localeCompare(a.sale_date || ''))
      .slice(0, 3);

    return `
      <div class="card" style="margin-bottom:20px;border-color:rgba(124,111,255,0.25)">
        <div class="card-header">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            Analyse : ${esc(p.name)}
          </div>
          <span class="badge bp">${esc(p.store || '—')}</span>
        </div>
        <div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
          ${[
            { label: 'Coût unitaire',    value: fF(s.unit),     color: 'var(--accent2)' },
            { label: 'Stock restant',    value: `${s.stock} u.`, color: s.isOutOfStock ? 'var(--red)' : s.isLowStock ? 'var(--yellow)' : 'var(--green)' },
            { label: 'Unités vendues',   value: `${s.sold} / ${p.qty}`, color: 'var(--blue)' },
            { label: 'Meilleur canal',   value: s.bestChannel,   color: 'var(--accent2)' },
            { label: 'Livraisons',       value: State.getLivByProduct(pid).length, color: 'var(--orange)' },
            { label: 'Type fret',        value: p.fret_type || '—', color: 'var(--text)' },
          ].map(item => `
            <div style="background:var(--surface2);border-radius:10px;padding:14px;border:1px solid var(--border)">
              <div style="font-size:.66rem;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-weight:600">${item.label}</div>
              <div style="font-size:1.05rem;font-weight:700;color:${item.color}">${item.value}</div>
            </div>`).join('')}
        </div>
        <div style="padding:0 20px 20px">
          <div style="font-size:.72rem;color:var(--text3);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Dernières ventes</div>
          ${recentSales.length
            ? recentSales.map(v => {
                const cl = State.getClient(v.client_id);
                return `
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--surface2);border-radius:8px;margin-bottom:6px;border:1px solid var(--border)">
                    <div>
                      <div style="font-size:.84rem;font-weight:600">${cl ? esc(cl.name) : 'Anonyme'}</div>
                      <div style="font-size:.7rem;color:var(--text3)">${fmtDate(v.sale_date)} · ${esc(v.channel || '—')}</div>
                    </div>
                    <div style="font-weight:700;color:var(--blue)">${fF(v.price * v.qty)}</div>
                  </div>`;
              }).join('')
            : '<div style="font-size:.82rem;color:var(--text3);padding:10px 0">Aucune vente enregistrée.</div>'}
        </div>
      </div>`;
  },
};
