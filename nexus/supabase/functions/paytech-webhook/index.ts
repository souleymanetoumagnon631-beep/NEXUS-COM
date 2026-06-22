// ══════════════════════════════════════════
//   NEXUS — Webhook PayTech (Edge Function)
//   Active l'abonnement après paiement réussi
// ══════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const PAYTECH_API_KEY           = Deno.env.get("PAYTECH_API_KEY")!;
const PAYTECH_API_SECRET        = Deno.env.get("PAYTECH_API_SECRET")!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PLAN_DURATIONS: Record<string, number> = { monthly: 1, annual: 12 };
const PLAN_PRICES: Record<string, number>    = { monthly: 5000, annual: 40000 };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

async function sha256Hex(input: string): Promise<string> {
  const data       = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders() });
  if (req.method !== "POST")    return json({ error: "Method not allowed" }, 405);

  try {
    // ── 1. Lire le corps pour la vérification HMAC ──
    const rawBody = await req.text();

    // ── 2. Vérification de sécurité PayTech (signature HMAC) ──
    // PayTech envoie un header X-PayTech-Signature avec HMAC-SHA256 du payload
    const WEBHOOK_SECRET = Deno.env.get("PAYTECH_WEBHOOK_SECRET");
    const signatureHeader = req.headers.get("X-PayTech-Signature");

    if (WEBHOOK_SECRET) {
      // Vérification HMAC - méthode recommandée
      if (!signatureHeader || signatureHeader.length < 10) {
        console.error("[PayTech Webhook] Signature webhook manquante.");
        return json({ error: "Invalid signature" }, 401);
      }

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
      const expectedSig = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      if (signatureHeader !== expectedSig) {
        console.error("[PayTech Webhook] Signature HMAC invalide.");
        return json({ error: "Invalid signature" }, 401);
      }
    } else {
      // Legacy fallback (moins sécurisé) - vérifie les hashes dans le payload
      const payloadCheck: Record<string, string> = {};
      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try { Object.assign(payloadCheck, JSON.parse(rawBody)); } catch {}
      } else {
        const form = new URLSearchParams(rawBody);
        for (const [key, value] of form.entries()) payloadCheck[key] = value;
      }

      const expectedKeyHash    = await sha256Hex(PAYTECH_API_KEY);
      const expectedSecretHash = await sha256Hex(PAYTECH_API_SECRET);

      if (
        payloadCheck.api_key_sha256    !== expectedKeyHash ||
        payloadCheck.api_secret_sha256 !== expectedSecretHash
      ) {
        console.error("[PayTech Webhook] Signature invalide — requête rejetée.");
        return json({ error: "Invalid signature" }, 401);
      }
    }

    // ── 3. Parser le payload ──
    let payload: Record<string, string> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try { payload = JSON.parse(rawBody); } catch { payload = {}; }
    } else {
      const form = new URLSearchParams(rawBody);
      for (const [key, value] of form.entries()) payload[key] = value;
    }

    console.log("[PayTech Webhook] Payload reçu:", payload);

    // ── 4. Ne traiter que les paiements réussis ──
    if (payload.type_event !== "sale_complete") {
      console.log(`[PayTech Webhook] Événement ignoré: ${payload.type_event}`);
      return json({ success: true, ignored: true });
    }

    // ── 5. Parser les infos personnalisées (plan, userId/email, ref) ──
    let custom: Record<string, string> = {};
    try { custom = JSON.parse(payload.custom_field || "{}"); } catch { /* noop */ }

    const plan          = custom.plan;
    const ref           = payload.ref_command || custom.ref;
    const token         = payload.token || null;
    const paymentMethod = payload.payment_method || "unknown";

    if (!plan || !PLAN_DURATIONS[plan]) {
      console.error("[PayTech Webhook] Plan invalide:", plan);
      return json({ error: "Invalid plan" }, 400);
    }

    // ── 6. Idempotence — éviter de traiter 2 fois le même paiement ──
    if (token) {
      const { data: existing } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("paytech_token", token)
        .eq("status", "success")
        .maybeSingle();

      if (existing) {
        console.log("[PayTech Webhook] Paiement déjà traité — ignoré.");
        return json({ success: true, already_processed: true });
      }
    }

    // ── 7. Identifier l'utilisateur ──
    let userId = custom.userId || null;

    if (!userId && custom.email) {
      const targetEmail = custom.email.toLowerCase();

      // Recherche directe par email (plus efficace)
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", targetEmail)
        .maybeSingle();

      if (user) {
        userId = user.id;
      } else {
        // Fallback vers admin API si la table users n'est pas accessible
        const PER_PAGE = 1000;
        let page = 1;
        let found: any = null;

        while (!found && page <= 10) {
          const { data: usersList, error: listError } =
            await supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE });

          if (listError) {
            console.error("[PayTech Webhook] Erreur recherche utilisateur:", listError);
            break;
          }

          found = usersList.users.find(
            u => u.email?.toLowerCase() === targetEmail
          ) || null;

          // Arrêt si plus petit que PER_PAGE (dernière page)
          if (usersList.users.length < PER_PAGE) break;
          page++;
        }

        if (found) userId = found.id;
      }
    }

    if (!userId) {
      console.error("[PayTech Webhook] Utilisateur introuvable.", custom);
      return json({ error: "User not found" }, 404);
    }

    // ── 8. Calculer la nouvelle période d'abonnement ──
    const durationMonths = PLAN_DURATIONS[plan];
    const priceFcfa      = PLAN_PRICES[plan];

    const { data: currentSub } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date();
    let periodStart = now;

    // Si un abonnement payant est encore actif, on prolonge depuis sa date de fin
    if (
      currentSub?.current_period_end &&
      new Date(currentSub.current_period_end) > now &&
      currentSub.plan !== "trial"
    ) {
      periodStart = new Date(currentSub.current_period_end);
    }

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + durationMonths);

    // ── 9. Créer le nouvel abonnement actif ──
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id:             userId,
        plan,
        status:             "active",
        price_fcfa:         priceFcfa,
        trial_ends_at:        null,
        current_period_start: now.toISOString(),
        current_period_end:   periodEnd.toISOString(),
        paytech_ref:          ref,
      })
      .select()
      .single();

    if (subError) {
      console.error("[PayTech Webhook] Erreur création abonnement:", subError);
      return json({ error: "Subscription creation failed" }, 500);
    }

    // ── 10. Enregistrer le paiement (historique) ──
    const { error: payError } = await supabaseAdmin.from("payments").insert({
      user_id:       userId,
      subscription_id: subscription.id,
      paytech_token: token,
      paytech_ref:    ref,
      amount_fcfa:    priceFcfa,
      plan,
      status:       "success",
      payment_method: paymentMethod,
    });

    if (payError) {
      console.error("[PayTech Webhook] Erreur enregistrement paiement:", payError);
    }

    console.log(`[PayTech Webhook] ✓ Abonnement activé — user: ${userId}, plan: ${plan}.`);

    return json({ success: true });

  } catch (err) {
    console.error("[PayTech Webhook] Erreur inattendue:", err);
    return json({ error: "Internal server error" }, 500);
  }
});