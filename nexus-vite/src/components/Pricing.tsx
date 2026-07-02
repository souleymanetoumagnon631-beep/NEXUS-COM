import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-24 bg-charbon">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="section-label block mb-4">Investissement</span>
                    <h2 className="section-title">Un modèle qui grandit avec vous</h2>
                    <p className="section-sub">
                        Commencez gratuitement. Payez quand vous avez la preuve que l'outil vous rapporte plus qu'il ne vous coûte.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    
                    {/* Tier 1: Gratuit */}
                    <div className="glass-card p-8 flex flex-col h-full border border-white/5 bg-charbon-900">
                        <div className="mb-8">
                            <h3 className="font-display text-2xl font-semibold text-creme mb-2">Cahier</h3>
                            <p className="text-creme/50 text-sm h-10">Pour digitaliser vos ventes sans risque.</p>
                            <div className="mt-6">
                                <span className="text-4xl font-display font-bold text-creme">0</span>
                                <span className="text-creme/50 ml-2">FCFA / mois</span>
                            </div>
                        </div>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Capture des ventes WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Gestion de stock basique</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Jusqu'à 100 transactions/mois</span>
                            </li>
                        </ul>
                        
                        <Link to="/signup" className="w-full text-center py-3 px-4 rounded-xl border border-white/10 text-creme hover:bg-white/5 transition-colors font-medium">
                            Commencer gratuitement
                        </Link>
                    </div>

                    {/* Tier 2: Pro (Highlighted) */}
                    <div className="glass-card-strong p-8 flex flex-col h-full border-argile/30 bg-mousse-950 transform lg:scale-105 relative z-10 shadow-[0_20px_60px_rgba(46,64,54,0.3)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-argile text-creme px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg shadow-argile/20">
                            Recommandé
                        </div>
                        <div className="mb-8">
                            <h3 className="font-display text-2xl font-semibold text-creme mb-2">Boutique</h3>
                            <p className="text-creme/50 text-sm h-10">La gestion complète de votre trésorerie.</p>
                            <div className="mt-6">
                                <span className="text-4xl font-display font-bold text-creme">5 000</span>
                                <span className="text-creme/50 ml-2">FCFA / mois</span>
                            </div>
                        </div>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-creme/90">
                                <Check className="w-5 h-5 text-argile shrink-0" />
                                <span>Transactions illimitées</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/90">
                                <Check className="w-5 h-5 text-argile shrink-0" />
                                <span>Rapprochement Mobile Money automatique</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/90">
                                <Check className="w-5 h-5 text-argile shrink-0" />
                                <span>Carnet de créances & relances</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/90">
                                <Check className="w-5 h-5 text-argile shrink-0" />
                                <span>Jusqu'à 3 utilisateurs</span>
                            </li>
                        </ul>
                        
                        <Link to="/signup" className="magnetic-btn bg-argile text-creme w-full text-center py-3 px-4 shadow-lg shadow-argile/20 block">
                            <span className="relative z-10">Démarrer l'essai</span>
                            <div className="btn-bg bg-argile-600"></div>
                        </Link>
                    </div>

                    {/* Tier 3: Croissance */}
                    <div className="glass-card p-8 flex flex-col h-full border border-white/5 bg-charbon-900">
                        <div className="mb-8">
                            <h3 className="font-display text-2xl font-semibold text-creme mb-2">Grossiste</h3>
                            <p className="text-creme/50 text-sm h-10">L'accès au financement pour grandir.</p>
                            <div className="mt-6">
                                <span className="text-4xl font-display font-bold text-creme">15 000</span>
                                <span className="text-creme/50 ml-2">FCFA / mois</span>
                            </div>
                        </div>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Tout le plan Boutique</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Score de crédit certifié et partageable</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Accès invité pour votre comptable</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-creme/80">
                                <Check className="w-5 h-5 text-mousse-400 shrink-0" />
                                <span>Utilisateurs illimités</span>
                            </li>
                        </ul>
                        
                        <Link to="/pricing" className="w-full text-center py-3 px-4 rounded-xl border border-white/10 text-creme hover:bg-white/5 transition-colors font-medium">
                            Voir tous les détails
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;