import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lumina-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    className={`
                        w-full bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-200'} 
                        ${icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5 
                        rounded-xl text-slate-900 placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500 focus:bg-white
                        transition-all duration-200
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};
