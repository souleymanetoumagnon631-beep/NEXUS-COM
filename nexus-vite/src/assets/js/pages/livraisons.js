// ══════════════════════════════════════════
//   PAGE : LIVRAISONS
// ══════════════════════════════════════════
Pages.livraisons = {

  render() {
    $('liv-count-lbl').textContent = `${State.getLivraisons().length} livraison(s)`;
    this._renderPipeline();
    this._renderTable();
  },

  _renderPipeline() {
    const statuses = ['pending','confirmed','shipped','delivered'];
    const labels   = {
      pending:   'En attente',
      confirmed: 'Confirmé',
      shipped:   'Expédié',
      delivered: 'Livré',
    };

    $('liv-pipeline').innerHTML = statuses.map(s => {
      const items = State.getLivraisons().filter(l => l.status === s);
      const color = LIV_COLOR[s];
      return `
        <div class="pipeline-col">
          <div class="pipeline-header" style="color:${color}">
            ${labels[s]}
            <span class="pipeline-count">${items.length}</span>
          </div>
          ${items.map(l => {
            const c = State.getClient(l.client_id);
            const p = State.getProduct(l.product_id);
            return `
              <div class="delivery-card" onclick="Pages.livraisons.openModal('${l.id}')">
                <div class="delivery-name">${esc(c?.name || 'Anonyme')}</div>
                <div class="delivery-meta">${esc(p?.name || '?')} · ${l.qty || 1} u. · ${fF(l.amount)}</div>
                <div class="delivery-meta" style="margin-top:4px">${fmtDate(l.delivery_date)}</div>
              </div>`;
          }).join('')}
        </div>`;
    }).join('');
  },

  _renderTable() {
    const sorted = [...State.getLivraisons()]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    const tbody = $('liv-tbody');
    if (!sorted.length) {
      tbody.innerHTML = `<tr><td colspan="7">${EmptyState.html('Aucune livraison enregistrée.')}</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted.map((l, i) => {
      const c = State.getClient(l.client_id);
      const p = State.getProduct(l.product_id);
      return `
        <tr class="anim" style="animation-delay:${i * .025}s">
          <td style="font-weight:600">${esc(c?.name || 'Anonyme')}</td>
          <td>${esc(p?.name || '—')}</td>
          <td>${l.qty || 1}</td>
          <td style="color:var(--blue);font-weight:600">${fF(l.amount)}</td>
          <td>
            <select class="form-input" style="width:auto;padding:4px 8px;font-size:.78rem"
              onchange="Pages.livraisons.updateStatus('${l.id}',this.value)">
              ${['pending','confirmed','shipped','delivered','returned'].map(s =>
                `<option value="${s}"${l.status === s ? ' selected' : ''}>${LIV_STATUS[s]}</option>`
              ).join('')}
            </select>
          </td>
          <td style="color:var(--text3)">${fmtDate(l.delivery_date)}</td>
          <td>
            <div class="act">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.livraisons.openModal('${l.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.livraisons.delete('${l.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  },

  openModal(id = null) {
    State.modals.editLivId = id;
    $('liv-modal-title').textContent = id ? 'Modifier la Livraison' : 'Nouvelle Livraison';

    Form.fillClients('lm-client', '', '— Sélectionner un client —');
    Form.fillProducts('lm-product', '', '— Sélectionner un produit —');

    if (id) {
      const l = State.getLivraison(id);
      if (l) {
        Form.fillClients('lm-client',  l.client_id  || '');
        Form.fillProducts('lm-product', l.product_id || '');
        $('lm-qty').value     = l.qty || 1;
        $('lm-amount').value  = l.amount || '';
        $('lm-status').value  = l.status || 'pending';
        $('lm-date').value    = l.delivery_date || '';
        $('lm-address').value = l.address || '';
        $('lm-notes').value   = l.notes   || '';
      }
    } else {
      Form.clear('lm-amount','lm-address','lm-notes');
      $('lm-qty').value    = 1;
      $('lm-status').value = 'pending';
      $('lm-date').value   = today();
    }
    Modal.open('livModal');
  },

  async save() {
    const clientId  = str('lm-client');
    const productId = str('lm-product');

    const errors = Form.validate([
      { value: clientId,  message: 'Client requis.' },
      { value: productId, message: 'Produit requis.' },
    ]);
    if (errors.length) return Toast.err(errors[0]);

    const id      = State.modals.editLivId;
    const payload = {
      client_id:     clientId,
      product_id:    productId,
      qty:           num('lm-qty') || 1,
      amount:        num('lm-amount'),
      status:        str('lm-status') || 'pending',
      delivery_date: str('lm-date')   || today(),
      address:       str('lm-address'),
      notes:         str('lm-notes'),
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.livraisons.update(id, payload);
          State.updateLivraison(id, updated);
          Toast.ok('Livraison mise à jour.');
        } else {
          const liv = await DB.livraisons.create(payload);
          State.addLivraison(liv);
          Toast.ok('Livraison créée.');
        }
        Badges.update();
        this.render();
        Modal.close('livModal');
        State.modals.editLivId = null;
      },
      { btnId: 'btn-save-liv', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async updateStatus(id, status) {
    await Action.run(
      async () => {
        const updated = await DB.livraisons.updateStatus(id, status);
        State.updateLivraison(id, { status });
        Badges.update();
        this.render();
      },
      { successMsg: `Statut : ${LIV_STATUS[status]}.`, errorMsg: 'Erreur.' }
    );
  },

  async delete(id) {
    if (!Modal.confirm('Supprimer cette livraison ?')) return;
    await Action.run(
      async () => {
        await DB.livraisons.delete(id);
        State.removeLivraison(id);
        Badges.update();
        this.render();
      },
      { successMsg: 'Livraison supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
