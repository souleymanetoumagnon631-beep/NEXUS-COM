// ══════════════════════════════════════════
//   PAGE : PRODUITS (Inventaire)
// ══════════════════════════════════════════
Pages.produits = {

  render() {
    const q      = str('prod-search').toLowerCase();
    const sortBy = $('prod-sort')?.value || 'name';

    let list = State.getProducts()
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .map(p => ({ p, s: Engine.getProductStats(p.id) }))
      .filter(x => x.s !== null);

    // Tri
    const sortFns = {
      name:   (a, b) => a.p.name.localeCompare(b.p.name),
      stock:  (a, b) => b.s.stock   - a.s.stock,
      invest: (a, b) => b.s.invest  - a.s.invest,
      profit: (a, b) => b.s.profit  - a.s.profit,
    };
    list.sort(sortFns[sortBy] || sortFns.name);

    $('prod-count').textContent = `${State.getProducts().length} produit(s)`;

    const tbody = $('prod-tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="10">${EmptyState.html(
        q ? 'Aucun résultat.' : 'Aucun produit enregistré.'
      )}</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(({ p, s }, i) => {
      const col = avColor(p.name);

      let stB, stL;
      if      (s.isOutOfStock) { stB = 'br'; stL = 'Rupture'; }
      else if (s.isLowStock)   { stB = 'by'; stL = 'Stock faible'; }
      else                     { stB = 'bg'; stL = 'En stock'; }

      const stockColor = s.isOutOfStock
        ? 'var(--red)'
        : s.isLowStock
          ? 'var(--yellow)'
          : 'var(--text)';

      return `
        <tr class="anim" style="animation-delay:${i * .025}s">
          <td>
            <div class="td-prod">
              <div class="td-av" style="background:${col}22;color:${col}">${p.name[0].toUpperCase()}</div>
              <div>
                <div class="td-name">${esc(p.name)}</div>
                ${p.store ? `<div class="td-sub">${esc(p.store)}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="color:var(--text2);font-size:.78rem">${esc(p.store || '—')}</td>
          <td>${(p.qty || 0).toLocaleString('fr-FR')}</td>
          <td style="color:var(--green)">${s.sold.toLocaleString('fr-FR')}</td>
          <td style="font-weight:600;color:${stockColor}">
            ${s.stock.toLocaleString('fr-FR')}
            ${s.isLowStock && !s.isOutOfStock
              ? `<span style="font-size:.65rem;color:var(--yellow);margin-left:4px">⚠</span>`
              : ''}
          </td>
          <td style="color:var(--text2)">${fF(s.unit)}</td>
          <td style="color:var(--accent2)">${fF(s.invest)}</td>
          <td style="color:var(--blue)">${fF(s.ca)}</td>
          <td>
            <span class="badge ${s.profit >= 0 ? 'bg' : 'br'}">${fF(s.profit)}</span>
          </td>
          <td><span class="badge ${stB}">${stL}</span></td>
        </tr>`;
    }).join('');
  },
};
