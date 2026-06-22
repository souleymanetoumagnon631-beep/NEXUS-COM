// ══════════════════════════════════════════
//   PAGE : ACHATS
// ══════════════════════════════════════════
Pages.achats = {

  render() {
    const q    = str('a-search').toLowerCase();
    const list = q
      ? State.getProducts().filter(p => p.name.toLowerCase().includes(q))
      : State.getProducts();

    $('a-count').textContent = `${State.getProducts().length} produit(s)`;

    const tbody = $('a-tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6">${EmptyState.html(
        q ? 'Aucun résultat.' : 'Aucun achat enregistré.',
        q ? '' : 'Ajoutez votre premier produit.'
      )}</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((p, i) => {
      const invest = Engine.computeInvest(p);
      const unit   = p.qty > 0 ? invest / p.qty : 0;
      const col    = avColor(p.name);
      return `
        <tr class="anim" style="animation-delay:${i * .03}s">
          <td>
            <div class="td-prod">
              <div class="td-av" style="background:${col}22;color:${col}">${p.name[0].toUpperCase()}</div>
              <div>
                <div class="td-name">${esc(p.name)}</div>
                <div class="td-sub">${fmtDate(p.created_at?.split('T')[0])}</div>
              </div>
            </div>
          </td>
          <td style="color:var(--text2)">${esc(p.store || '—')}</td>
          <td>${(p.qty || 0).toLocaleString('fr-FR')}</td>
          <td style="color:var(--accent2);font-weight:600">${fF(invest)}</td>
          <td style="color:var(--text2)">${fF(unit)}</td>
          <td>
            <div class="act">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.achats.openEdit('${p.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.achats.delete('${p.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  },

  updatePreview() {
    const p = {
      stock: num('a-stock'), fret: num('a-fret'),
      customs: num('a-customs'), packaging: num('a-packaging'),
      fb: num('a-fb'), tiktok: num('a-tiktok'),
      ads: num('a-ads'), misc: num('a-misc'),
      delivery: 0,
      qty: num('a-qty'),
    };
    const invest = Engine.computeInvest(p);
    $('pa-invest').textContent = fF(invest);
    $('pa-unit').textContent   = p.qty > 0 ? fF(invest / p.qty) : '—';
  },

  async save() {
    const name = str('a-name');
    const qty  = num('a-qty');

    const errors = Form.validate([
      { value: name, message: 'Nom du produit requis.' },
      { value: qty,  message: 'Quantité requise.' },
    ]);
    if (errors.length) return Toast.err(errors[0]);

    const payload = {
      name,
      store:      str('a-store'),
      qty,
      stock:      num('a-stock'),
      fret_type:  str('a-fret-type') || 'Aérien',
      fret:       num('a-fret'),
      customs:    num('a-customs'),
      packaging:  num('a-packaging'),
      fb:         num('a-fb'),
      tiktok:     num('a-tiktok'),
      ads:        num('a-ads'),
      misc:       num('a-misc'),
      delivery:   0,
    };

    await Action.run(
      async () => {
        const product = await DB.products.create(payload);
        State.addProduct(product);
        Badges.update();
        this.render();
        this.clearForm();
        if (State.ui.currentPage === 'dashboard') Pages.dashboard.render();
      },
      {
        btnId:      'btn-save-achat',
        successMsg: `"${name}" ajouté aux achats.`,
        errorMsg:   'Erreur lors de l\'enregistrement.',
      }
    );
  },

  clearForm() {
    Form.clear(
      'a-name','a-store','a-qty','a-stock',
      'a-fret','a-customs','a-packaging',
      'a-fb','a-tiktok','a-ads','a-misc'
    );
    const fretType = $('a-fret-type');
    if (fretType) fretType.value = 'Aérien';
    this.updatePreview();
  },

  openEdit(id) {
    const p = State.getProduct(id);
    if (!p) return;

    State.modals.editProductId = id;

    const fields = [
      { k: 'name',      lb: 'Nom',           t: 'text',   full: true },
      { k: 'store',     lb: 'Boutique',       t: 'text',   full: true },
      { k: 'qty',       lb: 'Quantité',       t: 'number' },
      { k: 'stock',     lb: 'Coût stock',     t: 'number' },
      { k: 'fret_type', lb: 'Type de fret',   t: 'select', options: ['Aérien', 'Maritime'] },
      { k: 'fret',      lb: 'Fret',           t: 'number' },
      { k: 'customs',   lb: 'Douane',         t: 'number' },
      { k: 'packaging', lb: 'Emballage',      t: 'number' },
      { k: 'fb',        lb: 'Facebook Ads',   t: 'number' },
      { k: 'tiktok',    lb: 'TikTok Ads',     t: 'number' },
      { k: 'ads',       lb: 'Autres pubs',    t: 'number' },
      { k: 'misc',      lb: 'Autres frais',   t: 'number', full: true },
    ];

    const bodyHtml = `
      <div class="form-grid">
        ${fields.map(f => {
          if (f.t === 'select') {
            return `
              <div class="form-group${f.full ? ' form-full' : ''}">
                <label class="form-label">${f.lb}</label>
                <select class="form-input" id="em-${f.k}">
                  ${f.options.map(opt =>
                    `<option value="${esc(opt)}"${p[f.k] === opt ? ' selected' : ''}>${esc(opt)}</option>`
                  ).join('')}
                </select>
              </div>`;
          }
          return `
            <div class="form-group${f.full ? ' form-full' : ''}">
              <label class="form-label">${f.lb}</label>
              <input type="${f.t}" class="form-input" id="em-${f.k}"
                value="${esc(String(p[f.k] ?? ''))}"
                ${f.t === 'number' ? 'min="0"' : ''}>
            </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:9px;margin-top:18px">
        <button class="btn btn-secondary" style="flex:1" onclick="Modal.close('editModal')">Annuler</button>
        <button class="btn btn-primary" style="flex:1" onclick="Pages.achats.saveEdit()">Sauvegarder</button>
      </div>`;

    $('editModalTitle').textContent = `Modifier — ${esc(p.name)}`;
    $('editBody').innerHTML         = bodyHtml;
    Modal.open('editModal');
  },

  async saveEdit() {
    const id = State.modals.editProductId;
    if (!id) return;

    const payload = {
      name:      $('em-name')?.value.trim()  || '',
      store:     $('em-store')?.value.trim() || '',
      qty:       parseFloat($('em-qty')?.value)       || 0,
      stock:     parseFloat($('em-stock')?.value)     || 0,
      fret_type: $('em-fret_type')?.value    || 'Aérien',
      fret:      parseFloat($('em-fret')?.value)      || 0,
      customs:   parseFloat($('em-customs')?.value)   || 0,
      packaging: parseFloat($('em-packaging')?.value) || 0,
      fb:        parseFloat($('em-fb')?.value)        || 0,
      tiktok:    parseFloat($('em-tiktok')?.value)    || 0,
      ads:       parseFloat($('em-ads')?.value)       || 0,
      misc:      parseFloat($('em-misc')?.value)      || 0,
    };

    if (!payload.name) return Toast.err('Nom requis.');

    await Action.run(
      async () => {
        const updated = await DB.products.update(id, payload);
        State.updateProduct(id, updated);
        Modal.close('editModal');
        State.modals.editProductId = null;
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { successMsg: 'Achat mis à jour.', errorMsg: 'Erreur lors de la mise à jour.' }
    );
  },

  async delete(id) {
    const p = State.getProduct(id);
    if (!p) return;
    if (!Modal.confirm(`Supprimer "${p.name}" et toutes ses ventes ?`)) return;

    await Action.run(
      async () => {
        await DB.products.delete(id);
        State.removeProduct(id);
        Badges.update();
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { successMsg: `"${p.name}" supprimé.`, errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
