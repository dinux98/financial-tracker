import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Header = ({ title = "Dashboard" }) => {
    return (
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                    <Search size={20} />
                </button>
                <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
            </div>
        </div>
    );
};
