// ══════════════════════════════════════════
//   PAGE : MARKETING
//   Positionnement · Offre · Angles · Créatifs
// ══════════════════════════════════════════
Pages.marketing = {

  _tab:         'positionnement',
  _creatifTab:  'scripts',
  _currentPid:  '',
  _mktDataCache:{}, // { productId: { data... } } chargé depuis Supabase

  _criteria: [
    { key: 'offre-dream',   label: 'Résultat rêvé défini',   weight: 20 },
    { key: 'offre-proba',   label: 'Preuve de crédibilité',   weight: 15 },
    { key: 'offre-delay',   label: 'Délai clairement défini', weight: 15 },
    { key: 'offre-effort',  label: 'Effort client minimisé',  weight: 10 },
    { key: 'offre-bonus',   label: 'Bonus & valeur ajoutée',  weight: 15 },
    { key: 'offre-urgency', label: 'Rareté / urgence créée',  weight: 10 },
    { key: 'pqr-price',     label: 'Prix défini',             weight: 5 },
    { key: 'pqr-material',  label: 'Qualité documentée',      weight: 5 },
    { key: 'pqr-speed',     label: 'Rapidité de livraison',   weight: 5 },
  ],

  // ══════════════════════════════════════
  //   INIT / RENDER PRINCIPAL
  // ══════════════════════════════════════
  render() {
    Form.fillProducts('mkt-global-product', this._currentPid, '— Sélectionner un produit —');
    this._renderTab();
  },

  async onProductChange() {
    this._currentPid = $('mkt-global-product')?.value || '';
    if (this._currentPid && !this._mktDataCache[this._currentPid]) {
      const remote = await DB.marketingData.getByProduct(this._currentPid);
      this._mktDataCache[this._currentPid] = remote?.data || {};
    }
    this._renderTab();
  },

  switchTab(el, tab) {
    this._tab = tab;
    $$('#page-marketing .mkt-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this._renderTab();
  },

  _renderTab() {
    const panel = $('marketing-panels');
    if (!panel) return;

    if (this._tab === 'positionnement') panel.innerHTML = this._positionnementHTML();
    else if (this._tab === 'offre')      panel.innerHTML = this._offreHTML();
    else if (this._tab === 'angles')     panel.innerHTML = this._anglesHTML();
    else                                  panel.innerHTML = this._creatifsHTML();

    this._postRender();
  },

  _postRender() {
    const d = this._mktDataCache[this._currentPid] || {};

    if (this._tab === 'positionnement') {
      this._fillField('pos-comp1', d['pos-comp1']);
      this._fillField('pos-comp1-price', d['pos-comp1-price']);
      this._fillField('pos-comp1-strengths', d['pos-comp1-strengths']);
      this._fillField('pos-comp1-weaknesses', d['pos-comp1-weaknesses']);
      this._fillField('pos-advantage', d['pos-advantage']);
      this._fillField('pos-usp', d['pos-usp']);
      this._fillField('avatar-age', d['avatar-age']);
      this._fillField('avatar-gender', d['avatar-gender']);
      this._fillField('avatar-location', d['avatar-location']);
      this._fillField('avatar-problems', d['avatar-problems']);
      this._fillField('avatar-desires', d['avatar-desires']);
      this._fillField('avatar-where', d['avatar-where']);
      this.renderPositionnementSummary();
    }
    else if (this._tab === 'offre') {
      this._fillField('offre-dream', d['offre-dream']);
      this._fillField('offre-proba', d['offre-proba']);
      this._fillField('offre-delay', d['offre-delay']);
      this._fillField('offre-effort', d['offre-effort']);
      this._fillField('offre-bonus', d['offre-bonus']);
      this._fillField('offre-urgency', d['offre-urgency']);
      this._fillField('pqr-price', d['pqr-price']);
      this._fillField('pqr-price-old', d['pqr-price-old']);
      this._fillField('pqr-price-why', d['pqr-price-why']);
      this._fillField('pqr-material', d['pqr-material']);
      this._fillField('pqr-quality-proof', d['pqr-quality-proof']);
      this._fillField('pqr-speed', d['pqr-speed']);
      this._fillField('pqr-process', d['pqr-process']);
      this.renderOffreScore();
    }
    else if (this._tab === 'angles') {
      this.renderAngles();
    }
    else if (this._tab === 'creatifs') {
      const angleOpts = State.data.angles;
      Form.fillSelect('sc-angle', angleOpts, a => a.id, a => a.title, '— Aucun angle —');
      Form.fillSelect('cp-angle', angleOpts, a => a.id, a => a.title, '— Aucun angle —');
      this.renderScripts();
      this.renderCopies();
    }
  },

  _fillField(id, val) {
    const el = $(id);
    if (el && val !== undefined) el.value = val;
  },

  _collectFields(ids) {
    const obj = {};
    ids.forEach(id => { obj[id] = $(id)?.value || ''; });
    return obj;
  },

  _noProductHTML(message = 'Sélectionnez un produit pour commencer.') {
    return `<div class="card"><div style="padding:50px 20px;text-align:center;color:var(--text3)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5" style="margin-bottom:14px"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
      <p style="font-size:.875rem">${esc(message)}</p>
    </div></div>`;
  },

  // ══════════════════════════════════════
  //   TAB 1 : POSITIONNEMENT
  // ══════════════════════════════════════
  _positionnementHTML() {
    if (!this._currentPid) return this._noProductHTML();

    return `
      <div class="split-2col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Analyse Concurrentielle
            </div>
            <button class="btn btn-sm btn-primary" onclick="Pages.marketing.saveConcurrents()">Sauvegarder</button>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Concurrent principal</label>
              <input class="form-input" type="text" id="pos-comp1" placeholder="Ex: Boutique X, AliExpress...">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Leur prix</label>
              <input class="form-input" type="text" id="pos-comp1-price" placeholder="Ex: 12 000 FCFA">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Leurs forces</label>
              <textarea class="form-input" id="pos-comp1-strengths" rows="2" style="resize:none;font-family:inherit" placeholder="Ce qu'ils font bien..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">Leurs faiblesses</label>
              <textarea class="form-input" id="pos-comp1-weaknesses" rows="2" style="resize:none;font-family:inherit" placeholder="Ce qu'ils font mal..."></textarea>
            </div>
            <div class="sep" style="grid-column:unset;margin-bottom:14px">Notre avantage</div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Pourquoi nous choisir ?</label>
              <textarea class="form-input" id="pos-advantage" rows="3" style="resize:none;font-family:inherit" placeholder="Ce qui nous différencie..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Notre promesse unique (USP)</label>
              <input class="form-input" type="text" id="pos-usp" placeholder="Ex: Livraison le jour même à Bamako">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              Client Idéal (Avatar)
            </div>
            <button class="btn btn-sm btn-primary" onclick="Pages.marketing.saveAvatar()">Sauvegarder</button>
          </div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
              <div class="form-group">
                <label class="form-label">Âge cible</label>
                <input class="form-input" type="text" id="avatar-age" placeholder="Ex: 20-35 ans">
              </div>
              <div class="form-group">
                <label class="form-label">Genre</label>
                <select class="form-input" id="avatar-gender">
                  <option value="">Tous</option>
                  <option value="Femmes">Femmes</option>
                  <option value="Hommes">Hommes</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Localisation</label>
              <input class="form-input" type="text" id="avatar-location" placeholder="Ex: Bamako, ACI 2000...">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Problèmes & frustrations</label>
              <textarea class="form-input" id="avatar-problems" rows="2" style="resize:none;font-family:inherit" placeholder="Qu'est-ce qui les frustre ?"></textarea>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Désirs & aspirations</label>
              <textarea class="form-input" id="avatar-desires" rows="2" style="resize:none;font-family:inherit" placeholder="Qu'est-ce qu'ils veulent vraiment ?"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Où les trouver ?</label>
              <input class="form-input" type="text" id="avatar-where" placeholder="Ex: Facebook, TikTok, marchés...">
            </div>
          </div>
        </div>

        <div class="card" style="grid-column:1/-1">
          <div class="card-header">
            <div class="card-title">Résumé du Positionnement</div>
            <button class="btn btn-sm btn-secondary" onclick="Pages.marketing.renderPositionnementSummary()">Actualiser</button>
          </div>
          <div id="pos-summary" style="padding:20px;color:var(--text3);font-size:.84rem">
            Remplissez les sections et sauvegardez.
          </div>
        </div>
      </div>`;
  },

  async saveConcurrents() {
    if (!this._currentPid) return Toast.err('Sélectionnez un produit.');
    this._mergeAndSave([
      'pos-comp1','pos-comp1-price','pos-comp1-strengths','pos-comp1-weaknesses',
      'pos-advantage','pos-usp',
    ], 'Analyse concurrentielle sauvegardée.');
  },

  async saveAvatar() {
    if (!this._currentPid) return Toast.err('Sélectionnez un produit.');
    this._mergeAndSave([
      'avatar-age','avatar-gender','avatar-location','avatar-problems','avatar-desires','avatar-where',
    ], 'Avatar client sauvegardé.');
  },

  async _mergeAndSave(fields, successMsg) {
    const pid = this._currentPid;
    const newData = this._collectFields(fields);
    const merged   = { ...(this._mktDataCache[pid] || {}), ...newData };

    await Action.run(
      async () => {
        await DB.marketingData.upsert(pid, merged);
        this._mktDataCache[pid] = merged;
        this.renderPositionnementSummary();
        this.renderOffreScore();
      },
      { successMsg, errorMsg: 'Erreur lors de la sauvegarde.' }
    );
  },

  renderPositionnementSummary() {
    const pid = this._currentPid;
    const wrap = $('pos-summary');
    if (!wrap) return;
    if (!pid) { wrap.innerHTML = '<span style="color:var(--text3)">Sélectionnez un produit.</span>'; return; }

    const d    = this._mktDataCache[pid] || {};
    const prod = State.getProduct(pid);

    if (!d['pos-usp'] && !d['avatar-age']) {
      wrap.innerHTML = '<span style="color:var(--text3)">Remplissez les sections et sauvegardez.</span>';
      return;
    }

    wrap.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="pos-block">
          <div class="pos-block-title">🎯 Produit analysé</div>
          <div style="font-size:.95rem;font-weight:700;color:var(--text);margin-bottom:6px">${esc(prod?.name || '—')}</div>
          ${d['pos-usp'] ? `<div style="font-size:.82rem;color:var(--accent2);font-style:italic">"${esc(d['pos-usp'])}"</div>` : ''}
        </div>
        <div class="pos-block">
          <div class="pos-block-title">👤 Client idéal</div>
          ${d['avatar-age'] ? `<div style="font-size:.82rem;color:var(--text2);margin-bottom:4px">• Âge : <strong>${esc(d['avatar-age'])}</strong>${d['avatar-gender'] ? ' · ' + esc(d['avatar-gender']) : ''}</div>` : ''}
          ${d['avatar-location'] ? `<div style="font-size:.82rem;color:var(--text2);margin-bottom:4px">• Lieu : ${esc(d['avatar-location'])}</div>` : ''}
          ${d['avatar-where'] ? `<div style="font-size:.82rem;color:var(--text2)">• Où le trouver : ${esc(d['avatar-where'])}</div>` : ''}
        </div>
        ${d['avatar-problems'] ? `<div class="pos-block"><div class="pos-block-title" style="color:var(--red)">😤 Problèmes</div><div style="font-size:.82rem;color:var(--text2);line-height:1.6">${esc(d['avatar-problems'])}</div></div>` : ''}
        ${d['avatar-desires'] ? `<div class="pos-block"><div class="pos-block-title" style="color:var(--green)">✨ Désirs</div><div style="font-size:.82rem;color:var(--text2);line-height:1.6">${esc(d['avatar-desires'])}</div></div>` : ''}
        ${d['pos-comp1'] ? `<div class="pos-block"><div class="pos-block-title" style="color:var(--red)">⚔️ Concurrent : ${esc(d['pos-comp1'])}</div>
          ${d['pos-comp1-price'] ? `<div style="font-size:.78rem;color:var(--text3);margin-bottom:6px">Prix : ${esc(d['pos-comp1-price'])}</div>` : ''}
          ${d['pos-comp1-strengths'] ? `<div style="font-size:.8rem;color:var(--green);margin-bottom:4px">+ ${esc(d['pos-comp1-strengths'])}</div>` : ''}
          ${d['pos-comp1-weaknesses'] ? `<div style="font-size:.8rem;color:var(--red)">− ${esc(d['pos-comp1-weaknesses'])}</div>` : ''}
        </div>` : ''}
        ${d['pos-advantage'] ? `<div class="pos-block" style="border-color:rgba(124,111,255,0.25)"><div class="pos-block-title" style="color:var(--accent2)">💎 Notre avantage</div><div style="font-size:.82rem;color:var(--text2);line-height:1.6">${esc(d['pos-advantage'])}</div></div>` : ''}
      </div>`;
  },

  // ══════════════════════════════════════
  //   TAB 2 : OFFRE
  // ══════════════════════════════════════
  _offreHTML() {
    if (!this._currentPid) return this._noProductHTML();

    return `
      <div class="split-2col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Construire la Valeur
            </div>
            <button class="btn btn-sm btn-primary" onclick="Pages.marketing.saveOffre100M()">Sauvegarder</button>
          </div>
          <div class="card-body">
            <div style="background:rgba(124,111,255,0.06);border:1px solid rgba(124,111,255,0.15);border-radius:10px;padding:12px 14px;margin-bottom:18px;font-size:.78rem;color:var(--accent3);line-height:1.6">
              💡 <strong>Méthode 100M$ Offers (Hormozi)</strong> : votre offre doit sembler trop bonne pour être refusée.
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Résultat rêvé du client</label>
              <input class="form-input" type="text" id="offre-dream" placeholder="Ex: Recevoir un bijou de qualité en 24h">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Probabilité perçue de réussite</label>
              <select class="form-input" id="offre-proba">
                <option value="">Sélectionner...</option>
                <option value="Garantie satisfaction ou remboursé">Garantie satisfaction ou remboursé</option>
                <option value="Avis clients vérifiés">Avis clients vérifiés</option>
                <option value="Photos/vidéos réelles">Photos/vidéos réelles du produit</option>
                <option value="Démonstration en direct">Démonstration en direct</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Délai pour obtenir le résultat</label>
              <input class="form-input" type="text" id="offre-delay" placeholder="Ex: Livré en 24-48h à Bamako">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Effort demandé au client</label>
              <input class="form-input" type="text" id="offre-effort" placeholder="Ex: Juste un message WhatsApp">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Bonus & cadeaux inclus</label>
              <textarea class="form-input" id="offre-bonus" rows="2" style="resize:none;font-family:inherit" placeholder="Ex: Emballage cadeau, livraison gratuite..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Rareté & urgence</label>
              <input class="form-input" type="text" id="offre-urgency" placeholder="Ex: Stock limité à 50 pièces">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              Prix · Qualité · Rapidité
            </div>
          </div>
          <div class="card-body">
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:16px;margin-bottom:14px">
              <div style="font-size:.72rem;color:var(--accent2);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">💰 Prix</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div class="form-group">
                  <label class="form-label">Prix actuel</label>
                  <input class="form-input" type="text" id="pqr-price" placeholder="Ex: 7 000 FCFA">
                </div>
                <div class="form-group">
                  <label class="form-label">Prix barré</label>
                  <input class="form-input" type="text" id="pqr-price-old" placeholder="Ex: 14 000 FCFA">
                </div>
              </div>
              <div class="form-group" style="margin-top:10px">
                <label class="form-label">Justification du prix</label>
                <input class="form-input" type="text" id="pqr-price-why" placeholder="Ex: Prix le plus bas du marché">
              </div>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:16px;margin-bottom:14px">
              <div style="font-size:.72rem;color:var(--green);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">⭐ Qualité</div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label">Matériaux / composition</label>
                <input class="form-input" type="text" id="pqr-material" placeholder="Ex: Acier inoxydable 316L">
              </div>
              <div class="form-group">
                <label class="form-label">Preuves de qualité</label>
                <textarea class="form-input" id="pqr-quality-proof" rows="2" style="resize:none;font-family:inherit" placeholder="Certifié, testé, retours positifs..."></textarea>
              </div>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:16px">
              <div style="font-size:.72rem;color:var(--orange);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">⚡ Rapidité</div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label">Délai de livraison</label>
                <input class="form-input" type="text" id="pqr-speed" placeholder="Ex: Livré le jour même">
              </div>
              <div class="form-group">
                <label class="form-label">Processus de commande</label>
                <input class="form-input" type="text" id="pqr-process" placeholder="Ex: 1 message WhatsApp → confirmé en 5min">
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="grid-column:1/-1">
          <div class="card-header">
            <div class="card-title">Score & Résumé de l'Offre</div>
            <button class="btn btn-sm btn-secondary" onclick="Pages.marketing.renderOffreScore()">Calculer</button>
          </div>
          <div id="offre-score-display" style="padding:20px;color:var(--text3);font-size:.84rem">
            Remplissez et sauvegardez pour voir votre score.
          </div>
        </div>
      </div>`;
  },

  async saveOffre100M() {
    if (!this._currentPid) return Toast.err('Sélectionnez un produit.');
    this._mergeAndSave([
      'offre-dream','offre-proba','offre-delay','offre-effort','offre-bonus','offre-urgency',
      'pqr-price','pqr-price-old','pqr-price-why','pqr-material','pqr-quality-proof','pqr-speed','pqr-process',
    ], 'Offre sauvegardée.');
  },

  renderOffreScore() {
    const pid  = this._currentPid;
    const wrap = $('offre-score-display');
    if (!wrap) return;
    if (!pid) { wrap.innerHTML = '<span style="color:var(--text3)">Sélectionnez un produit.</span>'; return; }

    const d    = this._mktDataCache[pid] || {};
    const prod = State.getProduct(pid);

    let score = 0;
    const rows = this._criteria.map(c => {
      const filled = !!(d[c.key] && d[c.key].trim());
      if (filled) score += c.weight;
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">
          <div style="width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;background:${filled ? 'var(--green-bg)' : 'var(--surface3)'};border:1px solid ${filled ? 'var(--green-b)' : 'var(--border)'};color:${filled ? 'var(--green)' : 'var(--text3)'}">${filled ? '✓' : '○'}</div>
          <div style="flex:1;font-size:.82rem;color:${filled ? 'var(--text)' : 'var(--text3)'}">${c.label}</div>
          <div style="font-size:.72rem;font-weight:700;color:${filled ? 'var(--green)' : 'var(--text3)'}">+${c.weight}%</div>
        </div>`;
    }).join('');

    const scoreColor = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--accent2)' : score >= 40 ? 'var(--yellow)' : 'var(--red)';
    const scoreLabel = score >= 80 ? 'Offre irrésistible 🔥' : score >= 60 ? 'Bonne offre 👍' : score >= 40 ? 'Offre moyenne ⚠️' : 'Offre faible ❌';

    wrap.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start">
        <div>
          <div style="font-size:.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:14px">Critères remplis</div>
          ${rows}
        </div>
        <div style="text-align:center;padding:24px;background:var(--surface2);border:1px solid var(--border);border-radius:14px">
          <div style="font-size:3rem;font-weight:900;color:${scoreColor};letter-spacing:-.04em;line-height:1">${score}%</div>
          <div style="font-size:.82rem;font-weight:700;color:${scoreColor};margin-top:8px;margin-bottom:16px">${scoreLabel}</div>
          <div class="offre-score-bar"><div class="offre-score-fill" style="width:${score}%;background:${scoreColor}"></div></div>
          <div style="font-size:.72rem;color:var(--text3);margin-top:12px;line-height:1.5">
            ${score < 80 ? `Complétez encore ${100 - score}% pour une offre irrésistible` : 'Votre offre est prête à convertir !'}
          </div>
          ${prod ? `<div style="margin-top:14px;padding:10px;background:var(--surface3);border-radius:8px;font-size:.75rem;color:var(--text2)">
            <div style="font-weight:600;margin-bottom:4px">${esc(prod.name)}</div>
            ${d['pqr-price'] ? `<div style="color:var(--green)">${esc(d['pqr-price'])}</div>` : ''}
            ${d['pqr-speed'] ? `<div style="color:var(--orange)">⚡ ${esc(d['pqr-speed'])}</div>` : ''}
          </div>` : ''}
        </div>
      </div>`;
  },

  // ══════════════════════════════════════
  //   TAB 3 : ANGLES
  // ══════════════════════════════════════
  _anglesHTML() {
    return `
      <div class="split-360">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Ajouter un Angle</div>
            <button class="btn btn-sm btn-secondary" onclick="Pages.marketing.clearAngle()">Effacer</button>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Type d'angle *</label>
              <select class="form-input" id="angle-type">
                <option value="Emotionnel">Émotionnel</option>
                <option value="Problème-Solution">Problème → Solution</option>
                <option value="Curiosité">Curiosité / Mystère</option>
                <option value="Social proof">Preuve sociale</option>
                <option value="Urgence">Urgence / Rareté</option>
                <option value="Bénéfice direct">Bénéfice direct</option>
                <option value="Identité">Identité / Appartenance</option>
                <option value="Contre-intuitif">Contre-intuitif</option>
                <option value="Storytelling">Storytelling</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Titre de l'angle *</label>
              <input class="form-input" type="text" id="angle-title" placeholder="Ex: Le bijou qui protège et embellit">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Description</label>
              <textarea class="form-input" id="angle-desc" rows="3" style="resize:none;font-family:inherit" placeholder="Comment utiliser cet angle..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Exemple de phrase d'accroche</label>
              <textarea class="form-input" id="angle-hook" rows="2" style="resize:none;font-family:inherit" placeholder="Ex: Et si un bracelet changeait votre quotidien ?"></textarea>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">Canal recommandé</label>
              <select class="form-input" id="angle-channel">
                <option value="Tous">Tous les canaux</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="Pages.marketing.saveAngle()">Ajouter l'Angle</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">Angles définis</div>
            <span id="angles-count" style="font-size:.75rem;color:var(--text3)">0 angle(s)</span>
          </div>
          <div id="angles-grid" style="padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px"></div>
        </div>
      </div>`;
  },

  clearAngle() {
    Form.clear('angle-title','angle-desc','angle-hook');
    $('angle-type').value    = 'Emotionnel';
    $('angle-channel').value = 'Tous';
  },

  async saveAngle() {
    const title = str('angle-title');
    if (!title) return Toast.err('Titre requis.');

    const payload = {
      type:        str('angle-type') || 'Autre',
      title,
      description: str('angle-desc'),
      hook:        str('angle-hook'),
      channel:     str('angle-channel') || 'Tous',
      product_id:  this._currentPid || null,
    };

    await Action.run(
      async () => {
        const angle = await DB.angles.create(payload);
        State.addAngle(angle);
        this.clearAngle();
        this.renderAngles();
      },
      { successMsg: `Angle "${title}" ajouté.`, errorMsg: 'Erreur lors de l\'ajout.' }
    );
  },

  async delAngle(id) {
    if (!Modal.confirm('Supprimer cet angle ?')) return;
    await Action.run(
      async () => {
        await DB.angles.delete(id);
        State.removeAngle(id);
        this.renderAngles();
      },
      { successMsg: 'Angle supprimé.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },

  renderAngles() {
    const count = $('angles-count');
    const grid  = $('angles-grid');
    if (!grid) return;

    const list = this._currentPid
      ? State.data.angles.filter(a => !a.product_id || a.product_id === this._currentPid)
      : State.data.angles;

    if (count) count.textContent = `${list.length} angle(s)`;

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${EmptyState.html('Aucun angle défini.')}</div>`;
      return;
    }

    const icons = {
      'Emotionnel':'❤️','Problème-Solution':'🔄','Curiosité':'🤔','Social proof':'⭐',
      'Urgence':'⏰','Bénéfice direct':'💎','Identité':'👑','Contre-intuitif':'🔀',
      'Storytelling':'📖','Autre':'💡',
    };

    grid.innerHTML = list.map((a, i) => `
      <div class="angle-card t-${a.type.replace(/ /g,'\\ ')} anim" style="animation-delay:${i * .04}s">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.1rem">${icons[a.type] || '💡'}</span>
            <span class="badge bp" style="font-size:.65rem">${esc(a.type)}</span>
          </div>
          <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.marketing.delAngle('${a.id}')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
          </button>
        </div>
        <div style="font-size:.875rem;font-weight:700;margin-bottom:6px;line-height:1.35">${esc(a.title)}</div>
        ${a.description ? `<div style="font-size:.75rem;color:var(--text2);margin-bottom:8px;line-height:1.5">${esc(a.description)}</div>` : ''}
        ${a.hook ? `<div style="font-size:.78rem;color:var(--accent2);font-style:italic;background:rgba(124,111,255,0.07);border-radius:7px;padding:8px 10px;border-left:2px solid var(--accent);margin-bottom:8px">"${esc(a.hook)}"</div>` : ''}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
          <span class="badge bb" style="font-size:.63rem">${esc(a.channel)}</span>
          <span style="font-size:.67rem;color:var(--text3)">${fmtDate(a.created_at?.split('T')[0])}</span>
        </div>
      </div>`).join('');
  },

  // ══════════════════════════════════════
  //   TAB 4 : CRÉATIFS
  // ══════════════════════════════════════
  _creatifsHTML() {
    return `
      <div style="display:flex;gap:6px;margin-bottom:20px">
        <button class="task-filter-btn ${this._creatifTab === 'scripts' ? 'active' : ''}" onclick="Pages.marketing.switchCreatifTab(this,'scripts')">Scripts Vidéo</button>
        <button class="task-filter-btn ${this._creatifTab === 'copy' ? 'active' : ''}" onclick="Pages.marketing.switchCreatifTab(this,'copy')">Copywritings</button>
      </div>
      <div id="creatif-scripts" style="${this._creatifTab !== 'scripts' ? 'display:none' : ''}">
        ${this._scriptsHTML()}
      </div>
      <div id="creatif-copy" style="${this._creatifTab !== 'copy' ? 'display:none' : ''}">
        ${this._copiesHTML()}
      </div>`;
  },

  switchCreatifTab(el, tab) {
    this._creatifTab = tab;
    $$('#page-marketing .task-filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    $('creatif-scripts').style.display = tab === 'scripts' ? 'block' : 'none';
    $('creatif-copy').style.display    = tab === 'copy'    ? 'block' : 'none';
  },

  _scriptsHTML() {
    return `
      <div class="split-400">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Créer un Script</div>
            <button class="btn btn-sm btn-secondary" onclick="Pages.marketing.clearScript()">Effacer</button>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Titre du script *</label>
              <input class="form-input" type="text" id="sc-title" placeholder="Ex: Script TikTok Bracelet #1">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Durée cible</label>
              <select class="form-input" id="sc-duration">
                <option value="15s">15 secondes</option>
                <option value="30s">30 secondes</option>
                <option value="60s">60 secondes</option>
                <option value="90s">90 secondes</option>
                <option value="3min">3 minutes</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Angle utilisé</label>
              <select class="form-input" id="sc-angle"></select>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px;margin-bottom:14px">
              <div style="font-size:.7rem;color:var(--accent2);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Structure du Script</div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--orange)">🎣 Hook (0-3s)</label>
                <textarea class="form-input" id="sc-hook" rows="2" style="resize:none;font-family:inherit" placeholder="Accroche choc..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--red)">😤 Problème (3-8s)</label>
                <textarea class="form-input" id="sc-problem" rows="2" style="resize:none;font-family:inherit" placeholder="Le problème ressenti..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--blue)">💡 Agitation (8-15s)</label>
                <textarea class="form-input" id="sc-agitation" rows="2" style="resize:none;font-family:inherit" placeholder="Amplifiez la douleur..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--green)">✅ Solution (15-30s)</label>
                <textarea class="form-input" id="sc-solution" rows="2" style="resize:none;font-family:inherit" placeholder="Présentez le produit..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--accent2)">⭐ Preuve (30-45s)</label>
                <textarea class="form-input" id="sc-proof" rows="2" style="resize:none;font-family:inherit" placeholder="Témoignages, résultats..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label" style="color:var(--yellow)">👉 CTA (dernières 5s)</label>
                <textarea class="form-input" id="sc-cta" rows="2" style="resize:none;font-family:inherit" placeholder="Appel à l'action..."></textarea>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Notes de réalisation</label>
              <textarea class="form-input" id="sc-notes" rows="2" style="resize:none;font-family:inherit" placeholder="Décors, musique, transitions..."></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="Pages.marketing.saveScript()">Sauvegarder le Script</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">Scripts sauvegardés</div>
            <span id="scripts-count" style="font-size:.75rem;color:var(--text3)">0</span>
          </div>
          <div id="scripts-list" style="padding:16px;display:flex;flex-direction:column;gap:12px;max-height:700px;overflow-y:auto"></div>
        </div>
      </div>`;
  },

  clearScript() {
    Form.clear('sc-title','sc-hook','sc-problem','sc-agitation','sc-solution','sc-proof','sc-cta','sc-notes');
    $('sc-duration').value = '30s';
  },

  async saveScript() {
    const title = str('sc-title');
    if (!title) return Toast.err('Titre requis.');

    const payload = {
      title,
      duration:   str('sc-duration') || '30s',
      angle_id:   str('sc-angle') || null,
      hook:       str('sc-hook'),
      problem:    str('sc-problem'),
      agitation:  str('sc-agitation'),
      solution:   str('sc-solution'),
      proof:      str('sc-proof'),
      cta:        str('sc-cta'),
      notes:      str('sc-notes'),
      product_id: this._currentPid || null,
    };

    await Action.run(
      async () => {
        const script = await DB.scripts.create(payload);
        State.addScript(script);
        this.clearScript();
        this.renderScripts();
      },
      { successMsg: `"${title}" sauvegardé.`, errorMsg: 'Erreur lors de la sauvegarde.' }
    );
  },

  async delScript(id) {
    if (!Modal.confirm('Supprimer ce script ?')) return;
    await Action.run(
      async () => {
        await DB.scripts.delete(id);
        State.removeScript(id);
        this.renderScripts();
      },
      { successMsg: 'Script supprimé.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },

  renderScripts() {
    const count = $('scripts-count');
    const wrap  = $('scripts-list');
    if (!wrap) return;

    const list = this._currentPid
      ? State.data.scripts.filter(s => !s.product_id || s.product_id === this._currentPid)
      : State.data.scripts;

    if (count) count.textContent = list.length;
    if (!list.length) { wrap.innerHTML = EmptyState.html('Aucun script.'); return; }

    const sections = [
      { key:'hook', label:'🎣 Hook', cls:'ss-hook' },
      { key:'problem', label:'😤 Problème', cls:'ss-problem' },
      { key:'agitation', label:'💡 Agitation', cls:'ss-agitation' },
      { key:'solution', label:'✅ Solution', cls:'ss-solution' },
      { key:'proof', label:'⭐ Preuve', cls:'ss-proof' },
      { key:'cta', label:'👉 CTA', cls:'ss-cta' },
    ];

    wrap.innerHTML = [...list].reverse().map((s, i) => {
      const angle = s.angle_id ? State.data.angles.find(a => a.id === s.angle_id) : null;
      return `
        <div class="script-card anim" style="animation-delay:${i * .03}s">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
            <div>
              <div style="font-size:.9rem;font-weight:700;margin-bottom:4px">${esc(s.title)}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <span class="badge bp">${s.duration}</span>
                ${angle ? `<span class="badge bb">${esc(angle.title)}</span>` : ''}
              </div>
            </div>
            <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.marketing.delScript('${s.id}')">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
            </button>
          </div>
          ${sections.filter(sec => s[sec.key]).map(sec => `
            <div class="script-section ${sec.cls}">
              <div style="font-size:.65rem;font-weight:700;color:inherit;opacity:.7;min-width:80px;flex-shrink:0">${sec.label}</div>
              <div>${esc(s[sec.key])}</div>
            </div>`).join('')}
          ${s.notes ? `<div style="margin-top:8px;font-size:.75rem;color:var(--text3);font-style:italic">📝 ${esc(s.notes)}</div>` : ''}
          <div style="margin-top:10px;font-size:.67rem;color:var(--text3);text-align:right">${fmtDate(s.created_at?.split('T')[0])}</div>
        </div>`;
    }).join('');
  },

  _copiesHTML() {
    return `
      <div class="split-400">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Créer un Copywriting</div>
            <button class="btn btn-sm btn-secondary" onclick="Pages.marketing.clearCopy()">Effacer</button>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Titre du copy *</label>
              <input class="form-input" type="text" id="cp-title" placeholder="Ex: Post Facebook Bijou #1">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Format</label>
              <select class="form-input" id="cp-format">
                <option value="Post Facebook">Post Facebook</option>
                <option value="Légende Instagram">Légende Instagram</option>
                <option value="Message WhatsApp">Message WhatsApp</option>
                <option value="Description TikTok">Description TikTok</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Publicité texte">Publicité texte</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">Angle utilisé</label>
              <select class="form-input" id="cp-angle"></select>
            </div>
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px;margin-bottom:14px">
              <div style="font-size:.7rem;color:var(--accent2);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Structure AIDA+</div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--orange)">🎯 Attention</label>
                <textarea class="form-input" id="cp-attention" rows="2" style="resize:none;font-family:inherit" placeholder="Titre qui accroche..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--blue)">🧠 Intérêt</label>
                <textarea class="form-input" id="cp-interest" rows="3" style="resize:none;font-family:inherit" placeholder="Développez le contexte..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--accent2)">💭 Désir</label>
                <textarea class="form-input" id="cp-desire" rows="3" style="resize:none;font-family:inherit" placeholder="Décrivez la transformation..."></textarea>
              </div>
              <div class="form-group" style="margin-bottom:10px">
                <label class="form-label" style="color:var(--green)">✅ Preuve</label>
                <textarea class="form-input" id="cp-proof" rows="2" style="resize:none;font-family:inherit" placeholder="Témoignages, chiffres..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label" style="color:var(--yellow)">🚀 Action</label>
                <textarea class="form-input" id="cp-action" rows="2" style="resize:none;font-family:inherit" placeholder="CTA, lien, numéro..."></textarea>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label class="form-label">Émojis & hashtags</label>
              <input class="form-input" type="text" id="cp-extras" placeholder="Ex: #bijoux #bamako #Mali">
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-primary" style="flex:1" onclick="Pages.marketing.saveCopy()">Sauvegarder</button>
              <button class="btn btn-secondary" onclick="Pages.marketing.previewCopy()">Aperçu</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">Copywritings sauvegardés</div>
            <span id="copies-count" style="font-size:.75rem;color:var(--text3)">0</span>
          </div>
          <div id="copies-list" style="padding:16px;display:flex;flex-direction:column;gap:12px;max-height:700px;overflow-y:auto"></div>
        </div>
      </div>`;
  },

  clearCopy() {
    Form.clear('cp-title','cp-attention','cp-interest','cp-desire','cp-proof','cp-action','cp-extras');
  },

  previewCopy() {
    const msg = [
      $('cp-attention')?.value,
      $('cp-interest')?.value,
      $('cp-desire')?.value,
      $('cp-proof')?.value,
      $('cp-action')?.value,
    ].filter(Boolean).join('\n\n') + (str('cp-extras') ? `\n\n${str('cp-extras')}` : '');

    const win = window.open('', '_blank');
    win.document.write(`<pre style="font-family:sans-serif;padding:30px;white-space:pre-wrap;max-width:600px;line-height:1.7;font-size:15px">${esc(msg)}</pre>`);
  },

  async saveCopy() {
    const title = str('cp-title');
    if (!title) return Toast.err('Titre requis.');

    const payload = {
      title,
      format:     str('cp-format') || 'Post Facebook',
      angle_id:   str('cp-angle') || null,
      attention:  str('cp-attention'),
      interest:   str('cp-interest'),
      desire:     str('cp-desire'),
      proof:      str('cp-proof'),
      action:     str('cp-action'),
      extras:     str('cp-extras'),
      product_id: this._currentPid || null,
    };

    await Action.run(
      async () => {
        const copy = await DB.copies.create(payload);
        State.addCopy(copy);
        this.clearCopy();
        this.renderCopies();
      },
      { successMsg: `"${title}" sauvegardé.`, errorMsg: 'Erreur lors de la sauvegarde.' }
    );
  },

  async delCopy(id) {
    if (!Modal.confirm('Supprimer ce copy ?')) return;
    await Action.run(
      async () => {
        await DB.copies.delete(id);
        State.removeCopy(id);
        this.renderCopies();
      },
      { successMsg: 'Copy supprimé.', errorMsg: 'Erreur lors de la suppression.' }
    );
  },

  copyCopyText(id) {
    const c = State.data.copies.find(x => x.id === id);
    if (!c) return;
    const msg = [c.attention, c.interest, c.desire, c.proof, c.action].filter(Boolean).join('\n\n') + (c.extras ? `\n\n${c.extras}` : '');
    navigator.clipboard.writeText(msg).then(() => Toast.ok('Copié !'));
  },

  renderCopies() {
    const count = $('copies-count');
    const wrap  = $('copies-list');
    if (!wrap) return;

    const list = this._currentPid
      ? State.data.copies.filter(c => !c.product_id || c.product_id === this._currentPid)
      : State.data.copies;

    if (count) count.textContent = list.length;
    if (!list.length) { wrap.innerHTML = EmptyState.html('Aucun copy.'); return; }

    const formatColors = {
      'Post Facebook':'#60a5fa','Légende Instagram':'#ec4899','Message WhatsApp':'#34d399',
      'Description TikTok':'#f87171','Email':'#a78bfa','SMS':'#fbbf24','Publicité texte':'#fb923c',
    };

    wrap.innerHTML = [...list].reverse().map((c, i) => {
      const angle = c.angle_id ? State.data.angles.find(a => a.id === c.angle_id) : null;
      const fc    = formatColors[c.format] || 'var(--accent2)';
      return `
        <div class="copy-card anim" style="animation-delay:${i * .03}s">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
            <div>
              <div style="font-size:.9rem;font-weight:700;margin-bottom:4px">${esc(c.title)}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <span class="badge" style="background:${fc}22;color:${fc};border:1px solid ${fc}44;font-size:.65rem">${esc(c.format)}</span>
                ${angle ? `<span class="badge bb" style="font-size:.65rem">${esc(angle.title)}</span>` : ''}
              </div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="Pages.marketing.copyCopyText('${c.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
              <button class="btn btn-sm btn-danger btn-icon" onclick="Pages.marketing.delCopy('${c.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${c.attention ? `<div class="script-section ss-hook"><div style="font-size:.65rem;font-weight:700;min-width:70px;opacity:.7">🎯 Titre</div><div style="font-size:.8rem">${esc(c.attention)}</div></div>` : ''}
            ${c.interest ? `<div class="script-section ss-agitation"><div style="font-size:.65rem;font-weight:700;min-width:70px;opacity:.7">🧠 Intérêt</div><div style="font-size:.8rem">${esc(c.interest.substring(0,80))}${c.interest.length > 80 ? '...' : ''}</div></div>` : ''}
            ${c.action ? `<div class="script-section ss-cta"><div style="font-size:.65rem;font-weight:700;min-width:70px;opacity:.7">🚀 Action</div><div style="font-size:.8rem">${esc(c.action)}</div></div>` : ''}
          </div>
          <div style="margin-top:8px;font-size:.67rem;color:var(--text3);text-align:right">${fmtDate(c.created_at?.split('T')[0])}</div>
        </div>`;
    }).join('');
  },
};
