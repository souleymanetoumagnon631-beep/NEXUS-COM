import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Users, Truck, TrendingUp, MessageSquare, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: BarChart3,
        title: 'Mélangeur Diagnostique',
        desc: 'Visualisez instantanément vos profits, marges et ROI par produit. Plus besoin de calculer manuellement — vos données financières se mélangent et s\'analysent en temps réel.',
        gradient: 'from-violet-500/20 to-brand-neon/10',
        border: 'rgba(139,92,246,0.15)',
        iconBg: 'rgba(139,92,246,0.12)',
        iconColor: '#a78bfa',
    },
    {
        icon: MessageSquare,
        title: 'Machine à Écrire Télémétrie',
        desc: 'Suivez chaque client, son historique d\'achat, sa valeur totale et relancez-le directement via WhatsApp. Une machine de précision qui écrit l\'historique de vos relations commerciales.',
        gradient: 'from-brand-neon/20 to-emerald-500/10',
        border: 'rgba(0,255,163,0.15)',
        iconBg: 'rgba(0,255,163,0.1)',
        iconColor: '#00FFA3',
    },
    {
        icon: Truck,
        title: 'Planificateur Protocole Curseur',
        desc: 'Pipeline visuel Kanban pour suivre chaque commande de la confirmation à la livraison finale. Votre curseur planifie le protocole exact — zéro commande en suspens.',
        gradient: 'from-blue-500/20 to-cyan-500/10',
        border: 'rgba(59,130,246,0.15)',
        iconBg: 'rgba(59,130,246,0.1)',
        iconColor: '#60a5fa',
    },
];

const moreFeatures = [
    { icon: TrendingUp, title: 'Rentabilité en temps réel', desc: 'Visualisez vos profits, marges et ROI par produit.' },
    { icon: Users, title: 'Gestion clients avancée', desc: 'Suivez chaque client et son historique d\'achat.' },
    { icon: Truck, title: 'Suivi des livraisons', desc: 'Pipeline Kanban de la confirmation à la livraison.' },
    { icon: BarChart3, title: 'Graphiques & Analyses', desc: 'Revenus hebdomadaires, mensuels, par canal.' },
    { icon: MessageSquare, title: 'Relances WhatsApp', desc: 'Relancez vos clients en un clic.' },
    { icon: Zap, title: 'Marketing structuré', desc: 'Positionnement, offre, angles publicitaires.' },
];

const Features = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title reveal
            if (titleRef.current) {
                gsap.from(titleRef.current.children, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                });
            }

            // Feature cards stagger
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                gsap.from(card, {
                    y: 60,
                    opacity: 0,
                    duration: 0.9,
                    delay: i * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="relative z-10 py-24 md:py-32 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16 md:mb-24">
                    <span className="section-label">Pourquoi NEXUS</span>
                    <h2 className="section-title">
                        Tout ce dont votre <span className="text-gradient-neon">business</span> a besoin
                    </h2>
                    <p className="section-sub">
                        Un seul outil pour remplacer les tableurs, les carnets et les applications éparpillées.
                    </p>
                </div>

                {/* 3 Main Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div
                                key={feat.title}
                                ref={(el) => { cardsRef.current[i] = el; }}
                                className="feature-card glass-card-strong p-8 md:p-10 flex flex-col"
                                style={{ borderColor: feat.border }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: feat.iconBg }}
                                >
                                    <Icon size={26} strokeWidth={1.5} color={feat.iconColor} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white mb-3">
                                    {feat.title}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed flex-1">
                                    {feat.desc}
                                </p>
                                <div
                                    className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-medium"
                                    style={{ color: feat.iconColor }}
                                >
                                    <span>Explorer</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* More Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moreFeatures.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div
                                key={feat.title}
                                className="glass-card p-6 flex items-start gap-4 reveal"
                                style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(0,255,163,0.08)' }}
                                >
                                    <Icon size={18} strokeWidth={1.5} color="#00FFA3" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-1">{feat.title}</h4>
                                    <p className="text-xs text-white/40">{feat.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;