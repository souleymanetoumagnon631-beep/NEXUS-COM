// ══════════════════════════════════════════
//   PAGE : RENTABILITÉ
// ══════════════════════════════════════════
Pages.rentabilite = {

  _sort: { field: 'profit', dir: -1 },

  render() {
    const q    = str('r-search').toLowerCase();
    const list = Engine.getRentabiliteList(
      this._sort.field,
      this._sort.dir,
      q
    );

    $('r-count').textContent = `${list.length} produit(s)`;

    const tbody = $('r-tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="11">${EmptyState.html(
        q ? 'Aucun résultat.' : 'Ajoutez des achats puis des ventes.'
      )}</td></tr>`;
      Charts.destroy('profit-bar');
      return;
    }

    tbody.innerHTML = list.map(({ p, s }, i) => {
      const col = avColor(p.name);
      const pb  = s.profit  >= 0 ? 'bg' : 'br';
      const rb  = s.roi     >= 0 ? 'bg' : 'br';
      const mb  = s.margin  >= 0 ? 'bg' : 'br';

      let stB, stL;
      if      (s.nSales === 0)  { stB = 'by'; stL = 'En attente'; }
      else if (s.profit > 0)    { stB = 'bg'; stL = 'Rentable'; }
      else if (s.profit === 0)  { stB = 'bb'; stL = 'Équilibre'; }
      else                      { stB = 'br'; stL = 'Déficit'; }

      return `
        <tr class="anim" style="animation-delay:${i * .03}s">
          <td>
            <div class="td-prod">
              <div class="td-av" style="background:${col}22;color:${col}">${p.name[0].toUpperCase()}</div>
              <div>
                <div class="td-name">${esc(p.name)}</div>
                <div class="td-sub">${s.sold} vendus / ${p.qty} achetés</div>
              </div>
            </div>
          </td>
          <td style="color:var(--text2);font-size:.78rem">${esc(p.store || '—')}</td>
          <td style="color:var(--accent2);font-weight:600">${fF(s.invest)}</td>
          <td style="color:var(--blue);font-weight:600">${fF(s.ca)}</td>
          <td style="color:var(--text2)">${fF(s.unit)}</td>
          <td><span class="badge ${pb}">${fF(s.profit)}</span></td>
          <td><span class="badge ${mb}">${fP(s.margin)}</span></td>
          <td><span class="badge ${rb}">${fP(s.roi)}</span></td>
          <td><span class="badge bp">${s.nSales}</span></td>
          <td>
            <span style="font-weight:600;color:${
              s.isOutOfStock ? 'var(--red)' :
              s.isLowStock   ? 'var(--yellow)' :
              'var(--green)'
            }">
              ${s.stock}
            </span>
          </td>
          <td><span class="badge ${stB}">${stL}</span></td>
        </tr>`;
    }).join('');

    Charts.buildProfitChart();
  },

  sortBy(field) {
    if (this._sort.field === field) {
      this._sort.dir *= -1;
    } else {
      this._sort.field = field;
      this._sort.dir   = -1;
    }

    ['profit','roi','ca'].forEach(f => {
      const btn = $(`rs-${f}`);
      if (btn) btn.className = `btn btn-sm ${this._sort.field === f ? 'btn-primary' : 'btn-secondary'}`;
    });

    this.render();
  },
};
