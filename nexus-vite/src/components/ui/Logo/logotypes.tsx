import React from 'react';

/**
 * ──────────────────────────────────────────────
 *   LOGOTYPES — Variantes SVG du logo NEXUS
 *   Chaque variante exporte un composant React
 *   prêt à être stylé via `className` / `style`.
 *   Pour ajouter une variante, il suffit d'ajouter
 *   une entrée ici, sans toucher au composant Logo.
 * ──────────────────────────────────────────────
 */

export interface LogotypeProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Icône seule — le symbole NEXUS (polygone / éclair stylisé)
 */
export const LogotypeIcon: React.FC<LogotypeProps> = ({
    size = 24,
    className,
    style,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-label="NEXUS"
        role="img"
    >
        <g fill="currentColor">
            <polygon points="60,8 90,60 60,55" />
            <polygon points="112,60 60,90 65,60" />
            <polygon points="60,112 30,60 60,65" />
            <polygon points="8,60 60,30 55,60" />
        </g>
    </svg>
);

/**
 * Icône + marque « NEXUS » — utilisé dans la barre de navigation
 */
export const LogotypeFull: React.FC<LogotypeProps & { textClassName?: string }> = ({
    size = 24,
    className,
    style,
    textClassName,
}) => (
    <span
        className={className}
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            ...style,
        }}
        aria-label="NEXUS"
        role="img"
    >
        <LogotypeIcon size={size} />
        <span
            className={textClassName}
            style={{
                fontSize: size * 0.666,
                fontWeight: 600,
                letterSpacing: '-0.03em',
                fontFamily: 'Space Grotesk, sans-serif',
            }}
        >
            NEXUS
        </span>
    </span>
);

/**
 * Registre des variantes — permet d'ajouter facilement
 * des variantes (dark, light, animated, etc.)
 */
export const LOGOTYPE_REGISTRY = {
    icon: LogotypeIcon,
    full: LogotypeFull,
} as const;

export type LogotypeVariant = keyof typeof LOGOTYPE_REGISTRY;
