// ══════════════════════════════════════════
//   NEXUS — Service PayTech
// ══════════════════════════════════════════

/**
 * Service PayTech pour les paiements mobile money
 * 
 * IMPORTANT: Les clés secrètes ne doivent JAMAIS être exposées côté client.
 * Ce fichier contient uniquement les méthodes publiques (initiation de paiement).
 * Le traitement des webhooks doit se faire côté serveur (Edge Function ou API).
 */

const PAYTECH_CONFIG = {
    apiUrl: 'https://paytech.sn/api', // URL de production PayTech
    // Les clés secrètes sont stockées côté serveur uniquement (voir edge function)
};

/**
 * Initialise un paiement PayTech
 * @param {Object} params - Paramètres du paiement
 * @param {string} params.email - Email du client
 * @param {string} params.name - Nom complet du client
 * @param {string} params.phone - Téléphone du client
 * @param {string} params.plan - Plan choisi (trial, monthly, annual)
 * @param {number} params.amount - Montant en FCFA
 * @returns {Promise<Object>} - Réponse de PayTech avec URL de paiement
 */
export async function initiatePayment({ email, name, phone, plan, amount }) {
    try {
        // Appel à notre Edge Function Supabase (sécurisée, pas de clé exposée)
        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paytech-init`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    email,
                    name,
                    phone,
                    plan,
                    amount,
                    currency: 'XOF',
                    description: `NEXUS - Abonnement ${plan}`,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'initialisation du paiement');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('PayTech initiation error:', error);
        throw error;
    }
}

/**
 * Vérifie le statut d'un paiement
 * @param {string} transactionId - ID de transaction PayTech
 * @returns {Promise<Object>} - Statut du paiement
 */
export async function checkPaymentStatus(transactionId) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paytech-status`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ transactionId }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la vérification du statut');
        }

        return await response.json();
    } catch (error) {
        console.error('PayTech status check error:', error);
        throw error;
    }
}

/**
 * Plans PayTech avec montants
 */
export const PAYTECH_PLANS = {
    trial: {
        name: 'Essai Gratuit',
        amount: 0,
        currency: 'XOF',
    },
    monthly: {
        name: 'Mensuel',
        amount: 5000,
        currency: 'XOF',
    },
    annual: {
        name: 'Annuel',
        amount: 40000,
        currency: 'XOF',
    },
};

export default {
    initiatePayment,
    checkPaymentStatus,
    PAYTECH_PLANS,
};