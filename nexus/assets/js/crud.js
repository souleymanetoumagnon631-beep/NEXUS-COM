// ══════════════════════════════════════════
//   NEXUS — CRUD Service Générique
//   Réduit la duplication massive dans les pages
//   (create, read, update, delete, openModal, render)
// ══════════════════════════════════════════

const CRUD = (() => {
  'use strict';

  // ── Helpers ──
  const $  = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);
  const esc = s => (s || '').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
  const fF = v => {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return Math.round(v).toLocaleString('fr-FR') + ' FCFA';
  };

  // ── Mapping des champs par entité ──
  const FIELD_CONFIG = {
    product: {
      fields: [
        { key: 'name',      label: 'Nom',           type: 'text',   full: true },
        { key: 'store',     label: 'Boutique',       type: 'text',   full: true },
        { key: 'qty',       label: 'Quantité',       type: 'number' },
        { key: 'stock',     label: 'Coût stock',     type: 'number' },
        { key: 'fret_type', label: 'Type de fret',   type: 'select', options: ['Aérien', 'Maritime'] },
        { key: 'fret',      label: 'Fret',           type: 'number' },
        { key: 'customs',   label: 'Douane',         type: 'number' },
        { key: 'packaging', label: 'Emballage',      type: 'number' },
        { key: 'fb',        label: 'Facebook Ads',   type: 'number' },
        { key: 'tiktok',    label: 'TikTok Ads',     type: 'number' },
        { key: 'ads',       label: 'Autres pubs',    type: 'number', full: true },
        { key: 'misc',      label: 'Autres frais',   type: 'number', full: true },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push('Nom du produit requis.');
        if (!data.qty || data.qty <= 0) errors.push('Quantité requise.');
        return errors;
      },
      buildPayload: (id) => ({
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
      }),
      successMsg: (name) => `"${name}" enregistré.`,
      updateMsg:  () => 'Produit mis à jour.',
    },

    sale: {
      fields: [
        { key: 'product_id', label: 'Produit', type: 'select', options: 'products' },
        { key: 'client_id',  label: 'Client',  type: 'select', options: 'clients', default: '' },
        { key: 'price',      label: 'Prix unitaire', type: 'number' },
        { key: 'qty',        label: 'Quantité',      type: 'number' },
        { key: 'shipping',   label: 'Livraison',     type: 'number' },
        { key: 'channel',    label: 'Canal',         type: 'select', options: ['WhatsApp','Facebook','TikTok','Instagram','Boutique','Site web','Autre'] },
        { key: 'sale_date',  label: 'Date',          type: 'date' },
        { key: 'note',       label: 'Note',          type: 'text', full: true },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.product_id) errors.push('Produit requis.');
        if (!data.price || data.price <= 0) errors.push('Prix requis.');
        if (!data.qty || data.qty <= 0) errors.push('Quantité requise.');
        return errors;
      },
      buildPayload: (id) => ({
        product_id: $('em-product_id')?.value || '',
        client_id:  $('em-client_id')?.value  || null,
        price:      parseFloat($('em-price')?.value)      || 0,
        qty:        parseFloat($('em-qty')?.value)        || 0,
        shipping:   parseFloat($('em-shipping')?.value)   || 0,
        channel:    $('em-channel')?.value    || 'WhatsApp',
        sale_date:  $('em-sale_date')?.value  || today(),
        note:       $('em-note')?.value       || '',
      }),
      successMsg: (data) => {
        const p = State.getProduct(data.product_id);
        return `Vente enregistrée pour "${p?.name || '?'}".`;
      },
      updateMsg:  () => 'Vente mise à jour.',
    },

    client: {
      fields: [
        { key: 'name',   label: 'Nom complet', type: 'text', full: true },
        { key: 'phone',  label: 'Téléphone',   type: 'tel' },
        { key: 'city',   label: 'Ville',       type: 'text' },
        { key: 'address',label: 'Adresse',     type: 'text', full: true },
        { key: 'notes',  label: 'Notes',       type: 'textarea', full: true },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push('Nom requis.');
        if (!data.phone?.trim()) errors.push('Téléphone requis.');
        return errors;
      },
      buildPayload: (id) => ({
        name:   $('em-name')?.value.trim()  || '',
        phone:  $('em-phone')?.value.trim() || '',
        city:   $('em-city')?.value.trim()  || '',
        address:$('em-address')?.value.trim()|| '',
        notes:  $('em-notes')?.value.trim() || '',
      }),
      successMsg: (name) => `Client "${name}" ajouté.`,
      updateMsg:  () => 'Client mis à jour.',
    },

    livraison: {
      fields: [
        { key: 'client_id',  label: 'Client',  type: 'select', options: 'clients' },
        { key: 'product_id', label: 'Produit', type: 'select', options: 'products' },
        { key: 'qty',        label: 'Quantité',type: 'number' },
        { key: 'amount',     label: 'Montant', type: 'number' },
        { key: 'status',     label: 'Statut',  type: 'select', options: ['pending','confirmed','shipped','delivered','returned'] },
        { key: 'delivery_date', label: 'Date', type: 'date' },
        { key: 'address',    label: 'Adresse', type: 'text', full: true },
        { key: 'notes',      label: 'Notes',   type: 'textarea', full: true },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.client_id) errors.push('Client requis.');
        if (!data.product_id) errors.push('Produit requis.');
        return errors;
      },
      buildPayload: (id) => ({
        client_id:     $('em-client_id')?.value || '',
        product_id:    $('em-product_id')?.value || '',
        qty:           parseFloat($('em-qty')?.value)        || 0,
        amount:        parseFloat($('em-amount')?.value)      || 0,
        status:        $('em-status')?.value      || 'pending',
        delivery_date: $('em-delivery_date')?.value || today(),
        address:       $('em-address')?.value.trim() || '',
        notes:         $('em-notes')?.value.trim()  || '',
      }),
      successMsg: () => 'Livraison enregistrée.',
      updateMsg:  () => 'Livraison mise à jour.',
    },

    project: {
      fields: [
        { key: 'name',        label: 'Nom du projet', type: 'text', full: true },
        { key: 'description', label: 'Description',   type: 'text', full: true },
        { key: 'product_id',  label: 'Produit associé', type: 'select', options: 'products', default: '' },
        { key: 'target_qty',  label: 'Quantité cible', type: 'number' },
        { key: 'status',      label: 'Statut', type: 'select', options: ['prep','cours','term','susp'] },
        { key: 'start_date',  label: 'Date début', type: 'date' },
        { key: 'end_date',    label: 'Date fin',   type: 'date' },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push('Nom du projet requis.');
        return errors;
      },
      buildPayload: (id) => ({
        name:        $('em-name')?.value.trim()        || '',
        description: $('em-description')?.value.trim()  || '',
        product_id:  $('em-product_id')?.value         || null,
        target_qty:  parseFloat($('em-target_qty')?.value) || 0,
        status:      $('em-status')?.value      || 'prep',
        start_date:  $('em-start_date')?.value  || '',
        end_date:    $('em-end_date')?.value    || '',
      }),
      successMsg: (name) => `Projet "${name}" créé.`,
      updateMsg:  () => 'Projet mis à jour.',
    },

    task: {
      fields: [
        { key: 'title',       label: 'Titre',      type: 'text', full: true },
        { key: 'description', label: 'Description', type: 'text', full: true },
        { key: 'project_id',  label: 'Projet',     type: 'select', options: 'projects', default: '' },
        { key: 'priority',    label: 'Priorité',   type: 'select', options: ['faible','moyenne','haute','critique'] },
        { key: 'status',      label: 'Statut',     type: 'select', options: ['todo','doing','done'] },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.title?.trim()) errors.push('Titre requis.');
        return errors;
      },
      buildPayload: (id) => ({
        title:       $('em-title')?.value.trim()       || '',
        description: $('em-description')?.value.trim()  || '',
        project_id:  $('em-project_id')?.value         || null,
        priority:    $('em-priority')?.value   || 'moyenne',
        status:      $('em-status')?.value     || 'todo',
      }),
      successMsg: (name) => `Tâche "${name}" créée.`,
      updateMsg:  () => 'Tâche mise à jour.',
    },

    idea: {
      fields: [
        { key: 'name',      label: 'Nom du produit', type: 'text', full: true },
        { key: 'notes',     label: 'Notes',          type: 'textarea', full: true },
        { key: 'category',  label: 'Catégorie',      type: 'text' },
        { key: 'status',    label: 'Statut',         type: 'select', options: ['idea','research','validated','rejected'] },
        { key: 'ref_url',   label: 'Lien référence', type: 'url', full: true },
        { key: 'cost',      label: 'Coût fournisseur', type: 'number' },
        { key: 'price',     label: 'Prix estimé',    type: 'number' },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push('Nom requis.');
        return errors;
      },
      buildPayload: (id) => ({
        name:     $('em-name')?.value.trim()      || '',
        notes:    $('em-notes')?.value.trim()     || '',
        category: $('em-category')?.value.trim()  || '',
        status:   $('em-status')?.value  || 'idea',
        ref_url:  $('em-ref_url')?.value.trim()   || '',
        cost:     parseFloat($('em-cost')?.value)  || 0,
        price:    parseFloat($('em-price')?.value) || 0,
      }),
      successMsg: (name) => `Idée "${name}" enregistrée.`,
      updateMsg:  () => 'Idée mise à jour.',
    },

    expense: {
      fields: [
        { key: 'name',     label: 'Nom de la dépense', type: 'text', full: true },
        { key: 'amount',   label: 'Montant mensuel',   type: 'number' },
        { key: 'category', label: 'Catégorie',         type: 'select', options: ['Marketing','Logistique','Outils & Abonnements','Personnel','Bureautique','Autre'] },
      ],
      validate: (data) => {
        const errors = [];
        if (!data.name?.trim()) errors.push('Nom requis.');
        if (!data.amount || data.amount <= 0) errors.push('Montant requis.');
        return errors;
      },
      buildPayload: (id) => ({
        name:     $('em-name')?.value.trim()      || '',
        amount:   parseFloat($('em-amount')?.value) || 0,
        category: $('em-category')?.value  || 'Autre',
      }),
      successMsg: (name) => `Dépense "${name}" enregistrée.`,
      updateMsg:  () => 'Dépense mise à jour.',
    },
  };

  // ── Options de select dynamiques ──
  function getSelectOptions(type) {
    if (typeof type === 'string') {
      if (type === 'products') return State.getProducts().map(p => ({ value: p.id, label: p.name }));
      if (type === 'clients')  return State.getClients().map(c => ({ value: c.id, label: c.name }));
      if (type === 'projects') return State.getProjects().map(p => ({ value: p.id, label: p.name }));
    }
    return [];
  }

  // ── Générer le HTML du formulaire d'édition ──
  function buildFormHTML(entityType, data = {}) {
    const config = FIELD_CONFIG[entityType];
    if (!config) return '';

    return `
      <div class="form-grid">
        ${config.fields.map(f => {
          const value = data[f.key] ?? '';
          if (f.type === 'select') {
            const opts = typeof f.options === 'string' ? getSelectOptions(f.options) : (f.options || []);
            return `
              <div class="form-group${f.full ? ' form-full' : ''}">
                <label class="form-label">${f.label}</label>
                <select class="form-input" id="em-${f.key}">
                  <option value="">${f.default || '— Sélectionner —'}</option>
                  ${opts.map(o => `<option value="${esc(o.value)}"${value === o.value ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}
                </select>
              </div>`;
          }
          if (f.type === 'textarea') {
            return `
              <div class="form-group${f.full ? ' form-full' : ''}">
                <label class="form-label">${f.label}</label>
                <textarea class="form-input" id="em-${f.key}" rows="3" style="resize:vertical;font-family:inherit">${esc(String(value))}</textarea>
              </div>`;
          }
          return `
            <div class="form-group${f.full ? ' form-full' : ''}">
              <label class="form-label">${f.label}</label>
              <input type="${f.type}" class="form-input" id="em-${f.key}"
                value="${esc(String(value))}"
                ${f.type === 'number' ? 'min="0"' : ''}>
            </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:9px;margin-top:18px">
        <button class="btn btn-secondary" style="flex:1" onclick="Modal.close('editModal')">Annuler</button>
        <button class="btn btn-primary" style="flex:1" onclick="CRUD.save('${entityType}', ${data.id ? `'${data.id}'` : 'null'})">Sauvegarder</button>
      </div>`;
  }

  // ── API publique ──
  return {
    // Ouvrir le modal d'édition
    openModal(entityType, id = null) {
      const config = FIELD_CONFIG[entityType];
      if (!config) return;

      const data = id ? State[`get${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`](id) : {};
      const title = id ? `Modifier — ${esc(data.name || data.title || '')}` : `Nouveau ${entityType}`;

      $('editModalTitle').textContent = title;
      $('editBody').innerHTML = buildFormHTML(entityType, data);
      Modal.open('editModal');

      // Stocker l'ID en cours pour le save
      window.__editEntityType__ = entityType;
      window.__editEntityId__   = id;
    },

    // Sauvegarder (créer ou modifier)
    async save(entityType, id = null) {
      const config = FIELD_CONFIG[entityType];
      if (!config) return;

      const payload = config.buildPayload(id);
      const errors = config.validate(payload);
      if (errors.length) return Toast.err(errors[0]);

      const dbMethod = entityType === 'product' ? DB.products :
                       entityType === 'sale'    ? DB.sales :
                       entityType === 'client'  ? DB.clients :
                       entityType === 'livraison' ? DB.livraisons :
                       entityType === 'project' ? DB.projects :
                       entityType === 'task'    ? DB.tasks :
                       entityType === 'idea'    ? DB.ideas :
                       entityType === 'expense' ? DB.expenses : null;

      if (!dbMethod) return;

      await Action.run(
        async () => {
          let record;
          if (id) {
            record = await dbMethod.update(id, payload);
            const stateUpdate = `update${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;
            if (State[stateUpdate]) State[stateUpdate](id, record);
          } else {
            record = await dbMethod.create(payload);
            const stateAdd = `add${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;
            if (State[stateAdd]) State[stateAdd](record);
          }

          Modal.close('editModal');
          Badges.update();

          // Rafraîchir les pages concernées
          const refreshMap = {
            product:  ['achats', 'dashboard', 'rentabilite', 'produits', 'marketing'],
            sale:     ['ventes', 'dashboard', 'revenus'],
            client:   ['clients', 'livraisons', 'ventes', 'relances'],
            livraison:['livraisons', 'dashboard'],
            project:  ['projets', 'dashboard', 'taches'],
            task:     ['taches', 'dashboard', 'projets'],
            idea:     ['idees'],
            expense:  ['finances', 'dashboard'],
          };
          (refreshMap[entityType] || []).forEach(page => Nav.refreshIfActive(page));

          const msg = id ? config.updateMsg() : config.successMsg(payload.name || payload.title || '');
          Toast.ok(msg);
        },
        { errorMsg: `Erreur lors de ${id ? 'la modification' : 'l\'ajout'}.` }
      );
    },

    // Supprimer
    async delete(entityType, id) {
      const config = FIELD_CONFIG[entityType];
      if (!config) return;

      const data = State[`get${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`](id);
      if (!data) return;

      const name = data.name || data.title || 'cet élément';
      if (!Modal.confirm(`Supprimer "${name}" ?`)) return;

      const dbMethod = entityType === 'product' ? DB.products :
                       entityType === 'sale'    ? DB.sales :
                       entityType === 'client'  ? DB.clients :
                       entityType === 'livraison' ? DB.livraisons :
                       entityType === 'project' ? DB.projects :
                       entityType === 'task'    ? DB.tasks :
                       entityType === 'idea'    ? DB.ideas :
                       entityType === 'expense' ? DB.expenses : null;

      if (!dbMethod) return;

      await Action.run(
        async () => {
          await dbMethod.delete(id);
          const stateRemove = `remove${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;
          if (State[stateRemove]) State[stateRemove](id);

          Badges.update();
          const refreshMap = {
            product:  ['achats', 'dashboard', 'rentabilite', 'produits', 'marketing'],
            sale:     ['ventes', 'dashboard', 'revenus'],
            client:   ['clients', 'livraisons', 'ventes'],
            livraison:['livraisons', 'dashboard'],
            project:  ['projets', 'dashboard', 'taches'],
            task:     ['taches', 'dashboard', 'projets'],
            idea:     ['idees'],
            expense:  ['finances', 'dashboard'],
          };
          (refreshMap[entityType] || []).forEach(page => Nav.refreshIfActive(page));

          Toast.ok(`"${name}" supprimé.`);
        },
        { errorMsg: 'Erreur lors de la suppression.' }
      );
    },

    // Obtenir la config d'une entité
    getConfig(entityType) {
      return FIELD_CONFIG[entityType] || null;
    },

    // Lister les entités disponibles
    getEntityTypes() {
      return Object.keys(FIELD_CONFIG);
    },
  };
})();

window.CRUD = CRUD;