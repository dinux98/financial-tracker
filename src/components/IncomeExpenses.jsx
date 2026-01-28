import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export const IncomeExpenses = () => {
    const { transactions } = useContext(GlobalContext);

    const income = transactions
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Income Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <ArrowDownLeft size={24} />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-900">
                        Rs {income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-100 transition-colors">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Expense</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-900">
                        Rs {expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};
