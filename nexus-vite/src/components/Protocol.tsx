import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, GitBranch, Shield, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
    {
        icon: Database,
        step: '01',
        title: 'Architecture de vos données',
        desc: 'Toutes vos informations commerciales sont structurées en une seule base de données cohérente. Finis les fichiers éparpillés — vos achats, ventes, clients et livraisons coexistent dans un espace unifié.',
        color: '#a78bfa',
        bgColor: 'rgba(139,92,246,0.06)',
        borderColor: 'rgba(139,92,246,0.15)',
    },
    {
        icon: GitBranch,
        step: '02',
        title: 'Branchement des opérations',
        desc: 'Chaque transaction crée automatiquement des ramifications dans votre système. Une vente met à jour vos stocks, votre trésorerie, l\'historique client et vos indicateurs de performance — sans intervention manuelle.',
        color: '#00FFA3',
        bgColor: 'rgba(0,255,163,0.06)',
        borderColor: 'rgba(0,255,163,0.15)',
    },
    {
        icon: Shield,
        step: '03',
        title: 'Protocole de sécurité',
        desc: 'Vos données sont chiffrées de bout en bout sur Supabase. Chaque accès est journalisé, chaque action est tracée. Vous contrôlez qui voit quoi, quand et comment.',
        color: '#60a5fa',
        bgColor: 'rgba(59,130,246,0.06)',
        borderColor: 'rgba(59,130,246,0.15)',
    },
    {
        icon: Cpu,
        step: '04',
        title: 'Moteur d\'intelligence',
        desc: 'Nos algorithmes analysent vos données en temps réel pour détecter les tendances, anomalies et opportunités. Le système apprend de votre activité et vous restitue une intelligence actionnable.',
        color: '#f472b6',
        bgColor: 'rgba(244,114,182,0.06)',
        borderColor: 'rgba(244,114,182,0.15)',
    },
];

const Protocol = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);

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

            // Stagger cards with scroll
            const cards = cardsContainerRef.current?.querySelectorAll('.protocol-card-item');
            if (cards) {
                cards.forEach((card, i) => {
                    gsap.from(card, {
                        y: 80,
                        opacity: 0,
                        duration: 0.9,
                        delay: i * 0.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                    });
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="protocol" className="relative z-10 py-24 md:py-32 px-4">
            {/* Orbs colorés pour cette section */}
            <div
                className="orb"
                style={{
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(0,255,163,0.04), transparent 70%)',
                    top: '20%',
                    right: '-250px',
                    position: 'absolute',
                }}
            />

            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16 md:mb-20">
                    <span className="section-label">Protocole</span>
                    <h2 className="section-title">
                        Comment <span className="text-gradient-neon">NEXUS</span> opère
                    </h2>
                    <p className="section-sub">
                        Quatre couches protocolaires qui transforment vos données brutes en décisions éclairées.
                    </p>
                </div>

                {/* Stacked Cards */}
                <div ref={cardsContainerRef} className="space-y-6">
                    {protocols.map((protocol, i) => {
                        const Icon = protocol.icon;
                        return (
                            <div
                                key={protocol.step}
                                className="protocol-card-item glass-card-strong p-8 md:p-10 relative overflow-hidden"
                                style={{
                                    borderColor: protocol.borderColor,
                                    background: `linear-gradient(135deg, ${protocol.bgColor}, transparent)`,
                                }}
                            >
                                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
                                    {/* Step number */}
                                    <div
                                        className="text-5xl md:text-7xl font-display font-bold leading-none shrink-0"
                                        style={{ color: `${protocol.color}15` }}
                                    >
                                        {protocol.step}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                        style={{ background: `${protocol.color}15` }}
                                    >
                                        <Icon size={26} strokeWidth={1.5} color={protocol.color} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3
                                            className="text-xl md:text-2xl font-display font-bold mb-3"
                                            style={{ color: protocol.color }}
                                        >
                                            {protocol.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl">
                                            {protocol.desc}
                                        </p>
                                    </div>

                                    {/* Decorative corner */}
                                    <div
                                        className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]"
                                        style={{
                                            background: `radial-gradient(circle at top right, ${protocol.color}, transparent 70%)`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Protocol;