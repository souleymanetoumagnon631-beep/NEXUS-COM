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

## Corrections Appliquées (v1.3)

- [x] **Sécurité :** Filtre user_id dans toutes les méthodes getAll()
- [x] **Sécurité :** HMAC obligatoire pour le webhook PayTech
- [x] **Sécurité :** CORS restreint via variable d'environnement
- [x] **Sécurité :** Placeholder de domaine remplacé par env var
- [x] **Logique :** Calcul des dates de semaine corrigé (lundi -> dimanche)
- [x] **Logique :** Calcul des mois basé sur la différence réelle
- [x] **Logique :** Bornes de dates clarifiées dans getCAForPeriod()
- [x] **Architecture :** Code mort supprimé
- [x] **Architecture :** Dossier supabase en double supprimé
- [x] **Architecture :** Script Supabase en double retiré de login.html
- [x] **UX :** Message d'erreur si chargement des données échoue
- [x] **UX :** Modale de confirmation custom disponible (Modal.confirmAsync)
- [x] **UX :** Cache marketing invalidé sur les changements Realtime

## Licence

Propriétaire — Tous droits réservés.