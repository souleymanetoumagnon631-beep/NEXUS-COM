import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Navbar: React.FC = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Initial animation
        gsap.fromTo(navRef.current, 
            { y: -100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            ref={navRef} 
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between ${
                scrolled ? 'glass-pill bg-charbon/60' : 'bg-transparent'
            }`}
        >
            <div className="flex items-center gap-3 lift">
                <Link to="/" className="flex items-center gap-3 group">
                    <svg width="32" height="32" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-90 transition-transform duration-500">
                        <g fill="#F2F0E9">
                            <polygon points="60,8 90,60 60,55" />
                            <polygon points="112,60 60,90 65,60" />
                            <polygon points="60,112 30,60 60,65" />
                            <polygon points="8,60 60,30 55,60" />
                        </g>
                    </svg>
                    <span className="font-display font-semibold tracking-[0.2em] text-xl text-creme">NEXUS</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-creme/70 hover:text-creme text-sm font-medium tracking-wide lift">Fonctionnalités</a>
                <a href="#protocol" className="text-creme/70 hover:text-creme text-sm font-medium tracking-wide lift">Protocole</a>
                <a href="#pricing" className="text-creme/70 hover:text-creme text-sm font-medium tracking-wide lift">Tarifs</a>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/login" className="hidden sm:block text-creme/80 hover:text-creme text-sm font-medium lift">
                    Connexion
                </Link>
                <Link to="/signup" className="magnetic-btn bg-argile text-creme px-6 py-2.5 text-sm">
                    <span className="relative z-10">Essayer gratuitement</span>
                    <div className="btn-bg bg-argile-600"></div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
