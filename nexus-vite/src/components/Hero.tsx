import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef1 = useRef<HTMLHeadingElement>(null);
    const titleRef2 = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Subtle image zoom
            gsap.from(imageRef.current, {
                scale: 1.05,
                duration: 20,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(titleRef1.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
            )
            .fromTo(titleRef2.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2 },
                "-=0.9"
            )
            .fromTo(descRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.8"
            )
            .fromTo(ctaRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.8"
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-[100dvh] min-h-[600px] flex items-end pb-24 lg:pb-32 overflow-hidden">
            {/* Background Image */}
            <div ref={imageRef} className="hero-bg-img">
                <img 
                    src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2532&auto=format&fit=crop" 
                    alt="Dark organic forest texture" 
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <h1 className="flex flex-col gap-2">
                        <span ref={titleRef1} className="font-display font-medium text-3xl md:text-5xl lg:text-6xl text-creme/90 tracking-tight">
                            L'intelligence financière est
                        </span>
                        <span ref={titleRef2} className="font-dramatic italic font-semibold text-5xl md:text-7xl lg:text-[7rem] text-argile leading-none pb-2 glow-argile">
                            Automatique.
                        </span>
                    </h1>
                    
                    <p ref={descRef} className="mt-8 text-lg md:text-xl text-creme/70 max-w-2xl font-body font-light leading-relaxed">
                        NEXUS transforme votre activité quotidienne sur WhatsApp en comptabilité rigoureuse et en historique finançable. Zéro saisie, zéro effort.
                    </p>

                    <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Link to="/signup" className="magnetic-btn bg-argile text-creme px-8 py-4 text-base group flex items-center gap-3">
                            <span className="relative z-10 font-semibold tracking-wide">Essayer gratuitement</span>
                            <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                            <div className="btn-bg bg-argile-600"></div>
                        </Link>
                        <span className="text-creme/50 text-sm font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-mousse-400 animate-pulse-dot"></span>
                            Aucune carte requise
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;