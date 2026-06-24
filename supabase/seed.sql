-- ══════════════════════════════════════════
-- NEXUS — Seed Database
-- Tables de base pour l'application
-- ══════════════════════════════════════════

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Abonnements ──
CREATE TABLE IF NOT EXISTS subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan              TEXT NOT NULL DEFAULT 'trial',
  status            TEXT NOT NULL DEFAULT 'active',
  price_fcfa        INTEGER NOT NULL DEFAULT 0,
  trial_ends_at     TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end   TIMESTAMPTZ,
  paytech_ref       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Paiements ──
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id   UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  paytech_token     TEXT,
  paytech_ref       TEXT,
  amount_fcfa       INTEGER NOT NULL,
  plan              TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending',
  payment_method    TEXT DEFAULT 'unknown',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Produits (Achats) ──
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  store             TEXT DEFAULT '',
  qty               INTEGER DEFAULT 0,
  stock             INTEGER DEFAULT 0,
  fret_type         TEXT DEFAULT 'Aérien',
  fret              INTEGER DEFAULT 0,
  customs           INTEGER DEFAULT 0,
  packaging         INTEGER DEFAULT 0,
  fb                INTEGER DEFAULT 0,
  tiktok            INTEGER DEFAULT 0,
  ads               INTEGER DEFAULT 0,
  misc              INTEGER DEFAULT 0,
  delivery          INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Ventes ──
CREATE TABLE IF NOT EXISTS sales (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  client_id         UUID REFERENCES clients(id) ON DELETE SET NULL,
  price             INTEGER NOT NULL,
  qty               INTEGER NOT NULL DEFAULT 1,
  shipping          INTEGER DEFAULT 0,
  channel           TEXT DEFAULT 'WhatsApp',
  sale_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  note              TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Clients ──
CREATE TABLE IF NOT EXISTS clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  phone             TEXT DEFAULT '',
  city              TEXT DEFAULT '',
  address           TEXT DEFAULT '',
  notes             TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Livraisons ──
CREATE TABLE IF NOT EXISTS livraisons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id         UUID REFERENCES clients(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  qty               INTEGER DEFAULT 1,
  amount            INTEGER DEFAULT 0,
  status            TEXT DEFAULT 'pending',
  delivery_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  address           TEXT DEFAULT '',
  notes             TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Projets ──
CREATE TABLE IF NOT EXISTS projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT DEFAULT '',
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  target_qty        INTEGER DEFAULT 0,
  status            TEXT DEFAULT 'prep',
  start_date        DATE,
  end_date          DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Tâches ──
CREATE TABLE IF NOT EXISTS tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT DEFAULT '',
  project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  priority          TEXT DEFAULT 'moyenne',
  status            TEXT DEFAULT 'todo',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Idées Produits ──
CREATE TABLE IF NOT EXISTS ideas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  notes             TEXT DEFAULT '',
  category          TEXT DEFAULT '',
  status            TEXT DEFAULT 'idea',
  ref_url           TEXT DEFAULT '',
  cost              INTEGER DEFAULT 0,
  price             INTEGER DEFAULT 0,
  scores            JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Dépenses fixes ──
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  amount            INTEGER NOT NULL,
  category          TEXT DEFAULT 'Autre',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Marketing Data (positionnement, offre) ──
CREATE TABLE IF NOT EXISTS marketing_data (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  data              JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ── Marketing Angles ──
CREATE TABLE IF NOT EXISTS marketing_angles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  type              TEXT NOT NULL DEFAULT 'Autre',
  title             TEXT NOT NULL,
  description       TEXT DEFAULT '',
  hook              TEXT DEFAULT '',
  channel           TEXT DEFAULT 'Tous',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Marketing Scripts ──
CREATE TABLE IF NOT EXISTS marketing_scripts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  angle_id          UUID REFERENCES marketing_angles(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  duration          TEXT DEFAULT '30s',
  hook              TEXT DEFAULT '',
  problem           TEXT DEFAULT '',
  agitation         TEXT DEFAULT '',
  solution          TEXT DEFAULT '',
  proof             TEXT DEFAULT '',
  cta               TEXT DEFAULT '',
  notes             TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Marketing Copies ──
CREATE TABLE IF NOT EXISTS marketing_copies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE,
  angle_id          UUID REFERENCES marketing_angles(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  format            TEXT DEFAULT 'Post Facebook',
  attention         TEXT DEFAULT '',
  interest          TEXT DEFAULT '',
  desire            TEXT DEFAULT '',
  proof             TEXT DEFAULT '',
  action            TEXT DEFAULT '',
  extras            TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Offres sauvegardées ──
CREATE TABLE IF NOT EXISTS saved_offers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  price_text        TEXT DEFAULT '',
  hook              TEXT DEFAULT '',
  description       TEXT DEFAULT '',
  cta               TEXT DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes pour performances ──
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_livraisons_user ON livraisons(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_user ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON fixed_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- ── RLS : Activer sur toutes les tables ──
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE livraisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_angles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies : user_id = auth.uid() ──
CREATE POLICY user_isolation ON products FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON sales FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON clients FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON livraisons FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON projects FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON tasks FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON ideas FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON fixed_expenses FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON marketing_data FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON marketing_angles FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON marketing_scripts FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON marketing_copies FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON saved_offers FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON subscriptions FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_isolation ON payments FOR ALL USING (user_id = auth.uid());

-- ── Fonction RPC pour récupérer l'abonnement de l'utilisateur courant ──
CREATE OR REPLACE FUNCTION get_my_subscription()
RETURNS SETOF subscriptions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM subscriptions
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;
$$;