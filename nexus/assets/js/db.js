// ══════════════════════════════════════════
//   NEXUS — Database Layer (Supabase CRUD)
//   Toutes les opérations base de données
// ══════════════════════════════════════════

const DB = {

  // ── UTILITAIRE : récupérer le user_id courant ──
  userId() {
    return window.__SESSION__?.userId || null;
  },

  // ── UTILITAIRE : gestion d'erreur centralisée ──
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

    async getById(id) {
      const { data, error } = await NEXUS.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) DB.handleError(error, 'products.getById');
      return data;
    },

    async create(payload) {
      const { data, error } = await NEXUS.supabase
        .from('products')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'products.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'products.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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

    async create(payload) {
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'sales.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('sales')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'sales.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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

    async search(query) {
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('name');
      if (error) DB.handleError(error, 'clients.search');
      return data || [];
    },

    async create(payload) {
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'clients.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'clients.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'livraisons.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('livraisons')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'livraisons.update');
      return data;
    },

    async updateStatus(id, status) {
      return this.update(id, { status });
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('livraisons')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'projects.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'projects.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'tasks.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
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
      const { error } = await NEXUS.supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'ideas.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('ideas')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'ideas.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('ideas')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'expenses.create');
      return data;
    },

    async update(id, payload) {
      const { data, error } = await NEXUS.supabase
        .from('fixed_expenses')
        .update(payload)
        .eq('id', id)
        .eq('user_id', DB.userId())
        .select()
        .single();
      if (error) DB.handleError(error, 'expenses.update');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
      if (error) DB.handleError(error, 'expenses.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   MARKETING DATA (Positionnement/Offre)
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
      const { data, error } = await NEXUS.supabase
        .from('marketing_data')
        .upsert({
          user_id:    DB.userId(),
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
      const { data, error } = await NEXUS.supabase
        .from('marketing_angles')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'angles.create');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('marketing_angles')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('marketing_scripts')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'scripts.create');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('marketing_scripts')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('marketing_copies')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'copies.create');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('marketing_copies')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
      if (error) DB.handleError(error, 'copies.delete');
      return true;
    },
  },

  // ══════════════════════════════════════════
  //   SAVED OFFERS (Relances)
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
      const { data, error } = await NEXUS.supabase
        .from('saved_offers')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'offers.create');
      return data;
    },

    async delete(id) {
      const { error } = await NEXUS.supabase
        .from('saved_offers')
        .delete()
        .eq('id', id)
        .eq('user_id', DB.userId());
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
      const { data, error } = await NEXUS.supabase
        .from('payments')
        .insert({ ...payload, user_id: DB.userId() })
        .select()
        .single();
      if (error) DB.handleError(error, 'payments.create');
      return data;
    },
  },

  // ══════════════════════════════════════════
  //   CHARGEMENT GLOBAL : toutes les données
  //   Appelé une seule fois au démarrage
  // ══════════════════════════════════════════
  async loadAll() {
    try {
      const [
        products, sales, clients, livraisons, projects, tasks, ideas,
        expenses, angles, scripts, copies, offers, marketingData,
      ] = await Promise.all([
        this.products.getAll(), this.sales.getAll(), this.clients.getAll(),
        this.livraisons.getAll(), this.projects.getAll(), this.tasks.getAll(),
        this.ideas.getAll(), this.expenses.getAll(), this.angles.getAll(),
        this.scripts.getAll(), this.copies.getAll(), this.offers.getAll(),
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
  //   REALTIME : écouter les changements live
  // ══════════════════════════════════════════
  realtime: {
  subscribeAll(callbacks) {
    return NEXUS.supabase
      .channel(`user-${DB.userId()}-changes`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sales', filter: `user_id=eq.${DB.userId()}` },
        payload => callbacks.onNewSale?.(payload.new))
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'livraisons', filter: `user_id=eq.${DB.userId()}` },
        payload => callbacks.onLivraisonChange?.(payload))
      .subscribe();
  },
  unsubscribe(channel) {
    if (channel) NEXUS.supabase.removeChannel(channel);
  },
},

// ══════════════════════════════════════════
  //   EXPORT JSON (backup complet)
  // ══════════════════════════════════════════
  async exportBackup() {
    const all = await this.loadAll();
    const blob = new Blob(
      [JSON.stringify({ ...all, exportedAt: new Date().toISOString(), version: '1.1' }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  // ══════════════════════════════════════════
  //   EXPORT EXCEL (synthèse rentabilité)
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
  //   IMPORT JSON — restauration complète
  //   Remplace tout, régénère les UUID, reconstruit les liens
  // ══════════════════════════════════════════
  async _reinsertTable(table, records, fkMaps = {}) {
    const idMap = {};
    if (!records || !records.length) return idMap;

    const clean = records.map(r => {
      const { id, created_at, updated_at, user_id, product, client, project, angle, ...rest } = r;
      Object.entries(fkMaps).forEach(([field, map]) => {
        if (rest[field]) rest[field] = map[rest[field]] || null; // lien cassé → on coupe plutôt que planter
      });
      return { ...rest, user_id: DB.userId() };
    });

    const { data, error } = await NEXUS.supabase.from(table).insert(clean).select('id');
    if (error) throw new Error(`Erreur import "${table}" : ${error.message}`);

    records.forEach((orig, i) => { idMap[orig.id] = data[i].id; });
    return idMap;
  },

  async importBackup(file) {
    const text = await file.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Fichier JSON invalide.'); }

    if (!Array.isArray(data.products) || !Array.isArray(data.sales)) {
      throw new Error('Structure de fichier non reconnue.');
    }

    const uid = DB.userId();
    const wipeTables = [
      'sales', 'livraisons', 'tasks', 'ideas', 'fixed_expenses',
      'marketing_data', 'marketing_angles', 'marketing_scripts',
      'marketing_copies', 'saved_offers', 'projects', 'clients', 'products',
    ];
    for (const t of wipeTables) {
      await NEXUS.supabase.from(t).delete().eq('user_id', uid);
    }

    const productMap = await this._reinsertTable('products', data.products);
    const clientMap  = await this._reinsertTable('clients', data.clients);
    await this._reinsertTable('ideas', data.ideas || []);
    await this._reinsertTable('fixed_expenses', data.expenses || []);

    const angleMap   = await this._reinsertTable('marketing_angles', data.angles || [], { product_id: productMap });
    const projectMap = await this._reinsertTable('projects', data.projects || [], { product_id: productMap });

    await this._reinsertTable('marketing_data', data.marketingData || [], { product_id: productMap });
    await this._reinsertTable('marketing_scripts', data.scripts || [], { product_id: productMap, angle_id: angleMap });
    await this._reinsertTable('marketing_copies', data.copies || [], { product_id: productMap, angle_id: angleMap });
    await this._reinsertTable('saved_offers', data.offers || [], { product_id: productMap });

    await this._reinsertTable('sales', data.sales || [], { product_id: productMap, client_id: clientMap });
    await this._reinsertTable('livraisons', data.livraisons || [], { product_id: productMap, client_id: clientMap });
    await this._reinsertTable('tasks', data.tasks || [], { project_id: projectMap });

    return true;
  },
};

window.DB = DB;