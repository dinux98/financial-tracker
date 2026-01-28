import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { PlusCircle, Save, X, Check, DollarSign } from 'lucide-react';

export const TransactionForm = () => {
    const { addTransaction, editTransaction, transactionEdit, setTransactionEdit } = useContext(GlobalContext);

    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('General');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState('expense');

    useEffect(() => {
        if (transactionEdit.edit === true) {
            setTransactionEdit({ item: transactionEdit.item, edit: true }); // Ensure logic consistency
            setText(transactionEdit.item.text);
            setAmount(transactionEdit.item.amount);
            setCategory(transactionEdit.item.category);
            setDate(transactionEdit.item.date);
            setType(transactionEdit.item.type);
        }
    }, [transactionEdit.item, transactionEdit.edit]);

    const onSubmit = e => {
        e.preventDefault();

        const newTransaction = {
            text,
            amount: +amount,
            category,
            date,
            type
        };

        if (transactionEdit.edit === true) {
            editTransaction({ ...transactionEdit.item, ...newTransaction });
            setTransactionEdit({ item: {}, edit: false });
        } else {
            addTransaction(newTransaction);
        }

        // Reset form
        setText('');
        setAmount('');
        setCategory('General');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
    };

    const cancelEdit = () => {
        setTransactionEdit({ item: {}, edit: false });
        setText('');
        setAmount('');
        setCategory('General');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                    {transactionEdit.edit ? 'Edit Transaction' : 'New Transaction'}
                </h3>
            </div>

            <form onSubmit={onSubmit} className="relative z-10">
                <div className="space-y-4">
                    {/* Description */}
                    <div className="form-control">
                        <label htmlFor="text" className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Description</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 outline-none transition-all placeholder:text-slate-300 font-medium"
                            placeholder="e.g. Salary, Lunch, Rent"
                            required
                        />
                    </div>

                    {/* Amount & Date Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label htmlFor="amount" className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Amount</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-slate-400 font-bold">Rs</span>
                                </div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 pl-10 outline-none transition-all font-bold"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Category & Type Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Category</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 outline-none transition-all font-medium appearance-none"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Food">🍔 Food</option>
                                <option value="Transport">🚕 Transport</option>
                                <option value="Salary">💰 Salary</option>
                                <option value="Bills">🧾 Bills</option>
                                <option value="Entertainment">🎬 Entertainment</option>
                                <option value="Shopping">🛍️ Shopping</option>
                                <option value="Health">⚕️ Health</option>
                                <option value="General">📝 General</option>
                            </select>
                        </div>

                        {/* Type Radio Group */}
                        <div className="form-control">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Type</label>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <label className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={type === 'income'}
                                        onChange={() => setType('income')}
                                        className="hidden"
                                    />
                                    Income
                                </label>
                                <label className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={type === 'expense'}
                                        onChange={() => setType('expense')}
                                        className="hidden"
                                    />
                                    Expense
                                </label>
                            </div>
                        </div>
                    </div>

                    <button className="w-full text-white bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-bold rounded-xl text-sm px-5 py-3.5 mr-2 mb-2 outline-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 mt-4">
                        {transactionEdit.edit ? <Save size={18} /> : <PlusCircle size={18} />}
                        {transactionEdit.edit ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};
