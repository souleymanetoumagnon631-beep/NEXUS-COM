// ══════════════════════════════════════════
//   NEXUS — UI Layer
//   Navigation, Toast, Modaux, Badges, Utils
// ══════════════════════════════════════════

// ══════════════════════════════════════════
//   UTILITAIRES GLOBAUX
// ══════════════════════════════════════════
const uid     = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const $       = id => document.getElementById(id);
const $$      = sel => document.querySelectorAll(sel);
const num     = id => parseFloat($(id)?.value) || 0;
const str     = id => ($(id)?.value || '').trim();
const today   = () => new Date().toISOString().split('T')[0];

const esc = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const fmtDate = d => {
  if (!d) return '—';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
};

const fF = v => {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return Math.round(v).toLocaleString('fr-FR') + ' FCFA';
};

const fP = v => {
  if (isNaN(v)) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(1) + ' %';
};

const avColor = name => {
  const c = ['#7c6fff','#3b82f6','#34d399','#fbbf24','#f87171',
             '#ec4899','#a78bfa','#14b8a6','#fb923c','#06b6d4'];
  let h = 0;
  for (const ch of (name || '')) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return c[Math.abs(h) % c.length];
};

// ── Constantes labels ──
const STATUS_LABELS = { prep:'En préparation', cours:'En cours', term:'Terminé', susp:'Suspendu' };
const STATUS_BADGE  = { prep:'bb', cours:'bp', term:'bg', susp:'by' };
const PRIO_LABELS   = { faible:'Faible', moyenne:'Moyenne', haute:'Haute', critique:'Critique' };
const PRIO_BADGE    = { faible:'bb', moyenne:'by', haute:'bo', critique:'br' };
const TASK_STATUS   = { todo:'À faire', doing:'En cours', done:'Terminée' };
const LIV_STATUS    = { pending:'En attente', confirmed:'Confirmé', shipped:'Expédié', delivered:'Livré', returned:'Retour' };
const LIV_BADGE     = { pending:'by', confirmed:'bb', shipped:'bp', delivered:'bg', returned:'br' };
const LIV_COLOR     = { pending:'var(--yellow)', confirmed:'var(--blue)', shipped:'var(--accent2)', delivered:'var(--green)', returned:'var(--red)' };

