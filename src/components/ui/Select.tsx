import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, icon, children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        className={twMerge(
                            "w-full appearance-none",
                            "h-10 px-3 pr-10",
                            "bg-white border border-slate-200 rounded-xl",
                            "text-sm text-slate-700 placeholder:text-slate-400",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            icon && "pl-10",
                            error && "border-red-300 focus:ring-red-500",
                            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
