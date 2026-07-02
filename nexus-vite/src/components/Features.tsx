import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Wallet, TrendingUp, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 1. Mélangeur Diagnostique (Card Cycling)
const DiagnosticMixer: React.FC = () => {
    const [cards, setCards] = useState([
        { id: 1, text: "2 sacs de riz, 15000F, Fatou", status: "Capturé" },
        { id: 2, text: "Paiement Wave 15000F reçu", status: "Rapproché" },
        { id: 3, text: "Stock : Riz (-2 sacs)", status: "Mis à jour" }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const newCards = [...prev];
                const last = newCards.pop()!;
                newCards.unshift(last);
                return newCards;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-64 w-full flex items-center justify-center perspective-[1000px]">
            {cards.map((card, index) => {
                const isFront = index === 0;
                const isMiddle = index === 1;
                const translateY = isFront ? 0 : isMiddle ? -20 : -40;
                const scale = isFront ? 1 : isMiddle ? 0.9 : 0.8;
                const opacity = isFront ? 1 : isMiddle ? 0.6 : 0.3;
                const zIndex = 3 - index;

                return (
                    <div 
                        key={card.id}
                        className="absolute w-full max-w-[280px] glass-card-strong p-5 border border-mousse-400/20"
                        style={{
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            opacity,
                            zIndex,
                            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="bg-mousse-700/50 p-2 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-argile" />
                            </div>
                            <div>
                                <p className="font-mono text-sm text-creme/90 mb-2">"{card.text}"</p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {card.status}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// 2. Machine à Écrire Télémétrie
const TelemetryTypewriter: React.FC = () => {
    const textToType = `> INITIALISATION SYSTEME...
> CONNEXION API MOBILE MONEY...
> RAPPROCHEMENT TRX_9824... OK
> SOLDE CONSOLIDE MIS A JOUR.
> RELANCE CLIENT 'Mamadou' ENVOYEE.`;
    
    const [displayedText, setDisplayedText] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentText = '';
        let i = 0;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const typingInterval = setInterval(() => {
                        if (i < textToType.length) {
                            currentText += textToType.charAt(i);
                            setDisplayedText(currentText);
                            i++;
                        } else {
                            clearInterval(typingInterval);
                        }
                    }, 50);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-64 flex flex-col bg-charbon-900 rounded-2xl border border-white/5 overflow-hidden relative" ref={containerRef}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-charbon-950">
                <span className="text-[10px] font-mono text-creme/40 tracking-widest uppercase">Terminal</span>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-argile animate-pulse-dot"></span>
                    <span className="text-[10px] font-mono text-argile tracking-widest uppercase">Flux en Direct</span>
                </div>
            </div>
            <div className="p-4 flex-1 overflow-hidden">
                <pre className="font-mono text-xs text-creme/70 whitespace-pre-wrap leading-relaxed">
                    {displayedText}
                    <span className="inline-block w-2 h-3 bg-argile ml-1 animate-typewriter-cursor align-middle"></span>
                </pre>
            </div>
        </div>
    );
};

// 3. Planificateur Protocole Curseur
const ProtocolScheduler: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<SVGSVGElement>(null);
    const cellRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ 
                repeat: -1, 
                repeatDelay: 2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });

            tl.set(cursorRef.current, { x: 0, y: 0 })
              .set(cellRef.current, { backgroundColor: 'transparent' })
              .call(() => setIsActive(false))
              
              // Move to cell
              .to(cursorRef.current, { 
                  x: 120, y: 40, 
                  duration: 1, 
                  ease: "power2.inOut" 
              })
              // Click cell
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .call(() => setIsActive(true))
              .to(cellRef.current, { backgroundColor: 'rgba(204, 88, 51, 0.2)', duration: 0.2 })
              .to(cursorRef.current, { scale: 1, duration: 0.1 })
              
              // Move to save button
              .to(cursorRef.current, { 
                  x: 180, y: 140, 
                  duration: 0.8, 
                  ease: "power2.inOut" 
              })
              // Click button
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .to(btnRef.current, { scale: 0.95, duration: 0.1 })
              .to(cursorRef.current, { scale: 1, duration: 0.1 })
              .to(btnRef.current, { scale: 1, duration: 0.1 });
              
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-64 relative bg-charbon-900 rounded-2xl border border-white/5 p-6 overflow-hidden">
            <div className="grid grid-cols-7 gap-2 mb-8">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={i} className="text-center font-mono text-xs text-creme/40">{day}</div>
                ))}
                {Array.from({ length: 14 }).map((_, i) => (
                    <div 
                        key={i} 
                        ref={i === 9 ? cellRef : null}
                        className={`aspect-square rounded-md border border-white/5 ${i === 9 && isActive ? 'border-argile/50' : ''}`}
                    />
                ))}
            </div>
            
            <div className="flex justify-end mt-auto">
                <div ref={btnRef} className="px-4 py-2 bg-mousse-700 text-xs font-mono text-creme rounded-lg border border-mousse-500/30">
                    Sauvegarder
                </div>
            </div>

            <svg ref={cursorRef} className="absolute top-8 left-8 w-6 h-6 text-creme drop-shadow-xl z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white" />
            </svg>
        </div>
    );
};

const Features: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".feature-block", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-24 relative z-10 bg-charbon">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20 feature-block">
                    <span className="section-label block mb-4">Système Opérationnel</span>
                    <h2 className="section-title">L'infrastructure de votre croissance</h2>
                    <p className="section-sub">
                        Une suite d'outils conçue pour s'effacer derrière vos habitudes, transformant vos données invisibles en actifs financiers.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="feature-block feature-card glass-card p-8 flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-mousse-800 flex items-center justify-center mb-8 border border-mousse-600/30">
                            <MessageSquare className="w-6 h-6 text-creme" />
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-creme mb-3">Zéro saisie, zéro effort</h3>
                        <p className="text-creme/60 font-body mb-8">
                            Continuez de gérer vos clients sur WhatsApp. Notre assistant capture automatiquement les ventes et met à jour votre stock.
                        </p>
                        <div className="mt-auto">
                            <DiagnosticMixer />
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="feature-block feature-card glass-card p-8 flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-mousse-800 flex items-center justify-center mb-8 border border-mousse-600/30">
                            <Wallet className="w-6 h-6 text-creme" />
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-creme mb-3">Trésorerie claire</h3>
                        <p className="text-creme/60 font-body mb-8">
                            Rapprochement automatique de vos paiements Mobile Money. Visualisez vos créances et relancez en un clic.
                        </p>
                        <div className="mt-auto">
                            <TelemetryTypewriter />
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="feature-block feature-card glass-card p-8 flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-argile flex items-center justify-center mb-8 shadow-lg shadow-argile/20">
                            <TrendingUp className="w-6 h-6 text-creme" />
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-creme mb-3">Score de Crédit</h3>
                        <p className="text-creme/60 font-body mb-8">
                            Après 3 mois, votre historique génère un score de fiabilité certifié, prêt à être partagé avec nos partenaires financiers.
                        </p>
                        <div className="mt-auto">
                            <ProtocolScheduler />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;