import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NoiseOverlay from './components/NoiseOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Refresh ScrollTrigger after all components mount
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div ref={mainRef} className="relative min-h-screen bg-[#07080f] text-white overflow-hidden">
            {/* Ambient Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            {/* Noise Overlay */}
            <NoiseOverlay />

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main>
                <Hero />
                <Features />
                <Philosophy />
                <Protocol />
                <Pricing />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;