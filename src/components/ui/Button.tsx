import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

        const variants = {
            primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 border border-transparent",
            secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
            glass: "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 shadow-glass",
            ghost: "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-5 text-sm",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10 p-2"
        };

        return (
            <button
                ref={ref}
                className={twMerge(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
