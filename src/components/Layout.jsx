import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, PieChart, Shield, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(AuthContext);

    const isActive = (path) =>
        location.pathname === path
            ? 'bg-emerald-50 text-emerald-600 font-bold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-emerald-50 to-teal-50 -z-10 rounded-b-[3rem]"></div>
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Sidebar / Navbar */}
            <nav className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-100 p-6 flex flex-col justify-between fixed md:relative z-20 h-auto md:h-screen">

                {/* Logo */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-2.5 rounded-xl shadow-lg shadow-primary/20">
                            <Wallet size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none text-left">MoneyTracker</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">PREMIUM</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/')}`}>
                            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="whitespace-nowrap">Dashboard</span>
                        </Link>
                        <Link to="/transactions" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/transactions')}`}>
                            <Receipt size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="whitespace-nowrap">Transactions</span>
                        </Link>
                        <div className="hidden md:block mt-6 border-t border-slate-100 pt-6">
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Analytics</p>
                            <Link to="/reports" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/reports')}`}>
                                <PieChart size={20} className="group-hover:scale-110 transition-transform" />
                                <span>Reports</span>
                            </Link>
                        </div>

                        {/* Admin Link */}
                        {currentUser?.role === 'admin' && (
                            <div className="hidden md:block mt-6 border-t border-slate-100 pt-6">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</p>
                                <Link to="/admin" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin')}`}>
                                    <Shield size={20} className="group-hover:scale-110 transition-transform" />
                                    <span>Admin Panel</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Profile / Logout */}
                <div className="hidden md:flex flex-col gap-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                            {currentUser?.avatar || '👤'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm w-full"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 md:px-12 overflow-y-auto z-10 pt-24 md:pt-8 w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};
