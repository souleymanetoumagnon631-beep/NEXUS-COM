import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Protocol: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Define media query context to only pin on desktop (md and up)
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const cards = cardsRef.current.filter(Boolean);
            if (cards.length === 0) return;

            const ctx = gsap.context(() => {
                // Pin the container
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${cards.length * 100}%`,
                    pin: true,
                    pinSpacing: true,
                });

                // Animate each card
                cards.forEach((card, i) => {
                    if (i === 0) return; // First card is already visible

                    const prevCard = cards[i - 1];

                    gsap.to(prevCard, {
                        scale: 0.9,
                        opacity: 0,
                        filter: "blur(10px)",
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `top+=${(i - 1) * 100}% top`,
                            end: `top+=${i * 100}% top`,
                            scrub: true,
                        }
                    });

                    gsap.fromTo(card,
                        { yPercent: 100, opacity: 0 },
                        {
                            yPercent: 0,
                            opacity: 1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: `top+=${(i - 1) * 100}% top`,
                                end: `top+=${i * 100}% top`,
                                scrub: true,
                            }
                        }
                    );
                });
            }, containerRef);

            return () => ctx.revert();
        });

        // Mobile fallback (no pin, just simple scroll reveal)
        mm.add("(max-width: 767px)", () => {
            const ctx = gsap.context(() => {
                const cards = cardsRef.current.filter(Boolean);
                cards.forEach(card => {
                    gsap.from(card, {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                        }
                    });
                });
            }, containerRef);
            return () => ctx.revert();
        });

        return () => mm.revert();
    }, []);

    // Anim 1: Helix
    const HelixAnim = () => (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-md animate-spin" style={{ animationDuration: '10s' }}>
                <path d="M100 20 C150 20 180 50 180 100 C180 150 150 180 100 180 C50 180 20 150 20 100 C20 50 50 20 100 20" 
                    fill="none" stroke="#F2F0E9" strokeWidth="1" strokeDasharray="10 20" />
                <path d="M100 40 C130 40 160 60 160 100 C160 140 130 160 100 160 C70 160 40 140 40 100 C40 60 70 40 100 40" 
                    fill="none" stroke="#CC5833" strokeWidth="2" strokeDasharray="5 10" />
            </svg>
        </div>
    );

    // Anim 2: Laser Sweep
    const LaserAnim = () => (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
            <div className="w-[150%] h-px bg-mousse-400 rotate-45 transform-gpu" style={{
                animation: 'scan 4s ease-in-out infinite alternate',
                boxShadow: '0 0 20px #728a7d, 0 0 40px #728a7d'
            }}>
                <style>{`@keyframes scan { from { transform: translateY(-300px) rotate(45deg); } to { transform: translateY(300px) rotate(45deg); } }`}</style>
            </div>
        </div>
    );

    // Anim 3: ECG Pulse
    const EcgAnim = () => (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <svg viewBox="0 0 400 100" className="w-full max-w-lg">
                <path d="M0,50 L100,50 L110,20 L130,90 L150,10 L170,80 L180,50 L400,50" 
                    fill="none" stroke="#CC5833" strokeWidth="3" 
                    strokeDasharray="400" strokeDashoffset="400"
                    style={{ animation: 'dash 3s linear infinite' }} />
                <style>{`@keyframes dash { to { stroke-dashoffset: 0; } }`}</style>
            </svg>
        </div>
    );

    return (
        <section ref={containerRef} className="relative h-auto md:h-screen bg-charbon-900 py-20 md:py-0 overflow-x-hidden">
            <div className="container mx-auto px-6 h-full relative">
                
                {/* Card 1 */}
                <div 
                    ref={el => cardsRef.current[0] = el}
                    className="md:absolute inset-0 flex items-center justify-center mb-12 md:mb-0"
                >
                    <div className="glass-card-strong w-full max-w-4xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                        <HelixAnim />
                        <div className="flex-1 relative z-10">
                            <span className="section-label block mb-4">Étape 01</span>
                            <h3 className="font-display text-4xl md:text-5xl font-bold text-creme mb-6">Connexion WhatsApp</h3>
                            <p className="text-creme/70 text-lg mb-8 leading-relaxed">
                                Liez votre numéro WhatsApp Business en un clic. Notre assistant commence immédiatement à écouter et structurer vos ventes.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-creme"><CheckCircle2 className="w-5 h-5 text-mousse-400" /> Sans installation d'application</li>
                                <li className="flex items-center gap-3 text-creme"><CheckCircle2 className="w-5 h-5 text-mousse-400" /> Vos vendeurs gardent leurs habitudes</li>
                            </ul>
                        </div>
                        <div className="flex-1 relative z-10 w-full">
                            <div className="bg-charbon-950 p-6 rounded-2xl border border-white/10 font-mono text-sm text-creme/80">
                                <p className="mb-4"><span className="text-argile">Commerçant :</span> "2 cartons lait, 45000, Payé Wave"</p>
                                <p className="mb-4"><span className="text-mousse-400">NEXUS :</span> "Vente enregistrée : Lait (x2). Montant : 45 000 FCFA. Statut : Payé."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div 
                    ref={el => cardsRef.current[1] = el}
                    className="md:absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:translate-y-full mb-12 md:mb-0"
                >
                    <div className="glass-card-strong w-full max-w-4xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                        <LaserAnim />
                        <div className="flex-1 relative z-10 order-2 md:order-1 w-full">
                            <div className="bg-charbon-950 p-6 rounded-2xl border border-white/10 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-4xl font-display font-bold text-creme mb-2">3 450 000 <span className="text-xl text-creme/50">FCFA</span></p>
                                    <p className="text-xs uppercase tracking-widest text-creme/40">Trésorerie Consolidée</p>
                                    <div className="flex gap-2 justify-center mt-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div></div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center"><div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative z-10 order-1 md:order-2">
                            <span className="section-label block mb-4">Étape 02</span>
                            <h3 className="font-display text-4xl md:text-5xl font-bold text-creme mb-6">Agrégation Financière</h3>
                            <p className="text-creme/70 text-lg mb-8 leading-relaxed">
                                Chaque paiement Mobile Money est automatiquement rapproché de vos ventes WhatsApp. Fini les trous de caisse.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div 
                    ref={el => cardsRef.current[2] = el}
                    className="md:absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:translate-y-full"
                >
                    <div className="glass-card-strong w-full max-w-4xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center border-argile/30 shadow-[0_0_50px_rgba(204,88,51,0.1)]">
                        <EcgAnim />
                        <div className="flex-1 relative z-10">
                            <span className="section-label block mb-4">Étape 03</span>
                            <h3 className="font-display text-4xl md:text-5xl font-bold text-argile mb-6">Score Finançable</h3>
                            <p className="text-creme/70 text-lg mb-8 leading-relaxed">
                                90 jours d'utilisation génèrent votre premier Score NEXUS. Un profil financier certifié, prêt à être envoyé à votre banquier.
                            </p>
                            <button className="magnetic-btn bg-argile text-creme px-6 py-3 text-sm">
                                <span className="relative z-10">Découvrir le scoring</span>
                                <div className="btn-bg bg-argile-600"></div>
                            </button>
                        </div>
                        <div className="flex-1 relative z-10 w-full">
                            <div className="bg-charbon-950 p-8 rounded-2xl border border-argile/20 text-center">
                                <p className="text-sm font-mono text-creme/50 mb-4">Score de fiabilité</p>
                                <p className="text-6xl font-display font-bold text-argile mb-2">785</p>
                                <p className="text-sm font-medium text-emerald-400">Excellente Santé</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Protocol;