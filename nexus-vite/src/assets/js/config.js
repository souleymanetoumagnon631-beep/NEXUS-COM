// ══════════════════════════════════════════
//   NEXUS — Configuration globale
// ══════════════════════════════════════════

// ── SUPABASE ──
// Les clés sont maintenant dans .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
// et chargées via src/lib/supabase.js

// ── PLANS & PRIX ──
const PLANS = {
  trial: {
    name: 'Essai Gratuit',
    price_fcfa: 0,
    duration: 7,
    unit: 'jours',
    label: '7 jours gratuits',
  },
  monthly: {
    name: 'Mensuel',
    price_fcfa: 5000,
    duration: 1,
    unit: 'mois',
    label: '5 000 FCFA / mois',
  },
  annual: {
    name: 'Annuel',
    price_fcfa: 40000,
    duration: 12,
    unit: 'mois',
    label: '40 000 FCFA / an',
    savings: '20 000 FCFA économisés',
  },
};

// ── APP ──
const APP_CONFIG = {
  name: 'NEXUS',
  tagline: 'Commerce Intelligence',
  version: '1.0.0',
  support_email: 'support@nexus-app.com', // ← remplace
  dashboard_url: '/dashboard.html',
  login_url: '/login.html',
  success_url: '/success.html',
};

// ── INIT SUPABASE CLIENT ──
// Import du client Supabase centralisé (ES module)
import { supabase as supabaseClient } from '../../lib/supabase.js';

// ── EXPORT GLOBAL ──
window.NEXUS = {
  supabase: supabaseClient,
  plans: PLANS,
  app: APP_CONFIG
};
