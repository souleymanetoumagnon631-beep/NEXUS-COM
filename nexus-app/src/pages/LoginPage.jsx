import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paytechService } from '../db/paytech';
import { supabase } from '../db/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signUp, user } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'forgot'
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'trial', 'monthly', 'annual'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null); // { type: 'err'|'ok'|'inf', text: '' }

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check if user has an active subscription
      supabase.rpc('get_my_subscription').then(({ data, error }) => {
        if (!error && data?.[0]?.is_active) {
          navigate('/dashboard', { replace: true });
        } else {
          setMessage({ type: 'err', text: 'Votre abonnement a expiré. Veuillez contacter le support.' });
        }
      });
    }
  }, [user, navigate]);

  // Pre-select plan if passed in query params
  useEffect(() => {
    const signupParam = searchParams.get('signup');
    const planParam = searchParams.get('plan');
    if (signupParam === 'true' || planParam) {
      setActiveTab('signup');
    }
    if (planParam && ['trial', 'monthly', 'annual'].includes(planParam)) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return setMessage({ type: 'err', text: 'Email requis.' });
    if (!password) return setMessage({ type: 'err', text: 'Mot de passe requis.' });

    setLoading(true);
    setMessage(null);

    try {
      await login(email, password);

      // Fetch subscription status
      const { data, error } = await supabase.rpc('get_my_subscription');
      if (error || !data?.[0]?.is_active) {
        setLoading(false);
        return setMessage({ type: 'err', text: 'Votre abonnement a expiré ou est inactif. Renouvelez pour continuer.' });
      }

      setMessage({ type: 'ok', text: 'Connexion réussie ! Redirection...' });
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    } catch (err) {
      setLoading(false);
      const msgs = {
        'Invalid login credentials': 'Email ou mot de passe incorrect.',
        'Email not confirmed': 'Confirmez votre email avant de vous connecter.',
        'Too many requests': 'Trop de tentatives. Réessayez dans quelques minutes.',
      };
      setMessage({ type: 'err', text: msgs[err.message] || `Erreur : ${err.message}` });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name) return setMessage({ type: 'err', text: 'Nom requis.' });
    if (!email) return setMessage({ type: 'err', text: 'Email requis.' });
    if (password.length < 8) return setMessage({ type: 'err', text: 'Mot de passe minimum 8 caractères.' });

    setLoading(true);
    setMessage(null);

    try {
      const newUser = await signUp(email, password);
      // Wait for auth metadata to be written
      await signUp(email, password); // Firebase/Supabase handles options with metadata in Context signup function

      // Local context signIn triggers when user is signed up automatically in Supabase
      if (selectedPlan === 'trial') {
        setMessage({ type: 'ok', text: 'Compte créé ! Bienvenue dans NEXUS 🎉' });
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      } else {
        setMessage({ type: 'ok', text: 'Compte créé ! Redirection vers le paiement...' });
        // Request payment via PayTech
        await paytechService.pay({
          plan: selectedPlan,
          email,
          name,
          userId: newUser.id,
          successPath: '/success',
          cancelPath: '/login'
        });
      }
    } catch (err) {
      setLoading(false);
      const msgs = {
        'User already registered': 'Cet email est déjà utilisé. Connectez-vous.',
        'Password should be at least 6 characters': 'Mot de passe trop court.',
      };
      setMessage({ type: 'err', text: msgs[err.message] || `Erreur : ${err.message}` });
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return setMessage({ type: 'err', text: 'Email requis.' });

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login?reset=true`
      });
      if (error) throw error;

      setMessage({ type: 'ok', text: 'Lien envoyé ! Vérifiez votre boîte email.' });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage({ type: 'err', text: `Erreur : ${err.message}` });
    }
  };

  return (
    <div className="login-wrap">
      {/* Logo */}
      <div className="login-logo" onClick={() => navigate('/')}>
        <div className="login-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="login-logo-name">NEXUS</div>
      </div>

      {/* Card */}
      <div className="login-card">
        {/* Tabs */}
        {activeTab !== 'forgot' && (
          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Connexion
            </button>
            <button
              className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabChange('signup')}
            >
              S'abonner
            </button>
          </div>
        )}

        {/* Global message */}
        {message && (
          <div className={`login-msg ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Login Panel */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="login-title">Content de vous revoir</div>
            <div className="login-sub">Accédez à votre tableau de bord commercial.</div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="forgot-link">
              <a onClick={() => handleTabChange('forgot')}>Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading && <span className="spinner"></span>}
              <span id="btn-login-text">Se connecter</span>
            </button>
          </form>
        )}

        {/* Signup Panel */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="login-title">Créez votre espace</div>
            <div className="login-sub">7 jours d'essai gratuit sur tous les plans.</div>

            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Souleymane Toumagnon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe (8+ caractères)</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Minimum 8 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="divider">CHOIX DU PLAN</div>

            <div className="plans-grid">
              {/* TRIAL */}
              <div
                className={`plan-card ${selectedPlan === 'trial' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('trial')}
              >
                <span className="plan-radio"></span>
                <div className="plan-card-inner">
                  <div className="plan-card-header">
                    <span className="plan-name">Essai Gratuit</span>
                    <span className="plan-price">0 FCFA</span>
                  </div>
                  <div className="plan-desc">7 jours d'accès complet sans engagement</div>
                </div>
              </div>

              {/* MONTHLY */}
              <div
                className={`plan-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <span className="plan-radio"></span>
                <div className="plan-card-inner">
                  <div className="plan-card-header">
                    <span className="plan-name">Mensuel</span>
                    <span className="plan-price">5 000 FCFA</span>
                  </div>
                  <div className="plan-desc">Facturé chaque mois, résiliable à tout moment</div>
                </div>
              </div>

              {/* ANNUAL */}
              <div
                className={`plan-card ${selectedPlan === 'annual' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                <span className="plan-badge">ÉCONOMIE 20K</span>
                <span className="plan-radio"></span>
                <div className="plan-card-inner">
                  <div className="plan-card-header">
                    <span className="plan-name">Annuel</span>
                    <span className="plan-price">40 000 FCFA</span>
                  </div>
                  <div className="plan-desc">Accès pendant 1 an (équivaut à 3 333 FCFA/mois)</div>
                </div>
              </div>
            </div>

            {selectedPlan === 'trial' ? (
              <div className="trial-notice">
                Votre période d'essai de <strong>7 jours</strong> commencera immédiatement.
              </div>
            ) : (
              <div className="trial-notice">
                Après inscription, vous serez redirigé vers <strong>PayTech</strong> pour régler votre abonnement.
              </div>
            )}

            <button type="submit" className="btn-login" style={{ marginTop: 16 }} disabled={loading}>
              {loading && <span className="spinner"></span>}
              <span id="btn-signup-text">S'abonner et commencer</span>
            </button>
          </form>
        )}

        {/* Forgot Password Panel */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgot}>
            <div className="login-title">Mot de passe oublié ?</div>
            <div className="login-sub">Saisissez votre email pour recevoir un lien de réinitialisation.</div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading && <span className="spinner"></span>}
              <span id="btn-forgot-text">Envoyer le lien</span>
            </button>

            <div className="back-link">
              <a onClick={() => handleTabChange('login')}>Retour à la connexion</a>
            </div>
          </form>
        )}
      </div>

      <div className="back-link" style={{ marginTop: 24 }}>
        <a onClick={() => navigate('/')}>← Retour au site</a>
      </div>
    </div>
  );
}
