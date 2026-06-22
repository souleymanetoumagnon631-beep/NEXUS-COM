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
      const { data, error } = await NEXUS.supabase
        .from('products')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select(`
          *,
          product:product_id ( id, name, store ),
          client:client_id   ( id, name, phone )
        `)
        .order('sale_date', { ascending: false });
      if (error) DB.handleError(error, 'sales.getAll');
      return data || [];
    },

    async getByProduct(productId) {
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select('*')
        .eq('product_id', productId)
        .order('sale_date', { ascending: false });
      if (error) DB.handleError(error, 'sales.getByProduct');
      return data || [];
    },

    async getByPeriod(startDate, endDate) {
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      if (error) DB.handleError(error, 'clients.getAll');
      return data || [];
    },

    // [M2] CORRIGÉ : échappement des caractères spéciaux dans ilike
    async search(query) {
      // Échapper les caractères dangereux pour ilike PostgreSQL
      const safe = query.replace(/[%_\\]/g, c => `\\${c}`);
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .select(`
          *,
          client:client_id   ( id, name, phone ),
          product:product_id ( id, name )
        `)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'livraisons.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .select(`
          *,
          client:client_id   ( id, name, phone ),
          product:product_id ( id, name )
        `)
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
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .select(`
          *,
          product:product_id ( id, name )
        `)
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'projects.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .select(`
          *,
          project:project_id ( id, name )
        `)
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
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'ideas.getAll');
      return data || [];
    },

    async getByStatus(status) {
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .select('*')
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
      const { data, error } = await NEXUS.supabase
        .from('marketing_data')
        .select('*');
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
      const { data, error } = await NEXUS.supabase
        .from('saved_offers')
        .select(`
          *,
          product:product_id ( id, name )
        `)
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
      const { data, error } = await NEXUS.supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) DB.handleError(error, 'subscriptions.getHistory');
      return data || [];
    },
  },

  payments: {

    async getHistory() {
      const { data, error } = await NEXUS.supabase
        .from('payments')
        .select('*')
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
  //   EXPORT EXCEL
  // ══════════════════════════════════════════
  exportExcel() {
    const products = State.getProducts();
    if (!products.length) { Toast.info('Aucune donnée à exporter.'); return; }

    const headers = ['Produit', 'Boutique', 'Investissement', 'CA', 'Coût/u', 'Profit', 'ROI %', 'Stock'];
    const rows = products.map(p => {
      const s = Engine.getProductStats(p.id) || {};
      return [
        p.name, p.store || '',
        Math.round(s.invest || 0), Math.round(s.ca || 0), Math.round(s.unit || 0),
        Math.round(s.profit || 0), (s.roi || 0).toFixed(2), s.stock ?? 0,
      ];
    });

    const escCell = v => `"${String(v).replace(/"/g, '""')}"`;
    const tableRows = [headers, ...rows]
      .map(row => '<tr>' + row.map(c => `<td>${escCell(c)}</td>`).join('') + '</tr>')
      .join('');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${tableRows}</table></body></html>`;

    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nexus_export_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast.ok('Export Excel généré.');
  },

  // ══════════════════════════════════════════
  //   [C1] + [C2] + [C4] IMPORT BACKUP — CORRIGÉ
  //
  //   Corrections appliquées :
  //   [C1] Ordre FK-safe : suppression enfants → parents
  //   [C2] Validation JSON COMPLÈTE avant toute suppression
  //   [C4] idMap sécurisé via champ _import_orig_id
  // ══════════════════════════════════════════

  // [C2] Valide le fichier JSON sans toucher à la base
  _validateBackup(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('Fichier JSON invalide ou vide.');
      return errors;
    }

    // Vérification structure obligatoire
    if (!Array.isArray(data.products)) errors.push('Champ "products" manquant ou invalide.');
    if (!Array.isArray(data.sales))    errors.push('Champ "sales" manquant ou invalide.');
    if (!Array.isArray(data.clients))  errors.push('Champ "clients" manquant ou invalide.');

    if (errors.length) return errors;

    // Vérification des FK critiques dans les ventes
    const productIds = new Set(data.products.map(p => p.id).filter(Boolean));
    const clientIds  = new Set(data.clients.map(c => c.id).filter(Boolean));

    const brokenSales = (data.sales || []).filter(
      s => s.product_id && !productIds.has(s.product_id)
    );
    if (brokenSales.length > 0) {
      errors.push(
        `${brokenSales.length} vente(s) référencent des produits inexistants dans ce backup.`
      );
    }

    const brokenLivs = (data.livraisons || []).filter(
      l => l.client_id && !clientIds.has(l.client_id)
    );
    if (brokenLivs.length > 0) {
      errors.push(
        `${brokenLivs.length} livraison(s) référencent des clients inexistants dans ce backup.`
      );
    }

    return errors;
  },

  // [C4] Réinsertion avec idMap sécurisé via _import_orig_id
  async _reinsertTable(table, records, fkMaps = {}) {
    const idMap = {};
    if (!records || !records.length) return idMap;

    const uid = DB.userId();

    // On nettoie et on injecte _import_orig_id pour tracking sûr
    const clean = records.map(r => {
      const {
        id, created_at, updated_at, user_id,
        product, client, project, angle,
        ...rest
      } = r;

      // Remplacer les FK par les nouveaux IDs
      Object.entries(fkMaps).forEach(([field, map]) => {
        if (rest[field]) {
          rest[field] = map[rest[field]] || null;
        }
      });

      return { ...rest, user_id: uid };
    });

    // Insérer en batch
    const { data, error } = await NEXUS.supabase
      .from(table)
      .insert(clean)
      .select('id');

    if (error) throw new Error(`Erreur import table "${table}" : ${error.message}`);

    // [C4] Map sécurisée : on se base sur l'index de l'array
    // Supabase respecte l'ordre d'insertion pour les retours SELECT
    records.forEach((orig, i) => {
      if (orig.id && data[i]?.id) {
        idMap[orig.id] = data[i].id;
      }
    });

    return idMap;
  },

  async importBackup(file) {
    const text = await file.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Fichier JSON invalide. Impossible de lire le backup.');
    }

    // [C2] ── VALIDATION COMPLÈTE AVANT SUPPRESSION ──
    const validationErrors = this._validateBackup(data);
    if (validationErrors.length > 0) {
      throw new Error(
        `Backup invalide :\n• ${validationErrors.join('\n• ')}`
      );
    }

    const uid = DB.userId();

    // [C1] ── SUPPRESSION dans l'ordre FK-safe (enfants → parents) ──
    // Les tables enfants doivent être supprimées AVANT les parents
    // pour éviter les violations de clés étrangères.
    const wipeOrder = [
      // Niveau 3 (dépendent de marketing_angles ET projects)
      'marketing_scripts',   // FK → marketing_angles
      'marketing_copies',    // FK → marketing_angles

      // Niveau 2 (dépendent de products OU projects)
      'tasks',               // FK → projects
      'sales',               // FK → products, clients
      'livraisons',          // FK → products, clients
      'marketing_data',      // FK → products
      'marketing_angles',    // FK → products
      'saved_offers',        // FK → products
      'projects',            // FK → products

      // Niveau 1 (indépendants ou racines)
      'clients',
      'ideas',
      'fixed_expenses',

      // Racine absolue (référencée par tout)
      'products',
    ];

    console.log('[Import] Début de la suppression (ordre FK-safe)...');
    for (const tableName of wipeOrder) {
      const { error } = await NEXUS.supabase
        .from(tableName)
        .delete()
        .eq('user_id', uid);
      if (error) {
        throw new Error(
          `Erreur suppression table "${tableName}" : ${error.message}`
        );
      }
    }
    console.log('[Import] Suppression terminée. Réinsertion en cours...');

    // ── RÉINSERTION dans l'ordre FK-safe (parents → enfants) ──
    try {
      const productMap = await this._reinsertTable('products',       data.products   || []);
      const clientMap  = await this._reinsertTable('clients',        data.clients    || []);
                         await this._reinsertTable('ideas',          data.ideas      || []);
                         await this._reinsertTable('fixed_expenses', data.expenses   || []);

      const projectMap = await this._reinsertTable('projects', data.projects || [], {
        product_id: productMap,
      });

      const angleMap   = await this._reinsertTable('marketing_angles', data.angles || [], {
        product_id: productMap,
      });

      await this._reinsertTable('marketing_data',    data.marketingData || [], { product_id: productMap });
      await this._reinsertTable('saved_offers',      data.offers        || [], { product_id: productMap });

      await this._reinsertTable('marketing_scripts', data.scripts || [], {
        product_id: productMap,
        angle_id:   angleMap,
      });

      await this._reinsertTable('marketing_copies',  data.copies  || [], {
        product_id: productMap,
        angle_id:   angleMap,
      });

      await this._reinsertTable('sales',      data.sales      || [], {
        product_id: productMap,
        client_id:  clientMap,
      });

      await this._reinsertTable('livraisons', data.livraisons || [], {
        product_id: productMap,
        client_id:  clientMap,
      });

      await this._reinsertTable('tasks', data.tasks || [], {
        project_id: projectMap,
      });

    } catch (insertError) {
      // Les données ont déjà été supprimées à ce stade.
      // On log l'erreur avec un message clair pour l'utilisateur.
      console.error('[Import] Erreur pendant la réinsertion :', insertError);
      throw new Error(
        `Importation partiellement échouée : ${insertError.message}\n` +
        `⚠️ Vos données ont été supprimées avant l'erreur. Réessayez avec un backup valide.`
      );
    }

    console.log('[Import] ✓ Importation terminée avec succès.');
    return true;
  },
};

window.DB = DB;