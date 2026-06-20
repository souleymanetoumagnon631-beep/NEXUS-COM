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
        products,
        sales,
        clients,
        livraisons,
        projects,
        tasks,
        ideas,
        expenses,
        angles,
        scripts,
        copies,
        offers,
      ] = await Promise.all([
        this.products.getAll(),
        this.sales.getAll(),
        this.clients.getAll(),
        this.livraisons.getAll(),
        this.projects.getAll(),
        this.tasks.getAll(),
        this.ideas.getAll(),
        this.expenses.getAll(),
        this.angles.getAll(),
        this.scripts.getAll(),
        this.copies.getAll(),
        this.offers.getAll(),
      ]);

      return {
        products,
        sales,
        clients,
        livraisons,
        projects,
        tasks,
        ideas,
        expenses,
        angles,
        scripts,
        copies,
        offers,
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

    // Écouter les nouvelles ventes en temps réel
    onNewSale(callback) {
      return NEXUS.supabase
        .channel('sales-changes')
        .on(
          'postgres_changes',
          {
            event:  'INSERT',
            schema: 'public',
            table:  'sales',
            filter: `user_id=eq.${DB.userId()}`,
          },
          payload => callback(payload.new)
        )
        .subscribe();
    },

    // Écouter les changements de livraisons
    onLivraisonChange(callback) {
      return NEXUS.supabase
        .channel('livraisons-changes')
        .on(
          'postgres_changes',
          {
            event:  '*',
            schema: 'public',
            table:  'livraisons',
            filter: `user_id=eq.${DB.userId()}`,
          },
          payload => callback(payload)
        )
        .subscribe();
    },

    // Se désabonner d'un channel
    unsubscribe(channel) {
      if (channel) NEXUS.supabase.removeChannel(channel);
    },
  },

// ══════════════════════════════════════════
//   EXPORT JSON (backup complet)
// ══════════════════════════════════════════
async exportBackup() {

  const all = await this.loadAll();

  const cleanData = structuredClone(all);

  // Nettoyage des objets liés ajoutés par les SELECT relationnels
  cleanData.sales?.forEach(r => {
    delete r.product;
    delete r.client;
  });

  cleanData.livraisons?.forEach(r => {
    delete r.product;
    delete r.client;
  });

  cleanData.projects?.forEach(r => {
    delete r.product;
  });

  cleanData.tasks?.forEach(r => {
    delete r.project;
  });

  cleanData.scripts?.forEach(r => {
    delete r.angle;
  });

  cleanData.copies?.forEach(r => {
    delete r.angle;
  });

  cleanData.offers?.forEach(r => {
    delete r.product;
  });

  const blob = new Blob(
    [
      JSON.stringify(
        {
          ...cleanData,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        },
        null,
        2
      )
    ],
    {
      type: 'application/json'
    }
  );

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(a.href);
},

// ══════════════════════════════════════════
//   IMPORT JSON (fusion intelligente)
// ══════════════════════════════════════════
async importBackup() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {

    try {

      const file = e.target.files?.[0];

      if (!file) return;

      const backup = JSON.parse(
        await file.text()
      );

      const tables = [

        ['products', 'products'],
        ['clients', 'clients'],

        ['projects', 'projects'],
        ['ideas', 'ideas'],

        ['fixed_expenses', 'expenses'],

        ['marketing_angles', 'angles'],

        ['sales', 'sales'],
        ['livraisons', 'livraisons'],

        ['tasks', 'tasks'],

        ['marketing_scripts', 'scripts'],
        ['marketing_copies', 'copies'],

        ['saved_offers', 'offers']

      ];

      let totalImported = 0;

      for (const [tableName, backupKey] of tables) {

        const rows = backup[backupKey];

        if (!Array.isArray(rows) || rows.length === 0)
          continue;

        const cleanedRows = rows.map(row => {

          const copy = { ...row };

          delete copy.product;
          delete copy.client;
          delete copy.angle;
          delete copy.project;

          return {
            ...copy,
            user_id: DB.userId()
          };

        });

        const { error } = await NEXUS.supabase
          .from(tableName)
          .upsert(cleanedRows, {
            onConflict: 'id'
          });

        if (error)
          throw error;

        totalImported += cleanedRows.length;
      }

      alert(
        `Import terminé avec succès.\n\n${totalImported} éléments importés ou mis à jour.`
      );

      location.reload();

    } catch (err) {

      console.error(err);

      alert(
        'Erreur lors de l’import :\n\n' +
        (err.message || err)
      );
    }
  };

  input.click();
},

// ══════════════════════════════════════════
//   EXPORT EXCEL (CSV compatible Excel)
// ══════════════════════════════════════════
async exportExcel() {

  const all = await this.loadAll();

  const rows = [];

  Object.entries(all).forEach(([section, data]) => {

    rows.push([section.toUpperCase()]);
    rows.push([]);

    if (Array.isArray(data)) {

      data.forEach(item => {

        const clean = { ...item };

        delete clean.product;
        delete clean.client;
        delete clean.angle;
        delete clean.project;

        rows.push([
          JSON.stringify(clean)
        ]);
      });
    }

    rows.push([]);
  });

  const csv = rows
    .map(row =>
      row
        .map(cell =>
          `"${String(cell || '').replace(/"/g, '""')}"`
        )
        .join(';')
    )
    .join('\n');

  const blob = new Blob(
    [csv],
    {
      type: 'text/csv;charset=utf-8;'
    }
  );

  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);

  a.download =
    `nexus_export_${new Date().toISOString().split('T')[0]}.csv`;

  a.click();

  URL.revokeObjectURL(a.href);
}

}; // fermeture de l'objet DB

// ── Export global
window.DB = DB;
