import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const declarations = [
    {
        statement: 'Nous ne construisons pas un tableau de bord.',
        contrast: 'Nous construisons le système nerveux de votre entreprise.',
    },
    {
        statement: 'Les tableurs ne sont pas des outils de gestion.',
        contrast: 'Ce sont des prisons pour vos données.',
    },
    {
        statement: 'Votre business ne devrait pas s\'adapter à un logiciel.',
        contrast: 'Le logiciel devrait épouser la forme de votre business.',
    },
];

const Philosophy = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((item, i) => {
                if (!item) return;
                const statement = item.querySelector('.phil-statement');
                const contrast = item.querySelector('.phil-contrast');
                const line = item.querySelector('.phil-line');

                if (statement) {
                    gsap.from(statement, {
                        x: -60,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    });
                }
                if (contrast) {
                    gsap.from(contrast, {
                        x: 60,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    });
                }
                if (line) {
                    gsap.from(line, {
                        scaleX: 0,
                        duration: 0.6,
                        delay: 0.1,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="philosophy" className="relative z-10 py-24 md:py-32 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-label">Philosophie</span>
                    <h2 className="section-title">
                        La <span className="text-gradient-neon">clarté</span> avant tout
                    </h2>
                    <p className="section-sub">
                        Chaque ligne de NEXUS est pensée pour éliminer le bruit et révéler l'essentiel.
                    </p>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {declarations.map((dec, i) => (
                        <div
                            key={i}
                            ref={(el) => { itemsRef.current[i] = el; }}
                            className="relative"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                                <div className="phil-statement text-right">
                                    <p className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white/30 leading-tight">
                                        {dec.statement}
                                    </p>
                                </div>
                                <div className="phil-contrast">
                                    <p className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-gradient-neon leading-tight">
                                        {dec.contrast}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="phil-line absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-px origin-left"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(0,255,163,0.15), transparent)',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Philosophy;