// ══════════════════════════════════════════
//   NEXUS — PayTech Webhook (Backend Node.js)
// ══════════════════════════════════════════
//
// Endpoint de secours si vous n'utilisez pas Supabase Edge Functions.
// À déployer sur Vercel, Railway, Render, etc.
//
// IMPORTANT: Ne jamais exposer les clés secrètes PayTech côté client.

import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// ── CONFIGURATION ──
// Les clés sont stockées dans les variables d'environnement du serveur
const PAYTECH_API_TOKEN = process.env.PAYTECH_API_TOKEN || '';
const PAYTECH_SECRET_KEY = process.env.PAYTECH_SECRET_KEY || '';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Vérifie la signature du webhook PayTech
 */
function verifySignature(payload, signature) {
    // PayTech utilise une signature HMAC-SHA256
    // Adaptez selon la documentation PayTech
    const hmac = crypto.createHmac('sha256', PAYTECH_SECRET_KEY);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return digest === signature;
}

/**
 * Met à jour l'abonnement dans Supabase
 */
async function updateSubscription(userId, plan, transactionId) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/subscriptions`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
                user_id: userId,
                plan: plan,
                transaction_id: transactionId,
                is_active: true,
                starts_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update subscription');
    }

    return await response.json();
}

/**
 * Récupère un utilisateur Supabase par email
 */
async function getUserByEmail(email) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    const users = await response.json();
    return users && users.length > 0 ? users[0] : null;
}

// ── ENDPOINT WEBHOOK ──
app.post('/api/webhook/paytech', async (req, res) => {
    try {
        const payload = req.body;
        const signature = req.headers['x-paytech-signature'] || '';

        // 1. Vérifier la signature
        if (!verifySignature(payload, signature)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        console.log(`Webhook reçu: ${payload.event} - Transaction: ${payload.transaction_id}`);

        // 2. Traiter selon le type d'événement
        switch (payload.event) {
            case 'payment.success':
                try {
                    const user = await getUserByEmail(payload.customer_email);

                    if (user) {
                        await updateSubscription(user.id, payload.plan, payload.transaction_id);
                        console.log(`Abonnement activé pour ${payload.customer_email} (plan: ${payload.plan})`);
                    } else {
                        console.error(`Utilisateur non trouvé: ${payload.customer_email}`);
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'activation de l\'abonnement:', error);
                }
                break;

            case 'payment.failed':
                console.error(`Paiement échoué pour ${payload.customer_email}: ${payload.transaction_id}`);
                break;

            case 'payment.pending':
                console.log(`Paiement en attente: ${payload.transaction_id}`);
                break;

            default:
                console.log(`Événement non géré: ${payload.event}`);
        }

        // 3. Répondre 200 OK
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Erreur webhook PayTech:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ── ENDPOINT DE TEST ──
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── DÉMARRAGE DU SERVEUR ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serveur webhook PayTech démarré sur le port ${PORT}`);
    console.log(`📡 Endpoint: http://localhost:${PORT}/api/webhook/paytech`);
});

export default app;