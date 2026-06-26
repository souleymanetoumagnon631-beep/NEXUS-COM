// ══════════════════════════════════════════
//   NEXUS — Moteur de Calcul Métier
//   Toute la logique financière ici
// ══════════════════════════════════════════

const Engine = {

  // ══════════════════════════════════════════
  //   PRODUIT : Calcul investissement total
  //   [CORRIGÉ] Les frais pub (fb, tiktok, ads, misc) sont maintenant
  //   saisis dans les ventes, pas dans les achats.
  //   computeInvest() ne calcule que le coût produit pur.
  // ══════════════════════════════════════════
  computeInvest(product) {
    return (
      (product.stock    || 0) +
      (product.fret     || 0) +
      (product.delivery || 0) +
      (product.customs  || 0) +
      (product.packaging|| 0)
    );
  },

  // ══════════════════════════════════════════
  //   VENTE : Calcul des frais de vente totaux
  // ══════════════════════════════════════════
  computeSaleCosts(sale) {
    return (
      (sale.shipping || 0) +
      (sale.fb_cost    || 0) +
      (sale.tiktok_cost|| 0) +
      (sale.ads_cost   || 0) +
      (sale.misc_cost  || 0)
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
  //   ALERTES INTELLIGENTES — v2
  //   [CORRIGÉ] Alertes actionnables, spécifiques,
  //   orientées cash et conseils pour entrepreneur africain
  // ══════════════════════════════════════════
  getAlerts(allStats, filterProductId = '') {
    const alerts = [];
    const sales  = filterProductId
      ? State.getSalesByProduct(filterProductId)
      : State.getSales();

    // ── 1. ALERTE CASH : Trésorerie réelle ──
    const totalInvest = allStats.reduce((s, x) => s + x.s.invest, 0);
    const totalCA     = allStats.reduce((s, x) => s + x.s.ca, 0);
    const totalProfit = allStats.reduce((s, x) => s + x.s.profit, 0);
    const totalExpenses = State.getTotalExpenses();
    const netProfit   = totalProfit - totalExpenses;
    const cashBalance = totalCA - totalInvest;

    if (netProfit <= 0 && totalCA > 0) {
      alerts.push({
        type: 'error',
        message: '🔴 Vous dépensez plus que vous ne gagnez',
        detail: `Profit net: ${fF(netProfit)}. Vos dépenses fixes (${fF(totalExpenses)}) mangent votre marge. Conseil : augmentez vos prix de 10-15% ou réduisez une dépense fixe ce mois-ci.`,
        action: 'Voir finances',
        page: 'finances',
      });
    }

    if (cashBalance < 0) {
      alerts.push({
        type: 'error',
        message: '🔴 Trésorerie négative — vous n\'avez pas encore récupéré votre investissement',
        detail: `Vous avez investi ${fF(totalInvest)} mais généré ${fF(totalCA)}. Il vous manque ${fF(Math.abs(cashBalance))} pour atteindre le point mort. Conseil : priorisez la vente des produits à forte marge.`,
        action: 'Voir rentabilité',
        page: 'rentabilite',
      });
    }

    // ── 2. ALERTE STOCK : Rotation lente ──
    const slowRotation = allStats.filter(x => {
      const sold = x.s.sold;
      const qty  = x.p.qty || 1;
      return sold > 0 && (qty - sold) > sold * 2; // stock > 2x vendu
    });
    if (slowRotation.length) {
      alerts.push({
        type: 'warning',
        message: '🐌 Rotation lente — stock qui ne se vend pas',
        detail: slowRotation.slice(0, 2).map(x =>
          `${x.p.name}: ${x.s.stock} en stock, seulement ${x.s.sold} vendu(s). Conseil : proposez une promo ou un lot pour écouler.`
        ).join(' | '),
        action: 'Voir produits',
        page: 'produits',
      });
    }

    // ── 3. ALERTE MARGE : Produits qui coûtent plus qu'ils ne rapportent ──
    const lossLeaders = allStats.filter(x => x.s.isDeficit);
    if (lossLeaders.length) {
      alerts.push({
        type: 'error',
        message: '📉 Produits en perte — ils vous coûtent de l\'argent',
        detail: lossLeaders.slice(0, 2).map(x =>
          `${x.p.name}: perte de ${fF(Math.abs(x.s.profit))}. Conseil : augmentez le prix ou stoppez ce produit.`
        ).join(' | '),
        action: 'Analyser',
        page: 'rentabilite',
      });
    }

    // ── 4. ALERTE PUB : Pression publicitaire trop forte ──
    const totalPubCosts = sales.reduce((s, v) =>
      s + (v.fb_cost || 0) + (v.tiktok_cost || 0) + (v.ads_cost || 0) + (v.misc_cost || 0), 0
    );
    const totalShipping = sales.reduce((s, v) => s + (v.shipping || 0), 0);
    const totalCosts = totalInvest + totalPubCosts + totalShipping + totalExpenses;
    const pubRatio = totalCA > 0 ? (totalPubCosts / totalCA) * 100 : 0;

    if (pubRatio > 30) {
      alerts.push({
        type: 'warning',
        message: `📢 Publicité = ${pubRatio.toFixed(0)}% du CA — c'est trop élevé`,
        detail: `Vous dépensez ${fF(totalPubCosts)} en pub pour ${fF(totalCA)} de ventes. Conseil : testez des canaux organiques (WhatsApp, bouche-à-oreille) ou réduisez les enchères.`,
        action: 'Voir revenus',
        page: 'revenus',
      });
    }

    // ── 5. ALERTE CANAL : Dépendance excessive ──
    const channelMap = {};
    sales.forEach(s => {
      const ch = s.channel || 'Autre';
      if (!channelMap[ch]) channelMap[ch] = 0;
      channelMap[ch] += (s.price || 0) * (s.qty || 0);
    });
    const totalChannelCA = Object.values(channelMap).reduce((a, b) => a + b, 0);
    const dominantChannel = Object.entries(channelMap)
      .sort((a, b) => b[1] - a[1])[0];
    if (dominantChannel && totalChannelCA > 0) {
      const ratio = (dominantChannel[1] / totalChannelCA) * 100;
      if (ratio > 70) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${ratio.toFixed(0)}% du CA vient d'un seul canal (${dominantChannel[0]})`,
          detail: `Si ce canal s'arrête, votre business est en danger. Conseil : diversifiez sur au moins 2 autres canaux cette semaine.`,
          action: 'Voir revenus',
          page: 'revenus',
        });
      }
    }

    // ── 6. ALERTE CLIENTS : Fidélisation ──
    const clients = State.getClients();
    const clientsWithSales = new Set(sales.filter(s => s.client_id).map(s => s.client_id));
    const repeatClients = clients.filter(c =>
      sales.filter(s => s.client_id === c.id).length > 1
    );
    if (clients.length > 0 && repeatClients.length < clients.length * 0.2) {
      alerts.push({
        type: 'info',
        message: '👤 Moins de 20% de vos clients sont fidèles',
        detail: `Seulement ${repeatClients.length} client(s) sur ${clients.length} ont acheté plusieurs fois. Conseil : créez un programme de fidélité simple (réduction 10% au 2e achat).`,
        action: 'Voir clients',
        page: 'clients',
      });
    }

    // ── 7. ALERTE STOCK FAIBLE ──
    const lowStock = allStats.filter(x => x.s.isLowStock);
    if (lowStock.length) {
      alerts.push({
        type: 'warning',
        message: `📦 ${lowStock.length} produit(s) bientôt en rupture`,
        detail: lowStock.slice(0, 3).map(x =>
          `${x.p.name}: ${x.s.stock} restant(s) sur ${x.p.qty} acheté(s). Conseil : commandez le réapprovisionnement maintenant.`
        ).join(' | '),
        action: 'Voir achats',
        page: 'achats',
      });
    }

    // ── 8. ALERTE TÂCHES CRITIQUES ──
    const critTasks = State.getTasks().filter(
      t => t.priority === 'critique' && t.status !== 'done'
    );
    if (critTasks.length) {
      alerts.push({
        type: 'error',
        message: `⏰ ${critTasks.length} tâche(s) critique(s) en attente`,
        detail: critTasks.slice(0, 2).map(t => t.title).join(', '),
        action: 'Voir tâches',
        page: 'taches',
      });
    }

    // ── 9. ALERTE PROJETS TERMINÉS ──
    const doneProjects = State.getProjects().filter(p => p.status === 'term');
    if (doneProjects.length) {
      alerts.push({
        type: 'success',
        message: `🎉 ${doneProjects.length} projet(s) terminé(s) !`,
        detail: doneProjects.slice(0, 2).map(p => p.name).join(', '),
        action: '',
        page: '',
      });
    }

    // ── 10. CONSEIL GÉNÉRAL SI TOUT VA BIEN ──
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        message: '✅ Business en bonne santé — continuez comme ça !',
        detail: 'Vos marges sont bonnes, vos stocks tournent, et vos clients sont fidèles. Pensez à lancer un nouveau produit pour accélérer la croissance.',
        action: '',
        page: '',
      });
    }

    return alerts;
  },

  // ══════════════════════════════════════════
  //   SCORE DE SANTÉ BUSINESS
  //   [NOUVEAU] Score visuel rouge/orange/vert
  //   basé sur 5 critères concrets
  // ══════════════════════════════════════════
  getBusinessHealthScore(filterProductId = '') {
    const products = filterProductId
      ? State.getProducts().filter(p => p.id === filterProductId)
      : State.getProducts();
    const sales = filterProductId
      ? State.getSalesByProduct(filterProductId)
      : State.getSales();

    const allStats = products
      .map(p => ({ p, s: this.getProductStats(p.id) }))
      .filter(x => x.s !== null);

    const totalInvest = allStats.reduce((s, x) => s + x.s.invest, 0);
    const totalCA     = allStats.reduce((s, x) => s + x.s.ca, 0);
    const totalProfit = allStats.reduce((s, x) => s + x.s.profit, 0);
    const totalExpenses = State.getTotalExpenses();
    const netProfit   = totalProfit - totalExpenses;
    const cashBalance = totalCA - totalInvest;

    const totalPubCosts = sales.reduce((s, v) =>
      s + (v.fb_cost || 0) + (v.tiktok_cost || 0) + (v.ads_cost || 0) + (v.misc_cost || 0), 0
    );
    const pubRatio = totalCA > 0 ? (totalPubCosts / totalCA) * 100 : 0;

    // Critères (chacun donne 0-20 points, max 100)
    let score = 0;
    const details = [];

    // 1. Rentabilité (20 pts)
    if (netProfit > 0) {
      const margin = totalCA > 0 ? (netProfit / totalCA) * 100 : 0;
      if (margin >= 30) { score += 20; details.push({ label: 'Marge nette > 30%', pts: 20, color: 'green' }); }
      else if (margin >= 15) { score += 15; details.push({ label: `Marge nette ${margin.toFixed(0)}%`, pts: 15, color: 'green' }); }
      else if (margin >= 5) { score += 10; details.push({ label: `Marge nette ${margin.toFixed(0)}% — faible`, pts: 10, color: 'orange' }); }
      else { score += 5; details.push({ label: 'Marge nette < 5% — attention', pts: 5, color: 'orange' }); }
    } else {
      details.push({ label: 'Business en perte', pts: 0, color: 'red' });
    }

    // 2. Trésorerie (20 pts)
    if (cashBalance > 0) {
      const ratio = totalInvest > 0 ? (cashBalance / totalInvest) * 100 : 0;
      if (ratio >= 50) { score += 20; details.push({ label: 'Trésorerie solide', pts: 20, color: 'green' }); }
      else if (ratio >= 20) { score += 15; details.push({ label: 'Trésorerie correcte', pts: 15, color: 'green' }); }
      else { score += 10; details.push({ label: 'Trésorerie faible', pts: 10, color: 'orange' }); }
    } else {
      details.push({ label: 'Trésorerie négative', pts: 0, color: 'red' });
    }

    // 3. Rotation stock (20 pts)
    const slowRotation = allStats.filter(x => {
      const sold = x.s.sold;
      const qty  = x.p.qty || 1;
      return sold > 0 && (qty - sold) > sold * 2;
    });
    const noSales = allStats.filter(x => x.s.nSales === 0);
    if (slowRotation.length === 0 && noSales.length === 0) {
      score += 20; details.push({ label: 'Bonne rotation des stocks', pts: 20, color: 'green' });
    } else if (slowRotation.length <= 1 && noSales.length <= 1) {
      score += 10; details.push({ label: `${slowRotation.length + noSales.length} produit(s) à rotation lente`, pts: 10, color: 'orange' });
    } else {
      details.push({ label: `${slowRotation.length + noSales.length} produit(s) qui ne tournent pas`, pts: 0, color: 'red' });
    }

    // 4. Pression pub (20 pts)
    if (pubRatio <= 15) {
      score += 20; details.push({ label: `Pub maîtrisée (${pubRatio.toFixed(0)}% du CA)`, pts: 20, color: 'green' });
    } else if (pubRatio <= 30) {
      score += 10; details.push({ label: `Pub modérée (${pubRatio.toFixed(0)}% du CA)`, pts: 10, color: 'orange' });
    } else {
      details.push({ label: `Pub trop chère (${pubRatio.toFixed(0)}% du CA)`, pts: 0, color: 'red' });
    }

    // 5. Diversification canaux (20 pts)
    const channelMap = {};
    sales.forEach(s => {
      const ch = s.channel || 'Autre';
      if (!channelMap[ch]) channelMap[ch] = 0;
      channelMap[ch] += (s.price || 0) * (s.qty || 0);
    });
    const nChannels = Object.keys(channelMap).length;
    if (nChannels >= 3) {
      score += 20; details.push({ label: `${nChannels} canaux de vente actifs`, pts: 20, color: 'green' });
    } else if (nChannels >= 2) {
      score += 10; details.push({ label: `Seulement ${nChannels} canaux — diversifiez`, pts: 10, color: 'orange' });
    } else {
      details.push({ label: '1 seul canal — risque élevé', pts: 0, color: 'red' });
    }

    // Score final
    let level, color, emoji;
    if (score >= 80) { level = 'Excellent'; color = 'var(--green)'; emoji = '🟢'; }
    else if (score >= 60) { level = 'Bon'; color = 'var(--accent2)'; emoji = '🟡'; }
    else if (score >= 40) { level = 'Fragile'; color = 'var(--orange)'; emoji = '🟠'; }
    else { level = 'Critique'; color = 'var(--red)'; emoji = '🔴'; }

    return { score, level, color, emoji, details, maxScore: 100 };
  },

  // ══════════════════════════════════════════
  //   CONSEIL DU JOUR
  //   [NOUVEAU] Conseil actionnable basé sur
  //   les données réelles du business
  // ══════════════════════════════════════════
  getDailyAdvice(filterProductId = '') {
    const products = filterProductId
      ? State.getProducts().filter(p => p.id === filterProductId)
      : State.getProducts();
    const sales = filterProductId
      ? State.getSalesByProduct(filterProductId)
      : State.getSales();

    const allStats = products
      .map(p => ({ p, s: this.getProductStats(p.id) }))
      .filter(x => x.s !== null);

    const totalCA = allStats.reduce((s, x) => s + x.s.ca, 0);
    const totalProfit = allStats.reduce((s, x) => s + x.s.profit, 0);
    const totalExpenses = State.getTotalExpenses();
    const netProfit = totalProfit - totalExpenses;

    const totalPubCosts = sales.reduce((s, v) =>
      s + (v.fb_cost || 0) + (v.tiktok_cost || 0) + (v.ads_cost || 0) + (v.misc_cost || 0), 0
    );
    const pubRatio = totalCA > 0 ? (totalPubCosts / totalCA) * 100 : 0;

    // Meilleur produit
    const bestProduct = [...allStats].sort((a, b) => b.s.profit - a.s.profit)[0];

    // Produit en perte
    const worstProduct = [...allStats].filter(x => x.s.isDeficit)
      .sort((a, b) => a.s.profit - b.s.profit)[0];

    // Stock faible
    const lowStock = allStats.filter(x => x.s.isLowStock)
      .sort((a, b) => a.s.stock - b.s.stock)[0];

    // Générer le conseil
    const advices = [];

    if (netProfit <= 0) {
      advices.push({
        icon: '💰',
        title: 'Priorité : devenir rentable',
        text: `Vous êtes en perte de ${fF(Math.abs(netProfit))}. Concentrez-vous sur vos 2-3 produits les plus vendus et augmentez leurs prix de 10%.`,
      });
    }

    if (bestProduct && bestProduct.s.profit > 0) {
      advices.push({
        icon: '⭐',
        title: `Votre meilleur produit : ${bestProduct.p.name}`,
        text: `Il génère ${fF(bestProduct.s.profit)} de profit avec une marge de ${bestProduct.s.margin.toFixed(0)}%. Mettez plus de budget pub dessus cette semaine.`,
      });
    }

    if (worstProduct) {
      advices.push({
        icon: '📉',
        title: `Produit à risque : ${worstProduct.p.name}`,
        text: `Perte de ${fF(Math.abs(worstProduct.s.profit))}. Soit vous augmentez le prix, soit vous arrêtez ce produit.`,
      });
    }

    if (pubRatio > 25) {
      advices.push({
        icon: '📢',
        title: 'Réduisez vos coûts pub',
        text: `La pub représente ${pubRatio.toFixed(0)}% de votre CA. Essayez le marketing organique (WhatsApp, groupes Facebook) cette semaine.`,
      });
    }

    if (lowStock) {
      advices.push({
        icon: '📦',
        title: `Stock bientôt épuisé : ${lowStock.p.name}`,
        text: `Il ne reste que ${lowStock.s.stock} unité(s). Commandez le réapprovisionnement maintenant pour éviter la rupture.`,
      });
    }

    // Conseil par défaut si tout va bien
    if (advices.length === 0) {
      advices.push({
        icon: '🚀',
        title: 'Tout va bien — accélérez !',
        text: 'Votre business est rentable et vos stocks tournent. C\'est le moment idéal pour lancer un nouveau produit ou tester un nouveau canal de vente.',
      });
    }

    return advices.slice(0, 3); // max 3 conseils
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
  // [CORRIGÉ] getCAForPeriod : les paramètres sont maintenant clairs :
  // daysAgoStart = début de la période (ex: 0 = aujourd'hui)
  // daysAgoEnd   = fin de la période (ex: 6 = il y a 6 jours)
  // start est la date la plus ancienne, end la plus récente
  getCAForPeriod(sales, daysAgoStart, daysAgoEnd) {
    const now   = new Date();
    const start = new Date();
    const end   = new Date();
    start.setDate(now.getDate() - Math.max(daysAgoStart, daysAgoEnd));
    end.setDate(now.getDate() - Math.min(daysAgoStart, daysAgoEnd));
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
      // [CORRIGÉ] Semaine commence le lundi (dow=1) au lieu de dimanche (dow=0)
      // getDay() : 0=Dim, 1=Lun, 2=Mar, ..., 6=Sam
      // Si dimanche (0), on recule de 6 jours pour arriver au lundi
      // Si lundi (1), on recule de 1 jour
      // Si mardi (2), on recule de 2 jours, etc.
      const daysSinceMonday = dow === 0 ? 6 : dow - 1;
      const start = new Date(y, m, d - daysSinceMonday);
      const end   = new Date(y, m, d - daysSinceMonday + 6);
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
    // [CORRIGÉ] Utilise la différence en mois réelle au lieu d'une approximation à 30 jours
    let avgCA   = 0;
    let avgSub  = 'Aucune vente';
    if (sales.length) {
      const dates = sales.map(s => s.sale_date).filter(Boolean).sort();
      const firstDate = new Date(dates[0]);
      const lastDate  = new Date(dates[dates.length - 1]);
      const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12
                       + (lastDate.getMonth() - firstDate.getMonth())
                       + 1; // +1 car on inclut le mois en cours
      const months = Math.max(1, monthsDiff);
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
    // [CORRIGÉ] Utilise la différence en mois réelle
    let avgMonthCA = 0;
    if (sales.length) {
      const dates = sales.map(s => s.sale_date).filter(Boolean).sort();
      const firstDate = new Date(dates[0]);
      const lastDate  = new Date(dates[dates.length - 1]);
      const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12
                       + (lastDate.getMonth() - firstDate.getMonth())
                       + 1;
      const months = Math.max(1, monthsDiff);
      avgMonthCA = totalCA / months;
    }

    // Seuil de rentabilité (unités à vendre par mois)
    const totalQtySold    = sales.reduce((s, v) => s + (v.qty || 0), 0);
    const avgPricePerUnit = totalQtySold > 0 ? totalCA / totalQtySold : 0;
    const avgMarginRate   = totalCA > 0 ? totalProfit / totalCA : 0;

    // Seuil minimal de marge en-dessous duquel le calcul devient peu fiable/explosif
    const MIN_RELIABLE_MARGIN = 0.02; // 2%
    const MAX_REASONABLE_UNITS = 100000;

    let breakeven       = null;
    let breakevenWarning = null;

    if (avgPricePerUnit > 0 && avgMarginRate > 0) {
      if (avgMarginRate < MIN_RELIABLE_MARGIN) {
        breakevenWarning = 'Votre marge moyenne est trop faible pour calculer un seuil de rentabilité fiable. Augmentez vos prix ou réduisez vos coûts.';
      } else {
        const computed = Math.ceil(totalFixed / (avgPricePerUnit * avgMarginRate));
        if (computed > MAX_REASONABLE_UNITS) {
          breakevenWarning = 'Le volume nécessaire est anormalement élevé — votre marge actuelle ne couvre pas vos dépenses fixes à un rythme réaliste.';
        } else {
          breakeven = computed;
        }
      }
    } else if (avgMarginRate <= 0 && totalCA > 0) {
      breakevenWarning = 'Votre marge moyenne actuelle est nulle ou négative : aucun volume de vente ne suffira à couvrir vos dépenses fixes en l\'état.';
    }

    return {
      totalFixed,
      totalCA,
      totalProfit,
      netProfit,
      avgMonthCA,
      breakeven,
      breakevenWarning,
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
  // [CORRIGÉ] Le profit mensuel utilise maintenant le coût unitaire du produit à l'achat
  // (pas le coût moyen global) pour éviter les distorsions temporelles
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

      // CA du mois
      const ca = mSales.reduce((s, v) => s + (v.price || 0) * (v.qty || 0), 0);

      // Profit du mois : calculé produit par produit avec le coût unitaire de chaque produit
      const profit = mSales.reduce((s, v) => {
        const stats = this.getProductStats(v.product_id);
        if (!stats) return s;
        // st.unit est le coût unitaire du produit (investissement total / quantité achetée)
        // C'est la meilleure approximation disponible sans coût historique par lot
        const unitCost = stats.unit;
        return s + (v.price - unitCost) * (v.qty || 0) - (v.shipping || 0);
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
