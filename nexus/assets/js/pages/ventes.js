// ══════════════════════════════════════════
//   PAGE : VENTES
// ══════════════════════════════════════════
Pages.ventes = {

  init() {
    Form.fillProducts('v-product', '', '— Sélectionner —');
    Form.fillProducts('v-filter',  '', 'Tous les produits');
    Form.fillClients('v-client', '', '— Client anonyme —');
    const vd = $('v-date');
    if (vd && !vd.value) vd.value = today();
    this.render();
  },

  render() {
    const q    = str('v-search').toLowerCase();
    const fpid = $('v-filter')?.value || '';

    let list = [...State.getSales()]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    if (fpid) list = list.filter(s => s.product_id === fpid);
    if (q)    list = list.filter(s => {
      const p = State.getProduct(s.product_id);
      return p?.name.toLowerCase().includes(q) || (s.note || '').toLowerCase().includes(q);
    });

    $('v-count').textContent = `${State.getSales().length} vente(s)`;

    const tbody = $('v-tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="9">${EmptyState.html(
        q || fpid ? 'Aucun résultat.' : 'Aucune vente enregistrée.'
      )}</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((v, i) => {
      const p  = State.getProduct(v.product_id);
      const cl = State.getClient(v.client_id);
      const col = avColor(p?.name || '');
      const ca  = (v.price || 0) * (v.qty || 0);

      return `
        <tr class="anim" style="animation-delay:${i * .025}s">
          <td>
            <div class="td-prod">
              <div class="td-av" style="background:${col}22;color:${col}">${(p?.name || '?')[0].toUpperCase()}</div>
              <div>
                <div class="td-name">${esc(p?.name || 'Supprimé')}</div>
                ${v.note ? `<div class="td-sub">${esc(v.note)}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="color:var(--text2);font-size:.78rem">${cl ? esc(cl.name) : 'Anonyme'}</td>
          <td style="font-weight:600">${fF(v.price)}</td>
          <td>${(v.qty || 0).toLocaleString('fr-FR')}</td>
          <td style="color:var(--blue);font-weight:600">${fF(ca)}</td>
          <td style="color:var(--text2)">${v.shipping ? fF(v.shipping) : '—'}</td>
          <td><span class="badge bp">${esc(v.channel || 'Autre')}</span></td>
          <td style="color:var(--text3)">${fmtDate(v.sale_date)}</td>
          <td>
            <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.ventes.delete('${v.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
            </button>
          </td>
        </tr>`;
    }).join('');
  },

  onProductChange() {
    const pid  = str('v-product');
    const info = $('v-product-info');
    if (!pid) { info.style.display = 'none'; return; }

    const s = Engine.getProductStats(pid);
    const p = State.getProduct(pid);
    if (s && p) {
      $('vpi-invest').textContent = fF(s.invest);
      $('vpi-unit').textContent   = fF(s.unit);
      $('vpi-qty').textContent    = (p.qty || 0).toLocaleString('fr-FR');
      $('vpi-sold').textContent   = s.sold.toLocaleString('fr-FR');
      info.style.display          = 'flex';
    }
    this.updatePreview();
  },

  updatePreview() {
    const price    = num('v-price');
    const qty      = num('v-qty');
    const shipping = num('v-shipping');
    const ca       = price * qty;

    $('pv-ca').textContent = fF(ca);

    const pid = str('v-product');
    const el  = $('pv-profit');
    if (pid) {
      const s = Engine.getProductStats(pid);
      if (s) {
        const profit = ca - s.unit * qty - shipping;
        el.textContent  = fF(profit);
        el.style.color  = profit >= 0 ? 'var(--green)' : 'var(--red)';
      }
    } else {
      el.textContent = '—';
      el.style.color = '';
    }
  },

  async save() {
    const pid   = str('v-product');
    const price = num('v-price');
    const qty   = num('v-qty');

    const errors = Form.validate([
      { value: pid,   message: 'Sélectionnez un produit.' },
      { value: price, message: 'Prix de vente requis.' },
      { value: qty,   message: 'Quantité vendue requise.' },
    ]);
    if (errors.length) return Toast.err(errors[0]);

    const p = State.getProduct(pid);

    const payload = {
      product_id: pid,
      client_id:  str('v-client') || null,
      price,
      qty,
      shipping:   num('v-shipping') || 0,
      channel:    str('v-channel') || 'WhatsApp',
      sale_date:  str('v-date')    || today(),
      note:       str('v-note'),
    };

    await Action.run(
      async () => {
        const sale = await DB.sales.create(payload);
        State.addSale(sale);
        Badges.update();
        this.render();
        this.clearForm();
        this.onProductChange();
        Nav.refreshIfActive('dashboard');
      },
      {
        btnId:      'btn-save-vente',
        successMsg: `Vente enregistrée pour "${p?.name}".`,
        errorMsg:   'Erreur lors de l\'enregistrement.',
      }
    );
  },

  clearForm() {
    Form.clear('v-price', 'v-qty', 'v-shipping', 'v-note');
    const vd = $('v-date');
    if (vd) vd.value = today();
    $('pv-ca').textContent    = '0 FCFA';
    $('pv-profit').textContent = '—';
    $('pv-profit').style.color = '';
  },

  async delete(id) {
    const v = State.getSale(id);
    if (!v) return;
    const p = State.getProduct(v.product_id);
    if (!Modal.confirm(`Supprimer cette vente de "${p?.name || '?'}" ?`)) return;

    await Action.run(
      async () => {
        await DB.sales.delete(id);
        State.removeSale(id);
        Badges.update();
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { successMsg: 'Vente supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
