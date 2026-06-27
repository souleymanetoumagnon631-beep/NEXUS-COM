import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
    {
        name: 'Essai Gratuit',
        price: '0',
        currency: 'FCFA',
        sub: '7 jours, sans engagement',
        cta: 'Commencer l\'essai',
        ctaClass: 'ghost',
        features: [
            'Accès complet à NEXUS',
            '14 modules débloqués',
            'Aucune carte bancaire requise',
            'Données conservées si vous passez au payant',
        ],
        plan: 'trial',
    },
    {
        name: 'Mensuel',
        price: '5 000',
        currency: 'FCFA/mois',
        sub: 'Résiliable à tout moment',
        cta: 'Choisir Mensuel',
        ctaClass: 'primary',
        features: [
            'Accès complet à NEXUS',
            'Produits & ventes illimités',
            'Support prioritaire',
            'Paiement sécurisé via PayTech',
        ],
        plan: 'monthly',
        featured: false,
    },
    {
        name: 'Annuel',
        price: '40 000',
        currency: 'FCFA/an',
        sub: 'Soit 3 333 FCFA/mois — Économisez 20 000 FCFA',
        cta: 'Choisir Annuel',
        ctaClass: 'gold',
        features: [
            'Tout le plan Mensuel',
            '2 mois offerts',
            'Accès anticipé aux nouveautés',
            'Idéal pour les entrepreneurs sérieux',
        ],
        plan: 'annual',
        featured: true,
        badge: 'MEILLEUR PRIX',
    },
];

const Pricing = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
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

            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                gsap.from(card, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
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

    const goSignup = (plan: string) => {
        window.location.href = `login.html?signup=true&plan=${plan}`;
    };

    return (
        <section ref={sectionRef} id="pricing" className="relative z-10 py-24 md:py-32 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-label">Tarifs</span>
                    <h2 className="section-title">
                        Un prix simple, <span className="text-gradient-neon">sans surprise</span>
                    </h2>
                    <p className="section-sub">
                        Commencez gratuitement. Passez au plan qui vous convient quand vous êtes prêt.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className={`glass-card-strong p-8 flex flex-col relative ${plan.featured ? 'ring-1 ring-brand-neon/30' : ''
                                }`}
                        >
                            {plan.badge && (
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    style={{
                                        background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                                        color: '#140626',
                                    }}
                                >
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-display font-semibold text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl md:text-4xl font-display font-bold text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-white/40">
                                        {plan.currency}
                                    </span>
                                </div>
                                <p className="text-xs text-white/30 mt-1">{plan.sub}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feat) => (
                                    <li key={feat} className="flex items-start gap-3 text-sm text-white/60">
                                        <Check size={16} className="shrink-0 mt-0.5" style={{ color: '#00FFA3' }} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => goSignup(plan.plan)}
                                className={`magnetic-btn w-full py-3.5 rounded-full text-sm font-semibold border-none cursor-pointer transition-all duration-300 ${plan.featured
                                        ? 'text-[#140626]'
                                        : plan.plan === 'trial'
                                            ? 'text-white/70 border border-white/10 bg-white/5 hover:bg-white/10'
                                            : 'text-white bg-white/10 hover:bg-white/15'
                                    }`}
                                style={
                                    plan.featured
                                        ? {
                                            background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                                            boxShadow: '0 0 30px rgba(0,255,163,0.2)',
                                        }
                                        : {}
                                }
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="text-center mt-20">
                    <div className="glass-card-strong p-10 md:p-16 max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                            Prêt à prendre le{' '}
                            <span className="text-gradient-neon">contrôle total</span> ?
                        </h3>
                        <p className="text-white/50 text-sm md:text-base mb-8 max-w-lg mx-auto">
                            Vos données sont sécurisées sur Supabase. Essai gratuit de 7 jours. Aucun engagement.
                        </p>
                        <button
                            onClick={() => goSignup('monthly')}
                            className="magnetic-btn inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-sm font-semibold border-none cursor-pointer text-[#140626]"
                            style={{
                                background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                                boxShadow: '0 0 40px rgba(0,255,163,0.2)',
                            }}
                        >
                            Démarrer mon essai gratuit
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                        <p className="text-xs text-white/30 mt-4">
                            7 jours gratuits · Sans carte bancaire · Annulation à tout moment
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;