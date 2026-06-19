// ══════════════════════════════════════════
//   NEXUS — PayTech Integration
//   Paiement abonnement (création + suivi)
// ══════════════════════════════════════════

const PayTech = {

  // ══════════════════════════════════════
  //   CRÉER UNE DEMANDE DE PAIEMENT
  // ══════════════════════════════════════
  async requestPayment({ plan, customField = {}, successPath = '/success.html', cancelPath = '/login.html' }) {
    const planConfig = NEXUS.plans[plan];
    if (!planConfig) throw new Error('Plan invalide.');
    if (planConfig.price_fcfa <= 0) throw new Error('Ce plan ne nécessite pas de paiement.');

    const ref = this._generateRef(plan);

    const body = {
      item_name:    `NEXUS — ${planConfig.name}`,
      item_price:   planConfig.price_fcfa,
      currency:     'XOF',
      ref_command:  ref,
      command_name: `Abonnement NEXUS ${planConfig.name}`,
      env:          NEXUS.paytech.ENV,
      ipn_url:      `${window.location.origin}/api/paytech-webhook`,
      success_url:  `${window.location.origin}${successPath}?plan=${plan}&ref=${ref}`,
      cancel_url:   `${window.location.origin}${cancelPath}?cancelled=true`,
      custom_field: JSON.stringify({ ...customField, plan, ref }),
    };

    const response = await fetch(NEXUS.paytech.BASE_URL, {
      method: 'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'API_KEY':      NEXUS.paytech.API_KEY,
        'API_SECRET':   NEXUS.paytech.API_SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur PayTech (${response.status})`);
    }

    const data = await response.json();

    if (data.success !== 1 || !data.redirect_url) {
      throw new Error(data.errors?.join(', ') || 'Échec de la création du paiement.');
    }

    // Sauvegarder la référence localement pour suivi sur success.html
    sessionStorage.setItem('nexus_pending_payment', JSON.stringify({
      ref,
      plan,
      token: data.token || null,
      createdAt: new Date().toISOString(),
    }));

    return { redirectUrl: data.redirect_url, ref, token: data.token };
  },

  // ══════════════════════════════════════
  //   LANCER LE PAIEMENT (redirect immédiat)
  // ══════════════════════════════════════
  async pay({ plan, customField = {}, successPath, cancelPath }) {
    const { redirectUrl } = await this.requestPayment({ plan, customField, successPath, cancelPath });
    window.location.href = redirectUrl;
  },

  // ══════════════════════════════════════
  //   PAIEMENT POUR INSCRIPTION (login.html)
  //   Compte créé mais pas encore payé
  // ══════════════════════════════════════
  async paySignup(email, name, plan) {
    return this.pay({
      plan,
      customField: { email, name },
      successPath: '/success.html',
      cancelPath:  '/login.html',
    });
  },

  // ══════════════════════════════════════
  //   PAIEMENT POUR UPGRADE (dashboard → compte)
  //   User déjà connecté
  // ══════════════════════════════════════
  async payUpgrade(plan) {
    const user = window.__SESSION__?.user;
    if (!user) throw new Error('Session introuvable. Reconnectez-vous.');

    return this.pay({
      plan,
      customField: { userId: user.id, email: user.email },
      successPath: '/success.html',
      cancelPath:  '/dashboard.html',
    });
  },

  // ══════════════════════════════════════
  //   VÉRIFIER LE STATUT D'UN PAIEMENT
  //   (utilisé sur success.html en fallback
  //    si le webhook n'a pas encore traité)
  // ══════════════════════════════════════
  async checkSubscriptionActivated(maxAttempts = 8, delayMs = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
      const sub = await Auth.getSubscription();
      if (sub && sub.is_active && sub.plan !== 'trial') {
        return sub;
      }
      await this._sleep(delayMs);
    }
    return null;
  },

  // ══════════════════════════════════════
  //   UTILS
  // ══════════════════════════════════════
  _generateRef(plan) {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `NEXUS-${plan.toUpperCase()}-${Date.now()}-${rand}`;
  },

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  getPendingPayment() {
    const raw = sessionStorage.getItem('nexus_pending_payment');
    return raw ? JSON.parse(raw) : null;
  },

  clearPendingPayment() {
    sessionStorage.removeItem('nexus_pending_payment');
  },
};

window.PayTech = PayTech;
