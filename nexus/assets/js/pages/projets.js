// ══════════════════════════════════════════
//   PAGE : PROJETS
// ══════════════════════════════════════════
Pages.projets = {

  _filter: '',

  render() {
    const list = this._filter
      ? State.getProjects().filter(p => p.status === this._filter)
      : State.getProjects();

    $('proj-count-lbl').textContent = `${State.getProjects().length} projet(s)`;

    const grid = $('proj-grid');
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${EmptyState.html(
        this._filter ? 'Aucun projet avec ce statut.' : 'Aucun projet.',
        this._filter ? '' : 'Créez votre premier projet !'
      )}</div>`;
      return;
    }

    grid.innerHTML = list.map((pr, i) => {
      const pct      = Engine.getProjectProgress(pr);
      const s        = pr.product_id ? Engine.getProductStats(pr.product_id) : null;
      const prod     = pr.product_id ? State.getProduct(pr.product_id) : null;
      const sold     = s ? s.sold : 0;
      const remaining = pr.target_qty > 0 ? Math.max(0, pr.target_qty - sold) : 0;
      const barColor = pct >= 100 ? 'var(--green)' : pct >= 60 ? 'var(--accent)' : pct >= 30 ? 'var(--yellow)' : 'var(--red)';

      const daysLeft = pr.end_date
        ? Math.ceil((new Date(pr.end_date) - new Date()) / 86400000)
        : null;
      const isLate   = daysLeft !== null && daysLeft < 0 && pr.status !== 'term';

      return `
        <div class="proj-card s-${pr.status} anim" style="animation-delay:${i * .04}s">
          <div class="proj-header">
            <div class="proj-name">${esc(pr.name)}</div>
            <span class="badge ${STATUS_BADGE[pr.status] || 'bp'}">
              ${STATUS_LABELS[pr.status] || pr.status}
            </span>
          </div>

          <div class="proj-desc">
            ${pr.description || '<span style="color:var(--text3)">Aucune description</span>'}
          </div>

          <div class="proj-meta">
            ${prod ? `<span class="badge bb">${esc(prod.name)}</span>` : ''}
            ${pr.start_date
              ? `<span class="badge" style="background:var(--surface);color:var(--text2);border:1px solid var(--border);font-size:.67rem">
                  ${fmtDate(pr.start_date)}
                </span>`
              : ''}
            ${pr.end_date
              ? `<span class="badge ${isLate ? 'br' : 'by'}" style="font-size:.67rem">
                  ${isLate ? 'Retard · ' : ''}${fmtDate(pr.end_date)}
                </span>`
              : ''}
          </div>

          ${pr.target_qty > 0 ? `
            <div class="proj-prog-label">
              <span>${sold.toLocaleString('fr-FR')} / ${pr.target_qty.toLocaleString('fr-FR')} vendus</span>
              <span style="color:${barColor};font-weight:700">${pct}%</span>
            </div>
            <div class="proj-prog-wrap">
              <div class="proj-prog-bar" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <div style="font-size:.72rem;color:var(--text3);margin-bottom:10px">
              ${remaining} unité(s) restante(s)
            </div>` : ''}

          <div class="proj-stats">
            <div class="proj-stat">
              <div class="proj-stat-val" style="color:var(--accent2)">${s ? fF(s.invest) : '—'}</div>
              <div class="proj-stat-lbl">Investi</div>
            </div>
            <div class="proj-stat">
              <div class="proj-stat-val" style="color:var(--blue)">${s ? fF(s.ca) : '—'}</div>
              <div class="proj-stat-lbl">CA</div>
            </div>
            <div class="proj-stat">
              <div class="proj-stat-val" style="color:${s && s.profit >= 0 ? 'var(--green)' : 'var(--red)'}">
                ${s ? fF(s.profit) : '—'}
              </div>
              <div class="proj-stat-lbl">Profit</div>
            </div>
          </div>

          <div class="proj-actions">
            <button class="btn btn-sm btn-secondary" onclick="Pages.projets.openModal('${pr.id}')">
              Modifier
            </button>
            <button class="btn btn-sm btn-danger" onclick="Pages.projets.delete('${pr.id}')">
              Supprimer
            </button>
          </div>
        </div>`;
    }).join('');
  },

  filter(el, status) {
    this._filter = status;
    $$('#proj-status-filters .task-filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this.render();
  },

  openModal(id = null) {
    State.modals.editProjectId = id;
    $('proj-modal-title').textContent = id ? 'Modifier le Projet' : 'Nouveau Projet';

    Form.fillProducts('pm-product', '', '— Aucun produit —');

    if (id) {
      const pr = State.getProject(id);
      if (pr) {
        $('pm-name').value    = pr.name        || '';
        $('pm-desc').value    = pr.description || '';
        $('pm-target').value  = pr.target_qty  || '';
        $('pm-status').value  = pr.status      || 'prep';
        $('pm-start').value   = pr.start_date  || '';
        $('pm-end').value     = pr.end_date    || '';
        Form.fillProducts('pm-product', pr.product_id || '');
      }
    } else {
      Form.clear('pm-name','pm-desc','pm-target','pm-end');
      $('pm-status').value = 'prep';
      $('pm-start').value  = today();
    }
    Modal.open('projectModal');
  },

  async save() {
    const name = str('pm-name');
    if (!name) return Toast.err('Nom requis.');

    const id      = State.modals.editProjectId;
    const payload = {
      name,
      description: str('pm-desc'),
      product_id:  str('pm-product') || null,
      target_qty:  num('pm-target')  || 0,
      status:      str('pm-status')  || 'prep',
      start_date:  str('pm-start')   || null,
      end_date:    str('pm-end')     || null,
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.projects.update(id, payload);
          State.updateProject(id, updated);
          Toast.ok(`"${name}" mis à jour.`);
        } else {
          const project = await DB.projects.create(payload);
          State.addProject(project);
          Toast.ok(`Projet "${name}" créé.`);
        }
        Badges.update();
        this.render();
        Modal.close('projectModal');
        State.modals.editProjectId = null;
        Nav.refreshIfActive('dashboard');
      },
      { btnId: 'btn-save-proj', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async delete(id) {
    const pr = State.getProject(id);
    if (!pr || !Modal.confirm(`Supprimer "${pr.name}" ?`)) return;

    await Action.run(
      async () => {
        await DB.projects.delete(id);
        State.removeProject(id);
        Badges.update();
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { successMsg: 'Projet supprimé.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
