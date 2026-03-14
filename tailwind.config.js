/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#020c1b',
                    800: '#0a192f',
                    700: '#112240',
                    600: '#233554',
                },
                // Social Palette - Ação Social Colors
                social: {
                    primary: '#056437',      // Dark Green - Primary color
                    secondary: '#FAB11D',    // Golden Yellow - Secondary color
                    primaryLight: '#E8F5ED', // Light green background
                    primaryDark: '#044D2A',  // Darker green
                    secondaryLight: '#FFF4E0', // Light gold background
                },
                // Lumina Palette
                lumina: {
                    50: '#F0FDF4',
                    100: '#DCFCE7', // Soft Green background
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#10B981', // Primary Neo-Emerald
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
                gold: {
                    400: '#FACC15',
                    500: '#EAB308', // Premium accents
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 0 10px rgba(100, 255, 218, 0.1)',
                'neon-hover': '0 0 20px rgba(100, 255, 218, 0.2)',
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
