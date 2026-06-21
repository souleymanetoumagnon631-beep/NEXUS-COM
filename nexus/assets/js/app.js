// ══════════════════════════════════════════
//   NEXUS — Point d'entrée de l'application
//   Init · Auth Guard · Routing
// ══════════════════════════════════════════

// ══════════════════════════════════════════
//   INIT PRINCIPALE
// ══════════════════════════════════════════
(async function initNexus() {
  try {
    // ── 1. Guard Auth ──
    const ok = await Auth.guardDashboard();
    if (!ok) return; // Redirigé vers login

    // ── 2. Charger toutes les données Supabase ──
    await State.init();

    // ── 3. Init thème ──
    Theme.init();

    // ── 4. Init UI ──
    initUserUI();
    Badges.update();
    SubscriptionUI.render();

    // ── 5. Enregistrer les renderers de pages ──
    registerPages();

    // ── 6. Render dashboard (page par défaut) ──
    Pages.dashboard.render();

    // ── 7. Cacher le loader, afficher l'app ──
    showApp();

    // ── 8. Init realtime Supabase ──
    initRealtime();

    // ── 9. Keyboard shortcuts ──
    initKeyboardShortcuts();

    console.log('[NEXUS] Application prête ✓');

  } catch (err) {
    console.error('[NEXUS] Erreur fatale :', err);
    showFatalError(err.message);
  }
})();

// ══════════════════════════════════════════
//   AFFICHER L'APP
// ══════════════════════════════════════════
function showApp() {
  const loader = $('app-loader');
  const app    = $('app');

  if (loader) {
    loader.classList.add('hide');
    setTimeout(() => loader.style.display = 'none', 400);
  }
  if (app) app.style.display = 'flex';
}

// ══════════════════════════════════════════
//   ERREUR FATALE
// ══════════════════════════════════════════
function showFatalError(msg) {
  const loader = $('app-loader');
  if (loader) {
    loader.innerHTML = `
      <div style="text-align:center;padding:40px;max-width:420px">
        <div style="font-size:2rem;margin-bottom:16px">⚠️</div>
        <div style="font-size:1rem;font-weight:700;color:#f87171;margin-bottom:10px">
          Erreur de chargement
        </div>
        <div style="font-size:.84rem;color:#8892a4;line-height:1.6;margin-bottom:24px">
          ${esc(msg || 'Une erreur inattendue est survenue.')}
        </div>
        <button onclick="location.reload()" style="
          background:linear-gradient(135deg,#7c6fff,#8b5cf6);
          color:#fff;border:none;padding:12px 28px;border-radius:10px;
          font-size:.875rem;font-weight:700;cursor:pointer">
          Recharger la page
        </button>
      </div>`;
  }
}

// ══════════════════════════════════════════
//   UI UTILISATEUR
// ══════════════════════════════════════════
function initUserUI() {
  const user = window.__SESSION__?.user;
  if (!user) return;

  const name      = user.user_metadata?.full_name || user.email?.split('@')[0] || 'U';
  const email     = user.email || '';
  const initials  = name.charAt(0).toUpperCase();

  const avatar = $('user-avatar');
  if (avatar) avatar.textContent = initials;

  const menuName  = $('menu-user-name');
  const menuEmail = $('menu-user-email');
  if (menuName)  menuName.textContent  = name;
  if (menuEmail) menuEmail.textContent = email;

  const compteEmail = $('compte-email');
  const compteName  = $('compte-name');
  if (compteEmail) compteEmail.value = email;
  if (compteName)  compteName.value  = name;
}

// ══════════════════════════════════════════
//   ENREGISTRER LES PAGES
// ══════════════════════════════════════════
function registerPages() {
  Nav.register('dashboard',   () => Pages.dashboard?.render?.());
  Nav.register('achats',      () => Pages.achats?.render?.());
  Nav.register('rentabilite', () => Pages.rentabilite?.render?.());
  Nav.register('produits',    () => Pages.produits?.render?.());
  Nav.register('projets',     () => Pages.projets?.render?.());
  Nav.register('taches',      () => Pages.taches?.render?.());
  Nav.register('revenus',     () => Pages.revenus?.render?.());
  Nav.register('clients',     () => Pages.clients?.render?.());
  Nav.register('livraisons',  () => Pages.livraisons?.render?.());
  Nav.register('finances',    () => Pages.finances?.render?.());
  Nav.register('idees',       () => Pages.idees?.render?.());
  Nav.register('relances',    () => Pages.relances?.render?.());
  Nav.register('marketing',   () => Pages.marketing?.render?.());
  Nav.register('compte',      () => Pages.compte?.render?.());
}

// ══════════════════════════════════════════
//   REALTIME SUPABASE
// ══════════════════════════════════════════
function initRealtime() {
  DB.realtime.subscribeAll({
    onNewSale(sale) {
      const exists = State.getSale(sale.id);
      if (!exists) {
        State.addSale(sale);
        Badges.update();
        Nav.refreshIfActive('dashboard');
        Toast.info('Nouvelle vente enregistrée en temps réel');
      }
    },
    onLivraisonChange(payload) {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      if (eventType === 'INSERT') State.addLivraison(newRecord);
      else if (eventType === 'UPDATE') State.updateLivraison(newRecord.id, newRecord);
      else if (eventType === 'DELETE') State.removeLivraison(oldRecord.id);
      Badges.update();
      Nav.refreshIfActive('livraisons');
    },
  });
}

