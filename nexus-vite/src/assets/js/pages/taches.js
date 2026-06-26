// ══════════════════════════════════════════
//   PAGE : TÂCHES
// ══════════════════════════════════════════
Pages.taches = {

  _filter: '',

  render() {
    let list = [...State.getTasks()];

    // Filtres
    const filterFns = {
      todo:     t => t.status === 'todo',
      doing:    t => t.status === 'doing',
      done:     t => t.status === 'done',
      critique: t => t.priority === 'critique' && t.status !== 'done',
    };
    if (this._filter && filterFns[this._filter]) {
      list = list.filter(filterFns[this._filter]);
    }

    // Tri par priorité
    const prioOrder = { critique: 0, haute: 1, moyenne: 2, faible: 3 };
    list.sort((a, b) => (prioOrder[a.priority] || 2) - (prioOrder[b.priority] || 2));

    const done  = State.getTasks().filter(t => t.status === 'done').length;
    const total = State.getTasks().length;
    $('task-count-lbl').textContent = `${total} tâche(s) · ${done} terminée(s)`;
    Badges.update();

    const wrap = $('task-list-wrap');
    if (!list.length) {
      wrap.innerHTML = EmptyState.html(
        this._filter ? 'Aucune tâche dans cette catégorie.' : 'Aucune tâche.',
        this._filter ? '' : 'Créez votre première tâche !'
      );
      return;
    }

    wrap.innerHTML = `
      <div class="task-list">
        ${list.map((t, i) => {
          const pr   = t.project_id ? State.getProject(t.project_id) : null;
          const done = t.status === 'done';
          return `
            <div class="task-item${done ? ' done' : ''} anim" style="animation-delay:${i * .025}s">
              <div class="task-checkbox${done ? ' checked' : ''}"
                onclick="Pages.taches.toggle('${t.id}')">
                ${done ? '✓' : ''}
              </div>
              <div class="task-info">
                <div class="task-title">${esc(t.title)}</div>
                ${t.description
                  ? `<div class="task-desc">${esc(t.description)}</div>`
                  : ''}
                <div class="task-badges">
                  <span class="badge ${PRIO_BADGE[t.priority] || 'bb'}">
                    ${PRIO_LABELS[t.priority] || t.priority}
                  </span>
                  <span class="badge ${t.status === 'done' ? 'bg' : t.status === 'doing' ? 'bp' : 'bb'}">
                    ${TASK_STATUS[t.status] || t.status}
                  </span>
                  ${pr
                    ? `<span class="badge" style="background:var(--surface);color:var(--text2);border:1px solid var(--border);font-size:.67rem">
                        ${esc(pr.name)}
                      </span>`
                    : ''}
                </div>
              </div>
              <div class="act">
                <button class="btn btn-sm btn-secondary btn-icon"
                  onclick="Pages.taches.openModal('${t.id}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn btn-sm btn-danger btn-icon"
                  onclick="Pages.taches.delete('${t.id}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  filter(el, filter) {
    this._filter = filter;
    $$('#page-taches .task-filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this.render();
  },

  openModal(id = null) {
    State.modals.editTaskId = id;
    $('task-modal-title').textContent = id ? 'Modifier la Tâche' : 'Nouvelle Tâche';

    Form.fillProjects('tm-project', '');

    if (id) {
      const t = State.getTask(id);
      if (t) {
        $('tm-title').value    = t.title       || '';
        $('tm-desc').value     = t.description || '';
        $('tm-priority').value = t.priority    || 'moyenne';
        $('tm-status').value   = t.status      || 'todo';
        Form.fillProjects('tm-project', t.project_id || '');
      }
    } else {
      Form.clear('tm-title','tm-desc');
      $('tm-priority').value = 'moyenne';
      $('tm-status').value   = 'todo';
    }
    Modal.open('taskModal');
  },

  async save() {
    const title = str('tm-title');
    if (!title) return Toast.err('Titre requis.');

    const id      = State.modals.editTaskId;
    const payload = {
      title,
      description: str('tm-desc'),
      project_id:  str('tm-project') || null,
      priority:    str('tm-priority') || 'moyenne',
      status:      str('tm-status')   || 'todo',
    };

    await Action.run(
      async () => {
        if (id) {
          const updated = await DB.tasks.update(id, payload);
          State.updateTask(id, updated);
          Toast.ok('Tâche mise à jour.');
        } else {
          const task = await DB.tasks.create(payload);
          State.addTask(task);
          Toast.ok(`"${title}" créée.`);
        }
        Badges.update();
        this.render();
        Modal.close('taskModal');
        State.modals.editTaskId = null;
        Nav.refreshIfActive('dashboard');
      },
      { btnId: 'btn-save-task', errorMsg: 'Erreur lors de l\'enregistrement.' }
    );
  },

  async toggle(id) {
    const t = State.getTask(id);
    if (!t) return;

    const newStatus = t.status === 'done' ? 'todo' : 'done';

    await Action.run(
      async () => {
        await DB.tasks.toggleStatus(id, t.status);
        State.updateTask(id, { status: newStatus });
        Badges.update();
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { errorMsg: 'Erreur lors de la mise à jour.' }
    );
  },

  async delete(id) {
    const t = State.getTask(id);
    if (!t || !Modal.confirm(`Supprimer "${t.title}" ?`)) return;

    await Action.run(
      async () => {
        await DB.tasks.delete(id);
        State.removeTask(id);
        Badges.update();
        this.render();
        Nav.refreshIfActive('dashboard');
      },
      { successMsg: 'Tâche supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },
};
