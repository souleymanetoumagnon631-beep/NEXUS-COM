// ══════════════════════════════════════════
//   PAGE : IDÉES PRODUITS
// ══════════════════════════════════════════
Pages.idees = {

  _filter:    '',
  _tempScores: { wow: 0, margin: 0, quality: 0, selling: 0, problem: 0 },

  _criteria: [
    { key: 'wow',     label: 'Effet Wow',        sub: 'Produit surprenant, désirable, viral' },
    { key: 'margin',  label: 'Marge Solide',      sub: 'Potentiel de profit élevé' },
    { key: 'quality', label: 'Qualité Perçue',    sub: 'Produit solide, retours positifs' },
    { key: 'selling', label: 'Se vend déjà',      sub: 'Preuve de marché existante' },
    { key: 'problem', label: 'Résout un problème',sub: 'Répond à un besoin réel' },
  ],

  render() {
    const q    = str('ideas-search').toLowerCase();
    let   list = [...State.getIdeas()];

    if (this._filter) list = list.filter(x => x.status === this._filter);
    if (q)            list = list.filter(x =>
      x.name.toLowerCase().includes(q) ||
      (x.notes || '').toLowerCase().includes(q)
    );

    // Tri par score décroissant
    list.sort((a, b) => {
      const sa = Object.values(a.scores || {}).reduce((s, v) => s + v, 0);
      const sb = Object.values(b.scores || {}).reduce((s, v) => s + v, 0);
      return sb - sa;
    });

    $('idees-count-lbl').textContent = `${State.getIdeas().length} idée(s)`;

    // KPIs
    const total     = State.getIdeas().length;
    const validated = State.getIdeas().filter(x => x.status === 'validated').length;
    const research  = State.getIdeas().filter(x => x.status === 'research').length;
    const excellent = State.getIdeas().filter(x =>
      Object.values(x.scores || {}).reduce((s, v) => s + v, 0) >= 20
    ).length;

    $('idees-stats').innerHTML = `
      <div class="stat-card c-blue anim">
        <div class="stat-icon-wrap" style="background:rgba(96,165,250,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
        </div>
        <div class="stat-label">Total Idées</div>
        <div class="stat-val">${total}</div>
        <div class="stat-sub">enregistrées</div>
      </div>
      <div class="stat-card c-green anim" style="animation-delay:.05s">
        <div class="stat-icon-wrap" style="background:rgba(52,211,153,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-label">Validées</div>
        <div class="stat-val" style="color:var(--green)">${validated}</div>
        <div class="stat-sub">prêtes à tester</div>
      </div>
      <div class="stat-card c-purple anim" style="animation-delay:.1s">
        <div class="stat-icon-wrap" style="background:rgba(124,111,255,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div class="stat-label">En Recherche</div>
        <div class="stat-val" style="color:var(--accent2)">${research}</div>
        <div class="stat-sub">en analyse</div>
      </div>
      <div class="stat-card c-orange anim" style="animation-delay:.15s">
        <div class="stat-icon-wrap" style="background:rgba(251,146,60,0.12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="stat-label">Excellent Potentiel</div>
        <div class="stat-val" style="color:var(--orange)">${excellent}</div>
        <div class="stat-sub">score ≥ 20/25</div>
      </div>`;

    const grid = $('ideas-grid');
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${EmptyState.html(
        q || this._filter ? 'Aucune idée trouvée.' : 'Aucune idée. Cliquez "+ Nouvelle Idée" !'
      )}</div>`;
      return;
    }

    const statusLabel = { idea: 'Idée', research: 'En recherche', validated: 'Validé', rejected: 'Écarté' };
    const statusBadge = { idea: 'bb',  research: 'bp',           validated: 'bg',      rejected: 'br' };

    grid.innerHTML = list.map((idea, i) => {
      const sc     = Engine.getIdeaScore(idea);
      const profit = (idea.price || 0) - (idea.cost || 0);
      const pct    = idea.price > 0 ? ((profit / idea.price) * 100).toFixed(1) : null;

      return `
        <div class="idea-card ${sc.cls} anim" style="animation-delay:${i * .04}s">

          <!-- Header -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:7px">
            <div style="font-size:.95rem;font-weight:700;line-height:1.35;flex:1">${esc(idea.name)}</div>
            <span class="badge ${statusBadge[idea.status] || 'bb'}">
              ${statusLabel[idea.status] || idea.status}
            </span>
          </div>

          ${idea.category
            ? `<div style="margin-bottom:7px">
                <span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text2);border:1px solid var(--border);font-size:.65rem">
                  ${esc(idea.category)}
                </span>
              </div>`
            : ''}

          ${idea.notes
            ? `<div style="font-size:.78rem;color:var(--text2);margin-bottom:12px;line-height:1.6">
                ${esc(idea.notes)}
              </div>`
            : ''}

          <!-- Barres de score -->
          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">
            ${this._criteria.map(c => {
              const val = (idea.scores || {})[c.key] || 0;
              const bc  = val >= 5 ? 'var(--green-d)'
                        : val >= 4 ? 'var(--accent)'
                        : val >= 3 ? 'var(--yellow)'
                        : val >= 2 ? 'var(--orange)'
                        : 'var(--red-d)';
              return `
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="font-size:.65rem;color:var(--text3);width:115px;flex-shrink:0">${c.label}</div>
                  <div style="flex:1;height:5px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
                    <div style="width:${val * 20}%;height:100%;background:${bc};border-radius:99px"></div>
                  </div>
                  <div style="font-size:.68rem;font-weight:700;width:14px;text-align:right">${val}</div>
                </div>`;
            }).join('')}
          </div>

          <!-- Score total -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:9px;border:1px solid rgba(255,255,255,0.05);margin-bottom:12px">
            <div>
              <div style="font-size:.65rem;color:var(--text3);margin-bottom:2px">Score Total</div>
              <div style="font-size:1.15rem;font-weight:800;color:${sc.color}">${sc.total} / 25</div>
            </div>
            <span class="badge" style="background:rgba(255,255,255,0.04);color:${sc.color};border:1px solid ${sc.color}33">
              ${sc.badge}
            </span>
          </div>

          <!-- Marge estimée -->
          ${(idea.cost || idea.price) ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px">
              ${idea.cost ? `
                <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;padding:8px 10px;text-align:center">
                  <div style="font-size:.63rem;color:var(--text3);margin-bottom:2px">Coût fournisseur</div>
                  <div style="font-size:.88rem;font-weight:700;color:var(--accent2)">
                    ${Math.round(idea.cost).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>` : ''}
              ${idea.price ? `
                <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;padding:8px 10px;text-align:center">
                  <div style="font-size:.63rem;color:var(--text3);margin-bottom:2px">Prix de vente</div>
                  <div style="font-size:.88rem;font-weight:700;color:var(--blue)">
                    ${Math.round(idea.price).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>` : ''}
              ${pct !== null ? `
                <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:8px;padding:8px 10px;text-align:center;grid-column:1/-1">
                  <div style="font-size:.63rem;color:var(--text3);margin-bottom:2px">Marge estimée</div>
                  <div style="font-size:.88rem;font-weight:700;color:${profit >= 0 ? 'var(--green)' : 'var(--red)'}">
                    ${profit >= 0 ? '+' : ''}${pct}% · ${Math.round(profit).toLocaleString('fr-FR')} FCFA/u
                  </div>
                </div>` : ''}
            </div>` : ''}

          ${idea.ref_url
            ? `<div style="margin-bottom:10px">
                <a href="${esc(idea.ref_url)}" target="_blank" rel="noopener"
                  style="font-size:.75rem;color:var(--accent2);text-decoration:none">
                  Voir la référence →
                </a>
              </div>`
            : ''}

          <!-- Actions -->
          <div style="display:flex;gap:6px;justify-content:flex-end">
            <button class="btn btn-sm btn-secondary" onclick="Pages.idees.openModal('${idea.id}')">Modifier</button>
            <button class="btn btn-sm btn-danger"    onclick="Pages.idees.delete('${idea.id}')">Supprimer</button>
          </div>
        </div>`;
    }).join('');
  },

  filter(el, status) {
    this._filter = status;
    $$('#page-idees .task-filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this.render();
  },

  openModal(id = null) {
    State.modals.editIdeaId = id;
    $('idea-modal-title').textContent = id ? 'Modifier l\'Idée' : 'Nouvelle Idée Produit';

    if (id) {
      const idea = State.getIdea(id);
      if (idea) {
        $('im-name').value     = idea.name     || '';
        $('im-notes').value    = idea.notes    || '';
        $('im-category').value = idea.category || '';
        $('im-status').value   = idea.status   || 'idea';
        $('im-ref').value      = idea.ref_url  || '';
        $('im-cost').value     = idea.cost     || '';
        $('im-price').value    = idea.price    || '';
        this._tempScores = { ...{ wow:0,margin:0,quality:0,selling:0,problem:0 }, ...(idea.scores || {}) };
      }
    } else {
      Form.clear('im-name','im-notes','im-category','im-ref','im-cost','im-price');
      $('im-status').value = 'idea';
      this._tempScores = { wow:0, margin:0, quality:0, selling:0, problem:0 };
    }

    this._buildScoreCriteria();
    this.updateMarginPreview();
    Modal.open('ideaModal');
  },

  _buildScoreCriteria() {
    const wrap = $('score-criteria');
    if (!wrap) return;

    wrap.innerHTML = this._criteria.map(c => `
      <div class="score-row">
        <div class="score-lbl">
          ${c.label}
          <span class="score-lbl-sub">${c.sub}</span>
        </div>
        <div class="score-dots" id="dots-${c.key}">
          ${[1,2,3,4,5].map(n => `
            <div class="sdot${this._tempScores[c.key] >= n ? ' on' : ''}"
              onclick="Pages.idees.setScore('${c.key}',${n})">
              ${n}
            </div>`).join('')}
        </div>
      </div>`).join('');

    this._updateScoreDisplay();
  },

  setScore(key, val) {
    this._tempScores[key] = this._tempScores[key] === val ? 0 : val;
    $$(`#dots-${key} .sdot`).forEach((d, i) =>
      d.classList.toggle('on', i < this._tempScores[key])
    );
    this._updateScoreDisplay();
  },

  _updateScoreDisplay() {
    const total = Object.values(this._tempScores).reduce((a, b) => a + b, 0);
    const sc    = Engine.getIdeaScore({ scores: this._tempScores });

    const valEl   = $('score-total-val');
    const badgeEl = $('score-total-badge');
    if (valEl)   { valEl.textContent   = `${total} / 25`; valEl.style.color   = sc.color; }
    if (badgeEl) { badgeEl.textContent = sc.badge;         badgeEl.style.color = sc.color; }
  },

  updateMarginPreview() {
    const cost  = parseFloat($('im-cost')?.value)  || 0;
    const price = parseFloat($('im-price')?.value) || 0;
    const prev  = $('im-margin-preview');
    if (!prev) return;

    if (cost > 0 && price > 0) {
      const profit = price - cost;
      const pct    = ((profit / price) * 100).toFixed(1);
      prev.style.display = 'flex';
      $('im-margin-pct').textContent = pct + ' %';
      $('im-margin-val').textContent = Math.round(profit).toLocaleString('fr-FR') + ' FCFA';
      $('im-margin-pct').style.color = profit >= 0 ? 'var(--green)' : 'var(--red)';
      $('im-margin-val').style.color = profit >= 0 ? 'var(--green)' : 'var(--red)';
    } else {
      prev.style.display = 'none';
    }
  },

  async save() {
    const name = ($('im-name')?.value || '').trim();
    if (!name) return Toast.err('Nom requis.');

    const id      = State.modals.editIdeaId;
    const payload = {
      name,
      notes:    ($('im-notes')?.value    || '').trim(),
      category: ($('im-category')?.value || '').trim(),
      status:   $('im-status')?.value    || 'idea',
      ref_url:  ($('im-ref')?.value      || '').trim(),
      cost:     parseFloat($('im-cost')?.value)  || 0,
      price:    parseFloat($('im-price')?.value) || 0,
      scores:   { ...this._tempScores },
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.ideas.update(id, payload);
          State.updateIdea(id, updated);
          Toast.ok(`"${name}" mise à jour.`);
        } else {
          const idea = await DB.ideas.create(payload);
          State.addIdea(idea);
          Toast.ok(`"${name}" ajoutée.`);
        }
        Badges.update();
        this.render();
        Modal.close('ideaModal');
        State.modals.editIdeaId = null;
      },
      { btnId: 'btn-save-idea', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async delete(id) {
    const idea = State.getIdea(id);
    if (!idea || !Modal.confirm(`Supprimer "${idea.name}" ?`)) return;

    await Action.run(
      async () => {
        await DB.ideas.delete(id);
        State.removeIdea(id);
        Badges.update();
        this.render();
      },
      { successMsg: 'Idée supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
