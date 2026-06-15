// ══════════════════════════════════════════
//   NEXUS — Auth (Login / Logout / Guard)
// ══════════════════════════════════════════

const Auth = {

  // ── CONNEXION ──
  async login(email, password) {
    const { data, error } = await NEXUS.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    return data;
  },

  // ── INSCRIPTION ──
  async signup(email, password, fullName) {
    const { data, error } = await NEXUS.supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data;
  },

  // ── DÉCONNEXION ──
  async logout() {
    await NEXUS.supabase.auth.signOut();
    window.location.href = NEXUS.app.login_url;
  },

  // ── SESSION ACTIVE ──
  async getSession() {
    const { data: { session } } = await NEXUS.supabase.auth.getSession();
    return session;
  },

  // ── USER COURANT ──
  async getUser() {
    const { data: { user } } = await NEXUS.supabase.auth.getUser();
    return user;
  },

  // ── ABONNEMENT ACTIF ──
  async getSubscription() {
    const { data, error } = await NEXUS.supabase.rpc('get_my_subscription');
    if (error) return null;
    return data?.[0] || null;
  },

  // ── GUARD : protège dashboard.html ──
  // Appeler en haut de dashboard.html
  async guardDashboard() {
    const session = await this.getSession();

    // Pas connecté → login
    if (!session) {
      window.location.href = NEXUS.app.login_url;
      return false;
    }

    // Vérifier abonnement
    const sub = await this.getSubscription();

    if (!sub || !sub.is_active) {
      // Abonnement expiré → login avec message
      sessionStorage.setItem('nexus_msg', 'Votre abonnement a expiré. Renouvelez pour continuer.');
      window.location.href = NEXUS.app.login_url;
      return false;
    }

    // Stocker les infos session dans window pour usage global
    window.__SESSION__ = {
      user:         session.user,
      subscription: sub,
      userId:       session.user.id,
    };

    return true;
  },

  // ── GUARD : redirige si déjà connecté ──
  // Appeler en haut de login.html
  async guardLogin() {
    const session = await this.getSession();
    if (session) {
      const sub = await this.getSubscription();
      if (sub && sub.is_active) {
        window.location.href = NEXUS.app.dashboard_url;
        return false;
      }
    }
    return true;
  },

  // ── MOT DE PASSE OUBLIÉ ──
  async resetPassword(email) {
    const { error } = await NEXUS.supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/login.html?reset=true` }
    );
    if (error) throw error;
  },

  // ── METTRE À JOUR MOT DE PASSE ──
  async updatePassword(newPassword) {
    const { error } = await NEXUS.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  // ── BADGE ABONNEMENT ──
  getSubscriptionBadge(sub) {
    if (!sub) return { label: 'Inactif', color: 'var(--red)', icon: '⚠️' };
    if (sub.plan === 'trial') {
      const daysLeft = Math.ceil(
        (new Date(sub.trial_ends_at) - new Date()) / 86400000
      );
      return {
        label: `Essai — ${daysLeft}j restant(s)`,
        color: 'var(--yellow)',
        icon: '⏳',
        daysLeft,
      };
    }
    if (sub.plan === 'monthly') {
      return { label: 'Plan Mensuel', color: 'var(--green)', icon: '✅' };
    }
    if (sub.plan === 'annual') {
      return { label: 'Plan Annuel', color: 'var(--accent2)', icon: '⭐' };
    }
    return { label: 'Inconnu', color: 'var(--text3)', icon: '?' };
  },
};

// ── EXPORT GLOBAL ──
window.Auth = Auth;
