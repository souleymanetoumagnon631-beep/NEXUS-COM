import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NoiseOverlay from './NoiseOverlay';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-charbon text-creme flex items-center justify-center relative overflow-hidden">
            <NoiseOverlay />
            
            {/* Ambient Orbs */}
            <div className="orb orb-1 opacity-50" />
            <div className="orb orb-2 opacity-50" />

            <div className="w-full max-w-md px-6 relative z-10">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                        <svg width="40" height="40" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-90 transition-transform duration-500">
                            <g fill="#F2F0E9">
                                <polygon points="60,8 90,60 60,55" />
                                <polygon points="112,60 60,90 65,60" />
                                <polygon points="60,112 30,60 60,65" />
                                <polygon points="8,60 60,30 55,60" />
                            </g>
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-creme mb-2">Bon retour.</h1>
                    <p className="text-creme/50">Accédez à votre infrastructure financière.</p>
                </div>

                <div className="glass-card-strong p-8 border-white/5 bg-charbon-950/80">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-charbon-900 border border-white/10 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-argile/50 focus:ring-1 focus:ring-argile/50 transition-all placeholder:text-creme/20"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                                <Link to="/forgot-password" className="text-xs text-argile hover:text-argile-400 transition-colors">
                                    Oublié ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-charbon-900 border border-white/10 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-argile/50 focus:ring-1 focus:ring-argile/50 transition-all placeholder:text-creme/20"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="magnetic-btn w-full bg-creme text-charbon-950 py-3.5 px-4 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                        >
                            <span className="relative z-10 font-bold flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Authentification...
                                    </>
                                ) : (
                                    <>
                                        Se connecter
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </span>
                            <div className="btn-bg bg-white"></div>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-creme/50 text-sm">
                            Nouveau sur NEXUS ?{' '}
                            <Link to="/signup" className="text-argile font-medium hover:text-argile-400 transition-colors">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
