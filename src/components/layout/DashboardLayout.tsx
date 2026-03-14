import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-20 lg:ml-72 min-h-screen flex flex-col relative transition-all duration-300">

                {/* Header */}
                <Header />

                {/* Content */}
                <div className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-[1600px] mx-auto animate-fade-in">
                    {children}
                </div>

            </main>
        </div>
    );
}
