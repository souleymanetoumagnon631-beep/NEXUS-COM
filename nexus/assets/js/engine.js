// ══════════════════════════════════════════
//   NEXUS — Moteur de Calcul Métier
//   Toute la logique financière ici
// ══════════════════════════════════════════

const Engine = {

  // ══════════════════════════════════════════
  //   PRODUIT : Calcul investissement total
  // ══════════════════════════════════════════
  computeInvest(product) {
    return (
      (product.stock    || 0) +
      (product.fret     || 0) +
      (product.delivery || 0) +
      (product.customs  || 0) +
      (product.packaging|| 0) +
      (product.fb       || 0) +
      (product.tiktok   || 0) +
      (product.ads      || 0) +
      (product.misc     || 0)
    );
  },

  // ══════════════════════════════════════════
  //   PRODUIT : Stats complètes
  // ══════════════════════════════════════════
  getProductStats(productId) {
    return State.cached(`stats_${productId}`, () => {
      const product = State.getProduct(productId);
      if (!product) return null;

      const sales        = State.getSalesByProduct(productId);
      const totalInvest  = this.computeInvest(product);
      const qty          = product.qty || 1;
      const unitCost     = qty > 0 ? totalInvest / qty : 0;

      const sold         = sales.reduce((s, v) => s + (v.qty || 0), 0);
      const ca           = sales.reduce((s, v) => s + ((v.price || 0) * (v.qty || 0)), 0);
      const totalShipping= sales.reduce((s, v) => s + (v.shipping || 0), 0);
      const cogs         = unitCost * sold;
      const profit       = ca - cogs - totalShipping;
      const margin       = ca > 0 ? (profit / ca) * 100 : 0;
      const roi          = cogs > 0 ? (profit / cogs) * 100 : 0;
      const cashBalance  = ca - totalInvest - totalShipping;
      const stock        = Math.max(0, qty - sold);
      const stockPct     = qty > 0 ? (stock / qty) * 100 : 0;

      // Meilleur canal de vente
      const channelMap = {};
      sales.forEach(s => {
        const ch = s.channel || 'Autre';
        if (!channelMap[ch]) channelMap[ch] = 0;
        channelMap[ch] += (s.price || 0) * (s.qty || 0);
      });
      const bestChannel = Object.entries(channelMap)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      return {
        invest:       totalInvest,
        ca,
        cogs,
        profit,
        margin,
        roi,
        unit:         unitCost,
        sold,
        nSales:       sales.length,
        cashBalance,
        stock,
        stockPct,
        totalShipping,
        bestChannel,
        isLowStock:   stockPct < 20 && stock > 0,
        isOutOfStock: stock <= 0,
        isProfitable: profit > 0,
        isDeficit:    profit < 0 && sold > 0,
      };
    });
  },

  // ══════════════════════════════════════════
  //   DASHBOARD : Stats globales
  // ══════════════════════════════════════════
  getDashboardStats(filterProductId = '') {
    const cacheKey = `dash_${filterProductId}_${State._cacheVersion}`;
    return State.cached(cacheKey, () => {
      const products = filterProductId
        ? State.getProducts().filter(p => p.id === filterProductId)
        : State.getProducts();

      const sales = filterProductId
        ? State.getSalesByProduct(filterProductId)
        : State.getSales();

      const allStats = products
        .map(p => ({ p, s: this.getProductStats(p.id) }))
        .filter(x => x.s !== null);

      const totalInvest   = allStats.reduce((s, x) => s + x.s.invest, 0);
      const totalCA       = allStats.reduce((s, x) => s + x.s.ca, 0);
      const totalProfit   = allStats.reduce((s, x) => s + x.s.profit, 0);
      const totalExpenses = State.getTotalExpenses();
      const netProfit     = totalProfit - totalExpenses;
      const avgMargin     = totalCA > 0 ? (totalProfit / totalCA) * 100 : 0;
      const globalROI     = totalInvest > 0 ? (totalProfit / totalInvest) * 100 : 0;

      // CA 7 derniers jours
      const ca7j      = this.getCAForPeriod(sales, 0, 6);
      const caPrev7j  = this.getCAForPeriod(sales, 7, 13);
      const trend7j   = caPrev7j > 0 ? ((ca7j - caPrev7j) / caPrev7j) * 100 : 0;

      // Alertes
      const alerts = this.getAlerts(allStats, filterProductId);

      return {
        totalInvest,
        totalCA,
        totalProfit,
        totalExpenses,
        netProfit,
        avgMargin,
        globalROI,
        ca7j,
        caPrev7j,
        trend7j,
        allStats,
        nProducts:      products.length,
        nSales:         sales.length,
        nClients:       State.getClients().length,
        nPending:       State.getLivPending().length,
        nActiveProjects:State.getActiveProjects().length,
        nPendingTasks:  State.getPendingTasks().length,
        alerts,
        isProfitable:   netProfit > 0,
      };
    });
  },

  // ══════════════════════════════════════════
  //   ALERTES : Générer les alertes dashboard
  // ══════════════════════════════════════════
  getAlerts(allStats, filterProductId = '') {
    const alerts = [];

    // Stock faible
    const lowStock = allStats.filter(x => x.s.isLowStock);
    if (lowStock.length) {
      alerts.push({
        type:    'warning',
        message: `${lowStock.length} produit(s) en stock faible`,
        detail:  lowStock.slice(0, 3).map(x => x.p.name).join(', '),
      });
    }

    // Rupture de stock
    const outOfStock = allStats.filter(x => x.s.isOutOfStock);
    if (outOfStock.length) {
      alerts.push({
        type:    'error',
        message: `${outOfStock.length} produit(s) en rupture de stock`,
        detail:  outOfStock.slice(0, 3).map(x => x.p.name).join(', '),
      });
    }

    // Produits en déficit
    const inLoss = allStats.filter(x => x.s.isDeficit);
    if (inLoss.length) {
      alerts.push({
        type:    'error',
        message: `${inLoss.length} produit(s) en déficit`,
        detail:  inLoss.slice(0, 2).map(x => x.p.name).join(', '),
      });
    }

    // Produits sans ventes
    const noSales = allStats.filter(x => x.s.nSales === 0);
    if (noSales.length && !filterProductId) {
      alerts.push({
        type:    'info',
        message: `${noSales.length} produit(s) sans ventes`,
        detail:  '',
      });
    }

    // Tâches critiques
    const critTasks = State.getTasks().filter(
      t => t.priority === 'critique' && t.status !== 'done'
    );
    if (critTasks.length) {
      alerts.push({
        type:    'error',
        message: `${critTasks.length} tâche(s) critique(s) en attente`,
        detail:  '',
      });
    }

    // Projets terminés
    const doneProjects = State.getProjects().filter(p => p.status === 'term');
    if (doneProjects.length) {
      alerts.push({
        type:    'success',
        message: `${doneProjects.length} projet(s) terminé(s) avec succès !`,
        detail:  '',
      });
    }

    return alerts;
  },

  // ══════════════════════════════════════════
  //   CLIENT : Stats
  // ══════════════════════════════════════════
  getClientStats(clientId) {
    return State.cached(`client_${clientId}`, () => {
      const sales    = State.getSalesByClient(clientId);
      const ca       = sales.reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);
      const orders   = sales.length;
      const livs     = State.getLivByClient(clientId);
      const sorted   = [...sales].sort((a, b) =>
        (b.sale_date || '').localeCompare(a.sale_date || '')
      );
      const lastDate = sorted[0]?.sale_date || null;
      const avgBasket = orders > 0 ? ca / orders : 0;

      return {
        ca,
        orders,
        livraisons: livs.length,
        lastDate,
        avgBasket,
        isRecurrent: orders > 1,
      };
    });
  },

  // ══════════════════════════════════════════
  //   PROJET : Progression
  // ══════════════════════════════════════════
  getProjectProgress(project) {
    if (!project.product_id || !project.target_qty) return 0;
    const stats = this.getProductStats(project.product_id);
    if (!stats) return 0;
    return Math.min(100, Math.round((stats.sold / project.target_qty) * 100));
  },

  // ══════════════════════════════════════════
  //   REVENUS : Calcul par période
  // ══════════════════════════════════════════
  getCAForPeriod(sales, daysAgoStart, daysAgoEnd) {
    const now   = new Date();
    const start = new Date();
    const end   = new Date();
    start.setDate(now.getDate() - daysAgoEnd);
    end.setDate(now.getDate() - daysAgoStart);
    const sDate = start.toISOString().split('T')[0];
    const eDate = end.toISOString().split('T')[0];
    return sales
      .filter(s => s.sale_date >= sDate && s.sale_date <= eDate)
      .reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);
  },

  getDateBounds(tab) {
    const now = new Date();
    const y   = now.getFullYear();
    const m   = now.getMonth();
    const d   = now.getDate();
    const dow = now.getDay();

    if (tab === 'week') {
      const start = new Date(y, m, d - dow);
      const end   = new Date(y, m, d - dow + 6);
      return {
        start: start.toISOString().split('T')[0],
        end:   end.toISOString().split('T')[0],
      };
    }
    if (tab === 'month') {
      return {
        start: new Date(y, m, 1).toISOString().split('T')[0],
        end:   new Date(y, m + 1, 0).toISOString().split('T')[0],
      };
    }
    if (tab === 'year') {
      return { start: `${y}-01-01`, end: `${y}-12-31` };
    }
    return { start: null, end: null };
  },

  filterSalesByPeriod(tab) {
    const b = this.getDateBounds(tab);
    if (!b.start) return [...State.getSales()];
    return State.getSales().filter(
      s => s.sale_date >= b.start && s.sale_date <= b.end
    );
  },

  // Stats revenus complètes
  getRevenusStats() {
    const sales  = State.getSales();
    const now    = new Date();
    const y      = now.getFullYear();
    const bWeek  = this.getDateBounds('week');
    const bMonth = this.getDateBounds('month');

    const filterCA = (start, end) => sales
      .filter(s => s.sale_date >= start && s.sale_date <= end)
      .reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);

    const wCA = filterCA(bWeek.start, bWeek.end);
    const mCA = filterCA(bMonth.start, bMonth.end);
    const yCA = sales
      .filter(s => s.sale_date?.startsWith(String(y)))
      .reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);

    const wCount = sales.filter(
      s => s.sale_date >= bWeek.start && s.sale_date <= bWeek.end
    ).length;
    const mCount = sales.filter(
      s => s.sale_date >= bMonth.start && s.sale_date <= bMonth.end
    ).length;
    const yCount = sales.filter(
      s => s.sale_date?.startsWith(String(y))
    ).length;

    // Moyenne mensuelle
    let avgCA   = 0;
    let avgSub  = 'Aucune vente';
    if (sales.length) {
      const dates = sales.map(s => s.sale_date).filter(Boolean).sort();
      const months = Math.max(
        1,
        Math.round(
          (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 2592000000
        ) + 1
      );
      avgCA  = sales.reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0) / months;
      avgSub = `Sur ${months} mois d'activité`;
    }

    return { wCA, mCA, yCA, wCount, mCount, yCount, avgCA, avgSub };
  },

  // ══════════════════════════════════════════
  //   FINANCES : Seuil de rentabilité
  // ══════════════════════════════════════════
  getFinancesStats() {
    const sales         = State.getSales();
    const totalFixed    = State.getTotalExpenses();
    const totalCA       = sales.reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);

    const totalProfit = State.getProducts().reduce((s, p) => {
      const st = this.getProductStats(p.id);
      return s + (st?.profit || 0);
    }, 0);
    const netProfit = totalProfit - totalFixed;

    // CA moyen mensuel
    let avgMonthCA = 0;
    if (sales.length) {
      const dates = sales.map(s => s.sale_date).filter(Boolean).sort();
      const months = Math.max(
        1,
        Math.round(
          (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 2592000000
        ) + 1
      );
      avgMonthCA = totalCA / months;
    }

    // Seuil de rentabilité (unités à vendre par mois)
    const totalQtySold = sales.reduce((s, v) => s + (v.qty || 0), 0);
    const avgPricePerUnit = totalQtySold > 0 ? totalCA / totalQtySold : 0;
    const avgMarginRate = totalCA > 0 ? totalProfit / totalCA : 0;
    const breakeven = avgPricePerUnit > 0 && avgMarginRate > 0
      ? Math.ceil(totalFixed / (avgPricePerUnit * avgMarginRate))
      : null;

    return {
      totalFixed,
      totalCA,
      totalProfit,
      netProfit,
      avgMonthCA,
      breakeven,
      avgPricePerUnit,
      avgMarginRate,
    };
  },

  // ══════════════════════════════════════════
  //   RENTABILITÉ : Classement produits
  // ══════════════════════════════════════════
  getRentabiliteList(sortField = 'profit', sortDir = -1, query = '') {
    const products = query
      ? State.getProducts().filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      : State.getProducts();

    return products
      .map(p => ({ p, s: this.getProductStats(p.id) }))
      .filter(x => x.s !== null)
      .sort((a, b) => ((b.s[sortField] || 0) - (a.s[sortField] || 0)) * sortDir);
  },

  // ══════════════════════════════════════════
  //   IDÉES : Score potentiel produit
  // ══════════════════════════════════════════
  getIdeaScore(idea) {
    const scores = idea.scores || {};
    const total  = Object.values(scores).reduce((s, v) => s + (v || 0), 0);
    let cls, badge, color;

    if (total >= 20) {
      cls = 'sc-excellent'; badge = 'Excellent potentiel'; color = 'var(--orange)';
    } else if (total >= 14) {
      cls = 'sc-bon';       badge = 'Bon potentiel';       color = 'var(--green)';
    } else if (total >= 8) {
      cls = 'sc-moyen';     badge = 'Potentiel moyen';     color = 'var(--yellow)';
    } else {
      cls = 'sc-faible';    badge = 'Faible potentiel';    color = 'var(--text3)';
    }

    return { total, cls, badge, color };
  },

  // ══════════════════════════════════════════
  //   DONNÉES GRAPHIQUES
  // ══════════════════════════════════════════

  // Données pour graphique semaine (7 jours)
  getWeekChartData(filterPid = '') {
    const sales = filterPid
      ? State.getSalesByProduct(filterPid)
      : State.getSales();

    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
      const d  = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));
      values.push(
        sales
          .filter(s => s.sale_date === ds)
          .reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0)
      );
    }
    return { labels, values };
  },

  // Données pour graphique canal
  getChannelChartData(filterPid = '') {
    const sales = filterPid
      ? State.getSalesByProduct(filterPid)
      : State.getSales();

    const map = {};
    sales.forEach(s => {
      const ch = s.channel || 'Autre';
      if (!map[ch]) map[ch] = 0;
      map[ch] += (s.price || 0) * (s.qty || 0);
    });

    return {
      labels: Object.keys(map),
      values: Object.values(map),
    };
  },

  // Données pour graphique mensuel (6 mois)
  getMonthlyChartData() {
    const labels      = [];
    const caValues    = [];
    const profitValues = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y      = d.getFullYear();
      const m      = String(d.getMonth() + 1).padStart(2, '0');
      const prefix = `${y}-${m}`;

      labels.push(d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }));

      const mSales = State.getSales().filter(s => s.sale_date?.startsWith(prefix));
      const ca     = mSales.reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);

      const profit = mSales.reduce((s, v) => {
        const st = this.getProductStats(v.product_id);
        if (!st) return s;
        return s + (v.price - st.unit) * (v.qty || 0) - (v.shipping || 0);
      }, 0);

      caValues.push(ca);
      profitValues.push(profit);
    }

    return { labels, caValues, profitValues };
  },

  // Données breakeven pour graphique
  getBreakevenChartData() {
    const fin   = this.getFinancesStats();
    const units = Array.from({ length: 11 }, (_, i) => i * 10);

    const revenueData = units.map(u => u * fin.avgPricePerUnit);
    const costData    = units.map(u =>
      fin.totalFixed + u * fin.avgPricePerUnit * (1 - fin.avgMarginRate)
    );

    return {
      labels: units.map(u => `${u} u.`),
      revenueData,
      costData,
    };
  },
};

window.Engine = Engine;
