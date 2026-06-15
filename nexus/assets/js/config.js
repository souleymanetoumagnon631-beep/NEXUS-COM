// ══════════════════════════════════════════
//   NEXUS — Configuration globale
// ══════════════════════════════════════════

// ── SUPABASE ──
const SUPABASE_URL = 'https://XXXXXX.supabase.co'; // ← remplace par ton URL
const SUPABASE_ANON_KEY = 'eyJhbGci...';           // ← remplace par ton anon key

// ── PAYTECH ──
const PAYTECH_CONFIG = {
  API_KEY:    'TA_API_KEY_ICI',     // ← remplace
  API_SECRET: 'TA_API_SECRET_ICI', // ← remplace
  BASE_URL:   'https://paytech.sn/api/payment/request-payment',
  ENV:        'prod', // 'test' ou 'prod'
};

// ── PLANS & PRIX ──
const PLANS = {
  trial: {
    name:       'Essai Gratuit',
    price_fcfa: 0,
    duration:   7,
    unit:       'jours',
    label:      '7 jours gratuits',
  },
  monthly: {
    name:       'Mensuel',
    price_fcfa: 5000,
    duration:   1,
    unit:       'mois',
    label:      '5 000 FCFA / mois',
  },
  annual: {
    name:       'Annuel',
    price_fcfa: 40000,
    duration:   12,
    unit:       'mois',
    label:      '40 000 FCFA / an',
    savings:    '20 000 FCFA économisés',
  },
};

// ── APP ──
const APP_CONFIG = {
  name:        'NEXUS',
  tagline:     'Commerce Intelligence',
  version:     '1.0.0',
  support_email: 'support@nexus-app.com', // ← remplace
  dashboard_url: '/dashboard.html',
  login_url:     '/login.html',
  success_url:   '/success.html',
};

// ── INIT SUPABASE CLIENT ──
// On utilise le CDN Supabase (pas de build tool)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── EXPORT GLOBAL ──
window.NEXUS = {
  supabase:   supabaseClient,
  plans:      PLANS,
  app:        APP_CONFIG,
  paytech:    PAYTECH_CONFIG,
};
