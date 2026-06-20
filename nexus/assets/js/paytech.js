// ══════════════════════════════════════════
//   NEXUS — PayTech Integration
//   Paiement abonnement (création + suivi)
// ══════════════════════════════════════════

const PayTech = {

  // ══════════════════════════════════════
  //   CRÉER UNE DEMANDE DE PAIEMENT
  // ══════════════════════════════════════
async requestPayment({ plan, customField = {} }) {
    const planConfig = NEXUS.plans[plan];
    if (!planConfig) throw new Error('Plan invalide.');
    if (planConfig.price_fcfa <= 0) throw new Error('Ce plan ne nécessite pas de paiement.');

    const response = await fetch(`${SUPABASE_URL}/functions/v1/paytech-create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        plan,
        email:  customField.email,
        name:   customField.name,
        userId: customField.userId || null,
        origin: window.location.origin,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Erreur serveur (${response.status})`);
    }

    const data = await response.json();

    sessionStorage.setItem('nexus_pending_payment', JSON.stringify({
      ref: data.ref, plan, token: data.token || null, createdAt: new Date().toISOString(),
    }));

    return { redirectUrl: data.redirect_url, ref: data.ref, token: data.token };
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
