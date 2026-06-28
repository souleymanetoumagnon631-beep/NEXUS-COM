import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Logo } from './ui/Logo';

const Navbar = () => {
    const navRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (badgeRef.current) {
                gsap.from(badgeRef.current, {
                    y: -20,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            }
        });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!navRef.current) return;
            const scrolled = window.scrollY > 60;
            navRef.current.classList.toggle('scrolled', scrolled);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const goSignup = () => {
        window.location.href = 'login.html?signup=true&plan=monthly';
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-5xl transition-all duration-500"
            style={{
                background: 'rgba(7,8,15,0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '100px',
                padding: '10px 24px',
            }}
        >
            <style>{`
                nav.scrolled {
                    background: rgba(7,8,15,0.85) !important;
                    border-color: rgba(255,255,255,0.1) !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
            `}</style>

            <div className="flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2.5 no-underline">
                    <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                            borderRadius: '10px',
                        }}
                    >
                        <Logo variant="icon" size={40} theme="light" />
                    </div>
                    <span
                        className="text-base font-semibold tracking-tight"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        NEXUS
                    </span>
                </a>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { label: 'Accueil', href: '#hero' },
                        { label: 'Fonctionnalités', href: '#features' },
                        { label: 'Philosophie', href: '#philosophy' },
                        { label: 'Protocole', href: '#protocol' },
                        { label: 'Tarifs', href: '#pricing' },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-white/60 hover:text-white/90 transition-colors duration-300 no-underline"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => (window.location.href = 'login.html')}
                        className="hidden sm:inline-block text-sm text-white/70 hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer"
                    >
                        Connexion
                    </button>
                    <button
                        onClick={goSignup}
                        className="magnetic-btn text-sm font-medium px-5 py-2.5 rounded-full border-none cursor-pointer text-[#140626]"
                        style={{
                            background: 'linear-gradient(135deg, #00FFA3, #00CC82)',
                        }}
                        ref={badgeRef}
                    >
                        Essai gratuit →
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
