// ══════════════════════════════════════════
//   NEXUS — Charts (Chart.js)
//   Tous les graphiques de l'application
// ══════════════════════════════════════════

const Charts = {

  // ── Instances actives ──
  _instances: {},

  // ── Couleurs ──
  COLORS: [
    '#7c6fff','#34d399','#60a5fa','#fbbf24',
    '#f87171','#ec4899','#fb923c','#14b8a6',
    '#a78bfa','#06b6d4',
  ],

  // ── Options communes ──
  _getThemeColors() {
    const isLight = document.body.classList.contains('light-theme');
    return {
      text:       isLight ? '#475569' : '#8892a4',
      grid:       isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)',
      background: isLight ? '#fff' : 'transparent',
    };
  },

  _commonScales() {
    const t = this._getThemeColors();
    return {
      x: {
        grid:  { color: t.grid },
        ticks: { color: t.text, font: { size: 11 } },
      },
      y: {
        grid:  { color: t.grid },
        ticks: {
          color: t.text,
          font:  { size: 11 },
          callback: v => Math.round(v / 1000) + 'k',
        },
      },
    };
  },

  _commonPlugins(hideLegend = true) {
    const t = this._getThemeColors();
    return {
      legend: {
        display: !hideLegend,
        labels:  { color: t.text, font: { size: 11 }, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: v => `${v.dataset?.label || ''}: ${fF(v.raw)}`.trim(),
        },
      },
    };
  },

  // ── Destroy un chart existant ──
  destroy(id) {
    if (this._instances[id]) {
      this._instances[id].destroy();
      delete this._instances[id];
    }
  },

  // ── Destroy tous ──
  destroyAll() {
    Object.keys(this._instances).forEach(id => this.destroy(id));
  },

  // ── Mettre à jour le thème sur tous les charts actifs ──
  updateTheme() {
    Object.values(this._instances).forEach(chart => {
      const t   = this._getThemeColors();
      const sc  = chart.options.scales || {};
      Object.values(sc).forEach(axis => {
        if (axis.ticks) axis.ticks.color  = t.text;
        if (axis.grid)  axis.grid.color   = t.grid;
      });
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = t.text;
      }
      chart.update();
    });
  },

  // ══════════════════════════════════════════
  //   DASHBOARD — Revenus 7 jours (Bar)
  // ══════════════════════════════════════════
  buildWeekChart(filterPid = '') {
    this.destroy('week');
    const ctx = $('chart-week')?.getContext('2d');
    if (!ctx) return;

    const { labels, values } = Engine.getWeekChartData(filterPid);

    this._instances['week'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label:           'CA (FCFA)',
          data:            values,
          backgroundColor: 'rgba(124,111,255,0.5)',
          borderColor:     'rgba(124,111,255,1)',
          borderWidth:     2,
          borderRadius:    6,
          borderSkipped:   false,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: this._commonPlugins(true),
        scales:  this._commonScales(),
      },
    });
  },

  // ══════════════════════════════════════════
  //   DASHBOARD — CA par canal (Doughnut)
  // ══════════════════════════════════════════
  buildChannelChart(filterPid = '') {
    this.destroy('channels');
    const ctx = $('chart-channels')?.getContext('2d');
    if (!ctx) return;

    const { labels, values } = Engine.getChannelChartData(filterPid);
    if (!labels.length) return;

    const t = this._getThemeColors();

    this._instances['channels'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data:            values,
          backgroundColor: this.COLORS.slice(0, labels.length),
          borderWidth:     0,
          hoverOffset:     6,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display:  true,
            position: 'right',
            labels:   { color: t.text, font: { size: 11 }, padding: 12 },
          },
          tooltip: {
            callbacks: {
              label: v => `${v.label}: ${fF(v.raw)}`,
            },
          },
        },
        cutout: '65%',
      },
    });
  },

  // ══════════════════════════════════════════
  //   REVENUS — Graphique mensuel (Line)
  // ══════════════════════════════════════════
  buildMonthlyChart() {
    this.destroy('monthly');
    const ctx = $('chart-monthly')?.getContext('2d');
    if (!ctx) return;

    const { labels, caValues, profitValues } = Engine.getMonthlyChartData();

    this._instances['monthly'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:           'CA',
            data:            caValues,
            borderColor:     '#60a5fa',
            backgroundColor: 'rgba(96,165,250,0.1)',
            fill:            true,
            tension:         0.4,
            borderWidth:     2,
            pointRadius:     4,
            pointBackgroundColor: '#60a5fa',
          },
          {
            label:           'Profit',
            data:            profitValues,
            borderColor:     '#34d399',
            backgroundColor: 'rgba(52,211,153,0.1)',
            fill:            true,
            tension:         0.4,
            borderWidth:     2,
            pointRadius:     4,
            pointBackgroundColor: '#34d399',
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: this._commonPlugins(false),
        scales:  this._commonScales(),
        interaction: { mode: 'index', intersect: false },
      },
    });
  },

  // ══════════════════════════════════════════
  //   REVENUS — CA par canal (Bar horizontal)
  // ══════════════════════════════════════════
  buildRevChannelChart() {
    this.destroy('rev-channels');
    const ctx = $('chart-rev-channels')?.getContext('2d');
    if (!ctx) return;

    const { labels, values } = Engine.getChannelChartData();
    if (!labels.length) return;

    this._instances['rev-channels'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data:            values,
          backgroundColor: this.COLORS.slice(0, labels.length),
          borderRadius:    6,
          borderWidth:     0,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: this._commonPlugins(true),
        scales: {
          ...this._commonScales(),
          x: {
            ...this._commonScales().x,
            ticks: {
              ...this._commonScales().x.ticks,
              callback: v => v,
            },
          },
        },
      },
    });
  },

  // ══════════════════════════════════════════
  //   FINANCES — Seuil de rentabilité (Line)
  // ══════════════════════════════════════════
  buildBreakevenChart() {
    this.destroy('breakeven');
    const ctx = $('chart-breakeven')?.getContext('2d');
    if (!ctx) return;

    const { labels, revenueData, costData } = Engine.getBreakevenChartData();

    this._instances['breakeven'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:           'Revenus',
            data:            revenueData,
            borderColor:     '#34d399',
            backgroundColor: 'rgba(52,211,153,0.05)',
            fill:            true,
            tension:         0.3,
            borderWidth:     2,
          },
          {
            label:           'Coûts',
            data:            costData,
            borderColor:     '#f87171',
            backgroundColor: 'rgba(248,113,113,0.05)',
            fill:            true,
            tension:         0.3,
            borderWidth:     2,
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: this._commonPlugins(false),
        scales:  this._commonScales(),
        interaction: { mode: 'index', intersect: false },
      },
    });
  },

  // ══════════════════════════════════════════
  //   RENTABILITÉ — Profit par produit (Bar)
  // ══════════════════════════════════════════
  buildProfitChart(limit = 8) {
    this.destroy('profit-bar');
    const ctx = $('chart-profit-bar')?.getContext('2d');
    if (!ctx) return;

    const list = Engine.getRentabiliteList('profit', -1)
      .slice(0, limit);

    const labels = list.map(x => x.p.name);
    const values = list.map(x => x.s.profit);
    const colors = values.map(v =>
      v >= 0 ? 'rgba(52,211,153,0.7)' : 'rgba(248,113,113,0.7)'
    );
    const borders = values.map(v =>
      v >= 0 ? '#34d399' : '#f87171'
    );

    this._instances['profit-bar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label:           'Profit (FCFA)',
          data:            values,
          backgroundColor: colors,
          borderColor:     borders,
          borderWidth:     2,
          borderRadius:    6,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: this._commonPlugins(true),
        scales: {
          ...this._commonScales(),
          x: {
            ...this._commonScales().x,
            ticks: {
              color:    this._getThemeColors().text,
              font:     { size: 10 },
              maxRotation: 30,
            },
          },
        },
      },
    });
  },

  // ══════════════════════════════════════════
  //   DASHBOARD — Performance radar (optionnel)
  // ══════════════════════════════════════════
  buildPerformanceChart() {
    this.destroy('performance');
    const ctx = $('chart-performance')?.getContext('2d');
    if (!ctx) return;

    const products = State.getProducts().slice(0, 6);
    if (!products.length) return;

    const t = this._getThemeColors();

    const datasets = products.map((p, i) => {
      const s = Engine.getProductStats(p.id);
      return {
        label:           p.name,
        data:            [
          Math.min(100, Math.max(0, s?.roi || 0)),
          Math.min(100, Math.max(0, s?.margin || 0)),
          Math.min(100, (s?.sold || 0) / (p.qty || 1) * 100),
        ],
        borderColor:     this.COLORS[i % this.COLORS.length],
        backgroundColor: this.COLORS[i % this.COLORS.length] + '22',
        borderWidth:     2,
        pointRadius:     4,
      };
    });

    this._instances['performance'] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['ROI (%)', 'Marge (%)', 'Ventes (%)'],
        datasets,
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, labels: { color: t.text, font: { size: 10 } } } },
        scales: {
          r: {
            ticks:       { color: t.text, font: { size: 10 } },
            grid:        { color: t.grid },
            pointLabels: { color: t.text, font: { size: 11 } },
          },
        },
      },
    });
  },

  // ══════════════════════════════════════════
  //   DASHBOARD — Répartition profit (Pie)
  // ══════════════════════════════════════════
  buildProfitPieChart() {
    this.destroy('profit-pie');
    const ctx = $('chart-profit-pie')?.getContext('2d');
    if (!ctx) return;

    const products = State.getProducts()
      .map(p => ({ p, s: Engine.getProductStats(p.id) }))
      .filter(x => x.s && x.s.profit > 0)
      .sort((a, b) => b.s.profit - a.s.profit)
      .slice(0, 6);

    if (!products.length) return;

    const t = this._getThemeColors();

    this._instances['profit-pie'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels:   products.map(x => x.p.name),
        datasets: [{
          data:            products.map(x => x.s.profit),
          backgroundColor: this.COLORS.slice(0, products.length),
          borderWidth:     2,
          borderColor:     t.background,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display:  true,
            position: 'bottom',
            labels:   { color: t.text, font: { size: 10 }, padding: 10 },
          },
          tooltip: {
            callbacks: {
              label: v => `${v.label}: ${fF(v.raw)}`,
            },
          },
        },
      },
    });
  },

  // ══════════════════════════════════════════
  //   HELPER : Rebuild les charts du dashboard
  // ══════════════════════════════════════════
  buildDashboardCharts(filterPid = '') {
    setTimeout(() => {
      this.buildWeekChart(filterPid);
      this.buildChannelChart(filterPid);
      this.buildPerformanceChart();
      this.buildProfitPieChart();
    }, 100);
  },

  buildRevenusCharts() {
    setTimeout(() => {
      this.buildMonthlyChart();
      this.buildRevChannelChart();
    }, 100);
  },
};

window.Charts = Charts;
