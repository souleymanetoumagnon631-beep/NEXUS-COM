// ══════════════════════════════════════════
//   NEXUS — Client Supabase centralisé
// ══════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env');
}

// Client Supabase unique pour toute l'application
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export par défaut pour compatibilité
export default supabase;