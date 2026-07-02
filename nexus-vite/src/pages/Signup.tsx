import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NoiseOverlay from '../components/NoiseOverlay';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            
            // Redirect to onboarding as requested
            navigate('/onboarding', { replace: true });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la création du compte.');
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
                    <h1 className="text-3xl font-display font-bold text-creme mb-2">Commencez.</h1>
                    <p className="text-creme/50">Créez votre compte en quelques secondes.</p>
                </div>

                <div className="glass-card-strong p-8 border-white/5 bg-charbon-950/80">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
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
                            <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-charbon-900 border border-white/10 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-argile/50 focus:ring-1 focus:ring-argile/50 transition-all placeholder:text-creme/20"
                                placeholder="Min. 6 caractères"
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="magnetic-btn w-full bg-argile text-creme py-3.5 px-4 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-lg shadow-argile/20"
                        >
                            <span className="relative z-10 font-bold flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    <>
                                        Créer mon compte
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </span>
                            <div className="btn-bg bg-argile-600"></div>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-creme/50 text-sm">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-creme font-medium hover:text-white transition-colors underline decoration-white/30 underline-offset-4">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
