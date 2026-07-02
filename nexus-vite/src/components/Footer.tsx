import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-charbon-950 pt-20 pb-10 rounded-t-[4rem] relative z-10 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <svg width="24" height="24" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                <g fill="#F2F0E9">
                                    <polygon points="60,8 90,60 60,55" />
                                    <polygon points="112,60 60,90 65,60" />
                                    <polygon points="60,112 30,60 60,65" />
                                    <polygon points="8,60 60,30 55,60" />
                                </g>
                            </svg>
                            <span className="font-display font-semibold tracking-[0.2em] text-xl text-creme">NEXUS</span>
                        </Link>
                        <p className="text-creme/50 text-sm leading-relaxed max-w-xs">
                            L'intelligence financière des commerçants africains. Transformez vos données invisibles en historique finançable.
                        </p>
                    </div>

                    {/* Nav 1 */}
                    <div>
                        <h4 className="text-creme font-semibold mb-6 uppercase tracking-wider text-xs">Produit</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-creme/50 hover:text-creme transition-colors text-sm">Fonctionnalités</a></li>
                            <li><a href="#protocol" className="text-creme/50 hover:text-creme transition-colors text-sm">Protocole</a></li>
                            <li><a href="#pricing" className="text-creme/50 hover:text-creme transition-colors text-sm">Tarifs</a></li>
                            <li><Link to="/login" className="text-creme/50 hover:text-creme transition-colors text-sm">Connexion</Link></li>
                        </ul>
                    </div>

                    {/* Légal */}
                    <div>
                        <h4 className="text-creme font-semibold mb-6 uppercase tracking-wider text-xs">Légal</h4>
                        <ul className="space-y-4">
                            <li><Link to="/terms" className="text-creme/50 hover:text-creme transition-colors text-sm">Conditions générales</Link></li>
                            <li><Link to="/privacy" className="text-creme/50 hover:text-creme transition-colors text-sm">Politique de confidentialité</Link></li>
                            <li><Link to="/legal" className="text-creme/50 hover:text-creme transition-colors text-sm">Mentions légales</Link></li>
                        </ul>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="text-creme font-semibold mb-6 uppercase tracking-wider text-xs">Statut</h4>
                        <div className="glass-card p-4 inline-block border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <span className="text-sm text-creme/80 font-mono">Système Opérationnel</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-creme/40 text-xs">
                        &copy; {new Date().getFullYear()} NEXUS. Tous droits réservés.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-creme/30 text-xs">Fait avec précision pour l'Afrique.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
