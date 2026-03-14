import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export function Switch({
    checked: controlledChecked,
    onCheckedChange,
    disabled = false,
    className
}: SwitchProps) {
    const [internalChecked, setInternalChecked] = useState(controlledChecked ?? false);

    useEffect(() => {
        setInternalChecked(controlledChecked ?? false);
    }, [controlledChecked]);

    const handleChange = () => {
        if (disabled) return;

        const newChecked = !internalChecked;
        if (controlledChecked === undefined) {
            setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
    };

    return (
        <button
            onClick={handleChange}
            disabled={disabled}
            className={twMerge(
                "relative inline-flex flex-shrink-0",
                "h-6 w-11 rounded-full transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                internalChecked ? "bg-blue-500" : "bg-slate-300",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            type="button"
            role="switch"
            aria-checked={internalChecked}
        >
            <span
                className={twMerge(
                    "absolute top-1/2 -translate-y-1/2 w-5 h-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                    internalChecked ? "translate-x-5" : "translate-x-0.5"
                )}
            />
        </button>
    );
}
