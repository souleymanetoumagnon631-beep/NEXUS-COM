// ══════════════════════════════════════════
//   NEXUS — State Management
//   Source unique de vérité pour toute l'app
// ══════════════════════════════════════════

const State = {

  // ── Données brutes (chargées depuis Supabase) ──
  data: {
    products:   [],
    sales:      [],
    clients:    [],
    livraisons: [],
    projects:   [],
    tasks:      [],
    ideas:      [],
    expenses:   [],
    angles:     [],
    scripts:    [],
    copies:     [],
    offers:     [],
  },

  // ── UI State ──
  ui: {
    currentPage:        'dashboard',
    dashProductFilter:  '',
    rentSort:           { field: 'profit', dir: -1 },
    projFilter:         '',
    taskFilter:         '',
    ideaFilter:         '',
    revTab:             'week',
    mktProductId:       '',
    mktTab:             'positionnement',
    creatifTab:         'scripts',
    relanceTab:         'remboursement',
    selectedPlan:       'monthly',
    tempScores:         { wow: 0, margin: 0, quality: 0, selling: 0, problem: 0 },
  },

  // ── Modaux ──
  modals: {
    editProductId:  null,
    editSaleId:     null,
    editClientId:   null,
    editLivId:      null,
    editProjectId:  null,
    editTaskId:     null,
    editIdeaId:     null,
    editExpenseId:  null,
  },

  // ── Cache des calculs (invalidé si data change) ──
  _cache: new Map(),
  _cacheVersion: 0,

  // ══════════════════════════════════════════
  //   INIT : Charger toutes les données
  // ══════════════════════════════════════════
  async init() {
    try {
      const all = await DB.loadAll();
      this.setAll(all);
      this._buildIndexes();
      console.log('[State] Données chargées :', {
        products:   this.data.products.length,
        sales:      this.data.sales.length,
        clients:    this.data.clients.length,
        livraisons: this.data.livraisons.length,
        projects:   this.data.projects.length,
        tasks:      this.data.tasks.length,
        ideas:      this.data.ideas.length,
      });
      return true;
    } catch (err) {
      console.error('[State] Erreur init:', err);
      // Afficher une erreur utilisateur au lieu de planter silencieusement
      if (window.Toast) {
        Toast.err('Impossible de charger les données. Vérifiez votre connexion et réessayez.');
      }
      throw err;
    }
  },

  // ── Charger toutes les données d'un coup ──
  setAll(all) {
    Object.keys(this.data).forEach(key => {
      if (all[key] !== undefined) {
        this.data[key] = all[key];
      }
    });
    this._invalidateCache();
    this._buildIndexes();
  },

  // ══════════════════════════════════════════
  //   INDEX : Accès rapide aux données liées
  // ══════════════════════════════════════════
  _indexes: {
    salesByProduct: new Map(), // productId → sales[]
    salesByClient:  new Map(), // clientId  → sales[]
    livByProduct:   new Map(), // productId → livraisons[]
    livByClient:    new Map(), // clientId  → livraisons[]
    tasksbyProject: new Map(), // projectId → tasks[]
  },

  _buildIndexes() {
    // Reset
    Object.values(this._indexes).forEach(m => m.clear());

    // Sales par produit et client
    this.data.sales.forEach(s => {
      if (s.product_id) {
        if (!this._indexes.salesByProduct.has(s.product_id))
          this._indexes.salesByProduct.set(s.product_id, []);
        this._indexes.salesByProduct.get(s.product_id).push(s);
      }
      if (s.client_id) {
        if (!this._indexes.salesByClient.has(s.client_id))
          this._indexes.salesByClient.set(s.client_id, []);
        this._indexes.salesByClient.get(s.client_id).push(s);
      }
    });

    // Livraisons par produit et client
    this.data.livraisons.forEach(l => {
      if (l.product_id) {
        if (!this._indexes.livByProduct.has(l.product_id))
          this._indexes.livByProduct.set(l.product_id, []);
        this._indexes.livByProduct.get(l.product_id).push(l);
      }
      if (l.client_id) {
        if (!this._indexes.livByClient.has(l.client_id))
          this._indexes.livByClient.set(l.client_id, []);
        this._indexes.livByClient.get(l.client_id).push(l);
      }
    });

    // Tâches par projet
    this.data.tasks.forEach(t => {
      if (t.project_id) {
        if (!this._indexes.tasksbyProject.has(t.project_id))
          this._indexes.tasksbyProject.set(t.project_id, []);
        this._indexes.tasksbyProject.get(t.project_id).push(t);
      }
    });
  },

  // ══════════════════════════════════════════
  //   GETTERS : Accès rapide aux données
  // ══════════════════════════════════════════

  // Produits
  getProduct(id)        { return this.data.products.find(p => p.id === id) || null; },
  getProducts()         { return this.data.products; },

  // Ventes
  getSale(id)           { return this.data.sales.find(s => s.id === id) || null; },
  getSales()            { return this.data.sales; },
  getSalesByProduct(pid){ return this._indexes.salesByProduct.get(pid) || []; },
  getSalesByClient(cid) { return this._indexes.salesByClient.get(cid) || []; },

  // Clients
  getClient(id)         { return this.data.clients.find(c => c.id === id) || null; },
  getClients()          { return this.data.clients; },

  // Livraisons
  getLivraison(id)      { return this.data.livraisons.find(l => l.id === id) || null; },
  getLivraisons()       { return this.data.livraisons; },
  getLivByProduct(pid)  { return this._indexes.livByProduct.get(pid) || []; },
  getLivByClient(cid)   { return this._indexes.livByClient.get(cid) || []; },
  getLivPending()       { return this.data.livraisons.filter(l => l.status === 'pending' || l.status === 'confirmed'); },

  // Projets
  getProject(id)        { return this.data.projects.find(p => p.id === id) || null; },
  getProjects()         { return this.data.projects; },
  getActiveProjects()   { return this.data.projects.filter(p => p.status === 'cours' || p.status === 'prep'); },

  // Tâches
  getTask(id)           { return this.data.tasks.find(t => t.id === id) || null; },
  getTasks()            { return this.data.tasks; },
  getTasksByProject(pid){ return this._indexes.tasksbyProject.get(pid) || []; },
  getPendingTasks()     { return this.data.tasks.filter(t => t.status !== 'done'); },

  // Idées
  getIdea(id)           { return this.data.ideas.find(i => i.id === id) || null; },
  getIdeas()            { return this.data.ideas; },

  // Dépenses
  getExpense(id)        { return this.data.expenses.find(e => e.id === id) || null; },
  getExpenses()         { return this.data.expenses; },
  getTotalExpenses()    { return this.data.expenses.reduce((s, e) => s + (e.amount || 0), 0); },

  // Marketing
  getAngles(pid = null) {
    if (!pid) return this.data.angles;
    return this.data.angles.filter(a => !a.product_id || a.product_id === pid);
  },
  getScripts(pid = null) {
    if (!pid) return this.data.scripts;
    return this.data.scripts.filter(s => !s.product_id || s.product_id === pid);
  },
  getCopies(pid = null) {
    if (!pid) return this.data.copies;
    return this.data.copies.filter(c => !c.product_id || c.product_id === pid);
  },
  getOffers()  { return this.data.offers; },

  // ══════════════════════════════════════════
  //   MUTATIONS : Modifier le state local
  //   (après succès de l'opération Supabase)
  // ══════════════════════════════════════════

  // ── Products ──
  addProduct(product) {
    this.data.products.unshift(product);
    this._invalidateCache();
  },
  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this._invalidateCache();
    }
  },
  removeProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.sales    = this.data.sales.filter(s => s.product_id !== id);
    this._buildIndexes();
    this._invalidateCache();

    // Nettoyer le cache marketing lié à ce produit (évite données obsolètes affichées)
    if (window.Pages?.marketing?._mktDataCache) {
      delete Pages.marketing._mktDataCache[id];
      if (Pages.marketing._currentPid === id) {
        Pages.marketing._currentPid = '';
      }
    }
  },

  // ── Sales ──
  addSale(sale) {
    this.data.sales.unshift(sale);
    this._buildIndexes();
    this._invalidateCache();
  },
  removeSale(id) {
    this.data.sales = this.data.sales.filter(s => s.id !== id);
    this._buildIndexes();
    this._invalidateCache();
  },

  // ── Clients ──
  addClient(client) {
    this.data.clients.push(client);
    this.data.clients.sort((a, b) => a.name.localeCompare(b.name));
  },
  updateClient(id, updates) {
    const idx = this.data.clients.findIndex(c => c.id === id);
    if (idx !== -1) this.data.clients[idx] = { ...this.data.clients[idx], ...updates };
  },
  removeClient(id) {
    this.data.clients  = this.data.clients.filter(c => c.id !== id);
    this.data.sales    = this.data.sales.map(s =>
      s.client_id === id ? { ...s, client_id: null } : s
    );
    this._buildIndexes();
  },

  // ── Livraisons ──
  addLivraison(liv) {
    this.data.livraisons.unshift(liv);
    this._buildIndexes();
  },
  updateLivraison(id, updates) {
    const idx = this.data.livraisons.findIndex(l => l.id === id);
    if (idx !== -1) this.data.livraisons[idx] = { ...this.data.livraisons[idx], ...updates };
    this._buildIndexes();
  },
  removeLivraison(id) {
    this.data.livraisons = this.data.livraisons.filter(l => l.id !== id);
    this._buildIndexes();
  },

  // ── Projects ──
  addProject(project) {
    this.data.projects.unshift(project);
  },
  updateProject(id, updates) {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx !== -1) this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
  },
  removeProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.data.tasks    = this.data.tasks.map(t =>
      t.project_id === id ? { ...t, project_id: null } : t
    );
    this._buildIndexes();
  },

  // ── Tasks ──
  addTask(task) {
    this.data.tasks.unshift(task);
    this._buildIndexes();
  },
  updateTask(id, updates) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates };
      this._buildIndexes();
    }
  },
  removeTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this._buildIndexes();
  },

  // ── Ideas ──
  addIdea(idea)       { this.data.ideas.unshift(idea); },
  updateIdea(id, u)   {
    const idx = this.data.ideas.findIndex(i => i.id === id);
    if (idx !== -1) this.data.ideas[idx] = { ...this.data.ideas[idx], ...u };
  },
  removeIdea(id)      { this.data.ideas = this.data.ideas.filter(i => i.id !== id); },

  // ── Expenses ──
  addExpense(exp)     { this.data.expenses.unshift(exp); },
  updateExpense(id, u){
    const idx = this.data.expenses.findIndex(e => e.id === id);
    if (idx !== -1) this.data.expenses[idx] = { ...this.data.expenses[idx], ...u };
  },
  removeExpense(id)   { this.data.expenses = this.data.expenses.filter(e => e.id !== id); },

  // ── Angles ──
  addAngle(a)   { this.data.angles.unshift(a); },
  removeAngle(id){ this.data.angles = this.data.angles.filter(a => a.id !== id); },

  // ── Scripts ──
  addScript(s)   { this.data.scripts.unshift(s); },
  removeScript(id){ this.data.scripts = this.data.scripts.filter(s => s.id !== id); },

  // ── Copies ──
  addCopy(c)   { this.data.copies.unshift(c); },
  removeCopy(id){ this.data.copies = this.data.copies.filter(c => c.id !== id); },

  // ── Offers ──
  addOffer(o)   { this.data.offers.unshift(o); },
  removeOffer(id){ this.data.offers = this.data.offers.filter(o => o.id !== id); },

  // ══════════════════════════════════════════
  //   CACHE : Invalidation
  // ══════════════════════════════════════════
  _invalidateCache() {
    this._cache.clear();
    this._cacheVersion++;
  },

  cached(key, fn) {
    if (this._cache.has(key)) return this._cache.get(key);
    const result = fn();
    this._cache.set(key, result);
    return result;
  },
};

window.State = State;