// ══════════════════════════════════════════
//   TOAST
// ══════════════════════════════════════════
const Toast = {
  show(msg, type = 'inf', duration = 3500) {
    const container = $('toasts') || this._createContainer();
    const el        = document.createElement('div');

    const icons = {
      ok:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
      err: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      inf: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      warn:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    };

    el.className = `toast ${type}`;
    el.innerHTML = `${icons[type] || icons.inf}<span>${esc(msg)}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'tOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, duration);
  },

  ok   (msg) { this.show(msg, 'ok'); },
  err  (msg) { this.show(msg, 'err'); },
  info (msg) { this.show(msg, 'inf'); },
  warn (msg) { this.show(msg, 'warn'); },

  _createContainer() {
    const div = document.createElement('div');
    div.id = 'toasts';
    document.body.appendChild(div);
    return div;
  },
};

// ══════════════════════════════════════════
//   NAVIGATION
// ══════════════════════════════════════════
const Nav = {

  pageTitles: {
    dashboard:   'Tableau de bord',
    achats:      'Mes Achats',
    ventes:      'Mes Ventes',
    clients:     'Clients',
    livraisons:  'Livraisons',
    rentabilite: 'Rentabilité',
    produits:    'Produits',
    revenus:     'Revenus',
    finances:    'Finances',
    projets:     'Projets',
    taches:      'Tâches',
    idees:       'Idées Produits',
    relances:    'Relances',
    marketing:   'Marketing',
    compte:      'Mon Compte',
  },

  // Renderer de chaque page (injecté par app.js)
  renderers: {},

  register(page, fn) {
    this.renderers[page] = fn;
  },

  refreshIfActive(page) {
    if (this.renderers[page] && State.ui.currentPage === page) {
      this.renderers[page]();
    }
  },

  go(page, el = null) {
    // Cacher toutes les pages
    $$('.page').forEach(p => p.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));

    // Activer la page cible
    $(`page-${page}`)?.classList.add('active');
    (el || document.querySelector(`[data-page="${page}"]`))?.classList.add('active');

    // Titre topbar
    const titleEl = $('topTitle');
    if (titleEl) titleEl.textContent = this.pageTitles[page] || page;

    // Stocker la page courante
    State.ui.currentPage = page;

    // Fermer sidebar mobile
    this.closeSidebar();

    // Render
    if (page === 'ventes') {
      Pages.ventes?.init?.();
    } else if (this.renderers[page]) {
      this.renderers[page]();
    }
  },

  openSidebar()  {
    $('sidebar')?.classList.add('open');
    $('sov')?.classList.add('open');
  },

  closeSidebar() {
    $('sidebar')?.classList.remove('open');
    $('sov')?.classList.remove('open');
  },
};

// ══════════════════════════════════════════
//   BADGES SIDEBAR
// ══════════════════════════════════════════
const Badges = {
  update() {
    const d = State.data;
    this._set('b-achats',     d.products.length);
    this._set('b-ventes',     d.sales.length);
    this._set('b-clients',    d.clients.length);
    this._set('b-livraisons', d.livraisons.filter(l => l.status === 'pending' || l.status === 'confirmed').length);
    this._set('b-projets',    d.projects.length);
    this._set('b-taches',     d.tasks.filter(t => t.status !== 'done').length);
    this._set('b-idees',      d.ideas.length);
    this._set('b-relances',   d.clients.length);
  },

  _set(id, val) {
    const el = $(id);
    if (el) el.textContent = val;
  },
};

// ══════════════════════════════════════════
//   MODAUX
// ══════════════════════════════════════════
const Modal = {

  open(id) {
    $(id)?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close(id) {
    $(id)?.classList.remove('open');
    document.body.style.overflow = '';
  },

  closeAll() {
    $$('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
    // Reset tous les editId dans State
    Object.keys(State.modals).forEach(k => State.modals[k] = null);
  },

  // Fermer si clic sur l'overlay
  onOverlayClick(e, modalId) {
    if (e.target.id === modalId) this.close(modalId);
  },

  // Générique : modal d'édition avec contenu dynamique
  openEdit(title, bodyHtml, onSave) {
    const modal = $('editModal');
    if (!modal) return;
    $('editModalTitle').textContent  = title;
    $('editBody').innerHTML          = bodyHtml;
    window.__editSaveCallback__      = onSave;
    this.open('editModal');
  },

  // Confirmer une action destructrice
  confirm(message) {
    return window.confirm(message);
  },
};

// ══════════════════════════════════════════
//   FORMULAIRES : Utilitaires
// ══════════════════════════════════════════
const Form = {

  // Remplir un select avec des options
  fillSelect(selectId, items, valueFn, labelFn, defaultLabel = '— Sélectionner —', currentVal = '') {
    const sel = $(selectId);
    if (!sel) return;
    sel.innerHTML = `<option value="">${defaultLabel}</option>` +
      items.map(item =>
        `<option value="${esc(valueFn(item))}"${valueFn(item) === currentVal ? ' selected' : ''}>${esc(labelFn(item))}</option>`
      ).join('');
  },

  // Remplir select produits
  fillProducts(selectId, currentVal = '', placeholder = '— Sélectionner un produit —') {
    this.fillSelect(
      selectId,
      State.getProducts(),
      p => p.id,
      p => p.name,
      placeholder,
      currentVal
    );
  },

  // Remplir select clients
  fillClients(selectId, currentVal = '', placeholder = '— Client anonyme —') {
    const sel = $(selectId);
    if (!sel) return;
    sel.innerHTML = `<option value="">${placeholder}</option>` +
      State.getClients().map(c =>
        `<option value="${c.id}"${c.id === currentVal ? ' selected' : ''}>${esc(c.name)}${c.phone ? ' · ' + c.phone : ''}</option>`
      ).join('');
  },

  // Remplir select projets
  fillProjects(selectId, currentVal = '') {
    this.fillSelect(
      selectId,
      State.getProjects(),
      p => p.id,
      p => p.name,
      '— Aucun projet —',
      currentVal
    );
  },

  // Remplir select angles marketing
  fillAngles(selectId, currentVal = '') {
    this.fillSelect(
      selectId,
      State.data.angles,
      a => a.id,
      a => a.title,
      '— Aucun angle —',
      currentVal
    );
  },

  // Vider les champs d'un formulaire
  clear(...ids) {
    ids.forEach(id => {
      const el = $(id);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
  },

  // Valider et retourner les erreurs
  validate(rules) {
    const errors = [];
    rules.forEach(({ value, message }) => {
      if (!value && value !== 0) errors.push(message);
    });
    return errors;
  },
};

// ══════════════════════════════════════════
//   LOADER : Indicateur de chargement
// ══════════════════════════════════════════
const Loader = {

  show(containerId, message = 'Chargement...') {
    const el = $(containerId);
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;gap:14px">
        <div class="nexus-spinner"></div>
        <div style="font-size:.84rem;color:var(--text3)">${esc(message)}</div>
      </div>`;
  },

  hide(containerId) {
    // Le contenu sera remplacé par le render suivant
  },

  // Loader sur un bouton
  setBtn(btnId, loading, originalText = '') {
    const btn = $(btnId);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.innerHTML = `<div class="btn-spinner"></div>`;
    } else {
      btn.innerHTML = originalText || btn.dataset.originalText || 'Valider';
    }
  },
};

