import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pages & Components
import NoiseOverlay from './components/NoiseOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

// Auth & Protected
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import Transactions from './pages/dashboard/Transactions';

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
        };
    }, []);

    return (
        <div ref={mainRef} className="relative min-h-screen bg-charbon text-creme overflow-x-hidden">
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
                {/* Public Landing */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected & App Flow */}
                <Route path="/onboarding" element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Transactions />} />
                    <Route path="finances" element={<PlaceholderPage title="Trésorerie" />} />
                    <Route path="inventory" element={<PlaceholderPage title="Stock" />} />
                    <Route path="score" element={<PlaceholderPage title="Score NEXUS" />} />
                </Route>
                
                <Route path="/pricing" element={<PlaceholderPage title="Tarifs (Complet)" />} />
            </Routes>
        </Router>
    );
}

export default App;