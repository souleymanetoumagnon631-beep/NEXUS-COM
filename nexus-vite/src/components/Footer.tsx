import { Logo } from './ui/Logo';

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/5 pt-16 pb-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div
                                className="w-7 h-7 flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                                    borderRadius: '8px',
                                }}
                            >
                                <Logo variant="icon" size={40} theme="light" />
                            </div>
                            <span
                                className="text-sm font-semibold tracking-tight"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                                NEXUS
                            </span>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
                            La plateforme de gestion commerciale conçue pour les entrepreneurs africains.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Produit</h4>
                        <div className="flex flex-col gap-2.5">
                            {['Fonctionnalités', 'Modules', 'Tarifs', 'Connexion'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 no-underline"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Ressources</h4>
                        <div className="flex flex-col gap-2.5">
                            {['Guide de démarrage', 'Tutoriels vidéo', 'Blog', 'FAQ'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 no-underline"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Contact</h4>
                        <div className="flex flex-col gap-2.5">
                            {['Nous écrire', 'WhatsApp', 'support@nexus-app.com'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 no-underline"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <div className="text-[11px] text-white/20">
                        © 2026 NEXUS — Commerce Intelligence pour entrepreneurs africains
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{
                                color: '#00FFA3',
                                background: 'rgba(0,255,163,0.08)',
                                border: '1px solid rgba(0,255,163,0.15)',
                            }}
                        >
                            v1.5
                        </span>
                        <a href="#" className="text-[11px] text-white/20 hover:text-white/40 no-underline transition-colors">
                            Mentions légales
                        </a>
                        <a href="#" className="text-[11px] text-white/20 hover:text-white/40 no-underline transition-colors">
                            CGU
                        </a>
                    </div>
                </div>

                {/* System Status */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FFA3', boxShadow: '0 0 6px #00FFA3' }} />
                    <span className="text-[10px] text-white/20 uppercase tracking-wider">
                        Tous les systèmes opérationnels
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
