// ══════════════════════════════════════════
//   PAGE : FINANCES
// ══════════════════════════════════════════
Pages.finances = {

  render() {
    const fin = Engine.getFinancesStats();
    this._renderKPIs(fin);
    this._renderTable();
    Charts.buildBreakevenChart();
  },

  _renderKPIs(fin) {
    $('fin-kpis').innerHTML = `
      <div class="fin-card" style="border-color:rgba(248,113,113,0.2)">
        <div class="fin-label">Dépenses Fixes / Mois</div>
        <div class="fin-val" style="color:var(--red)">${fF(fin.totalFixed)}</div>
        <div class="fin-sub">${State.getExpenses().length} poste(s)</div>
      </div>
      <div class="fin-card" style="border-color:rgba(52,211,153,0.2)">
        <div class="fin-label">Profit Brut</div>
        <div class="fin-val" style="color:var(--green)">${fF(fin.totalProfit)}</div>
        <div class="fin-sub">Avant dépenses fixes</div>
      </div>
      <div class="fin-card" style="border-color:${fin.netProfit >= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}">
        <div class="fin-label">Profit Net</div>
        <div class="fin-val" style="color:${fin.netProfit >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${fF(fin.netProfit)}
        </div>
        <div class="fin-sub">Après dépenses fixes</div>
      </div>
      <div class="fin-card" style="border-color:rgba(251,191,36,0.2)">
        <div class="fin-label">CA Moyen / Mois</div>
        <div class="fin-val" style="color:var(--yellow)">${fF(fin.avgMonthCA)}</div>
        <div class="fin-sub">Sur l'historique</div>
      </div>
      <div class="fin-card" style="border-color:rgba(124,111,255,0.2)">
        <div class="fin-label">Seuil de Rentabilité</div>
        <div class="fin-val" style="color:var(--accent2)">
          ${fin.breakeven ? fin.breakeven + ' u.' : '—'}
        </div>
        <div class="fin-sub">Unités à vendre / mois</div>
      </div>`;
  },

  _renderTable() {
    const expenses = State.getExpenses();
    const total    = State.getTotalExpenses();

    const tbody = $('depenses-tbody');

    if (!expenses.length) {
      tbody.innerHTML = `<tr><td colspan="4">${EmptyState.html(
        'Aucune dépense fixe enregistrée.',
        'Ajoutez vos coûts récurrents : abonnements, loyer, etc.'
      )}</td></tr>`;
    } else {
      tbody.innerHTML = expenses.map((d, i) => `
        <tr class="anim" style="animation-delay:${i * .03}s">
          <td style="font-weight:600">${esc(d.name)}</td>
          <td style="color:var(--red);font-weight:600">${fF(d.amount)}</td>
          <td><span class="badge bo">${esc(d.category || 'Autre')}</span></td>
          <td>
            <div class="act">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.finances.openModal('${d.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.finances.delete('${d.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>`).join('');
    }

    $('depenses-total').textContent = fF(total);
  },

  openModal(id = null) {
    State.modals.editExpenseId = id;
    $('dep-modal-title').textContent = id ? 'Modifier la Dépense' : 'Nouvelle Dépense Fixe';

    if (id) {
      const d = State.getExpense(id);
      if (d) {
        $('dm-name').value     = d.name     || '';
        $('dm-amount').value   = d.amount   || '';
        $('dm-category').value = d.category || 'Autre';
      }
    } else {
      Form.clear('dm-name','dm-amount');
      $('dm-category').value = 'Marketing';
    }
    Modal.open('depenseModal');
  },

  async save() {
    const name   = str('dm-name');
    const amount = num('dm-amount');

    const errors = Form.validate([
      { value: name,   message: 'Nom requis.' },
      { value: amount, message: 'Montant requis.' },
    ]);
    if (errors.length) return Toast.err(errors[0]);

    const id      = State.modals.editExpenseId;
    const payload = {
      name,
      amount,
      category: str('dm-category') || 'Autre',
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.expenses.update(id, payload);
          State.updateExpense(id, updated);
          Toast.ok('Dépense mise à jour.');
        } else {
          const expense = await DB.expenses.create(payload);
          State.addExpense(expense);
          Toast.ok(`"${name}" ajoutée.`);
        }
        this.render();
        Modal.close('depenseModal');
        State.modals.editExpenseId = null;
      },
      { btnId: 'btn-save-dep', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async delete(id) {
    const d = State.getExpense(id);
    if (!d || !Modal.confirm(`Supprimer "${d.name}" ?`)) return;

    await Action.run(
      async () => {
        await DB.expenses.delete(id);
        State.removeExpense(id);
        this.render();
      },
      { successMsg: 'Dépense supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
