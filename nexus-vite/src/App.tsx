import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import NoiseOverlay from './components/NoiseOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop Helper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Landing Page Assembly
const LandingPage = () => {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Refresh ScrollTrigger after all components mount and images load
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div ref={mainRef} className="relative min-h-screen bg-charbon text-creme overflow-hidden">
            {/* Ambient Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <NoiseOverlay />
            <Navbar />

            <main>
                <Hero />
                <Features />
                <Philosophy />
                <Protocol />
                <Pricing />
            </main>

            <Footer />
        </div>
    );
};

// Placeholder for Auth/App Pages (To be built in later phases)
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="min-h-screen flex items-center justify-center bg-charbon text-creme">
        <NoiseOverlay />
        <div className="text-center">
            <h1 className="font-display text-4xl mb-4">{title}</h1>
            <p className="text-creme/50 mb-8">Phase de développement en cours...</p>
            <a href="/" className="magnetic-btn bg-argile text-creme px-6 py-2">Retour</a>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<PlaceholderPage title="Connexion" />} />
                <Route path="/signup" element={<PlaceholderPage title="Inscription" />} />
                <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
                <Route path="/pricing" element={<PlaceholderPage title="Tarifs (Complet)" />} />
            </Routes>
        </Router>
    );
}

export default App;