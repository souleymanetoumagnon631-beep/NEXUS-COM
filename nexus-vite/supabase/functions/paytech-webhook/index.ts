// ══════════════════════════════════════════
//   NEXUS — PayTech Webhook (Supabase Edge Function)
// ══════════════════════════════════════════
//
// Cette fonction gère les notifications de paiement PayTech.
// Elle est appelée par PayTech après un paiement réussi/échoué.
//
// Sécurité : Les clés secrètes PayTech sont stockées dans les
// secrets Supabase (pas dans le code).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Configuration PayTech (depuis les secrets Supabase)
const PAYTECH_API_TOKEN = Deno.env.get('PAYTECH_API_TOKEN') || '';
const PAYTECH_SECRET_KEY = Deno.env.get('PAYTECH_SECRET_KEY') || '';

// Initialisation du client Supabase
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface PayTechWebhookPayload {
    event: string;
    transaction_id: string;
    status: 'success' | 'failed' | 'pending';
    amount: number;
    currency: string;
    customer_email: string;
    customer_name: string;
    plan: string;
    timestamp: string;
    signature: string; // Signature PayTech pour vérification
}

/**
 * Vérifie la signature du webhook PayTech
 */
function verifySignature(payload: PayTechWebhookPayload): boolean {
    // PayTech utilise une signature HMAC-SHA256
    // Implémentez la vérification selon la doc PayTech
    const crypto = globalThis.crypto;
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const key = encoder.encode(PAYTECH_SECRET_KEY);

    // Note: Cette implémentation est un exemple
    // Adaptez selon la méthode de signature de PayTech
    return true; // À implémenter selon la doc PayTech
}

/**
 * Met à jour l'abonnement dans Supabase
 */
async function updateSubscription(
    supabaseUrl: string,
    serviceKey: string,
    userId: string,
    plan: string,
    transactionId: string
) {
    const response = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
                user_id: userId,
                plan: plan,
                transaction_id: transactionId,
                is_active: true,
                starts_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update subscription');
    }

    return await response.json();
}

/**
 * Envoie un email de confirmation (optionnel)
 */
async function sendConfirmationEmail(email: string, plan: string) {
    // Intégration avec Supabase Auth ou service email
    // Pour l'instant, on log juste
    console.log(`Email de confirmation envoyé à ${email} pour le plan ${plan}`);
}

serve(async (req) => {
    try {
        // 1. Vérifier la méthode HTTP
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // 2. Parser le payload
        const payload: PayTechWebhookPayload = await req.json();

        // 3. Vérifier la signature (sécurité)
        if (!verifySignature(payload)) {
            console.error('Invalid webhook signature');
            return new Response('Invalid signature', { status: 401 });
        }

        console.log(`Webhook reçu: ${payload.event} - Transaction: ${payload.transaction_id}`);

        // 4. Traiter selon le type d'événement
        switch (payload.event) {
            case 'payment.success':
                // Paiement réussi → activer l'abonnement
                try {
                    // Récupérer l'utilisateur Supabase par email
                    const userResponse = await fetch(
                        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(payload.customer_email)}`,
                        {
                            headers: {
                                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                            },
                        }
                    );

                    const users = await userResponse.json();
                    if (users && users.length > 0) {
                        const userId = users[0].id;

                        // Créer/mettre à jour l'abonnement
                        await updateSubscription(
                            SUPABASE_URL,
                            SUPABASE_SERVICE_ROLE_KEY,
                            userId,
                            payload.plan,
                            payload.transaction_id
                        );

                        // Envoyer email de confirmation
                        await sendConfirmationEmail(payload.customer_email, payload.plan);

                        console.log(`Abonnement activé pour ${payload.customer_email} (plan: ${payload.plan})`);
                    } else {
                        console.error(`Utilisateur non trouvé: ${payload.customer_email}`);
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'activation de l\'abonnement:', error);
                }
                break;

            case 'payment.failed':
                // Paiement échoué → logger l'erreur
                console.error(`Paiement échoué pour ${payload.customer_email}: ${payload.transaction_id}`);
                break;

            case 'payment.pending':
                // Paiement en attente → rien à faire
                console.log(`Paiement en attente: ${payload.transaction_id}`);
                break;

            default:
                console.log(`Événement non géré: ${payload.event}`);
        }

        // 5. Répondre 200 OK à PayTech
        return new Response(
            JSON.stringify({ received: true }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            }
        );

    } catch (error) {
        console.error('Erreur webhook PayTech:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            }
        );
    }
});