// ══════════════════════════════════════════
//   ABONNEMENT : Affichage dans topbar
// ══════════════════════════════════════════
const SubscriptionUI = {

  render() {
    const sub    = window.__SESSION__?.subscription;
    if (!sub) return;

    const badge  = Auth.getSubscriptionBadge(sub);
    const el     = $('sub-badge');
    if (!el) return;

    el.innerHTML = `
      <span style="font-size:.7rem;font-weight:700;color:${badge.color};
        background:${badge.color}15;border:1px solid ${badge.color}30;
        padding:4px 10px;border-radius:99px;display:inline-flex;align-items:center;gap:5px">
        ${badge.icon} ${badge.label}
      </span>`;

    // Alerte trial presque expiré
    if (sub.plan === 'trial' && badge.daysLeft <= 2) {
      setTimeout(() => {
        Toast.warn(`Votre essai expire dans ${badge.daysLeft} jour(s). Abonnez-vous pour continuer !`);
      }, 2000);
    }
  },
};

// ══════════════════════════════════════════
//   THÈME : Dark / Light
// ══════════════════════════════════════════
const Theme = {

  init() {
    const saved = localStorage.getItem('nexus_theme') || 'dark';
    this.apply(saved);
  },

  toggle() {
    const isLight = document.body.classList.contains('light-theme');
    this.apply(isLight ? 'dark' : 'light');
  },

  apply(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('nexus_theme', theme);
    this._updateIcon(theme);
    Charts.updateTheme();
  },

  _updateIcon(theme) {
    const sunPath  = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    const moonPath = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
    const path     = theme === 'light' ? sunPath : moonPath;
    ['theme-icon', 'theme-icon-landing'].forEach(id => {
      const el = $(id);
      if (el) el.innerHTML = path;
    });
  },
};

// ══════════════════════════════════════════
//   EMPTY STATE : Affichage vide
// ══════════════════════════════════════════
const EmptyState = {
  html(message = 'Aucune donnée.', subMessage = '') {
    return `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>${esc(message)}</p>
        ${subMessage ? `<p style="font-size:.78rem;margin-top:4px;color:var(--text3)">${esc(subMessage)}</p>` : ''}
      </div>`;
  },
};

// ══════════════════════════════════════════
//   ASYNC ACTION : Wrapper pour les actions
//   avec loading + toast automatique
// ══════════════════════════════════════════
const Action = {
  async run(fn, { btnId, successMsg, errorMsg } = {}) {
    if (btnId) Loader.setBtn(btnId, true);
    try {
      const result = await fn();
      if (successMsg) Toast.ok(successMsg);
      return result;
    } catch (err) {
      console.error('[Action Error]', err);
      Toast.err(errorMsg || err.message || 'Une erreur est survenue.');
      return null;
    } finally {
      if (btnId) Loader.setBtn(btnId, false);
    }
  },
};

// ══════════════════════════════════════════
//   LANDING : Transition vers l'app
// ══════════════════════════════════════════
function enterApp() {
  const landing = $('landing');
  if (landing) {
    landing.classList.add('hide');
    setTimeout(() => {
      landing.style.display = 'none';
    }, 600);
  }
}

// ══════════════════════════════════════════
//   KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // Échap → fermer modaux
    if (e.key === 'Escape') {
      Modal.closeAll();
      Nav.closeSidebar();
    }
    // Ctrl+K → focus recherche (si présente)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchEl = document.querySelector('.search-wrap input:not([type=hidden])');
      searchEl?.focus();
    }
  });
}

function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// ══════════════════════════════════════════
//   EXPORT GLOBAL
// ══════════════════════════════════════════
window.debounce = debounce;
window.Toast    = Toast;
window.Nav      = Nav;
window.Badges   = Badges;
window.Modal    = Modal;
window.Form     = Form;
window.Loader   = Loader;
window.Theme    = Theme;
window.Action   = Action;
window.EmptyState = EmptyState;
window.SubscriptionUI = SubscriptionUI;

// Utilitaires globaux
window.uid      = uid;
window.$        = $;
window.$$       = $$;
window.num      = num;
window.str      = str;
window.today    = today;
window.esc      = esc;
window.fmtDate  = fmtDate;
window.fF       = fF;
window.fP       = fP;
window.avColor  = avColor;
window.enterApp = enterApp;

window.STATUS_LABELS = STATUS_LABELS;
window.STATUS_BADGE  = STATUS_BADGE;
window.PRIO_LABELS   = PRIO_LABELS;
window.PRIO_BADGE    = PRIO_BADGE;
window.TASK_STATUS   = TASK_STATUS;
window.LIV_STATUS    = LIV_STATUS;
window.LIV_BADGE     = LIV_BADGE;
window.LIV_COLOR     = LIV_COLOR;
