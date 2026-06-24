// ══════════════════════════════════════════
//   PAGE : RELANCES
//   3 modes : Remboursement · Récommande · Offres
// ══════════════════════════════════════════
Pages.relances = {

  _tab: 'remboursement',

  render() {
    this._renderPanel();
  },

  switchTab(el, tab) {
    this._tab = tab;
    $$('#page-relances .relance-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this._renderPanel();
  },

  _renderPanel() {
    const panel = $('relance-panels');
    if (!panel) return;

    if (this._tab === 'remboursement') panel.innerHTML = this._remboursementHTML();
    else if (this._tab === 'recommande') panel.innerHTML = this._recommandeHTML();
    else panel.innerHTML = this._offresHTML();

    this._postRender();
  },

  _postRender() {
    if (this._tab === 'remboursement') {
      Form.fillClients('r-remb-client', '', '— Choisir un client —');
      Form.fillProducts('r-remb-product', '', '— Aucun —');
      this.previewRembMessage();
    } else if (this._tab === 'recommande') {
      Form.fillProducts('r-rec-product', '', '— Choisir un produit —');
      this._renderRecClientsList();
      this.previewRecMessage();
    } else {
      Form.fillProducts('o-product', '', '— Aucun —');
      this._renderOffresList();
      this.previewOffreMessage();
    }
  },

  // ══════════════════════════════════════
  //   TAB 1 : REMBOURSEMENT
  // ══════════════════════════════════════
  _remboursementHTML() {
    return `
      <div class="split-340">
        <div class="card">
          <div class="card-header"><div class="card-title">Configurer la relance</div></div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Client *</label>
              <select class="form-input" id="r-remb-client" onchange="Pages.relances.previewRembMessage()"></select>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Montant dû (FCFA)</label>
              <input class="form-input" type="number" id="r-remb-amount" placeholder="0" oninput="Pages.relances.previewRembMessage()">
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Produit concerné</label>
              <select class="form-input" id="r-remb-product" onchange="Pages.relances.previewRembMessage()"></select>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Ton du message</label>
              <select class="form-input" id="r-remb-tone" onchange="Pages.relances.previewRembMessage()">
                <option value="poli">Poli & professionnel</option>
                <option value="amical">Amical & détendu</option>
                <option value="ferme">Ferme & direct</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">Note personnalisée</label>
              <textarea class="form-input" id="r-remb-note" rows="2" style="resize:none;font-family:inherit"
                oninput="Pages.relances.previewRembMessage()" placeholder="Détail supplémentaire..."></textarea>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary" style="width:100%" onclick="Pages.relances.sendRembWhatsApp()">
                ${this._waIcon()} Envoyer via WhatsApp
              </button>
              <button class="btn btn-secondary" style="width:100%" onclick="Pages.relances.callClient('r-remb-client')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                Appeler le client
              </button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Aperçu du message</div></div>
          <div style="padding:20px">
            <div id="r-remb-preview" style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;font-size:.875rem;line-height:1.7;color:var(--text2);min-height:160px;white-space:pre-wrap">
              Sélectionnez un client pour prévisualiser le message...
            </div>
          </div>
        </div>
      </div>`;
  },

  previewRembMessage() {
    const clientId  = $('r-remb-client')?.value;
    const client    = clientId ? State.getClient(clientId) : null;
    const amount    = $('r-remb-amount')?.value;
    const productId = $('r-remb-product')?.value;
    const product   = productId ? State.getProduct(productId) : null;
    const tone      = $('r-remb-tone')?.value || 'poli';
    const note      = $('r-remb-note')?.value || '';
    const prev      = $('r-remb-preview');
    if (!prev) return;

    if (!client) { prev.textContent = 'Sélectionnez un client pour prévisualiser...'; return; }

    const greetings = {
      poli:   `Bonjour ${client.name},\n\nJ'espère que vous allez bien.`,
      amical: `Salut ${client.name} ! 😊`,
      ferme:  `Bonjour ${client.name}.`,
    };
    const bodies = {
      poli:   `Je me permets de vous contacter concernant un règlement en attente${amount ? ` de ${parseInt(amount).toLocaleString('fr-FR')} FCFA` : ''}${product ? ` pour ${product.name}` : ''}.`,
      amical: `Je voulais juste te rappeler qu'il y a un paiement en attente${amount ? ` de ${parseInt(amount).toLocaleString('fr-FR')} FCFA` : ''}${product ? ` (${product.name})` : ''} 😅`,
      ferme:  `Suite à notre transaction${product ? ` concernant ${product.name}` : ''}, un montant${amount ? ` de ${parseInt(amount).toLocaleString('fr-FR')} FCFA` : ''} reste à régler.`,
    };
    const closings = {
      poli:   `Merci de bien vouloir régulariser cette situation dans les meilleurs délais.\n\nCordialement.`,
      amical: `Tu peux me le faire quand tu veux, merci d'avance ! 🙏`,
      ferme:  `Je vous remercie de procéder au règlement rapidement.`,
    };

    let msg = `${greetings[tone]}\n\n${bodies[tone]}`;
    if (note) msg += `\n\n${note}`;
    msg += `\n\n${closings[tone]}`;
    prev.textContent = msg;
  },

  sendRembWhatsApp() {
    const clientId = $('r-remb-client')?.value;
    const client   = clientId ? State.getClient(clientId) : null;
    if (!client) return Toast.err('Sélectionnez un client.');
    if (!client.phone) return Toast.err('Ce client n\'a pas de numéro.');

    const msg   = $('r-remb-preview')?.textContent || '';
    const phone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    Toast.ok(`Message envoyé à ${client.name}.`);
  },

  callClient(selectId) {
    const clientId = $(selectId)?.value;
    const client   = clientId ? State.getClient(clientId) : null;
    if (!client) return Toast.err('Sélectionnez un client.');
    if (!client.phone) return Toast.err('Ce client n\'a pas de numéro.');
    window.location.href = `tel:+${client.phone.replace(/\D/g, '')}`;
  },

  // ══════════════════════════════════════
  //   TAB 2 : CLIENTS ABONNÉS
  // ══════════════════════════════════════
  _recommandeHTML() {
    return `
      <div class="split-340">
        <div class="card">
          <div class="card-header"><div class="card-title">Configurer la relance</div></div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Produit à proposer</label>
              <select class="form-input" id="r-rec-product" onchange="Pages.relances.previewRecMessage()"></select>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Message personnalisé</label>
              <textarea class="form-input" id="r-rec-note" rows="3" style="resize:none;font-family:inherit"
                oninput="Pages.relances.previewRecMessage()" placeholder="Ex: Nouveau stock disponible..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">Sélectionner les clients</label>
              <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
                <button class="btn btn-sm btn-secondary" onclick="Pages.relances.selectAllClients()">Tous</button>
                <button class="btn btn-sm btn-secondary" onclick="Pages.relances.selectRecurrentClients()">Récurrents</button>
                <button class="btn btn-sm btn-secondary" onclick="Pages.relances.deselectAllClients()">Aucun</button>
              </div>
              <div id="r-rec-clients-list" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px"></div>
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="Pages.relances.sendRecWhatsApp()">
              ${this._waIcon()} Relancer les clients sélectionnés
            </button>
            <p style="font-size:.72rem;color:var(--text3);margin-top:8px;text-align:center">
              Ouvre un onglet WhatsApp par client
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Aperçu du message</div></div>
          <div style="padding:20px">
            <div id="r-rec-preview" style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;font-size:.875rem;line-height:1.7;color:var(--text2);min-height:160px;white-space:pre-wrap">
              Configurez les options pour prévisualiser...
            </div>
          </div>
        </div>
      </div>`;
  },

  _renderRecClientsList() {
    const wrap = $('r-rec-clients-list');
    if (!wrap) return;
    const clients = State.getClients();

    if (!clients.length) {
      wrap.innerHTML = '<div style="font-size:.82rem;color:var(--text3)">Aucun client enregistré.</div>';
      return;
    }

    wrap.innerHTML = clients.map(c => {
      const cs = Engine.getClientStats(c.id);
      return `
        <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surface2);border-radius:9px;border:1px solid var(--border);cursor:pointer">
          <input type="checkbox" class="rec-client-check" data-id="${c.id}"
            onchange="Pages.relances.previewRecMessage()"
            style="accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
          <div style="flex:1;min-width:0">
            <div style="font-size:.84rem;font-weight:600">${esc(c.name)}</div>
            <div style="font-size:.7rem;color:var(--text3)">${c.phone || 'Pas de numéro'} · ${cs.orders} commande(s)</div>
          </div>
          ${cs.isRecurrent ? '<span class="badge bg" style="font-size:.6rem">Récurrent</span>' : ''}
        </label>`;
    }).join('');
  },

  selectAllClients() {
    $$('.rec-client-check').forEach(c => c.checked = true);
    this.previewRecMessage();
  },
  deselectAllClients() {
    $$('.rec-client-check').forEach(c => c.checked = false);
    this.previewRecMessage();
  },
  selectRecurrentClients() {
    $$('.rec-client-check').forEach(c => {
      const cs = Engine.getClientStats(c.dataset.id);
      c.checked = cs.isRecurrent;
    });
    this.previewRecMessage();
  },

  previewRecMessage() {
    const productId = $('r-rec-product')?.value;
    const product   = productId ? State.getProduct(productId) : null;
    const note      = $('r-rec-note')?.value || '';
    const selected  = $$('.rec-client-check:checked');
    const prev      = $('r-rec-preview');
    if (!prev) return;

    let msg = `Bonjour [Prénom] ! 👋\n\n`;
    if (product) msg += `Nous avons une nouveauté pour vous : *${product.name}*.\n\n`;
    if (note)    msg += `${note}\n\n`;
    msg += `En tant que client fidèle, vous bénéficiez d'une offre exclusive.\n\nRépondez à ce message pour en savoir plus ! 🎁`;

    prev.textContent = `${selected.length} client(s) sélectionné(s)\n\n---\n\n${msg}`;
  },

  // ── [FIX popup-blocker + CORRIGÉ 8.3] ──
  // Limite à 10 onglets maximum pour éviter de noyer l'utilisateur
  // Les navigateurs bloquent window.open() appelé hors d'un clic direct
  // (donc tout appel dans un setTimeout > 0 est bloqué, sauf le premier).
  // Solution : ouvrir TOUTES les fenêtres immédiatement (pendant le clic),
  // puis rediriger chaque fenêtre déjà ouverte vers son URL WhatsApp
  // une fois celle-ci construite. Comme la fenêtre existe déjà,
  // la rediriger plus tard via .location n'est pas bloqué.
  async sendRecWhatsApp() {
    const selected = [...$$('.rec-client-check:checked')];
    if (!selected.length) return Toast.err('Sélectionnez au moins un client.');

    const productId = $('r-rec-product')?.value;
    const product   = productId ? State.getProduct(productId) : null;
    const note      = $('r-rec-note')?.value || '';

    let targets = selected
      .map(el => State.getClient(el.dataset.id))
      .filter(client => client?.phone);

    if (!targets.length) {
      return Toast.err('Aucun des clients sélectionnés n\'a de numéro de téléphone.');
    }

    // [CORRIGÉ 8.3] Limiter à 10 clients maximum par envoi
    const MAX_WINDOWS = 10;
    const totalTargets = targets.length;
    if (targets.length > MAX_WINDOWS) {
      targets = targets.slice(0, MAX_WINDOWS);
    }

    const skipped = selected.length - targets.length;

    // Ouvrir toutes les fenêtres MAINTENANT (synchrone, dans le clic) → non bloqué
    const windows = targets.map(() => window.open('', '_blank'));
    const blockedCount = windows.filter(w => !w).length;

    if (blockedCount === targets.length) {
      Toast.err('Votre navigateur bloque les fenêtres pop-up. Autorisez les pop-up pour ce site puis réessayez.');
      return;
    }

    let sent = 0;
    targets.forEach((client, i) => {
      const win = windows[i];
      if (!win) return; // cette fenêtre précise a été bloquée
      const phone = client.phone.replace(/\D/g, '');
      let msg = `Bonjour ${client.name} ! 👋\n\n`;
      if (product) msg += `Nous avons une nouveauté pour vous : *${product.name}*.\n\n`;
      if (note)    msg += `${note}\n\n`;
      msg += `En tant que client fidèle, vous bénéficiez d'une offre exclusive.\n\nRépondez à ce message pour en savoir plus ! 🎁`;
      win.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      sent++;
    });

    let report = `${sent} message(s) ouvert(s) dans WhatsApp.`;
    if (totalTargets > MAX_WINDOWS) report += ` ${totalTargets - MAX_WINDOWS} client(s) ignoré(s) (limite de ${MAX_WINDOWS} onglets).`;
    if (skipped) report += ` ${skipped} client(s) ignoré(s) (pas de numéro).`;
    if (blockedCount) report += ` ${blockedCount} fenêtre(s) bloquée(s) par le navigateur.`;
    (blockedCount ? Toast.warn : Toast.ok)(report);
  },

  // ══════════════════════════════════════
  //   TAB 3 : NOUVELLES OFFRES
  // ══════════════════════════════════════
  _offresHTML() {
    return `
      <div class="split-2col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Créer un contenu publicitaire</div>
            <button class="btn btn-sm btn-primary" onclick="Pages.relances.saveOffre()">Sauvegarder</button>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Titre de l'offre *</label>
              <input class="form-input" type="text" id="o-title" placeholder="Ex: Promo Aïd -30%"
                oninput="Pages.relances.previewOffreMessage()">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Produit associé</label>
              <select class="form-input" id="o-product" onchange="Pages.relances.previewOffreMessage()"></select>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Prix ou offre</label>
              <input class="form-input" type="text" id="o-price" placeholder="Ex: 7 000 FCFA au lieu de 14 000"
                oninput="Pages.relances.previewOffreMessage()">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Accroche principale</label>
              <textarea class="form-input" id="o-hook" rows="2" style="resize:none;font-family:inherit"
                oninput="Pages.relances.previewOffreMessage()" placeholder="Ex: Ne ratez pas cette opportunité..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Description</label>
              <textarea class="form-input" id="o-desc" rows="3" style="resize:none;font-family:inherit"
                oninput="Pages.relances.previewOffreMessage()" placeholder="Bénéfices, rareté, urgence..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">Call to Action</label>
              <input class="form-input" type="text" id="o-cta" placeholder="Ex: Commandez maintenant !"
                oninput="Pages.relances.previewOffreMessage()">
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-primary" style="flex:1" onclick="Pages.relances.sendOffreWhatsApp()">
                ${this._waIcon()} Envoyer à tous les clients
              </button>
              <button class="btn btn-secondary" onclick="Pages.relances.copyOffre()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="card">
            <div class="card-header"><div class="card-title">Aperçu du message</div></div>
            <div style="padding:20px">
              <div id="o-preview" style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;font-size:.875rem;line-height:1.7;color:var(--text2);min-height:160px;white-space:pre-wrap">
                Remplissez le formulaire pour prévisualiser...
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">Offres sauvegardées</div>
              <span id="offres-count" style="font-size:.75rem;color:var(--text3)">0</span>
            </div>
            <div id="offres-list" style="padding:14px;display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto"></div>
          </div>
        </div>
      </div>`;
  },

  previewOffreMessage() {
    const title     = $('o-title')?.value || '';
    const productId = $('o-product')?.value;
    const product   = productId ? State.getProduct(productId) : null;
    const price     = $('o-price')?.value || '';
    const hook      = $('o-hook')?.value || '';
    const desc      = $('o-desc')?.value || '';
    const cta       = $('o-cta')?.value || '';
    const prev      = $('o-preview');
    if (!prev) return;

    if (!title && !hook) { prev.textContent = 'Remplissez le formulaire pour prévisualiser...'; return; }

    let msg = '';
    if (hook)    msg += `🔥 *${hook}*\n\n`;
    if (title)   msg += `*${title}*\n\n`;
    if (product) msg += `📦 Produit : ${product.name}\n`;
    if (price)   msg += `💰 ${price}\n`;
    if (desc)    msg += `\n${desc}\n`;
    if (cta)     msg += `\n👉 ${cta}`;

    prev.textContent = msg;
  },

  async saveOffre() {
    const title = ($('o-title')?.value || '').trim();
    if (!title) return Toast.err('Titre requis.');

    const payload = {
      title,
      product_id:  $('o-product')?.value || null,
      price_text:  $('o-price')?.value   || '',
      hook:        $('o-hook')?.value    || '',
      description: $('o-desc')?.value    || '',
      cta:         $('o-cta')?.value     || '',
    };

    await Action.run(
      async () => {
        const offer = await DB.offers.create(payload);
        State.addOffer(offer);
        this._renderOffresList();
      },
      { successMsg: `"${title}" sauvegardée.`, errorMsg: 'Erreur lors de la sauvegarde.' }
    );
  },

  _renderOffresList() {
    const wrap  = $('offres-list');
    const count = $('offres-count');
    if (!wrap) return;

    const offers = State.getOffers();
    if (count) count.textContent = offers.length;

    if (!offers.length) {
      wrap.innerHTML = '<div style="font-size:.82rem;color:var(--text3)">Aucune offre sauvegardée.</div>';
      return;
    }

    wrap.innerHTML = [...offers].reverse().map(o => {
      const p = o.product_id ? State.getProduct(o.product_id) : null;
      return `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div style="flex:1;min-width:0">
            <div style="font-size:.84rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title)}</div>
            <div style="font-size:.7rem;color:var(--text3);margin-top:2px">${p ? esc(p.name) : '—'} · ${fmtDate(o.created_at?.split('T')[0])}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.relances.loadOffre('${o.id}')" title="Charger">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.relances.delOffre('${o.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');
  },

  loadOffre(id) {
    const o = State.data.offers.find(x => x.id === id);
    if (!o) return;
    $('o-title').value   = o.title       || '';
    $('o-product').value = o.product_id  || '';
    $('o-price').value   = o.price_text  || '';
    $('o-hook').value    = o.hook        || '';
    $('o-desc').value    = o.description || '';
    $('o-cta').value     = o.cta         || '';
    this.previewOffreMessage();
    Toast.ok('Offre chargée.');
  },

  async delOffre(id) {
    if (!Modal.confirm('Supprimer cette offre ?')) return;
    await Action.run(
      async () => {
        await DB.offers.delete(id);
        State.removeOffer(id);
        this._renderOffresList();
      },
      { successMsg: 'Offre supprimée.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },

  // ── [FIX popup-blocker] même principe que sendRecWhatsApp ──
  sendOffreWhatsApp() {
    const msg = $('o-preview')?.textContent || '';
    if (!msg || msg === 'Remplissez le formulaire pour prévisualiser...') {
      return Toast.err('Créez un message d\'abord.');
    }
    const clients = State.getClients().filter(c => c.phone);
    if (!clients.length) return Toast.err('Aucun client avec un numéro de téléphone.');

    // Ouvrir toutes les fenêtres immédiatement (dans le contexte du clic)
    const windows = clients.map(() => window.open('', '_blank'));
    const blockedCount = windows.filter(w => !w).length;

    if (blockedCount === clients.length) {
      Toast.err('Votre navigateur bloque les fenêtres pop-up. Autorisez les pop-up pour ce site puis réessayez.');
      return;
    }

    let sent = 0;
    clients.forEach((c, i) => {
      const win = windows[i];
      if (!win) return;
      const phone = c.phone.replace(/\D/g, '');
      const personalMsg = msg.replace('[Prénom]', c.name);
      win.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(personalMsg)}`;
      sent++;
    });

    let report = `${sent} message(s) ouvert(s) dans WhatsApp.`;
    if (blockedCount) report += ` ${blockedCount} fenêtre(s) bloquée(s) par le navigateur.`;
    (blockedCount ? Toast.warn : Toast.ok)(report);
  },

  copyOffre() {
    const msg = $('o-preview')?.textContent || '';
    if (!msg) return Toast.err('Aucun message à copier.');
    navigator.clipboard.writeText(msg).then(() => Toast.ok('Message copié !'));
  },

  _waIcon() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  },
};