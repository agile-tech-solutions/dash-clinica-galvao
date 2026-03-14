import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'glass';
}

export const Badge = ({ className, variant = 'primary', children, ...props }: BadgeProps) => {
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset transition-colors";

    const variants = {
        primary: "bg-primary-500/10 text-primary-400 ring-primary-500/20",
        success: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        danger: "bg-red-500/10 text-red-400 ring-red-500/20",
        neutral: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
        glass: "bg-white/5 text-slate-200 ring-white/10 backdrop-blur-sm",
    };

    return (
        <span className={twMerge(baseStyles, variants[variant], className)} {...props}>
            {children}
        </span>
    );
};
