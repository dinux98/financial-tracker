import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { Trash2, Edit2, Search, Coffee, Car, DollarSign, FileText, Film, ShoppingBag, Activity, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';

// Category Icon Mapping
const getCategoryIcon = (category) => {
    switch (category) {
        case 'Food': return <Coffee size={18} />;
        case 'Transport': return <Car size={18} />;
        case 'Salary': return <DollarSign size={18} />;
        case 'Bills': return <FileText size={18} />;
        case 'Entertainment': return <Film size={18} />;
        case 'Shopping': return <ShoppingBag size={18} />;
        case 'Health': return <Activity size={18} />;
        default: return <MoreHorizontal size={18} />;
    }
};

export const TransactionList = ({ limit, customData }) => {
    const { transactions, deleteTransaction, setTransactionEdit } = useContext(GlobalContext);
    const [filter, setFilter] = useState('');
    // Track expanded items by ID
    const [expandedItems, setExpandedItems] = useState({});
    const [deleteId, setDeleteId] = useState(null); // State to track deletion
    const navigate = useNavigate();

    const sourceData = customData || transactions;

    // Sort by date descending
    const sortedTransactions = [...sourceData].sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredTransactions = useMemo(() => {
        return sortedTransactions.filter(t =>
            t.text.toLowerCase().includes(filter.toLowerCase()) ||
            t.category.toLowerCase().includes(filter.toLowerCase())
        );
    }, [sortedTransactions, filter]);

    const displayList = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setDeleteId(id); // Open Dialog
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteTransaction(deleteId);
            setDeleteId(null);
        }
    };

    const handleEdit = (e, transaction) => {
        e.stopPropagation();
        setTransactionEdit({ item: transaction, edit: true });
        navigate('/'); // Redirect to dashboard where form is likely located
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <>
            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Transaction"
                message="Are you sure you want to permanently delete this transaction?"
            />

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">History</h3>
                    {!limit && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary focus:border-primary block pl-10 p-2.5 outline-none transition-all w-32 focus:w-48 placeholder:text-slate-400 font-medium"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                    {displayList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <Search size={24} className="opacity-50" />
                            </div>
                            <p className="text-sm font-medium">No transactions found.</p>
                        </div>
                    ) : (
                        displayList.map((transaction, index) => {
                            const isExpanded = expandedItems[transaction.id];

                            return (
                                <div key={transaction.id}
                                    onClick={() => toggleExpand(transaction.id)}
                                    className={`group flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${isExpanded ? 'bg-slate-50 border-primary/30 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
                                            >
                                                {getCategoryIcon(transaction.category)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm md:text-base">{transaction.text}</p>
                                                {/* Show abbreviated details if collapsed, or nothing */}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold text-sm md:text-base ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                {transaction.type === 'income' ? '+' : '-'}Rs {Math.abs(transaction.amount).toLocaleString()}
                                            </span>
                                            <div className="text-slate-300">
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Details Section */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between animate-fade-in-down">
                                            <div className="text-sm text-slate-500">
                                                <p><span className="font-semibold text-slate-700">Date:</span> {transaction.date}</p>
                                                <p><span className="font-semibold text-slate-700">Category:</span> {transaction.category}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleEdit(e, transaction)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary text-xs font-bold transition-all shadow-sm"
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, transaction.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-500 text-xs font-bold transition-all shadow-sm"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
                {limit && filteredTransactions.length > limit && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <button onClick={() => navigate('/transactions')} className="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wide cursor-pointer transition-colors">
                            View All Transactions
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
