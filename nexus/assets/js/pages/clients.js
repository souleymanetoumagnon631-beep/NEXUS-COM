// ══════════════════════════════════════════
//   PAGE : CLIENTS
// ══════════════════════════════════════════
Pages.clients = {

  render() {
    const q    = str('clients-search').toLowerCase();
    const list = q
      ? State.getClients().filter(c =>
          c.name.toLowerCase().includes(q) ||
          (c.phone || '').includes(q))
      : State.getClients();

    $('clients-count-lbl').textContent = `${State.getClients().length} client(s)`;

    // KPIs
    const totalCA   = State.getClients().reduce((a, c) => a + Engine.getClientStats(c.id).ca, 0);
    const recurrent = State.getClients().filter(c => Engine.getClientStats(c.id).isRecurrent).length;

    $('clients-stats').innerHTML = `
      <div class="stat-card c-blue anim">
        <div class="stat-icon-wrap" style="background:rgba(96,165,250,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div class="stat-label">Total Clients</div>
        <div class="stat-val">${State.getClients().length}</div>
        <div class="stat-sub">enregistrés</div>
      </div>
      <div class="stat-card c-green anim" style="animation-delay:.05s">
        <div class="stat-icon-wrap" style="background:rgba(52,211,153,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-label">Récurrents</div>
        <div class="stat-val" style="color:var(--green)">${recurrent}</div>
        <div class="stat-sub">2+ commandes</div>
      </div>
      <div class="stat-card c-purple anim" style="animation-delay:.1s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-label">CA Total Clients</div>
        <div class="stat-val" style="font-size:.95rem">${fF(totalCA)}</div>
        <div class="stat-sub">cumulé</div>
      </div>
      <div class="stat-card c-yellow anim" style="animation-delay:.15s">
        <div class="stat-icon-wrap" style="background:rgba(251,191,36,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </div>
        <div class="stat-label">Panier Moyen</div>
        <div class="stat-val" style="font-size:.95rem">
          ${State.getClients().length ? fF(totalCA / State.getClients().length) : '—'}
        </div>
        <div class="stat-sub">par client</div>
      </div>`;

    const grid = $('clients-grid');
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${EmptyState.html(
        q ? 'Aucun résultat.' : 'Aucun client enregistré.',
        q ? '' : 'Ajoutez votre premier client !'
      )}</div>`;
      return;
    }

    grid.innerHTML = list.map((c, i) => {
      const cs  = Engine.getClientStats(c.id);
      const col = avColor(c.name);
      return `
        <div class="client-card anim" style="animation-delay:${i * .04}s">
          <div class="client-header">
            <div class="client-avatar" style="background:linear-gradient(135deg,${col},${col}88)">
              ${c.name[0].toUpperCase()}
            </div>
            <div style="flex:1;min-width:0">
              <div class="client-name">
                ${esc(c.name)}
                ${cs.isRecurrent ? '<span class="badge bg" style="font-size:.6rem;margin-left:6px">Récurrent</span>' : ''}
              </div>
              <div class="client-phone">${c.phone || '—'}${c.city ? ` · ${esc(c.city)}` : ''}</div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.clients.openModal('${c.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.clients.delete('${c.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          </div>
          <div class="client-stats">
            <div class="client-stat">
              <div class="client-stat-val" style="color:var(--blue)">${fF(cs.ca)}</div>
              <div class="client-stat-lbl">CA total</div>
            </div>
            <div class="client-stat">
              <div class="client-stat-val" style="color:var(--accent2)">${cs.orders}</div>
              <div class="client-stat-lbl">Commandes</div>
            </div>
            <div class="client-stat">
              <div class="client-stat-val" style="color:var(--text2);font-size:.75rem">
                ${cs.lastDate ? fmtDate(cs.lastDate) : '—'}
              </div>
              <div class="client-stat-lbl">Dernier achat</div>
            </div>
          </div>
          ${c.notes
            ? `<div style="margin-top:10px;font-size:.75rem;color:var(--text3);border-top:1px solid var(--border);padding-top:8px">${esc(c.notes)}</div>`
            : ''}
        </div>`;
    }).join('');
  },

  openModal(id = null) {
    State.modals.editClientId = id;
    $('client-modal-title').textContent = id ? 'Modifier le Client' : 'Nouveau Client';

    if (id) {
      const c = State.getClient(id);
      if (c) {
        $('cm-name').value    = c.name    || '';
        $('cm-phone').value   = c.phone   || '';
        $('cm-city').value    = c.city    || '';
        $('cm-address').value = c.address || '';
        $('cm-notes').value   = c.notes   || '';
      }
    } else {
      Form.clear('cm-name','cm-phone','cm-city','cm-address','cm-notes');
    }
    Modal.open('clientModal');
  },

  async save() {
    const name = str('cm-name');
    if (!name) return Toast.err('Nom requis.');

    const id      = State.modals.editClientId;
    const payload = {
      name,
      phone:   str('cm-phone'),
      city:    str('cm-city'),
      address: str('cm-address'),
      notes:   str('cm-notes'),
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.clients.update(id, payload);
          State.updateClient(id, updated);
          Toast.ok(`"${name}" mis à jour.`);
        } else {
          const client = await DB.clients.create(payload);
          State.addClient(client);
          Toast.ok(`"${name}" ajouté.`);
        }
        Badges.update();
        this.render();
        Modal.close('clientModal');
        State.modals.editClientId = null;
      },
      { btnId: 'btn-save-client', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async delete(id) {
    const c = State.getClient(id);
    if (!c || !Modal.confirm(`Supprimer "${c.name}" ?`)) return;

    await Action.run(
      async () => {
        await DB.clients.delete(id);
        State.removeClient(id);
        Badges.update();
        this.render();
      },
      { successMsg: `"${c.name}" supprimé.`, errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
