import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Wallet, 
    PackageSearch, 
    TrendingUp, 
    LogOut, 
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NoiseOverlay from '../NoiseOverlay';

const DashboardLayout: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navigation = [
        { name: 'Transactions', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Trésorerie', to: '/dashboard/finances', icon: Wallet },
        { name: 'Stock', to: '/dashboard/inventory', icon: PackageSearch },
        { name: 'Score NEXUS', to: '/dashboard/score', icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-charbon text-creme flex overflow-hidden">
            <NoiseOverlay />
            
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-charbon-950 border-r border-white/5 relative z-20">
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                            <g fill="#F2F0E9">
                                <polygon points="60,8 90,60 60,55" />
                                <polygon points="112,60 60,90 65,60" />
                                <polygon points="60,112 30,60 60,65" />
                                <polygon points="8,60 60,30 55,60" />
                            </g>
                        </svg>
                        <span className="font-display font-bold tracking-[0.2em] text-lg text-creme">NEXUS</span>
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            end={item.to === '/dashboard'}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                    isActive 
                                    ? 'bg-mousse-800/50 text-creme border border-mousse-600/30 shadow-[0_0_15px_rgba(46,64,54,0.3)]' 
                                    : 'text-creme/50 hover:bg-white/5 hover:text-creme'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="mb-4 px-4">
                        <p className="text-xs font-mono text-creme/40 truncate">{user?.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-xs text-creme/60">Plan Gratuit</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-creme/50 hover:bg-red-500/10 hover:text-red-400 transition-all text-left font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Header Mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-charbon-950 border-b border-white/5 z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <g fill="#F2F0E9">
                            <polygon points="60,8 90,60 60,55" />
                            <polygon points="112,60 60,90 65,60" />
                            <polygon points="60,112 30,60 60,65" />
                            <polygon points="8,60 60,30 55,60" />
                        </g>
                    </svg>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-creme">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-charbon-950/95 backdrop-blur-md z-30 p-4 flex flex-col">
                    <div className="flex-1 flex flex-col gap-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                end={item.to === '/dashboard'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-medium ${
                                        isActive 
                                        ? 'bg-mousse-800/50 text-creme border border-mousse-600/30' 
                                        : 'text-creme/50 hover:bg-white/5 hover:text-creme'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-4 mt-auto rounded-xl text-creme/50 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 relative z-10 pt-16 md:pt-0 h-screen overflow-y-auto overflow-x-hidden">
                <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
