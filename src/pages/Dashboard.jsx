import React from 'react';
import { Header } from '../components/Header';
import { Balance } from '../components/Balance';
import { IncomeExpenses } from '../components/IncomeExpenses';
import { TransactionList } from '../components/TransactionList';
import { TransactionForm } from '../components/TransactionForm';
import { ExpenseChart } from '../components/Charts/ExpenseChart';

export const Dashboard = () => {
    return (
        <div className="animate-fade-in-up h-screen flex flex-col overflow-hidden">
            <Header title="Dashboard" />

            <div className="flex-1 overflow-auto pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto">
                    {/* Left Column (Input & Summary) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Compact Balance & Income/Expenses in one row on larger screens, stacked on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="md:col-span-2">
                                <Balance />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <IncomeExpenses />
                            </div>
                        </div>
                        <TransactionForm />
                    </div>

                    {/* Right Column (Charts & History) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="h-[250px] md:h-[320px]">
                            <ExpenseChart />
                        </div>
                        <div className="flex-1 min-h-0">
                            <TransactionList limit={5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};