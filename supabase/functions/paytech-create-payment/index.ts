// ══════════════════════════════════════════
//   NEXUS — Création paiement (Edge Function)
//   Garde les clés secrètes côté serveur
// ══════════════════════════════════════════

const PAYTECH_API_KEY    = Deno.env.get("PAYTECH_API_KEY")!;
const PAYTECH_API_SECRET = Deno.env.get("PAYTECH_API_SECRET")!;
const PAYTECH_ENV        = Deno.env.get("PAYTECH_ENV") || "prod";
const SUPABASE_URL       = Deno.env.get("SUPABASE_URL")!;

const PLAN_PRICES: Record<string, number> = { monthly: 5000, annual: 40000 };
const PLAN_NAMES: Record<string, string>  = { monthly: "Mensuel", annual: "Annuel" };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
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
    const { plan, email, name, userId, origin } = await req.json();

    // ── Validation stricte — JAMAIS faire confiance au prix envoyé par le client ──
    if (!plan || !PLAN_PRICES[plan]) return json({ error: "Plan invalide" }, 400);
    if (!email)                      return json({ error: "Email requis" }, 400);

    const ref = `NEXUS-${plan.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    const siteOrigin = origin || "https://ton-domaine.vercel.app";

    const body = {
      item_name:    `NEXUS — ${PLAN_NAMES[plan]}`,
      item_price:   PLAN_PRICES[plan], // ← prix défini côté serveur, pas par le client
      currency:     "XOF",
      ref_command:  ref,
      command_name: `Abonnement NEXUS ${PLAN_NAMES[plan]}`,
      env:          PAYTECH_ENV,
      ipn_url:      `${SUPABASE_URL}/functions/v1/paytech-webhook`,
      success_url:  `${siteOrigin}/success.html?plan=${plan}&ref=${ref}`,
      cancel_url:   `${siteOrigin}/login.html?cancelled=true`,
      custom_field: JSON.stringify({ email, name, userId, plan, ref }),
    };

    const response = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Accept":       "application/json",
        "Content-Type": "application/json",
        "API_KEY":      PAYTECH_API_KEY,
        "API_SECRET":   PAYTECH_API_SECRET,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.success !== 1 || !data.redirect_url) {
      console.error("[paytech-create-payment] Erreur PayTech:", data);
      return json({ error: data.errors?.join(", ") || "Erreur PayTech" }, 400);
    }

    return json({ redirect_url: data.redirect_url, ref, token: data.token || null });

  } catch (err) {
    console.error("[paytech-create-payment] Erreur:", err);
    return json({ error: "Erreur serveur" }, 500);
  }
});