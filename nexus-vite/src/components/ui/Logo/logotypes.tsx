import React from 'react';

/**
 * ──────────────────────────────────────────────
 *   LOGOTYPES — Variantes SVG du logo NEXUS
 *   Chaque variante exporte un composant React
 *   prêt à être stylé via `className` / `style`.
 * ──────────────────────────────────────────────
 */

export interface LogotypeProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Icône seule — le symbole NEXUS
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
 * Logo complet — symbole + texte intégrés dans le SVG
 */
export const LogotypeFull: React.FC<LogotypeProps> = ({
    size = 240,
    className,
    style,
}) => (
    <svg
        width={size}
        height={(size * 280) / 240}
        viewBox="0 0 240 280"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-label="NEXUS"
        role="img"
    >
        <g fill="currentColor">
            <polygon points="120,16 180,120 120,110" />
            <polygon points="224,120 120,180 130,120" />
            <polygon points="120,224 60,120 120,130" />
            <polygon points="16,120 120,60 110,120" />
        </g>

        <text
            x="120"
            y="255"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="32"
            fontWeight="600"
            letterSpacing="6"
            fill="currentColor"
            textAnchor="middle"
        >
            NEXUS
        </text>
    </svg>
);

/**
 * Registre des variantes
 */
export const LOGOTYPE_REGISTRY = {
    icon: LogotypeIcon,
    full: LogotypeFull,
} as const;

export type LogotypeVariant = keyof typeof LOGOTYPE_REGISTRY;