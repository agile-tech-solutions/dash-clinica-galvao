import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    LogOut,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import faviconImage from '../../assets/favicon.png';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <aside className="fixed pt-5 left-0 top-0 h-screen w-20 lg:w-80 bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300">
            {/* Brand Section */}
            <div className="h-20 flex items-center px-6 border-b border-slate-50">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white">
                    <img
                        src={faviconImage}
                        alt="Clínica Galvão Logo"
                        className="w-15 h-15 object-contain"
                    />
                </div>
                <div className="ml-3 hidden lg:block">
                    <h1 className="text-2xl font-bold text-slate-900">Clínica <span className="text-[#18A098]">Galvão</span></h1>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="mb-2 px-2 hidden lg:block">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</span>
                </div>
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`
                                flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-teal-50 text-[#18A098] font-medium'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#18A098]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="ml-3 hidden lg:block">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#18A098] hidden lg:block" />
                            )}
                        </Link>
                    );
                })}

                {/* User Section */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="mb-3 px-2 hidden lg:block">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuário</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#18A098] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden lg:block flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    Clínica Galvão
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    Administrador
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 transition-colors text-slate-400 group-hover:text-red-600" />
                        <span className="ml-3 hidden lg:block">Sair</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
}
