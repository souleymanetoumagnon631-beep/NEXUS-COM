import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6 })
                .from(titleRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
                .from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
                .from(actionsRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
                .from(statsRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.3');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const goSignup = () => {
        window.location.href = 'login.html?signup=true&plan=monthly';
    };

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
        >
            {/* Background Image */}
            <div className="hero-bg-img">
                <img
                    src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1920&q=80"
                    alt=""
                    loading="eager"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div
                    ref={badgeRef}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
                    style={{
                        background: 'rgba(0,255,163,0.08)',
                        border: '1px solid rgba(0,255,163,0.15)',
                        color: '#00FFA3',
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: '#00FFA3', boxShadow: '0 0 6px #00FFA3' }}
                    />
                    7 jours d'essai gratuit — Sans carte bancaire
                </div>

                {/* Title */}
                <h1
                    ref={titleRef}
                    className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl max-w-4xl"
                >
                    Pilotez votre business<br />
                    <span className="text-gradient-neon">avec une clarté totale</span>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mt-6 leading-relaxed"
                >
                    NEXUS centralise vos achats, ventes, clients, livraisons et finances en un seul tableau de bord.
                    Prenez des décisions basées sur des données réelles — pas des intuitions.
                </p>

                {/* Actions */}
                <div ref={actionsRef} className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                    <button
                        onClick={goSignup}
                        className="magnetic-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold border-none cursor-pointer text-[#140626]"
                        style={{
                            background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                            boxShadow: '0 0 40px rgba(0,255,163,0.2)',
                        }}
                    >
                        Commencer gratuitement
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="magnetic-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-medium border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors duration-300"
                    >
                        <Play size={16} strokeWidth={2} />
                        Voir les fonctionnalités
                    </button>
                </div>

                {/* Pricing pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <div className="px-4 py-2 rounded-full text-xs text-white/50 border border-white/10">
                        <strong className="text-white/80">7 jours</strong>&nbsp;gratuits
                    </div>
                    <div className="px-4 py-2 rounded-full text-xs text-white/50 border border-white/10">
                        <strong className="text-white/80">5 000 FCFA</strong>&nbsp;/ mois
                    </div>
                    <div
                        className="px-4 py-2 rounded-full text-xs border"
                        style={{
                            color: '#00FFA3',
                            borderColor: 'rgba(0,255,163,0.2)',
                            background: 'rgba(0,255,163,0.06)',
                        }}
                    >
                        🔥 <strong>40 000 FCFA</strong>&nbsp;/ an — Économisez 20 000 FCFA
                    </div>
                </div>

                {/* Stats */}
                <div
                    ref={statsRef}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-16 w-full max-w-2xl"
                >
                    {[
                        { value: '14', label: 'Modules intégrés' },
                        { value: '100', suffix: '%', label: 'Données sécurisées' },
                        { value: '7', label: "Jours d'essai" },
                        { value: '∞', label: 'Produits & ventes' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="stat-value text-2xl md:text-3xl font-bold font-display text-white">
                                {stat.value}
                                {stat.suffix && <span className="text-brand-neon">{stat.suffix}</span>}
                            </div>
                            <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/20">
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
        </section>
    );
};

export default Hero;