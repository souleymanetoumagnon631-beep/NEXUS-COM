// ══════════════════════════════════════════
//   PAGE : DASHBOARD — v2 Clarté & Action
//   Sections claires : Trésorerie, Santé, Performance, Actions
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

    // ── SECTION 1 : CONSEIL DU JOUR ──
    const advices = Engine.getDailyAdvice(pid);
    let adviceHTML = '';
    if (advices.length) {
      adviceHTML = `
        <div class="card" style="margin-bottom:20px;border-color:rgba(124,111,255,0.2);background:linear-gradient(135deg,rgba(124,111,255,0.04),var(--surface2))">
          <div class="card-header">
            <div class="card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Conseils du jour
            </div>
            <span style="font-size:.72rem;color:var(--text3)">Basé sur vos données réelles</span>
          </div>
          <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
            ${advices.map(a => `
              <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 14px;background:var(--surface3);border-radius:10px;border:1px solid var(--border)">
                <span style="font-size:1.4rem;flex-shrink:0">${a.icon}</span>
                <div>
                  <div style="font-size:.84rem;font-weight:700;margin-bottom:4px">${a.title}</div>
                  <div style="font-size:.78rem;color:var(--text2);line-height:1.6">${a.text}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    // ── SECTION 2 : SCORE DE SANTÉ ──
    const health = Engine.getBusinessHealthScore(pid);
    const scoreHTML = `
      <div class="card" style="margin-bottom:20px;border-color:${health.color}44">
        <div class="card-header">
          <div class="card-title">${health.emoji} Santé de votre business</div>
          <span style="font-size:.72rem;color:var(--text3)">Score sur ${health.maxScore}</span>
        </div>
        <div style="padding:20px">
          <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
            <!-- Jauge circulaire simplifiée -->
            <div style="position:relative;width:100px;height:100px;flex-shrink:0">
              <svg width="100" height="100" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="12"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="${health.color}" stroke-width="12"
                  stroke-dasharray="${(health.score / health.maxScore) * 327}" stroke-dashoffset="0"
                  stroke-linecap="round" transform="rotate(-90 60 60)" style="transition:stroke-dasharray 1s ease"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                <span style="font-size:1.5rem;font-weight:900;color:${health.color}">${health.score}</span>
                <span style="font-size:.6rem;color:var(--text3);text-transform:uppercase">/ ${health.maxScore}</span>
              </div>
            </div>
            <div style="flex:1;min-width:200px">
              <div style="font-size:1.1rem;font-weight:800;color:${health.color};margin-bottom:12px">${health.emoji} ${health.level}</div>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${health.details.map(d => `
                  <div style="display:flex;align-items:center;gap:8px;font-size:.78rem">
                    <span style="width:8px;height:8px;border-radius:50%;background:${d.color === 'green' ? 'var(--green)' : d.color === 'orange' ? 'var(--orange)' : 'var(--red)'};flex-shrink:0"></span>
                    <span style="color:var(--text2)">${d.label}</span>
                    <span style="margin-left:auto;font-weight:600;color:${health.color}">${d.pts}/${20}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>`;

    // ── KPIS : TRÉSORERIE & PERFORMANCE ──
    const totalPubCosts = Engine.computeSaleCosts({ shipping: 0, fb_cost: 0, tiktok_cost: 0, ads_cost: 0, misc_cost: 0 });
    // Recalcul plus précis des coûts totaux
    const sales = pid ? State.getSalesByProduct(pid) : State.getSales();
    const totalPub = sales.reduce((s, v) => s + (v.fb_cost || 0) + (v.tiktok_cost || 0) + (v.ads_cost || 0) + (v.misc_cost || 0), 0);
    const totalShip = sales.reduce((s, v) => s + (v.shipping || 0), 0);
    const vraiProfit = d.totalCA - d.totalInvest - totalPub - totalShip - d.totalExpenses;
    const cashDisponible = d.totalCA - d.totalInvest;

    $('d-stats').innerHTML = `
      <!-- Ligne 1 : Trésorerie & Liquidités -->
      <div style="grid-column:1/-1;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:4px">💰 Trésorerie & Rentabilité Réelle</div>
      <div class="stat-card ${vraiProfit >= 0 ? 'c-green' : 'c-red'} anim">
        <div class="stat-icon-wrap" style="background:rgba(${vraiProfit >= 0 ? '52,211,153' : '248,113,113'},0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${vraiProfit >= 0 ? '#34d399' : '#f87171'}" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-label">💵 Profit Net Réel</div>
        <div class="stat-val ${vraiProfit >= 0 ? 'pos' : 'neg'}">${fF(vraiProfit)}</div>
        <div class="stat-sub">CA ${fF(d.totalCA)} − Invest ${fF(d.totalInvest)} − Pub ${fF(totalPub)} − Dépenses fixes ${fF(d.totalExpenses)}</div>
      </div>
      <div class="stat-card ${cashDisponible >= 0 ? 'c-purple' : 'c-red'} anim" style="animation-delay:.05s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div class="stat-label">💰 Trésorerie (CA − Invest)</div>
        <div class="stat-val ${cashDisponible >= 0 ? 'pos' : 'neg'}">${fF(cashDisponible)}</div>
        <div class="stat-sub">${cashDisponible >= 0 ? 'Vous avez récupéré votre mise + ' + fF(cashDisponible) : 'Il manque ' + fF(Math.abs(cashDisponible)) + ' pour atteindre le point mort'}</div>
      </div>
      <!-- Ligne 2 : KPIs classiques -->
      <div style="grid-column:1/-1;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-top:8px;margin-bottom:4px">📊 Performance Commerciale</div>
      <div class="stat-card c-blue anim" style="animation-delay:.1s">
        <div class="stat-icon-wrap" style="background:rgba(96,165,250,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-label">Chiffre d'Affaires Total</div>
        <div class="stat-val" style="color:var(--blue)">${fF(d.totalCA)}</div>
        <div class="stat-sub">${d.nSales} vente(s) · Moy. ${d.nSales > 0 ? fF(Math.round(d.totalCA / d.nSales)) : '0'} / vente</div>
      </div>
      <div class="stat-card ${pp ? 'c-green' : 'c-red'} anim" style="animation-delay:.15s">
        <div class="stat-icon-wrap" style="background:rgba(${pp ? '52,211,153' : '248,113,113'},0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${pp ? '#34d399' : '#f87171'}" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <div class="stat-label">Marge brute (produits)</div>
        <div class="stat-val ${pp ? 'pos' : 'neg'}">${fF(d.totalProfit)}</div>
        <div class="stat-sub">Marge: ${fP(d.avgMargin)} · ROI: ${fP(d.globalROI)}</div>
      </div>
      <div class="stat-card c-yellow anim" style="animation-delay:.2s">
        <div class="stat-icon-wrap" style="background:rgba(251,191,36,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-label">CA — 7 derniers jours</div>
        <div class="stat-val" style="color:var(--yellow)">${fF(d.ca7j)}</div>
        <div class="stat-sub">Tendance : <span style="color:${d.trend7j >= 0 ? 'var(--green)' : 'var(--red)'}">${fP(d.trend7j)}</span> vs semaine précédente</div>
      </div>
      <div class="stat-card c-purple anim" style="animation-delay:.25s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <div class="stat-label">Investissement Total</div>
        <div class="stat-val" style="color:var(--accent2)">${fF(d.totalInvest)}</div>
        <div class="stat-sub">${d.nProducts} produit(s) · Total dépenses fixes: ${fF(d.totalExpenses)}</div>
      </div>
    `;

    // ── Stats produit spécifique ──
    const specificEl = $('dash-specific-stats');
    if (specificEl) {
      specificEl.innerHTML = pid ? this._renderProductDetail(pid) : '';
    }

    // ── Insérer score + conseils avant les charts ──
    const chartsRow = $('dash-charts-row');
    if (chartsRow) {
      // Insérer avant le premier élément du split-2col
      chartsRow.insertAdjacentHTML('beforebegin', scoreHTML);
      chartsRow.insertAdjacentHTML('beforebegin', adviceHTML);
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
                <div style="font-size:.71rem;color:var(--text3);margin-top:1px">Invest: ${fF(s.invest)} · CA: ${fF(s.ca)} · Marge: ${fP(s.margin)}</div>
                <div style="height:4px;background:rgba(124,111,255,0.06);border-radius:99px;overflow:hidden;margin-top:6px">
                  <div style="width:${pct}%;height:100%;background:${bc};border-radius:99px"></div>
                </div>
              </div>
              <div style="font-weight:700;font-size:.875rem;flex-shrink:0;color:${pc}">${fF(s.profit)}</div>
            </div>`;
        }).join('')
      : EmptyState.html('Pas encore de ventes.', 'Ajoutez votre première vente pour voir le classement.');

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
            <span style="flex:1">
              <strong>${esc(a.message)}</strong>
              ${a.detail ? `<br><span style="opacity:.8;font-size:.78rem">${esc(a.detail)}</span>` : ''}
            </span>
            ${a.action ? `<button class="btn btn-sm btn-secondary" style="flex-shrink:0;font-size:.72rem;padding:6px 12px" onclick="Nav.go('${a.page}')">${esc(a.action)}</button>` : ''}
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
      { label: 'En perte',      value: d.allStats.filter(x => x.s.isDeficit).length, color: d.allStats.filter(x => x.s.isDeficit).length > 0 ? 'var(--red)' : '' },
      { label: 'Clients',       value: d.nClients,    color: 'var(--blue)' },
      { label: 'Tâches',        value: `${doneTasks}/${totalTasks}`, color: '' },
      { label: 'Prog. Projets', value: `${avgProjPct}%`, color: 'var(--accent2)' },
      { label: 'Livraisons en attente', value: d.nPending, color: d.nPending > 0 ? 'var(--orange)' : '' },
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

    // Calculer le vrai profit avec les frais pub des ventes
    const sales = State.getSalesByProduct(pid);
    const totalPub = sales.reduce((sum, v) => sum + (v.fb_cost || 0) + (v.tiktok_cost || 0) + (v.ads_cost || 0) + (v.misc_cost || 0), 0);
    const vraiProfit = s.ca - s.invest - (sales.reduce((sum, v) => sum + (v.shipping || 0), 0)) - totalPub;

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
            { label: 'Profit net réel',  value: fF(vraiProfit), color: vraiProfit >= 0 ? 'var(--green)' : 'var(--red)' },
            { label: 'Stock restant',    value: `${s.stock} u.`, color: s.isOutOfStock ? 'var(--red)' : s.isLowStock ? 'var(--yellow)' : 'var(--green)' },
            { label: 'Unités vendues',   value: `${s.sold} / ${p.qty}`, color: 'var(--blue)' },
            { label: 'Meilleur canal',   value: s.bestChannel,   color: 'var(--accent2)' },
            { label: 'Frais pub totaux', value: fF(totalPub),    color: totalPub > 0 ? 'var(--orange)' : 'var(--text3)' },
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
                      <div style="font-size:.7rem;color:var(--text3)">${fmtDate(v.sale_date)} · ${esc(v.channel || '—')}${v.fb_cost ? ' · Pub: ' + fF(v.fb_cost) : ''}</div>
                    </div>
                    <div style="font-weight:700;color:var(--blue)">${fF(v.price * v.qty)}</div>
                  </div>`;
              }).join('')
            : '<div style="font-size:.82rem;color:var(--text3);padding:10px 0">Aucune vente enregistrée.</div>'}
        </div>
      </div>`;
  },
};