// ══════════════════════════════════════════
//   PAGE : MON COMPTE
// ══════════════════════════════════════════
Pages.compte = {

  async render() {
    const sub   = window.__SESSION__?.subscription;
    const badge = Auth.getSubscriptionBadge(sub);
    const el    = $('compte-sub-info');
    if (!el) return;

    const periodEnd = sub?.plan === 'trial'
      ? sub.trial_ends_at
      : sub?.current_period_end;

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="font-size:1.3rem">${badge.icon}</span>
            <span style="font-size:1rem;font-weight:700;color:${badge.color}">${badge.label}</span>
          </div>
          ${periodEnd
            ? `<div style="font-size:.8rem;color:var(--text2)">
                ${sub?.plan === 'trial' ? 'Essai expire le' : 'Renouvellement le'} :
                <strong>${fmtDate(periodEnd?.split('T')[0])}</strong>
              </div>`
            : ''}
        </div>
        ${sub?.plan === 'trial' || sub?.plan === 'monthly'
          ? `<button class="btn btn-primary" onclick="Pages.compte?.upgrade?.()">
              ${sub?.plan === 'trial' ? 'Choisir un plan' : 'Passer à l\'annuel'}
            </button>`
          : '<span class="badge bg">Plan actif</span>'}
      </div>
      ${sub?.plan === 'trial'
        ? `<div style="margin-top:16px;padding:14px;background:var(--yellow-bg);border:1px solid var(--yellow-b);border-radius:10px;font-size:.82rem;color:var(--yellow);line-height:1.6">
            Votre essai gratuit se termine bientôt. Abonnez-vous pour conserver l'accès à NEXUS et à toutes vos données.
          </div>`
        : ''}
      <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">
          <div style="font-size:.66rem;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;font-weight:600">Plan actuel</div>
          <div style="font-size:.96rem;font-weight:700">${NEXUS.plans[sub?.plan]?.name || '—'}</div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">
          <div style="font-size:.66rem;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;font-weight:600">Prix</div>
          <div style="font-size:.96rem;font-weight:700;color:var(--accent2)">${NEXUS.plans[sub?.plan]?.label || '—'}</div>
        </div>
      </div>`;
  },

  async saveProfile() {
    const name = str('compte-name');
    if (!name) return Toast.err('Nom requis.');

    await Action.run(
      async () => {
        await NEXUS.supabase.auth.updateUser({ data: { full_name: name } });
        if (window.__SESSION__?.user?.user_metadata) {
          window.__SESSION__.user.user_metadata.full_name = name;
        }
        initUserUI();
      },
      { successMsg: 'Profil mis à jour.', errorMsg: 'Erreur lors de la mise à jour.' }
    );
  },

  async changePassword() {
    const pwd  = $('compte-pwd')?.value || '';
    const pwd2 = $('compte-pwd2')?.value || '';

    if (pwd.length < 8) return Toast.err('Minimum 8 caractères.');
    if (pwd !== pwd2)   return Toast.err('Les mots de passe ne correspondent pas.');

    await Action.run(
      () => Auth.updatePassword(pwd),
      { successMsg: 'Mot de passe mis à jour.' }
    );

    Form.clear('compte-pwd', 'compte-pwd2');
  },

  async upgrade() {
    const sub  = window.__SESSION__?.subscription;
    const plan = sub?.plan === 'trial' ? 'monthly' : 'annual';

    try {
      await PayTech.payUpgrade(plan);
    } catch (err) {
      Toast.err(`Erreur paiement : ${err.message}`);
    }
  },

  confirmReset() {
    if (!confirm('⚠️ Supprimer TOUTES vos données ? Cette action est irréversible.')) return;
    if (!confirm('Dernière confirmation : supprimer définitivement ?')) return;
    this._resetAll();
  },

  async _resetAll() {
    await Action.run(
      async () => {
        const uid = DB.userId();
        const tables = [
          'sales','livraisons','tasks','ideas','fixed_expenses',
          'marketing_data','marketing_angles','marketing_scripts',
          'marketing_copies','saved_offers','projects','clients','products'
        ];
        for (const table of tables) {
          await NEXUS.supabase.from(table).delete().eq('user_id', uid);
        }
        await State.init();
        Badges.update();
        Pages.dashboard.render();
        Nav.go('dashboard');
      },
      { successMsg: 'Toutes les données ont été supprimées.', errorMsg: 'Erreur lors de la réinitialisation.' }
    );
  },
};
async function handleImportFile(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;

  if (!confirm('⚠️ Importer ce fichier remplacera TOUTES vos données actuelles. Continuer ?')) return;
  if (!confirm('Dernière confirmation : vos données actuelles seront définitivement écrasées.')) return;

  await Action.run(
    async () => {
      await DB.importBackup(file);
      await State.init();
      Badges.update();
      Nav.go(State.ui.currentPage || 'dashboard');
    },
    { successMsg: 'Importation réussie.', errorMsg: 'Échec de l\'importation.' }
  );
}
