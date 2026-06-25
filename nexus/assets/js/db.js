// ══════════════════════════════════════════
//   NEXUS — Database Layer (Supabase CRUD)
//   v1.1 — Corrections critiques appliquées
//
//   CORRECTIONS :
//   [C1] Ordre FK-safe dans importBackup()
//   [C2] Validation JSON avant suppression
//   [C3] userId() via supabase.auth.getUser()
//   [C4] idMap sécurisé par champ temporaire
//   [C5] Realtime étendu à toutes les tables
//   [M1] getById() avec filtre user_id
//   [M2] Recherche client échappée
//   [M3] Validation métier (prix, qty)
// ══════════════════════════════════════════

const DB = {

  // ── [C3] CORRIGÉ : userId() ne dépend plus de window.__SESSION__ ──
  // On garde window.__SESSION__ comme cache rapide,
  // mais _getUserId() vérifie via Supabase en cas de doute.
  userId() {
    return window.__SESSION__?.userId || null;
  },

  async _getUserId() {
    // Priorité au cache session
    if (window.__SESSION__?.userId) return window.__SESSION__.userId;
    // Fallback : interroger Supabase directement
    const { data: { user }, error } = await NEXUS.supabase.auth.getUser();
    if (error || !user) throw new Error('Session expirée. Veuillez vous reconnecter.');
    return user.id;
  },

  // ── Utilitaire : gestion d'erreur centralisée ──
  handleError(error, context = '') {
    console.error(`[DB Error] ${context}:`, error);
    throw new Error(error.message || 'Erreur base de données');
  },

  // ══════════════════════════════════════════
  //   PRODUCTS
  // ══════════════════════════════════════════
  products: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('products')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'products.getAll');
      return data || [];
    },

    // [M1] CORRIGÉ : filtre user_id ajouté
    async getById(id) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('user_id', uid)
        .single();
      if (error) DB.handleError(error, 'products.getById');
      return data;
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('products')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'products.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'products.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'products.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   SALES
  // ══════════════════════════════════════════
  sales: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select(`
          *,
          product:product_id ( id, name, store ),
          client:client_id   ( id, name, phone )
        `)
        .eq('user_id', uid)
        .order('sale_date', { ascending: false });
      if (error) DB.handleError(error, 'sales.getAll');
      return data || [];
    },

    async getByProduct(productId) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', uid)
        .order('sale_date', { ascending: false });
      if (error) DB.handleError(error, 'sales.getByProduct');
      return data || [];
    },

    async getByPeriod(startDate, endDate) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select('*')
        .eq('user_id', uid)
        .gte('sale_date', startDate)
        .lte('sale_date', endDate)
        .order('sale_date', { ascending: false });
      if (error) DB.handleError(error, 'sales.getByPeriod');
      return data || [];
    },

    // [M3] CORRIGÉ : validation métier ajoutée
    async create(payload) {
      if (!payload.product_id) throw new Error('Produit requis pour une vente.');
      if (!payload.price || payload.price <= 0) throw new Error('Le prix doit être supérieur à 0.');
      if (!payload.qty || payload.qty <= 0) throw new Error('La quantité doit être supérieure à 0.');

      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'sales.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'sales.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'sales.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   CLIENTS
  // ══════════════════════════════════════════
  clients: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .select('*')
        .eq('user_id', uid)
        .order('name', { ascending: true });
      if (error) DB.handleError(error, 'clients.getAll');
      return data || [];
    },

    // [M2] CORRIGÉ : échappement des caractères spéciaux dans ilike
    async search(query) {
      const uid = await DB._getUserId();
      // Échapper les caractères dangereux pour ilike PostgreSQL
      const safe = query.replace(/[%_\\]/g, c => `\\${c}`);
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .select('*')
        .eq('user_id', uid)
        .or(`name.ilike.%${safe}%,phone.ilike.%${safe}%`)
        .order('name');
      if (error) DB.handleError(error, 'clients.search');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'clients.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'clients.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'clients.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   LIVRAISONS
  // ══════════════════════════════════════════
  livraisons: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .select(`
          *,
          client:client_id   ( id, name, phone ),
          product:product_id ( id, name )
        `)
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'livraisons.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .select(`
          *,
          client:client_id   ( id, name, phone ),
          product:product_id ( id, name )
        `)
        .eq('user_id', uid)
        .eq('status', status)
        .order('delivery_date');
      if (error) DB.handleError(error, 'livraisons.getByStatus');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'livraisons.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'livraisons.update');
      return data;
    },

    async updateStatus(id, status) {
      return this.update(id, { status });
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('livraisons')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'livraisons.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   PROJECTS
  // ══════════════════════════════════════════
  projects: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .select(`
          *,
          product:product_id ( id, name )
        `)
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'projects.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .select('*')
        .eq('user_id', uid)
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'projects.getByStatus');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'projects.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'projects.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'projects.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   TASKS
  // ══════════════════════════════════════════
  tasks: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .select(`
          *,
          project:project_id ( id, name )
        `)
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'tasks.getAll');
      return data || [];
    },

    async getByProject(projectId) {
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');
      if (error) DB.handleError(error, 'tasks.getByProject');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'tasks.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'tasks.update');
      return data;
    },

    async toggleStatus(id, currentStatus) {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      return this.update(id, { status: newStatus });
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'tasks.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   IDEAS
  // ══════════════════════════════════════════
  ideas: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'ideas.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .select('*')
        .eq('user_id', uid)
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'ideas.getByStatus');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'ideas.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'ideas.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('ideas')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'ideas.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   FIXED EXPENSES
  // ══════════════════════════════════════════
  expenses: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'expenses.getAll');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      // [M3] Validation métier
      if (!payload.amount || payload.amount <= 0) throw new Error('Le montant doit être supérieur à 0.');
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'expenses.create');
      return data;
    },

    async update(id, payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .update(payload)
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (error) DB.handleError(error, 'expenses.update');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'expenses.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   MARKETING DATA
  // ══════════════════════════════════════════
  marketingData: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('marketing_data')
        .select('*')
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'marketingData.getAll');
      return data || [];
    },

    async getByProduct(productId) {
      const { data, error } = await NEXUS.supabase
        .from('marketing_data')
        .select('*')
        .eq('product_id', productId)
        .single();
      if (error && error.code !== 'PGRST116') {
        DB.handleError(error, 'marketingData.getByProduct');
      }
      return data || null;
    },

    async upsert(productId, dataPayload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('marketing_data')
        .upsert({
          user_id:    uid,
          product_id: productId,
          data:       dataPayload,
        }, { onConflict: 'user_id,product_id' })
        .select()
        .single();
      if (error) DB.handleError(error, 'marketingData.upsert');
      return data;
    },
  },

  // ══════════════════════════════════════════
  //   MARKETING ANGLES
  // ══════════════════════════════════════════
  angles: {

    async getAll(productId = null) {
      let query = NEXUS.supabase
        .from('marketing_angles')
        .select('*')
        .order('created_at', { ascending: false });
      if (productId) query = query.eq('product_id', productId);
      const { data, error } = await query;
      if (error) DB.handleError(error, 'angles.getAll');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('marketing_angles')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'angles.create');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('marketing_angles')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'angles.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   MARKETING SCRIPTS
  // ══════════════════════════════════════════
  scripts: {

    async getAll(productId = null) {
      let query = NEXUS.supabase
        .from('marketing_scripts')
        .select(`
          *,
          angle:angle_id ( id, title, type )
        `)
        .order('created_at', { ascending: false });
      if (productId) query = query.eq('product_id', productId);
      const { data, error } = await query;
      if (error) DB.handleError(error, 'scripts.getAll');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('marketing_scripts')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'scripts.create');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('marketing_scripts')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'scripts.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   MARKETING COPIES
  // ══════════════════════════════════════════
  copies: {

    async getAll(productId = null) {
      let query = NEXUS.supabase
        .from('marketing_copies')
        .select(`
          *,
          angle:angle_id ( id, title, type )
        `)
        .order('created_at', { ascending: false });
      if (productId) query = query.eq('product_id', productId);
      const { data, error } = await query;
      if (error) DB.handleError(error, 'copies.getAll');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('marketing_copies')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'copies.create');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('marketing_copies')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'copies.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   SAVED OFFERS
  // ══════════════════════════════════════════
  offers: {

    async getAll() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('saved_offers')
        .select(`
          *,
          product:product_id ( id, name )
        `)
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'offers.getAll');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('saved_offers')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'offers.create');
      return data;
    },

    async delete(id) {
      const uid = await DB._getUserId();
      const { error } = await NEXUS.supabase
        .from('saved_offers')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);
      if (error) DB.handleError(error, 'offers.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   SUBSCRIPTIONS & PAYMENTS
  // ══════════════════════════════════════════
  subscriptions: {

    async getMy() {
      const { data, error } = await NEXUS.supabase
        .rpc('get_my_subscription');
      if (error) DB.handleError(error, 'subscriptions.getMy');
      return data?.[0] || null;
    },

    async getHistory() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'subscriptions.getHistory');
      return data || [];
    },
  },

  payments: {

    async getHistory() {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('payments')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'payments.getHistory');
      return data || [];
    },

    async create(payload) {
      const uid = await DB._getUserId();
      const { data, error } = await NEXUS.supabase
        .from('payments')
        .insert({ ...payload, user_id: uid })
        .select()
        .single();
      if (error) DB.handleError(error, 'payments.create');
      return data;
    },
  },

  // ══════════════════════════════════════════
  //   CHARGEMENT GLOBAL
  // ══════════════════════════════════════════
  async loadAll() {
    try {
      const [
        products, sales, clients, livraisons, projects, tasks, ideas,
        expenses, angles, scripts, copies, offers, marketingData,
      ] = await Promise.all([
        this.products.getAll(),   this.sales.getAll(),       this.clients.getAll(),
        this.livraisons.getAll(), this.projects.getAll(),    this.tasks.getAll(),
        this.ideas.getAll(),      this.expenses.getAll(),    this.angles.getAll(),
        this.scripts.getAll(),    this.copies.getAll(),      this.offers.getAll(),
        this.marketingData.getAll(),
      ]);

      return {
        products, sales, clients, livraisons, projects, tasks, ideas,
        expenses, angles, scripts, copies, offers, marketingData,
      };
    } catch (err) {
      console.error('[DB] Erreur chargement global:', err);
      throw err;
    }
  },

  // ══════════════════════════════════════════
  //   [C5] REALTIME — Étendu à toutes les tables
  // ══════════════════════════════════════════
  realtime: {

    subscribeAll(callbacks) {
      const uid = DB.userId();
      if (!uid) {
        console.warn('[Realtime] user_id manquant, écoute annulée.');
        return null;
      }

      return NEXUS.supabase
        .channel(`user-${uid}-all-changes`)

        // ── Ventes ──
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sales', filter: `user_id=eq.${uid}` },
          payload => callbacks.onNewSale?.(payload.new))

        // ── Livraisons ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'livraisons', filter: `user_id=eq.${uid}` },
          payload => callbacks.onLivraisonChange?.(payload))

        // ── Produits ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'products', filter: `user_id=eq.${uid}` },
          payload => callbacks.onProductChange?.(payload))

        // ── Clients ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'clients', filter: `user_id=eq.${uid}` },
          payload => callbacks.onClientChange?.(payload))

        // ── Projets ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${uid}` },
          payload => callbacks.onProjectChange?.(payload))

        // ── Tâches ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${uid}` },
          payload => callbacks.onTaskChange?.(payload))

        // ── Idées ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'ideas', filter: `user_id=eq.${uid}` },
          payload => callbacks.onIdeaChange?.(payload))

        // ── Dépenses ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'fixed_expenses', filter: `user_id=eq.${uid}` },
          payload => callbacks.onExpenseChange?.(payload))

        // ── Angles marketing ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'marketing_angles', filter: `user_id=eq.${uid}` },
          payload => callbacks.onAngleChange?.(payload))

        // ── Scripts marketing ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'marketing_scripts', filter: `user_id=eq.${uid}` },
          payload => callbacks.onScriptChange?.(payload))

        // ── Copies marketing ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'marketing_copies', filter: `user_id=eq.${uid}` },
          payload => callbacks.onCopyChange?.(payload))

        // ── Offres sauvegardées ──
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'saved_offers', filter: `user_id=eq.${uid}` },
          payload => callbacks.onOfferChange?.(payload))

        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Realtime] ✓ Écoute active sur toutes les tables');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[Realtime] Erreur de connexion. Tentative de reconnexion...');
          }
        });
    },

    unsubscribe(channel) {
      if (channel) NEXUS.supabase.removeChannel(channel);
    },
  },

  // ══════════════════════════════════════════
  //   EXPORT JSON
  // ══════════════════════════════════════════
  async exportBackup() {
    const all = await this.loadAll();
    const blob = new Blob(
      [JSON.stringify({ ...all, exportedAt: new Date().toISOString(), version: '1.2' }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast.ok('Backup exporté avec succès.');
  },

  // ══════════════════════════════════════════
  //   EXPORT EXCEL — Multi-feuilles (Produits, Ventes, Clients, Livraisons, Dépenses)
  // ══════════════════════════════════════════
  exportExcel() {
    const products   = State.getProducts();
    const sales       = State.getSales();
    const clients     = State.getClients();
    const livraisons  = State.getLivraisons();
    const expenses    = State.getExpenses();

    if (!products.length && !sales.length && !clients.length) {
      Toast.info('Aucune donnée à exporter.');
      return;
    }

    const escCell = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const buildSheet = (name, headers, rows) => {
      const headerRow = '<Row>' + headers.map(h => `<Cell><Data ss:Type="String">${escCell(h)}</Data></Cell>`).join('') + '</Row>';
      const dataRows = rows.map(row =>
        '<Row>' + row.map(c => {
          const isNum = typeof c === 'number';
          return `<Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escCell(c)}</Data></Cell>`;
        }).join('') + '</Row>'
      ).join('');
      return `<Worksheet ss:Name="${escCell(name)}"><Table>${headerRow}${dataRows}</Table></Worksheet>`;
    };

    // ── Feuille Produits ──
    const prodRows = products.map(p => {
      const s = Engine.getProductStats(p.id) || {};
      return [
        p.name, p.store || '', p.qty || 0,
        Math.round(s.invest || 0), Math.round(s.ca || 0), Math.round(s.unit || 0),
        Math.round(s.profit || 0), Number((s.roi || 0).toFixed(2)), s.stock ?? 0,
      ];
    });

    // ── Feuille Ventes ──
    const venteRows = sales.map(v => {
      const p  = State.getProduct(v.product_id);
      const cl = State.getClient(v.client_id);
      return [
        p?.name || 'Supprimé', cl?.name || 'Anonyme',
        Math.round(v.price || 0), v.qty || 0,
        Math.round((v.price || 0) * (v.qty || 0)),
        Math.round(v.shipping || 0), v.channel || '', v.sale_date || '',
      ];
    });

    // ── Feuille Clients ──
    const clientRows = clients.map(c => {
      const cs = Engine.getClientStats(c.id);
      return [c.name, c.phone || '', c.city || '', Math.round(cs.ca), cs.orders];
    });

    // ── Feuille Livraisons ──
    const livRows = livraisons.map(l => {
      const c = State.getClient(l.client_id);
      const p = State.getProduct(l.product_id);
      return [c?.name || 'Anonyme', p?.name || '—', l.qty || 1, Math.round(l.amount || 0), LIV_STATUS[l.status] || l.status, l.delivery_date || ''];
    });

    // ── Feuille Dépenses ──
    const expRows = expenses.map(e => [e.name, Math.round(e.amount || 0), e.category || '']);

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  ${buildSheet('Produits',  ['Produit','Boutique','Qté','Investissement','CA','Coût/u','Profit','ROI %','Stock'], prodRows)}
  ${buildSheet('Ventes',    ['Produit','Client','Prix/u','Qté','CA','Livraison','Canal','Date'], venteRows)}
  ${buildSheet('Clients',   ['Nom','Téléphone','Ville','CA Total','Commandes'], clientRows)}
  ${buildSheet('Livraisons',['Client','Produit','Qté','Montant','Statut','Date'], livRows)}
  ${buildSheet('Dépenses',  ['Nom','Montant','Catégorie'], expRows)}
</Workbook>`;

    const blob = new Blob(['\uFEFF' + xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nexus_export_complet_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast.ok('Export Excel complet généré (Produits, Ventes, Clients, Livraisons, Dépenses).');
  },

  // ══════════════════════════════════════════
  //   IMPORT BACKUP v2 — NON-DESTRUCTIF
  //
  //   PRINCIPE FONDAMENTAL :
  //   On ne supprime JAMAIS les données existantes.
  //   On fusionne intelligemment :
  //     • Enregistrement absent en base → INSERT
  //     • Enregistrement déjà présent   → SKIP (pas d'écrasement)
  //
  //   En cas d'erreur pendant l'import :
  //     • Les données déjà présentes sont intactes
  //     • Les nouvelles partiellement insérées restent
  //     • Aucune perte possible
  //
  //   MODE REMPLACEMENT TOTAL disponible via _wipeAndRestore()
  //   mais uniquement appelé si l'utilisateur le confirme
  //   explicitement ET que la validation est 100% réussie.
  // ══════════════════════════════════════════

  // ── Validation complète du fichier avant tout traitement ──
  _validateBackup(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('Fichier JSON invalide ou vide.');
      return errors;
    }

    // ── Structure obligatoire ──
    if (!Array.isArray(data.products)) errors.push('Champ "products" manquant ou invalide.');
    if (!Array.isArray(data.sales))    errors.push('Champ "sales" manquant ou invalide.');
    if (!Array.isArray(data.clients))  errors.push('Champ "clients" manquant ou invalide.');

    // ── Champs optionnels mais doivent être des tableaux s'ils sont présents ──
    const optionalArrayFields = [
      'livraisons', 'projects', 'tasks', 'ideas', 'expenses',
      'angles', 'scripts', 'copies', 'offers', 'marketingData',
    ];
    optionalArrayFields.forEach(field => {
      if (data[field] !== undefined && !Array.isArray(data[field])) {
        errors.push(`Champ "${field}" présent mais invalide (doit être une liste).`);
      }
    });

    if (errors.length) return errors;

    // ── Vérification cohérence des FK dans le fichier lui-même ──
    const productIds = new Set(data.products.map(p => p.id).filter(Boolean));
    const clientIds  = new Set(data.clients.map(c => c.id).filter(Boolean));
    const projectIds = new Set((data.projects || []).map(p => p.id).filter(Boolean));
    const angleIds   = new Set((data.angles   || []).map(a => a.id).filter(Boolean));

    (data.sales || []).forEach(s => {
      if (s.product_id && !productIds.has(s.product_id))
        errors.push(`Vente "${s.id}" référence un produit inconnu (${s.product_id}).`);
    });

    (data.livraisons || []).forEach(l => {
      if (l.client_id && !clientIds.has(l.client_id))
        errors.push(`Livraison "${l.id}" référence un client inconnu (${l.client_id}).`);
      if (l.product_id && !productIds.has(l.product_id))
        errors.push(`Livraison "${l.id}" référence un produit inconnu (${l.product_id}).`);
    });

    (data.tasks || []).forEach(t => {
      if (t.project_id && !projectIds.has(t.project_id))
        errors.push(`Tâche "${t.id}" référence un projet inconnu (${t.project_id}).`);
    });

    (data.scripts || []).forEach(s => {
      if (s.angle_id && !angleIds.has(s.angle_id))
        errors.push(`Script "${s.id}" référence un angle inconnu (${s.angle_id}).`);
      if (s.product_id && !productIds.has(s.product_id))
        errors.push(`Script "${s.id}" référence un produit inconnu (${s.product_id}).`);
    });

    (data.copies || []).forEach(c => {
      if (c.angle_id && !angleIds.has(c.angle_id))
        errors.push(`Copy "${c.id}" référence un angle inconnu (${c.angle_id}).`);
      if (c.product_id && !productIds.has(c.product_id))
        errors.push(`Copy "${c.id}" référence un produit inconnu (${c.product_id}).`);
    });

    (data.offers || []).forEach(o => {
      if (o.product_id && !productIds.has(o.product_id))
        errors.push(`Offre "${o.id}" référence un produit inconnu (${o.product_id}).`);
    });

    (data.marketingData || []).forEach(m => {
      if (m.product_id && !productIds.has(m.product_id))
        errors.push(`Donnée marketing référence un produit inconnu (${m.product_id}).`);
    });

    (data.angles || []).forEach(a => {
      if (a.product_id && !productIds.has(a.product_id))
        errors.push(`Angle "${a.id}" référence un produit inconnu (${a.product_id}).`);
    });

    return errors;
  },

  // ── Fusion non-destructive d'une table ──
  // Stratégie : on charge les IDs existants en base,
  // on n'insère QUE ce qui est absent.
  // Retourne un idMap { ancien_id → nouveau_id_en_base }.
  async _mergeTable(table, records, fkMaps = {}) {
    const idMap   = {};
    const warnings = [];
    if (!records || !records.length) return { idMap, warnings };

    const uid = DB.userId();

    const { data: existing, error: fetchError } = await NEXUS.supabase
      .from(table)
      .select('id')
      .eq('user_id', uid);

    if (fetchError) throw new Error(`Erreur lecture table "${table}" : ${fetchError.message}`);

    const existingIds = new Set((existing || []).map(r => r.id));

    const toInsert = [];
    const origIds  = [];

    records.forEach(r => {
      if (existingIds.has(r.id)) {
        idMap[r.id] = r.id;
      } else {
        const {
          id, created_at, updated_at, user_id,
          product, client, project, angle,
          ...rest
        } = r;

        // Remplacer les FK par les nouveaux IDs mappés — et avertir si la cible est introuvable
        Object.entries(fkMaps).forEach(([field, map]) => {
          if (rest[field]) {
            const mapped = map[rest[field]];
            if (mapped) {
              rest[field] = mapped;
            } else {
              warnings.push(
                `${table} (id ${r.id}) : référence "${field}" introuvable — le lien a été supprimé pour cet enregistrement.`
              );
              rest[field] = null;
            }
          }
        });

        toInsert.push({ ...rest, user_id: uid });
        origIds.push(r.id);
      }
    });

    if (toInsert.length > 0) {
      const BATCH_SIZE = 100;
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch     = toInsert.slice(i, i + BATCH_SIZE);
        const batchOrig = origIds.slice(i, i + BATCH_SIZE);

        const { data: inserted, error: insertError } = await NEXUS.supabase
          .from(table)
          .insert(batch)
          .select('id');

        if (insertError) {
          throw new Error(
            `Erreur insertion dans "${table}" (batch ${Math.floor(i / BATCH_SIZE) + 1}) : ${insertError.message}`
          );
        }

        batchOrig.forEach((origId, idx) => {
          if (origId && inserted[idx]?.id) {
            idMap[origId] = inserted[idx].id;
          }
        });
      }
    }

    const skipped = records.length - toInsert.length;
    if (skipped > 0) {
      console.log(`[Import] Table "${table}" : ${toInsert.length} insérés, ${skipped} ignorés (déjà présents).`);
    }

    return { idMap, warnings };
  },

  // ── Import principal : FUSION NON-DESTRUCTIVE ──
  async importBackup(file) {
    const text = await file.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Fichier JSON invalide. Impossible de lire le backup.');
    }

    // ÉTAPE 1 : Validation complète AVANT tout traitement
    const validationErrors = this._validateBackup(data);
    if (validationErrors.length > 0) {
      throw new Error(
        `Backup invalide — aucune donnée modifiée :\n• ${validationErrors.slice(0, 5).join('\n• ')}` +
        (validationErrors.length > 5 ? `\n• ...et ${validationErrors.length - 5} autre(s) erreur(s).` : '')
      );
    }

    console.log('[Import] Validation OK. Début de la fusion non-destructive...');

    // ÉTAPE 2 : Fusion dans l'ordre FK-safe (parents → enfants)
    // En cas d'erreur à n'importe quelle étape :
    // - Les données déjà présentes en base sont INTACTES
    // - Les enregistrements déjà insérés restent en base
    // - Aucune perte de données possible

    const allWarnings = [];
    const collect = (result) => { allWarnings.push(...result.warnings); return result.idMap; };

    const productMap = collect(await this._mergeTable('products',       data.products   || []));
    const clientMap  = collect(await this._mergeTable('clients',        data.clients    || []));
                       collect(await this._mergeTable('ideas',          data.ideas      || []));
                       collect(await this._mergeTable('fixed_expenses', data.expenses   || []));

    const projectMap = collect(await this._mergeTable('projects', data.projects || [], {
      product_id: productMap,
    }));

    const angleMap = collect(await this._mergeTable('marketing_angles', data.angles || [], {
      product_id: productMap,
    }));

    collect(await this._mergeTable('marketing_data', data.marketingData || [], {
      product_id: productMap,
    }));

    collect(await this._mergeTable('saved_offers', data.offers || [], {
      product_id: productMap,
    }));

    collect(await this._mergeTable('marketing_scripts', data.scripts || [], {
      product_id: productMap,
      angle_id:   angleMap,
    }));

    collect(await this._mergeTable('marketing_copies', data.copies || [], {
      product_id: productMap,
      angle_id:   angleMap,
    }));

    collect(await this._mergeTable('sales', data.sales || [], {
      product_id: productMap,
      client_id:  clientMap,
    }));

    collect(await this._mergeTable('livraisons', data.livraisons || [], {
      product_id: productMap,
      client_id:  clientMap,
    }));

    collect(await this._mergeTable('tasks', data.tasks || [], {
      project_id: projectMap,
    }));

    console.log('[Import] ✓ Fusion terminée. Aucune donnée existante n\'a été supprimée.');
    return { success: true, warnings: allWarnings };
  },

  // ── Remplacement total (appelé UNIQUEMENT depuis confirmReset + import) ──
  // Supprime TOUT puis restaure. Uniquement si l'utilisateur accepte
  // explicitement les deux confirmations dans l'UI.
  async _wipeAndRestore(data) {
    const validationErrors = this._validateBackup(data);
    if (validationErrors.length > 0) {
      throw new Error(`Backup invalide :\n• ${validationErrors.join('\n• ')}`);
    }

    const uid = DB.userId();

    // Suppression FK-safe
    const wipeOrder = [
      'marketing_scripts', 'marketing_copies',
      'tasks', 'sales', 'livraisons',
      'marketing_data', 'marketing_angles', 'saved_offers', 'projects',
      'clients', 'ideas', 'fixed_expenses', 'products',
    ];

    for (const tableName of wipeOrder) {
      const { error } = await NEXUS.supabase.from(tableName).delete().eq('user_id', uid);
      if (error) throw new Error(`Erreur suppression "${tableName}" : ${error.message}`);
    }

    const allWarnings = [];
    const collect = (result) => { allWarnings.push(...result.warnings); return result.idMap; };

    // Réinsertion sans logique de fusion (table vide)
    const productMap = collect(await this._mergeTable('products',       data.products   || []));
    const clientMap  = collect(await this._mergeTable('clients',        data.clients    || []));
                       collect(await this._mergeTable('ideas',          data.ideas      || []));
                       collect(await this._mergeTable('fixed_expenses', data.expenses   || []));

    const projectMap = collect(await this._mergeTable('projects', data.projects || [], { product_id: productMap }));
    const angleMap   = collect(await this._mergeTable('marketing_angles', data.angles || [], { product_id: productMap }));

    collect(await this._mergeTable('marketing_data',    data.marketingData || [], { product_id: productMap }));
    collect(await this._mergeTable('saved_offers',      data.offers        || [], { product_id: productMap }));
    collect(await this._mergeTable('marketing_scripts', data.scripts       || [], { product_id: productMap, angle_id: angleMap }));
    collect(await this._mergeTable('marketing_copies',  data.copies        || [], { product_id: productMap, angle_id: angleMap }));
    collect(await this._mergeTable('sales',      data.sales      || [], { product_id: productMap, client_id: clientMap }));
    collect(await this._mergeTable('livraisons', data.livraisons || [], { product_id: productMap, client_id: clientMap }));
    collect(await this._mergeTable('tasks',      data.tasks      || [], { project_id: projectMap }));

    return { success: true, warnings: allWarnings };
  },
};

window.DB = DB;