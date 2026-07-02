import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import NoiseOverlay from '../components/NoiseOverlay';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleConnectWhatsApp = () => {
        setIsLoading(true);
        // Simuler la connexion WhatsApp
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 2000);
    };

    const handleFinish = () => {
        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="min-h-screen bg-charbon text-creme flex flex-col items-center justify-center relative overflow-hidden">
            <NoiseOverlay />
            
            {/* Ambient Orbs */}
            <div className="orb orb-1 opacity-30" />
            <div className="orb orb-3 opacity-30" />

            <div className="w-full max-w-2xl px-6 relative z-10">
                <div className="mb-12 flex justify-center">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-argile' : 'bg-white/10'}`}></div>
                        <div className={`w-16 h-px ${step >= 2 ? 'bg-argile' : 'bg-white/10'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-argile' : 'bg-white/10'}`}></div>
                    </div>
                </div>

                {step === 1 ? (
                    <div className="glass-card p-10 border-white/5 bg-charbon-950/90 text-center">
                        <h1 className="text-4xl font-display font-bold text-creme mb-4">Liez votre WhatsApp</h1>
                        <p className="text-creme/60 mb-10 max-w-md mx-auto">
                            NEXUS a besoin de se connecter à votre numéro WhatsApp Business pour capturer automatiquement vos ventes.
                        </p>
                        
                        <div className="bg-charbon-900 border border-white/10 rounded-2xl p-6 mb-10 max-w-sm mx-auto flex items-center justify-center">
                            <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                <span className="text-creme/30 font-mono text-sm">[ QR CODE MOCKUP ]</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConnectWhatsApp}
                            disabled={isLoading}
                            className="magnetic-btn bg-argile text-creme py-4 px-8 inline-flex items-center gap-3 disabled:opacity-70 shadow-lg shadow-argile/20"
                        >
                            <span className="relative z-10 font-bold flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connexion en cours...
                                    </>
                                ) : (
                                    <>
                                        Simuler la connexion
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </span>
                            <div className="btn-bg bg-argile-600"></div>
                        </button>
                    </div>
                ) : (
                    <div className="glass-card p-10 border-argile/30 bg-charbon-950/90 text-center shadow-[0_0_50px_rgba(204,88,51,0.1)]">
                        <div className="w-20 h-20 bg-mousse-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-mousse-500">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-creme mb-4">Parfaitement connecté.</h1>
                        <p className="text-creme/60 mb-10 max-w-md mx-auto">
                            L'assistant NEXUS écoute désormais vos transactions. Vous êtes prêt à découvrir votre infrastructure financière.
                        </p>

                        <button
                            onClick={handleFinish}
                            className="magnetic-btn bg-creme text-charbon-950 py-4 px-8 inline-flex items-center gap-3 font-bold"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Accéder au Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="btn-bg bg-white"></div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
