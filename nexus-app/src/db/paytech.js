import { supabase } from './supabaseClient';

export const paytechService = {
  async requestPayment({ plan, email, name, userId = null, successPath = '/success', cancelPath = '/login' }) {
    if (plan === 'trial') throw new Error('Ce plan ne nécessite pas de paiement.');

    const { data, error } = await supabase.functions.invoke('paytech-create-payment', {
      body: {
        plan,
        email,
        name,
        userId,
        origin: window.location.origin,
        successPath,
        cancelPath,
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la création du paiement');
    }

    sessionStorage.setItem('nexus_pending_payment', JSON.stringify({
      ref: data.ref,
      plan,
      token: data.token || null,
      createdAt: new Date().toISOString(),
    }));

    return { redirectUrl: data.redirect_url, ref: data.ref, token: data.token };
  },

  async pay({ plan, email, name, userId = null, successPath = '/success', cancelPath = '/login' }) {
    const { redirectUrl } = await this.requestPayment({ plan, email, name, userId, successPath, cancelPath });
    window.location.href = redirectUrl;
  },

  getPendingPayment() {
    const raw = sessionStorage.getItem('nexus_pending_payment');
    return raw ? JSON.parse(raw) : null;
  },

  clearPendingPayment() {
    sessionStorage.removeItem('nexus_pending_payment');
  }
};
