import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { WalletCards } from 'lucide-react';

export const Balance = () => {
    const { transactions } = useContext(GlobalContext);

    const income = transactions
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    const total = income - expense;

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20 transform hover:scale-[1.01] transition-transform duration-300">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-primary/20 blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                        <WalletCards size={20} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider">Total Balance</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                    <span className="text-xl md:text-2xl font-medium text-white mr-2">Rs</span>
                    <span className="text-white">
                        {Math.abs(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </h1>
            </div>
        </div>
    );
};