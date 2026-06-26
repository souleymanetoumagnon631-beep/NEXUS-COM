# ⚙️ Configuration Supabase & PayTech — NEXUS Vite

## 📋 Étapes de configuration

### 1. Variables d'environnement

Le fichier `.env` est déjà créé avec vos clés Supabase. Vérifiez qu'il contient :

```env
VITE_SUPABASE_URL=https://zewxinjatbyeelqcjntk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Installation des dépendances

```bash
cd nexus-vite
npm install
```

Cela installe :
- `@supabase/supabase-js` : Client Supabase
- `express` : Pour le webhook backend (optionnel)
- `concurrently` : Pour lancer dev + webhook en parallèle
- `vite` : Build tool

### 3. Structure Supabase créée

```
nexus-vite/
├── src/lib/
│   ├── supabase.js          ← Client Supabase centralisé (ES module)
│   └── paytech.js           ← Service PayTech (initiation paiement)
├── supabase/
│   └── functions/
│       └── paytech-webhook/ ← Edge Function pour webhooks PayTech
│           ├── index.ts
│           └── deno.json
└── api/
    └── webhook.js           ← Backend Node.js alternatif
```

### 4. Configuration Supabase (Dashboard)

#### a. Créer la table `subscriptions`

Dans Supabase Dashboard → SQL Editor, exécutez :

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_transaction_id ON subscriptions(transaction_id);

-- RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users peuvent voir leur propre abonnement
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role peut tout faire (pour webhook)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');
```

#### b. Déployer l'Edge Function

```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
cd nexus-vite
supabase link --project-id zewxinjatbyeelqcjntk

# Déployer la fonction
supabase functions deploy paytech-webhook --project-id zewxinjatbyeelqcjntk
```

#### c. Configurer les secrets Supabase

```bash
# Définir les secrets pour l'Edge Function
supabase secrets set PAYTECH_API_TOKEN=votre_token_paytech --project-id zewxinjatbyeelqcjntk
supabase secrets set PAYTECH_SECRET_KEY=votre_secret_paytech --project-id zewxinjatbyeelqcjntk
```

### 5. Configuration PayTech

#### a. Récupérer vos clés PayTech

1. Connectez-vous à votre compte PayTech
2. Allez dans **Paramètres → API**
3. Copiez :
   - `API Token` (public)
   - `Secret Key` (privé)

#### b. Configurer le webhook PayTech

Dans PayTech Dashboard → Webhooks :

```
URL du webhook: https://zewxinjatbyeelqcjntk.supabase.co/functions/v1/paytech-webhook
Méthode: POST
Headers:
  - Authorization: Bearer VOTRE_SUPABASE_ANON_KEY
```

#### c. Ajouter les clés dans `.env`

```env
# Ajoutez ces lignes à .env
VITE_PAYTECH_API_TOKEN=votre_token_paytech_public
VITE_PAYTECH_SECRET_KEY=votre_secret_paytech_prive
```

### 6. Alternative : Backend Node.js (sans Edge Functions)

Si vous préférez un backend Node.js classique :

```bash
# Installer les dépendances
npm install express cors dotenv

# Copier .env.example vers .env et remplir
cp .env.example .env

# Lancer le serveur
npm run webhook
# → http://localhost:3001/api/webhook/paytech
```

**Déployer sur Vercel/Railway/Render :**
- Importez le dossier `nexus-vite`
- Ajoutez les variables d'environnement dans le dashboard
- Le endpoint sera : `https://votre-app.vercel.app/api/webhook/paytech`

### 7. Tester le build

```bash
# Build de production
npm run build

# Lancer en développement
npm run dev
# → http://localhost:5173

# Lancer dev + webhook en parallèle
npm run dev:all
```

### 8. Vérifications

#### ✅ Frontend (Vite)
- [ ] `npm run build` réussit sans erreur
- [ ] `npm run dev` lance le serveur sur http://localhost:5173
- [ ] Les pages se chargent (index, login, dashboard)
- [ ] Le thème sombre/clair fonctionne

#### ✅ Supabase
- [ ] Table `subscriptions` créée
- [ ] RLS activé
- [ ] Edge Function déployée
- [ ] Secrets configurés

#### ✅ PayTech
- [ ] Clés API récupérées
- [ ] Webhook URL configurée dans PayTech
- [ ] Test de paiement en mode sandbox

## 🔒 Sécurité

### ✅ Bonnes pratiques appliquées

1. **Clés publiques uniquement côté client**
   - `VITE_SUPABASE_ANON_KEY` : clé anonyme Supabase (safe)
   - `VITE_PAYTECH_API_TOKEN` : token public PayTech (safe)

2. **Clés secrètes côté serveur uniquement**
   - `PAYTECH_SECRET_KEY` : stockée dans Supabase Secrets
   - `SUPABASE_SERVICE_ROLE_KEY` : utilisée uniquement par le webhook

3. **Vérification des signatures**
   - Webhook PayTech vérifié via HMAC-SHA256
   - Protection contre les appels frauduleux

### ❌ À ne JAMAIS faire

- ❌ Exposer `PAYTECH_SECRET_KEY` dans le frontend
- ❌ Hardcoder les clés dans le code
- ❌ Utiliser `SUPABASE_SERVICE_ROLE_KEY` côté client
- ❌ Désactiver la vérification de signature du webhook

## 📚 Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Vite App    │─────▶│   Supabase  │
│  (Client)   │◀─────│  (Frontend)  │◀─────│   (Backend) │
└─────────────┘      └──────────────┘      └─────────────┘
                          │                      │
                          │ 1. InitPayment()     │
                          │─────────────────────▶│
                          │                      │ 2. Create sub
                          │◀─────────────────────│
                          │                      │
                          │         ┌────────────┴──────────┐
                          │         │  PayTech Webhook        │
                          │         │  (Edge Function)        │
                          │         └────────────┬──────────┘
                          │                        │
                          │ 3. payment.success      │
                          │◀───────────────────────│
                          │                        │
                          │ 4. Update subscription  │
                          │───────────────────────▶│
```

## 🚀 Commandes rapides

```bash
# Installation
npm install

# Développement
npm run dev              # Frontend uniquement
npm run webhook          # Backend webhook uniquement
npm run dev:all          # Frontend + Backend

# Production
npm run build            # Build Vite
npm run preview          # Preview du build

# Supabase
supabase login
supabase link --project-id zewxinjatbyeelqcjntk
supabase functions deploy paytech-webhook
supabase secrets set PAYTECH_API_TOKEN=xxx
supabase db push         # Push des migrations SQL
```

## 📝 Notes importantes

1. **Le fichier `.env` est ignoré par git** (vérifiez `.gitignore`)
2. **Partagez uniquement `.env.example`** avec votre équipe
3. **Testez d'abord en mode sandbox PayTech** avant la production
4. **Vérifiez les logs Supabase** pour debugger les Edge Functions
5. **Le webhook doit répondre 200 OK** sous 5 secondes (timeout PayTech)

## 🆘 Dépannage

### Erreur : "Variables d'environnement manquantes"
→ Vérifiez que `.env` existe à la racine de `nexus-vite/`

### Erreur : "Invalid webhook signature"
→ Vérifiez que `PAYTECH_SECRET_KEY` est correct dans Supabase Secrets

### Erreur : "Table subscriptions does not exist"
→ Exécutez le SQL de création de table dans Supabase Dashboard

### Build échoue avec "Cannot find module"
→ Exécutez `npm install` pour installer les dépendances

## 📞 Support

- **Supabase** : https://supabase.com/docs
- **PayTech** : https://paytech.sn/documentation
- **Vite** : https://vitejs.dev/guide/