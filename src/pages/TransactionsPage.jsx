import React from 'react';
import { TransactionList } from '../components/TransactionList';
import { Header } from '../components/Header';

export const TransactionsPage = () => {
    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            <Header title="Transactions" subtitle="Manage your financial history" />
            <TransactionList />
        </div>
    );
};
