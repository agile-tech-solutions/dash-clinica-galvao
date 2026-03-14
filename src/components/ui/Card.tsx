import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    glass?: boolean;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverEffect = false,
    glass = false,
    noPadding = false,
}) => {
    const baseStyles = "relative overflow-hidden";
    const glassStyles = glass
        ? "bg-white/70 backdrop-blur-xl border border-white/20 shadow-glass"
        : "bg-white border border-slate-100 shadow-soft";

    const hoverStyles = hoverEffect
        ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-lumina-100"
        : "";

    const paddingStyles = noPadding ? "" : "p-6";
    const radiusStyles = "rounded-3xl";

    return (
        <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${radiusStyles} ${paddingStyles} ${className}`}>
            {children}
        </div>
    );
};
