import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('nexus_theme') || 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCtaClick = (plan = 'monthly') => {
    navigate(`/login?plan=${plan}`);
  };

  return (
    <div id="landing">
      {/* Background Orbs */}
      <div className="l-orb l-orb-1"></div>
      <div className="l-orb l-orb-2"></div>
      <div className="l-orb l-orb-3"></div>
      <div className="l-orb l-orb-4"></div>

      {/* NAVIGATION */}
      <nav className="l-nav" id="mainNav">
        <div className="l-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="l-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="l-logo-name">NEXUS</div>
        </div>

        {/* Navigation Links */}
        <div className={`l-nav-links ${mobileMenuOpen ? 'open' : ''}`} id="navLinks">
          <a href="#hero" className="l-nav-link active" onClick={() => setMobileMenuOpen(false)}>Accueil</a>
          <a href="#features" className="l-nav-link" onClick={() => setMobileMenuOpen(false)}>Fonctionnalités</a>
          <a href="#modules" className="l-nav-link" onClick={() => setMobileMenuOpen(false)}>Modules</a>
          <a href="#pricing" className="l-nav-link" onClick={() => setMobileMenuOpen(false)}>Prix</a>
          <a href="#resources" className="l-nav-link" onClick={() => setMobileMenuOpen(false)}>Ressources</a>
        </div>

        <div className="l-nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Changer de mode">
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <button className="l-nav-login" onClick={() => navigate('/login')}>Connexion</button>
          <button className="l-nav-cta" onClick={() => handleCtaClick('monthly')}>Essai gratuit →</button>
          
          {/* Hamburger Menu */}
          <button className={`l-hamburger ${mobileMenuOpen ? 'active' : ''}`} id="hamburgerBtn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="l-hero" id="hero">
        <div className="l-hero-badge">
          <span className="l-hero-badge-dot"></span>
          7 jours d'essai gratuit — Sans carte bancaire
        </div>

        <h1 className="l-hero-title">
          Pilotez votre business<br />
          <span className="l-hero-gradient-text">avec une clarté totale</span>
        </h1>

        <p className="l-hero-sub">
          NEXUS centralise vos achats, ventes, clients, livraisons et finances en un seul tableau de bord. Prenez des décisions basées sur des données réelles — pas des intuitions.
        </p>

        <div className="l-hero-actions">
          <button className="l-btn-main" onClick={() => handleCtaClick('monthly')}>
            Commencer gratuitement
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
          <button className="l-btn-ghost" onClick={() => document.querySelector('#features').scrollIntoView({ behavior: 'smooth' })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
            Voir les fonctionnalités
          </button>
        </div>

        <div className="l-pricing-row">
          <div className="l-price-pill"><strong>7 jours</strong>&nbsp;gratuits</div>
          <div className="l-price-pill"><strong>5 000 FCFA</strong>&nbsp;/ mois</div>
          <div className="l-price-pill highlight">🔥 <strong>40 000 FCFA</strong>&nbsp;/ an — Économisez 20 000 FCFA</div>
        </div>

        {/* Demo Mockup */}
        <div className="l-mockup">
          <div className="l-mockup-inner">
            <div className="l-mockup-browser-bar">
              <span></span><span></span><span></span>
              <div className="l-mockup-url">nexus.app/dashboard</div>
            </div>
            <div className="l-mockup-screen">
              <div className="l-mockup-sidebar">
                <div className="l-mockup-logo-sm"></div>
                <div className="l-mockup-nav-item" style={{ width: '80%' }}></div>
                <div className="l-mockup-nav-item" style={{ width: '60%' }}></div>
                <div className="l-mockup-nav-item" style={{ width: '70%' }}></div>
                <div className="l-mockup-nav-item" style={{ width: '50%' }}></div>
              </div>
              <div className="l-mockup-content">
                <div className="l-mockup-stats">
                  <div className="l-mockup-stat"></div>
                  <div className="l-mockup-stat"></div>
                  <div className="l-mockup-stat"></div>
                  <div className="l-mockup-stat"></div>
                </div>
                <div className="l-mockup-chart">
                  <div className="l-mockup-chart-bar" style={{ height: '40%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '65%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '50%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '80%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '55%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '90%' }}></div>
                  <div className="l-mockup-chart-bar" style={{ height: '70%' }}></div>
                </div>
                <div className="l-mockup-table">
                  <div className="l-mockup-table-row"></div>
                  <div className="l-mockup-table-row"></div>
                  <div className="l-mockup-table-row"></div>
                </div>
              </div>
            </div>
            <div className="l-mockup-glow"></div>
          </div>
        </div>

        {/* Global stats pills */}
        <div className="l-stats">
          <div className="l-stat">
            <div className="l-stat-val">14</div>
            <div className="l-stat-lbl">Modules intégrés</div>
          </div>
          <div className="l-stat">
            <div className="l-stat-val">100%</div>
            <div className="l-stat-lbl">Données sécurisées</div>
          </div>
          <div className="l-stat">
            <div className="l-stat-val">7</div>
            <div className="l-stat-lbl">Jours d'essai</div>
          </div>
          <div className="l-stat">
            <div className="l-stat-val">∞</div>
            <div className="l-stat-lbl">Produits & ventes</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="l-features" id="features">
        <div className="l-section-label">Pourquoi NEXUS</div>
        <h2 className="l-section-title">Tout ce dont votre business a besoin</h2>
        <p className="l-section-sub">Un seul outil pour remplacer les tableurs, les carnets et les applications éparpillées.</p>

        <div className="l-features-grid">
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(124,111,255,0.15)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <div className="l-feature-title">Rentabilité en temps réel</div>
            <div className="l-feature-desc">Visualisez instantanément vos profits, marges et ROI par produit. Plus besoin de calculer manuellement.</div>
          </div>
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(201,168,76,0.12)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
            </div>
            <div className="l-feature-title">Gestion clients avancée</div>
            <div className="l-feature-desc">Suivez chaque client, son historique d'achat, sa valeur totale et relancez-le directement via WhatsApp.</div>
          </div>
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(52,211,153,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <div className="l-feature-title">Suivi des livraisons</div>
            <div className="l-feature-desc">Pipeline visuel Kanban pour suivre chaque commande de la confirmation à la livraison finale.</div>
          </div>
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(96,165,250,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div className="l-feature-title">Graphiques & Analyses</div>
            <div className="l-feature-desc">Revenus hebdomadaires, mensuels, répartition par canal — des graphiques clairs pour comprendre vos tendances.</div>
          </div>
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(251,146,60,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <div className="l-feature-title">Relances WhatsApp</div>
            <div className="l-feature-desc">Relancez vos clients en un clic — remboursements, récommandes, nouvelles offres. Messages prédéfinis intelligents.</div>
          </div>
          <div className="l-feature-card">
            <div className="l-feature-icon" style={{ background: 'rgba(244,114,182,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="l-feature-title">Marketing structuré</div>
            <div className="l-feature-desc">Positionnement, offre irrésistible, angles publicitaires et scripts vidéo — la méthode des pros, simplifiée.</div>
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="l-modules" id="modules">
        <div className="l-section-label">Modules</div>
        <h2 className="l-section-title">14 outils, un seul tableau de bord</h2>
        <p className="l-section-sub">Chaque module est conçu pour un aspect spécifique de votre business.</p>

        <div className="l-modules-grid">
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            </div>
            <div className="l-module-name">Dashboard</div>
            <div className="l-module-desc">Vue d'ensemble complète</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </div>
            <div className="l-module-name">Achats</div>
            <div className="l-module-desc">Stocks & investissements</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
            </div>
            <div className="l-module-name">Ventes</div>
            <div className="l-module-desc">Historique & suivi</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
            </div>
            <div className="l-module-name">Clients</div>
            <div className="l-module-desc">CRM simplifié</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <div className="l-module-name">Livraisons</div>
            <div className="l-module-desc">Pipeline Kanban</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <div className="l-module-name">Relances</div>
            <div className="l-module-desc">WhatsApp intelligent</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <div className="l-module-name">Rentabilité</div>
            <div className="l-module-desc">ROI & marges</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div className="l-module-name">Revenus</div>
            <div className="l-module-desc">Analyse temporelle</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="l-module-name">Finances</div>
            <div className="l-module-desc">Dépenses & seuil</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            <div className="l-module-name">Projets</div>
            <div className="l-module-desc">Suivi & progression</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
            </div>
            <div className="l-module-name">Tâches</div>
            <div className="l-module-desc">Priorités & suivi</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
            </div>
            <div className="l-module-name">Idées</div>
            <div className="l-module-desc">Scoring & validation</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="l-module-name">Marketing</div>
            <div className="l-module-desc">Positionnement & offres</div>
          </div>
          <div className="l-module-card">
            <div className="l-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            </div>
            <div className="l-module-name">Créatifs</div>
            <div className="l-module-desc">Scripts & copywriting</div>
          </div>
        </div>
      </section>

      {/* RESOURCES SECTION */}
      <section className="l-resources" id="resources">
        <div className="l-section-label">Ressources</div>
        <h2 className="l-section-title">Apprenez et maîtrisez NEXUS</h2>
        <p className="l-section-sub">Guides, tutoriels et conseils pour tirer le meilleur de votre outil de gestion.</p>

        <div className="l-resources-grid">
          <div className="l-resource-card">
            <div className="l-resource-img" style={{ background: 'linear-gradient(135deg,#7c6fff22,#a78bfa11)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </div>
            <div className="l-resource-tag">Guide</div>
            <div className="l-resource-title">Guide de démarrage rapide</div>
            <div className="l-resource-desc">Configurez NEXUS en 5 minutes et commencez à gérer vos produits, ventes et clients.</div>
            <a href="#" className="l-resource-link" onClick={e => e.preventDefault()}>Lire le guide →</a>
          </div>
          <div className="l-resource-card">
            <div className="l-resource-img" style={{ background: 'linear-gradient(135deg,#34d39922,#10b98111)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <div className="l-resource-tag" style={{ color: '#34d399', background: 'rgba(52,211,153,0.1)' }}>Tutoriel</div>
            <div className="l-resource-title">Analyser votre rentabilité</div>
            <div className="l-resource-desc">Comprenez vos marges, ROI et produits les plus performants avec les outils d'analyse NEXUS.</div>
            <a href="#" className="l-resource-link" onClick={e => e.preventDefault()}>Voir le tutoriel →</a>
          </div>
          <div className="l-resource-card">
            <div className="l-resource-img" style={{ background: 'linear-gradient(135deg,#fbbf2422,#f59e0b11)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <div className="l-resource-tag" style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.1)' }}>Astuce</div>
            <div className="l-resource-title">Relances WhatsApp efficaces</div>
            <div className="l-resource-desc">Découvrez comment augmenter vos ventes with des relances automatisées et personnalisées.</div>
            <a href="#" className="l-resource-link" onClick={e => e.preventDefault()}>Découvrir →</a>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="l-pricing" id="pricing">
        <div className="l-section-label">Tarifs</div>
        <h2 className="l-section-title">Un prix simple, sans surprise</h2>
        <p className="l-section-sub">Commencez gratuitement. Passez au plan qui vous convient quand vous êtes prêt.</p>

        <div className="l-pricing-grid">
          {/* TRIAL CARD */}
          <div className="l-plan-card">
            <div className="l-plan-name">Essai Gratuit</div>
            <div className="l-plan-price">0 FCFA</div>
            <div className="l-plan-sub">7 jours, sans engagement</div>
            <ul className="l-plan-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Accès complet à NEXUS</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>14 modules débloqués</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Aucune carte bancaire requise</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Données conservées après l'essai</li>
            </ul>
            <button className="l-plan-btn ghost" onClick={() => handleCtaClick('trial')}>Commencer l'essai</button>
          </div>

          {/* MONTHLY CARD */}
          <div className="l-plan-card">
            <div className="l-plan-name">Mensuel</div>
            <div className="l-plan-price">5 000<span> FCFA/mois</span></div>
            <div className="l-plan-sub">Résiliable à tout moment</div>
            <ul className="l-plan-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Accès complet à NEXUS</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Produits & ventes illimités</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Support prioritaire</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Paiement sécurisé via PayTech</li>
            </ul>
            <button className="l-plan-btn primary" onClick={() => handleCtaClick('monthly')}>Choisir Mensuel</button>
          </div>

          {/* ANNUAL CARD */}
          <div className="l-plan-card featured">
            <div className="l-plan-badge">MEILLEUR PRIX</div>
            <div className="l-plan-name">Annuel</div>
            <div className="l-plan-price">40 000<span> FCFA/an</span></div>
            <div className="l-plan-sub">Soit 3 333 FCFA/mois — Économisez 20 000 FCFA</div>
            <ul className="l-plan-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Tout le plan Mensuel</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>2 mois offerts</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Accès anticipé aux nouveautés</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Idéal pour les entrepreneurs sérieux</li>
            </ul>
            <button className="l-plan-btn gold" onClick={() => handleCtaClick('annual')}>Choisir Annuel</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer" id="contact">
        <div className="l-footer-top">
          <div className="l-footer-brand">
            <div className="l-logo" style={{ marginBottom: 16 }}>
              <div className="l-logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="l-logo-name">NEXUS</div>
            </div>
            <p style={{ color: 'var(--text3)', fontSize: '0.84rem', lineHeight: 1.6, maxWidth: 280 }}>
              La plateforme de Commerce Intelligence conçue pour propulser les entrepreneurs d'Afrique de l'Ouest.
            </p>
          </div>
          <div className="l-footer-links-col">
            <h4>Plateforme</h4>
            <a href="#features">Fonctionnalités</a>
            <a href="#modules">Modules</a>
            <a href="#pricing">Tarifs</a>
          </div>
          <div className="l-footer-links-col">
            <h4>Support</h4>
            <a href="mailto:support@nexus-app.com">support@nexus-app.com</a>
            <a href="#" onClick={e => e.preventDefault()}>FAQ</a>
          </div>
        </div>
        <div className="l-footer-bottom">
          <p>© {new Date().getFullYear()} NEXUS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
