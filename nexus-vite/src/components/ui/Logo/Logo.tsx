import React from 'react';
import { LOGOTYPE_REGISTRY, type LogotypeVariant } from './logotypes';

/**
 * ──────────────────────────────────────────────
 *   Logo — Composant réutilisable pour afficher
 *   le logo NEXUS dans toutes ses variantes.
 *
 *   API :
 *     <Logo variant="full" size={32} />
 *     <Logo variant="icon" size={28} theme="dark" />
 *     <Logo variant="full" className="custom-class" />
 *
 *   Les consommateurs ne connaissent jamais
 *   l'emplacement des fichiers SVG.
 * ──────────────────────────────────────────────
 */

export interface LogoProps {
    /** Variante du logo : "full" (icône + texte) | "icon" (icône seule) */
    variant?: LogotypeVariant;
    /** Taille en pixels (carré pour l'icône, proportionnel pour le texte) */
    size?: number;
    /** Thème de couleur : "light" | "dark" | "auto" */
    theme?: 'light' | 'dark' | 'auto';
    /** Classes CSS additionnelles */
    className?: string;
    /** Styles inline additionnels */
    style?: React.CSSProperties;
}

const THEME_COLORS: Record<'light' | 'dark', { iconStroke: string; textColor: string }> = {
    light: {
        iconStroke: '#140626',
        textColor: '#140626',
    },
    dark: {
        iconStroke: '#ffffff',
        textColor: '#ffffff',
    },
};

const Logo: React.FC<LogoProps> = ({
    variant = 'full',
    size = 24,
    theme = 'auto',
    className,
    style,
}) => {
    const LogotypeComponent = LOGOTYPE_REGISTRY[variant];

    if (!LogotypeComponent) {
        // Fallback silencieux : si la variante n'existe pas
        return null;
    }

    // Détermination du thème selon le contexte si "auto"
    const resolvedTheme: 'light' | 'dark' =
        theme === 'auto'
            ? (typeof document !== 'undefined' &&
                  document.documentElement.classList.contains('light-theme'))
                ? 'light'
                : 'dark'
            : theme;

    const colors = THEME_COLORS[resolvedTheme];

    return (
        <LogotypeComponent
            size={size}
            className={className}
            style={{
                color: colors.iconStroke,
                ...(variant === 'full' ? { '--logo-text-color': colors.textColor } as React.CSSProperties : {}),
                ...style,
            }}
        />
    );
};

export default Logo;
