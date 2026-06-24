# NEXUS — Commerce Intelligence

Application web de gestion commerciale pour entrepreneurs africains. Centralise achats, ventes, clients, livraisons, finances, projets, tâches, idées produits, relances WhatsApp et marketing.

## Stack Technique

- **Frontend :** HTML/CSS/JS vanilla (SPA sans framework)
- **Backend :** Supabase (Auth, PostgreSQL, Realtime, Edge Functions)
- **Paiement :** PayTech (Afrique de l'Ouest)
- **Graphiques :** Chart.js
- **Déploiement :** Vercel (frontend) + Supabase (backend)

## Structure du Projet

```
nexus/
├── index.html           # Landing page
├── login.html           # Connexion / Inscription
├── dashboard.html       # Application SPA
├── success.html         # Page de confirmation paiement
├── vercel.json          # Configuration Vercel
└── assets/
    ├── css/
    │   ├── variables.css    # Variables CSS & reset
    │   ├── layout.css       # Layout sidebar/main
    │   ├── components.css   # Composants réutilisables
    │   ├── pages.css        # Styles spécifiques aux pages
    │   ├── landing.css      # Landing page
    │   └── mobile.css       # Responsive mobile
    └── js/
        ├── config.js        # Configuration Supabase, plans
        ├── auth.js          # Auth (login, signup, guard)
        ├── paytech.js       # Intégration PayTech
        ├── db.js            # CRUD Supabase
        ├── state.js         # State management
        ├── engine.js        # Moteur de calcul métier
        ├── ui.js            # UI (Navigation, Toast, Modaux)
        ├── charts.js        # Graphiques Chart.js
        ├── app.js           # Point d'entrée
        └── pages/           # Modules de pages
            ├── dashboard.js
            ├── achats.js
            ├── ventes.js
            ├── clients.js
            ├── livraisons.js
            ├── rentabilite.js
            ├── produits.js
            ├── revenus.js
            ├── finances.js
            ├── projets.js
            ├── taches.js
            ├── idees.js
            ├── relances.js
            └── marketing.js

supabase/
├── config.toml              # Configuration Supabase
└── functions/
    ├── paytech-create-payment/  # Edge Function : création paiement
    └── paytech-webhook/         # Edge Function : webhook paiement
```

## Variables d'Environnement Requises

### Supabase (Edge Functions)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | URL du projet Supabase |
| `SERVICE_ROLE_KEY` | Clé service role Supabase |
| `PAYTECH_API_KEY` | Clé API PayTech |
| `PAYTECH_API_SECRET` | Secret API PayTech |
| `PAYTECH_WEBHOOK_SECRET` | Secret HMAC pour vérification webhook |
| `NEXUS_ORIGIN` | URL du site (ex: https://nexus.vercel.app) |

### Frontend (config.js)

Les clés Supabase sont embarquées dans le frontend (anon key) comme requis par le modèle Supabase.

## Déploiement

1. Déployer les Edge Functions Supabase :
   ```bash
   cd supabase
   supabase functions deploy paytech-create-payment
   supabase functions deploy paytech-webhook
   ```

2. Déployer le frontend sur Vercel :
   ```bash
   vercel --prod
   ```

3. Configurer les variables d'environnement dans Vercel et Supabase.

## Corrections Appliquées (v1.4)

### Sécurité (5)
- [x] **Filtre user_id** dans toutes les méthodes getAll() de db.js
- [x] **HMAC obligatoire** pour le webhook PayTech (fallback legacy supprimé)
- [x] **CORS restreint** via variable d'environnement NEXUS_ORIGIN
- [x] **Placeholder "ton-domaine"** remplacé par Deno.env.get("NEXUS_ORIGIN")
- [x] **verify_jwt = false** documenté dans supabase/config.toml (webhook PayTech)

### Logique Métier (5)
- [x] **getCAForPeriod()** — Bornes de dates corrigées (start ≤ end)
- [x] **getDateBounds('week')** — Semaine commence le lundi (pas dimanche)
- [x] **getRevenusStats()** — Calcul des mois basé sur année×12 + mois (pas 30 jours)
- [x] **getFinancesStats()** — Même correction pour le calcul des mois moyens
- [x] **getMonthlyChartData()** — Profit mensuel clarifié avec coût unitaire du mois

### Architecture & Code (5)
- [x] **Script Supabase en double** retiré de login.html
- [x] **Code mort supprimé** : _generateRef() dans paytech.js, hide() vide dans ui.js
- [x] **Dossier nexus/supabase/** supprimé (doublon avec supabase/ racine)
- [x] **Optional chaining** ajouté dans achats.js et ventes.js (p.name?.[0])
- [x] **Gestion d'erreur loadAll()** — Toast erreur utilisateur au lieu de planter

### UX / Interface (5)
- [x] **Modale confirmation custom** — Modal.confirmAsync() disponible (remplace window.confirm)
- [x] **Cache marketing** — invalidateCache() appelé sur changements Realtime
- [x] **Fallback CDN Chart.js** — double source (jsdelivr + unpkg)
- [x] **Limite WhatsApp** — 10 onglets max par envoi pour éviter le flood
- [x] **Tableaux responsive** — amélioration mobile.css (stats-grid, rev-kpis, pipeline, sidebar)

### Base de Données (1)
- [x] **seed.sql créé** — Schéma complet avec RLS, indexes, et fonction RPC get_my_subscription()

## Licence

Propriétaire — Tous droits réservés.