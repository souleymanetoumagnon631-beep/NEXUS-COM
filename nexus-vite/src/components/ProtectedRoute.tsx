import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-charbon flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-argile/20 animate-ping absolute"></div>
                    <div className="w-8 h-8 rounded-full border-t-2 border-argile animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        // Rediriger vers login, mais en sauvegardant la route demandée
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
