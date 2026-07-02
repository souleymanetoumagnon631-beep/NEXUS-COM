import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Philosophy: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef1 = useRef<HTMLDivElement>(null);
    const textRef2 = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax background
            gsap.to(bgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Reveal animations
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                }
            });

            // Split text effect simulation
            if (textRef1.current && textRef2.current) {
                const words1 = textRef1.current.querySelectorAll('.word');
                const words2 = textRef2.current.querySelectorAll('.word');

                tl.from(words1, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power3.out"
                })
                .from(words2, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power3.out"
                }, "+=0.2");
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Helper to wrap words in spans for stagger animation
    const splitText = (text: string) => {
        return text.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">{word}</span>
        ));
    };

    return (
        <section ref={sectionRef} className="py-32 relative overflow-hidden bg-charbon-950 flex items-center min-h-[80vh]">
            {/* Parallax Background */}
            <div 
                ref={bgRef}
                className="absolute inset-0 z-0 opacity-20 scale-110"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col gap-16">
                    <div ref={textRef1} className="text-3xl md:text-5xl lg:text-6xl font-dramatic italic text-creme/50 leading-tight">
                        {splitText("La plupart des outils financiers se concentrent sur la")}
                        <span className="word inline-block mr-[0.3em] text-creme">complexité comptable.</span>
                    </div>

                    <div ref={textRef2} className="text-3xl md:text-5xl lg:text-6xl font-dramatic italic text-creme leading-tight md:ml-20">
                        {splitText("Nous nous concentrons sur votre")}
                        <span className="word inline-block text-argile glow-argile px-2 ml-2 border border-argile/30 rounded-2xl bg-argile/10">croissance.</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;