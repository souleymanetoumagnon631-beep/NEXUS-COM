// ══════════════════════════════════════════
//   NEXUS — Configuration globale
// ══════════════════════════════════════════

// ── SUPABASE ──
const SUPABASE_URL = 'https://zewxinjatbyeelqcjntk.supabase.co'; //
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpld3hpbmphdGJ5ZWVscWNqbnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTA2NTAsImV4cCI6MjA5NzEyNjY1MH0.FZVHhpStQZZvQDHaoyXdIGaHX-bNgfPak7CpKR-sELM';           //

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
  supabase: supabaseClient,
  plans: PLANS,
  app: APP_CONFIG
};
